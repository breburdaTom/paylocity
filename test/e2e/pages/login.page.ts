import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object Model for the Login page.
 *
 * Selectors are defined using Playwright best practices:
 * role-based and label-based locators where possible.
 */
export class LoginPage {
  readonly page: Page;

  // --- Selectors ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.errorMessage = page.locator(".validation-summary-errors");
  }

  // --- Actions ---

  /**
   * Navigate to the login page.
   */
  async goto(): Promise<void> {
    await this.page.goto("/Prod/Account/LogIn");
  }

  /**
   * Fill in credentials and submit the login form.
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // --- Assertions ---

  /**
   * Assert that the login page is visible.
   */
  async expectToBeVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert that an error message is displayed.
   */
  async expectErrorMessage(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }
}
