export type LogLevel = "debug" | "info" | "warn" | "error";

type LogMetadata = Record<string, unknown>;

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export class Logger {
  constructor(
    private readonly scope: string,
    private readonly minimumLevel: LogLevel = "info"
  ) {}

  withScope(scope: string): Logger {
    return new Logger(`${this.scope}:${scope}`, this.minimumLevel);
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.write("debug", message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.write("info", message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.write("warn", message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.write("error", message, metadata);
  }

  private write(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (levelPriority[level] < levelPriority[this.minimumLevel]) {
      return;
    }

    const parts = [new Date().toISOString(), level.toUpperCase(), `[${this.scope}]`, message];
    const line = metadata ? `${parts.join(" ")} ${JSON.stringify(metadata)}` : parts.join(" ");

    if (level === "error") {
      console.error(line);
      return;
    }

    if (level === "warn") {
      console.warn(line);
      return;
    }

    console.log(line);
  }
}

export const logger = new Logger("playwright-pom-agent-skills");
