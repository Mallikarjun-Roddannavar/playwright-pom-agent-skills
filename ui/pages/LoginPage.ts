import { type Locator } from "@playwright/test";

import { BasePage } from "@pages/BasePage";
import { HomePage } from "@pages/HomePage";

export class LoginPage extends BasePage {
  readonly loginForm: Locator = this.page.getByTestId("login-form");
  readonly usernameInput: Locator = this.page.getByTestId("login-username");
  readonly passwordInput: Locator = this.page.getByTestId("login-password");
  readonly submitButton: Locator = this.page.getByTestId("login-submit");
  readonly errorMessage: Locator = this.page.getByTestId("login-error");

  async goto(): Promise<this> {
    await this.gotoRoute(LoginPage.routes.login);
    await this.waitForPageLoad();
    return this;
  }

  async login(username: string, password: string): Promise<HomePage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    const homePage = new HomePage(this.page);
    await homePage.waitForPageLoad();
    return homePage;
  }

  async loginExpectingFailure(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async waitForPageLoad(): Promise<void> {
    this.logger.info("Waiting for page ready state", {
      name: "login-form",
      timeout: LoginPage.waits.MEDIUM,
    });
    await this.loginForm.waitFor({ timeout: LoginPage.waits.MEDIUM });
    this.logger.info("Page ready", { name: "login-form" });
  }
}
