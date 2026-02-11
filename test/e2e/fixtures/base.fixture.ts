import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";
import { EmployeeModal } from "../pages/employee-modal.page";

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeModal: EmployeeModal;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  employeeModal: async ({ page }, use) => {
    await use(new EmployeeModal(page));
  },
});

export { expect } from "@playwright/test";
