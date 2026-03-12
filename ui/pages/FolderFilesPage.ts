import { type Locator } from "@playwright/test";

import { BasePage } from "@pages/BasePage";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class FolderFilesPage extends BasePage {
  readonly uploadActionButton: Locator = this.page.getByTestId("files-upload-action-btn");
  readonly uploadFileInput: Locator = this.page.getByTestId("upload-file-input");
  readonly uploadFileButton: Locator = this.page.getByTestId("upload-file-btn");
  readonly uploadSuccessToast: Locator = this.page
    .locator('[role="status"], [role="alert"], [data-testid*="toast"]')
    .filter({ hasText: /upload|success/i })
    .first();

  async waitForPageLoad(): Promise<void> {
    this.logger.info("Waiting for page ready state", {
      name: "files-upload-action-btn",
      timeout: FolderFilesPage.waits.MEDIUM,
    });
    await this.uploadActionButton.waitFor({ timeout: FolderFilesPage.waits.MEDIUM });
    this.logger.info("Page ready", { name: "files-upload-action-btn" });
  }

  uploadedFileName(name: string): Locator {
    return this.page.getByRole("cell", {
      name: new RegExp(escapeRegExp(name), "i"),
    });
  }

  async uploadFile(filePath: string): Promise<this> {
    await this.uploadActionButton.click();
    await this.uploadFileInput.setInputFiles(filePath);
    await this.uploadFileButton.click();
    return this;
  }
}
