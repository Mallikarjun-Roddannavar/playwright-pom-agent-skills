import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const errors = [];

const checks = [
  {
    directory: "ui/pages",
    label: "UI page object",
    isValid: (name) => /^[A-Z][A-Za-z0-9]*Page\.ts$/.test(name),
    expectation: "PascalCase and end with 'Page.ts'",
    validateExportName: true,
  },
  {
    directory: "api/services",
    label: "API service",
    isValid: (name) => /^[A-Z][A-Za-z0-9]*Service\.ts$/.test(name),
    expectation: "PascalCase and end with 'Service.ts'",
    validateExportName: true,
  },
  {
    directory: "utils/fixtures",
    label: "fixture",
    isValid: (name) => /^[A-Z][A-Za-z0-9]*Fixtures\.ts$/.test(name),
    expectation: "PascalCase and end with 'Fixtures.ts'",
    validateExportName: false,
  },
  {
    directory: "utils/common",
    label: "shared utility",
    isValid: (name) => /^[A-Z][A-Za-z0-9]*\.ts$/.test(name),
    expectation: "PascalCase .ts file name",
    validateExportName: false,
  },
  {
    directory: "ui/specs",
    label: "UI spec",
    isValid: (name) => /^[a-z0-9]+(?:-[a-z0-9]+)*\.spec\.ts$/.test(name),
    expectation: "lowercase kebab-case and end with '.spec.ts'",
    validateExportName: false,
  },
  {
    directory: "api/specs",
    label: "API spec",
    isValid: (name) => /^[a-z0-9]+(?:-[a-z0-9]+)*\.spec\.ts$/.test(name),
    expectation: "lowercase kebab-case and end with '.spec.ts'",
    validateExportName: false,
  },
  {
    directory: "ui/setup",
    label: "UI setup file",
    isValid: (name) => /^[a-z0-9]+(?:-[a-z0-9]+)*\.setup\.ts$/.test(name),
    expectation: "lowercase kebab-case and end with '.setup.ts'",
    validateExportName: false,
  },
];

for (const check of checks) {
  validateDirectory(check);
}

validateConfigKeys("config/test-config.json");

if (errors.length > 0) {
  globalThis.console.error("Naming convention violations found:\n");
  for (const error of errors) {
    globalThis.console.error(`- ${error}`);
  }
  process.exit(1);
}

globalThis.console.log("Naming conventions check passed.");

function validateDirectory(check) {
  const absoluteDirectory = path.join(repoRoot, check.directory);
  if (!fs.existsSync(absoluteDirectory)) {
    return;
  }

  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) {
      continue;
    }

    if (!check.isValid(entry.name)) {
      errors.push(
        `${check.label} '${path.posix.join(check.directory, entry.name)}' must be ${check.expectation}.`
      );
      continue;
    }

    if (check.validateExportName) {
      validatePrimaryExportName(
        path.join(absoluteDirectory, entry.name),
        path.parse(entry.name).name
      );
    }
  }
}

function validatePrimaryExportName(filePath, expectedName) {
  const source = fs.readFileSync(filePath, "utf8");
  const classMatch = source.match(/export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/);
  if (!classMatch) {
    errors.push(`${relative(filePath)} must export a class whose name matches the file name.`);
    return;
  }

  const exportedName = classMatch[1];
  if (exportedName !== expectedName) {
    errors.push(
      `${relative(filePath)} exports '${exportedName}' but the file name expects '${expectedName}'.`
    );
  }
}

function validateConfigKeys(relativeConfigPath) {
  const filePath = path.join(repoRoot, relativeConfigPath);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
  walkConfig(config, relativeConfigPath);
}

function walkConfig(value, currentPath) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkConfig(item, `${currentPath}[${index}]`));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
      errors.push(`${currentPath} contains key '${key}' which must be UPPER_SNAKE_CASE.`);
    }
    walkConfig(nestedValue, `${currentPath}.${key}`);
  }
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}
