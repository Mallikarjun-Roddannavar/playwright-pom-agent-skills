import { type Locator } from "@playwright/test";

import { BasePage } from "@pages/BasePage";
import { FoldersPage } from "@pages/FoldersPage";

export class HomePage extends BasePage {
  readonly title: Locator = this.page.getByTestId("home-title");
  readonly hamburgerMenuButton: Locator = this.page.getByTestId("hamburger-menu-btn");
  readonly navFoldersLink: Locator = this.page.getByTestId("nav-folders");

  async goto(): Promise<this> {
    await this.gotoRoute(HomePage.routes.home);
    await this.waitForPageLoad();
    return this;
  }

  async openFolders(): Promise<FoldersPage> {
    await this.hamburgerMenuButton.click();
    await this.navFoldersLink.click();

    const foldersPage = new FoldersPage(this.page);
    await foldersPage.waitForPageLoad();
    return foldersPage;
  }

  async waitForPageLoad(): Promise<void> {
    this.logger.info("Waiting for page ready state", {
      name: "home-title",
      timeout: HomePage.waits.MEDIUM,
    });
    await this.title.waitFor({ timeout: HomePage.waits.MEDIUM });
    this.logger.info("Page ready", { name: "home-title" });
  }
}
