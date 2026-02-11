import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object Model for the Add/Edit Employee modal dialog.
 *
 * Selectors are defined as placeholders — replace with actual selectors
 * once they are available.
 */
export class EmployeeModal {
  readonly page: Page;

  // --- Selectors (placeholders) ---
  readonly modalContainer: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dependantsInput: Locator;
  readonly addButton: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO: Replace placeholder selectors with actual selectors
    this.modalContainer = page.locator("");
    this.firstNameInput = page.locator("PLACEHOLDER_FIRST_NAME_INPUT");
    this.lastNameInput = page.locator("PLACEHOLDER_LAST_NAME_INPUT");
    this.dependantsInput = page.locator("PLACEHOLDER_DEPENDANTS_INPUT");
    this.addButton = page.locator("PLACEHOLDER_ADD_BUTTON");
    this.updateButton = page.locator("PLACEHOLDER_UPDATE_BUTTON");
    this.cancelButton = page.locator("PLACEHOLDER_CANCEL_BUTTON");
    this.closeButton = page.locator("PLACEHOLDER_CLOSE_BUTTON");
  }

  // --- Actions ---

  /**
   * Fill in the employee form fields.
   */
  async fillEmployeeForm(
    firstName: string,
    lastName: string,
    dependants: number
  ): Promise<void> {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    await this.dependantsInput.clear();
    await this.dependantsInput.fill(dependants.toString());
  }

  /**
   * Submit the form by clicking the Add button (for new employees).
   */
  async submitAdd(): Promise<void> {
    await this.addButton.click();
  }

  /**
   * Submit the form by clicking the Update button (for editing employees).
   */
  async submitUpdate(): Promise<void> {
    await this.updateButton.click();
  }

  /**
   * Cancel the modal.
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Close the modal via the X button.
   */
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /**
   * Add a new employee: fill the form and submit.
   */
  async addEmployee(
    firstName: string,
    lastName: string,
    dependants: number
  ): Promise<void> {
    await this.fillEmployeeForm(firstName, lastName, dependants);
    await this.submitAdd();
  }

  /**
   * Edit an existing employee: update the form and submit.
   */
  async editEmployee(
    firstName: string,
    lastName: string,
    dependants: number
  ): Promise<void> {
    await this.fillEmployeeForm(firstName, lastName, dependants);
    await this.submitUpdate();
  }

  // --- Assertions ---

  /**
   * Assert that the modal is visible.
   */
  async expectToBeVisible(): Promise<void> {
    await expect(this.modalContainer).toBeVisible();
  }

  /**
   * Assert that the modal is not visible (closed).
   */
  async expectToBeClosed(): Promise<void> {
    await expect(this.modalContainer).not.toBeVisible();
  }

  /**
   * Assert that the form fields contain the expected values (useful for edit mode).
   */
  async expectFormValues(
    firstName: string,
    lastName: string,
    dependants: number
  ): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.dependantsInput).toHaveValue(dependants.toString());
  }
}
