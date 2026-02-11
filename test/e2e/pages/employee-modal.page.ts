import { type Locator, type Page, expect } from "@playwright/test";

export class EmployeeModal {
  readonly page: Page;

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

    this.modalContainer = page.locator("#employeeModal .modal-content");
    this.firstNameInput = page.getByLabel("First Name:");
    this.lastNameInput = page.getByLabel("Last Name:");
    this.dependantsInput = page.getByLabel("Dependents:");
    this.addButton = page.getByRole("button", { name: "Add", exact: true });
    this.updateButton = page.getByRole("button", { name: "Update" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.closeButton = page.getByRole("button", { name: "Close" });
  }

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

  async submitAdd(): Promise<void> {
    await this.addButton.click();
  }

  async submitUpdate(): Promise<void> {
    await this.updateButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async addEmployee(
    firstName: string,
    lastName: string,
    dependants: number
  ): Promise<void> {
    await this.fillEmployeeForm(firstName, lastName, dependants);
    await this.submitAdd();
  }

  async editEmployee(
    firstName: string,
    lastName: string,
    dependants: number
  ): Promise<void> {
    await this.fillEmployeeForm(firstName, lastName, dependants);
    await this.submitUpdate();
  }

  async expectToBeVisible(): Promise<void> {
    await expect(this.modalContainer).toBeVisible();
  }

  async expectToBeClosed(): Promise<void> {
    await expect(this.modalContainer).not.toBeVisible();
  }

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
