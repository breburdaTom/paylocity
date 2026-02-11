import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object Model for the Benefits Dashboard page.
 *
 * Selectors are defined as placeholders — replace with actual selectors
 * once they are available.
 */
export class DashboardPage {
  readonly page: Page;

  // --- Selectors (placeholders) ---
  readonly addEmployeeButton: Locator;
  readonly employeesTable: Locator;
  readonly employeesTableRows: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO: Replace placeholder selectors with actual selectors
    this.addEmployeeButton = page.locator("PLACEHOLDER_ADD_EMPLOYEE_BUTTON");
    this.employeesTable = page.locator("PLACEHOLDER_EMPLOYEES_TABLE");
    this.employeesTableRows = page.locator("PLACEHOLDER_EMPLOYEES_TABLE_ROWS");
    this.pageTitle = page.locator("PLACEHOLDER_PAGE_TITLE");
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
    // TODO: Replace placeholder selector with actual edit button selector within the row
    await row.locator("PLACEHOLDER_EDIT_BUTTON").click();
  }

  /**
   * Click the Delete (X) action for a specific employee row.
   * @param rowIndex - zero-based index of the row in the table
   */
  async clickDeleteAction(rowIndex: number): Promise<void> {
    const row = this.employeesTableRows.nth(rowIndex);
    // TODO: Replace placeholder selector with actual delete button selector within the row
    await row.locator("PLACEHOLDER_DELETE_BUTTON").click();
  }

  /**
   * Find a table row by employee first name and last name.
   * Returns the Locator for the matching row.
   */
  getEmployeeRow(firstName: string, lastName: string): Locator {
    // TODO: Adjust the row-matching strategy based on actual table structure
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
    // TODO: Replace placeholder selector with actual edit button selector within the row
    await row.locator("PLACEHOLDER_EDIT_BUTTON").click();
  }

  /**
   * Click the Delete (X) action for a specific employee identified by name.
   */
  async clickDeleteForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    // TODO: Replace placeholder selector with actual delete button selector within the row
    await row.locator("PLACEHOLDER_DELETE_BUTTON").click();
  }

  // --- Table Data Extraction ---

  /**
   * Get all cell values from a specific employee row.
   * Returns an object with the column values.
   */
  async getEmployeeRowData(firstName: string, lastName: string): Promise<EmployeeRowData> {
    const row = this.getEmployeeRow(firstName, lastName);
    const cells = row.locator("td");

    // TODO: Adjust column indices based on actual table structure
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
