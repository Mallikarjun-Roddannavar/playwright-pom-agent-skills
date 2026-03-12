import fs from "node:fs";
import path from "node:path";

import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

import { logger } from "@utils/common/Logger";

type Summary = {
  startedAt: string;
  finishedAt?: string;
  status?: FullResult["status"];
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  timedOut: number;
  interrupted: number;
  flaky: number;
  failures: Array<{
    title: string;
    file?: string;
    project?: string;
    status: TestResult["status"];
    error?: string;
  }>;
};

export default class CustomReporter implements Reporter {
  private readonly reporterLogger = logger.withScope("reporter");
  private readonly outputPath = path.join(process.cwd(), "test-results", "framework-summary.json");
  private readonly summary: Summary = {
    startedAt: new Date().toISOString(),
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    timedOut: 0,
    interrupted: 0,
    flaky: 0,
    failures: [],
  };

  onBegin(_config: FullConfig, suite: Suite): void {
    this.summary.total = suite.allTests().length;
    this.reporterLogger.info("Test run started", { total: this.summary.total });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const project = test.parent.project()?.name;

    switch (result.status) {
      case "passed":
        this.summary.passed += 1;
        if (result.retry > 0) {
          this.summary.flaky += 1;
          this.reporterLogger.warn("Test recovered after retry", {
            title: test.titlePath().join(" > "),
            project: project,
            retry: result.retry,
          });
        }
        break;
      case "failed":
        this.summary.failed += 1;
        this.summary.failures.push({
          title: test.titlePath().join(" > "),
          file: test.location.file,
          project: project,
          status: result.status,
          error: result.error?.message,
        });
        this.reporterLogger.error("Test failed", {
          title: test.titlePath().join(" > "),
          project: project,
          error: result.error?.message,
        });
        break;
      case "skipped":
        this.summary.skipped += 1;
        break;
      case "timedOut":
        this.summary.timedOut += 1;
        this.summary.failures.push({
          title: test.titlePath().join(" > "),
          file: test.location.file,
          project: project,
          status: result.status,
          error: result.error?.message,
        });
        this.reporterLogger.error("Test timed out", {
          title: test.titlePath().join(" > "),
          project: project,
        });
        break;
      case "interrupted":
        this.summary.interrupted += 1;
        break;
    }
  }

  onEnd(result: FullResult): void {
    this.summary.finishedAt = new Date().toISOString();
    this.summary.status = result.status;

    fs.mkdirSync(path.dirname(this.outputPath), { recursive: true });
    fs.writeFileSync(this.outputPath, JSON.stringify(this.summary, null, 2), "utf8");

    this.reporterLogger.info("Test run finished", {
      status: result.status,
      total: this.summary.total,
      passed: this.summary.passed,
      failed: this.summary.failed,
      skipped: this.summary.skipped,
      timedOut: this.summary.timedOut,
      flaky: this.summary.flaky,
      summaryFile: this.outputPath,
    });
  }
}
