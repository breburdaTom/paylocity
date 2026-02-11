import { type Locator, type Page, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  readonly addEmployeeButton: Locator;
  readonly employeesTable: Locator;
  readonly employeesTableRows: Locator;
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

  /**
   * Wait for table rows to be loaded. Ensures page JS (jQuery handlers, API calls)
   * has fully executed before interacting with the page.
   */
  async waitForTableData(): Promise<void> {
    await this.employeesTableRows.first().waitFor({ state: "visible", timeout: 10_000 });
  }

  async goto(): Promise<void> {
    await this.page.goto("/Prod/Benefits");
  }

  async clickAddEmployee(): Promise<void> {
    await this.addEmployeeButton.click();
  }

  async clickEditAction(rowIndex: number): Promise<void> {
    const row = this.employeesTableRows.nth(rowIndex);
    await row.locator("i.fa-edit").click();
  }

  async clickDeleteAction(rowIndex: number): Promise<void> {
    const row = this.employeesTableRows.nth(rowIndex);
    await row.locator("i.fa-times").click();
    await this.confirmDelete();
  }

  getEmployeeRow(firstName: string, lastName: string): Locator {
    return this.employeesTableRows.filter({
      hasText: `${firstName}`,
    }).filter({
      hasText: `${lastName}`,
    });
  }

  async clickEditForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await row.locator("i.fa-edit").click();
  }

  async clickDeleteForEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await row.locator("i.fa-times").click();
    await this.confirmDelete();
  }

  private async confirmDelete(): Promise<void> {
    await expect(this.deleteModal).toBeVisible();
    await this.deleteConfirmButton.click();
    await expect(this.deleteModal).not.toBeVisible();
  }

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

  async expectToBeVisible(): Promise<void> {
    await expect(this.addEmployeeButton).toBeVisible();
    await expect(this.employeesTable).toBeVisible();
  }

  async expectEmployeeVisible(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await expect(row).toBeVisible();
  }

  async expectEmployeeNotVisible(firstName: string, lastName: string): Promise<void> {
    const row = this.getEmployeeRow(firstName, lastName);
    await expect(row).not.toBeVisible();
  }

  async expectEmployeeCount(count: number): Promise<void> {
    await expect(this.employeesTableRows).toHaveCount(count);
  }
}

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
