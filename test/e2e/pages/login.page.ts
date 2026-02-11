import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object Model for the Login page.
 *
 * Selectors are defined as placeholders — replace with actual selectors
 * once they are available.
 */
export class LoginPage {
  readonly page: Page;

  // --- Selectors (placeholders) ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO: Replace placeholder selectors with actual selectors
    this.usernameInput = page.locator("PLACEHOLDER_USERNAME_INPUT");
    this.passwordInput = page.locator("PLACEHOLDER_PASSWORD_INPUT");
    this.loginButton = page.locator("PLACEHOLDER_LOGIN_BUTTON");
    this.errorMessage = page.locator("PLACEHOLDER_ERROR_MESSAGE");
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
