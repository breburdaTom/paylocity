import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object Model for the Benefits Dashboard page.
 *
 * Selectors are defined using Playwright best practices:
 * role-based locators and scoped CSS selectors where appropriate.
 */
export class DashboardPage {
  readonly page: Page;

  // --- Selectors ---
  readonly addEmployeeButton: Locator;
  readonly employeesTable: Locator;
  readonly employeesTableRows: Locator;

  // Delete confirmation modal selectors
  readonly deleteModal: Locator;
  readonly deleteConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addEmployeeButton = page.getByRole("button", { name: "Add Employee" });
    this.employeesTable = page.getByRole("table");
    this.employeesTableRows = page.locator("#employeesTable tbody tr");

    this.deleteModal = page.locator("#deleteModal");
    this.deleteConfirmButton = page.locator("#deleteEmployee");
  }

  // --- Waits ---

  /**
   * Wait for the employee table data to be loaded.
   * This ensures the page's JavaScript (jQuery handlers, API calls) has fully executed.
   */
  async waitForTableData(): Promise<void> {
    await this.employeesTableRows.first().waitFor({ state: "visible", timeout: 10_000 });
  }

  // --- Actions ---

  /**
   * Navigate directly to the dashboard page.
   */
  async goto(): Promise<void> {
    await this.page.goto("/Prod/Benefits");
  }

  /**
   * Click the "Add Employee" button to open the modal.
   */
  async clickAddEmployee(): Promise<void> {
    await this.addEmployeeButton.click();
  }

  /**
   * Click the Edit action for a specific employee row.
   * @param rowIndex - zero-based index of the row in the table
   */
  async clickEditAction(rowIndex: number): Promise<void> {
    const row = this.employeesTableRows.nth(rowIndex);
    await row.locator("i.fa-edit").click();
  }

  /**
   * Click the Delete (X) action for a specific employee row and confirm deletion.
   * @param rowIndex - zero-based index of the row in the table
   */
  async clickDeleteAction(rowIndex: number): Promise<void> {
    const row = this.employeesTableRows.nth(rowIndex);
    await row.locator("i.fa-times").click();
    await this.confirmDelete();
  }

  /**
   * Find a table row by employee first name and last name.
   * Returns the Locator for the matching row.
   */
  getEmployeeRow(firstName: string, lastName: string): Locator {
    return this.employeesTableRows.filter({
      hasText: `${firstName}`,
    }).filter({
      hasText: `${lastName}`,
    });
  }

  /**
   * Click the Edit action for a specific employee identified by name.
   */
  async clickEditForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await row.locator("i.fa-edit").click();
  }

  /**
   * Click the Delete (X) action for a specific employee identified by name
   * and confirm deletion in the confirmation modal.
   */
  async clickDeleteForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await row.locator("i.fa-times").click();
    await this.confirmDelete();
  }

  /**
   * Confirm deletion in the delete confirmation modal.
   * Clicks the "Delete" button and waits for the modal to close.
   */
  private async confirmDelete(): Promise<void> {
    await expect(this.deleteModal).toBeVisible();
    await this.deleteConfirmButton.click();
    await expect(this.deleteModal).not.toBeVisible();
  }

  // --- Table Data Extraction ---

  /**
   * Get all cell values from a specific employee row.
   * Returns an object with the column values.
   */
  async getEmployeeRowData(firstName: string, lastName: string): Promise<EmployeeRowData> {
    const row = this.getEmployeeRow(firstName, lastName);
    const cells = row.locator("td");

    return {
      id: (await cells.nth(0).textContent()) ?? "",
      lastName: (await cells.nth(1).textContent()) ?? "",
      firstName: (await cells.nth(2).textContent()) ?? "",
      dependants: Number((await cells.nth(3).textContent()) ?? "0"),
      salary: parseFloat((await cells.nth(4).textContent())?.replace(/[^0-9.]/g, "") ?? "0"),
      gross: parseFloat((await cells.nth(5).textContent())?.replace(/[^0-9.]/g, "") ?? "0"),
      benefitsCost: parseFloat((await cells.nth(6).textContent())?.replace(/[^0-9.]/g, "") ?? "0"),
      net: parseFloat((await cells.nth(7).textContent())?.replace(/[^0-9.]/g, "") ?? "0"),
    };
  }

  // --- Assertions ---

  /**
   * Assert that the dashboard page is visible.
   */
  async expectToBeVisible(): Promise<void> {
    await expect(this.addEmployeeButton).toBeVisible();
    await expect(this.employeesTable).toBeVisible();
  }

  /**
   * Assert that an employee with the given name appears in the table.
   */
  async expectEmployeeVisible(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await expect(row).toBeVisible();
  }

  /**
   * Assert that an employee with the given name does NOT appear in the table.
   */
  async expectEmployeeNotVisible(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await expect(row).not.toBeVisible();
  }

  /**
   * Assert the number of employee rows in the table.
   */
  async expectEmployeeCount(count: number): Promise<void> {
    await expect(this.employeesTableRows).toHaveCount(count);
  }
}

// --- Types ---

export interface EmployeeRowData {
  id: string;
  lastName: string;
  firstName: string;
  dependants: number;
  salary: number;
  gross: number;
  benefitsCost: number;
  net: number;
}
