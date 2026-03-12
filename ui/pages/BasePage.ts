import type { Page } from "@playwright/test";

import { logger, type Logger } from "@utils/common/Logger";
import { waits } from "@utils/common/Waits";

export abstract class BasePage {
  protected static readonly waits = waits;

  public static readonly routes = {
    login: "/login",
    home: "/",
    folders: "/folders",
    folderFiles: (folderId: string) => `/folders/${folderId}`,
  } as const;

  readonly page: Page;
  protected readonly logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = logger.withScope(`page.${this.constructor.name}`);
  }

  protected async gotoRoute(route: string): Promise<void> {
    this.logger.info("Navigating to page", { route });
    await this.page.goto(route);
  }

  abstract waitForPageLoad(): Promise<void>;
}
