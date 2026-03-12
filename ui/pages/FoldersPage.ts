import { type Locator } from "@playwright/test";

import { BasePage } from "@pages/BasePage";
import { FolderFilesPage } from "@pages/FolderFilesPage";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class FoldersPage extends BasePage {
  readonly title: Locator = this.page.getByTestId("folders-title");
  readonly refreshButton: Locator = this.page.getByTestId("folders-refresh-btn");
  readonly newFolderButton: Locator = this.page.getByTestId("new-folder-btn");
  readonly createFolderInput: Locator = this.page.getByTestId("create-folder-input");
  readonly createFolderSubmit: Locator = this.page.getByTestId("create-folder-submit");

  async waitForPageLoad(): Promise<void> {
    this.logger.info("Waiting for page ready state", {
      name: "folders-title",
      timeout: FoldersPage.waits.MEDIUM,
    });
    await this.title.waitFor({ timeout: FoldersPage.waits.MEDIUM });
    this.logger.info("Page ready", { name: "folders-title" });
  }

  folderName(name: string): Locator {
    return this.page.getByRole("cell", {
      name: new RegExp(escapeRegExp(name), "i"),
    });
  }

  folderSelectCheckbox(folderId: string): Locator {
    return this.page.getByTestId(`folder-select-${folderId}`);
  }

  folderOpenButton(folderId: string): Locator {
    return this.page.getByTestId(`folder-open-btn-${folderId}`);
  }

  async createFolder(name: string): Promise<void> {
    await this.newFolderButton.click();
    await this.createFolderInput.fill(name);
    await this.createFolderSubmit.click();
  }

  async openFolder(folderId: string): Promise<FolderFilesPage> {
    await this.folderSelectCheckbox(folderId).check();
    await this.folderOpenButton(folderId).click();

    const folderFilesPage = new FolderFilesPage(this.page);
    await folderFilesPage.waitForPageLoad();
    return folderFilesPage;
  }
}
