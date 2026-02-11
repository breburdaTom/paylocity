import { test as baseTest, expect } from "./base.fixture";
import { ENV } from "../utils/env";

/**
 * Authenticated fixture — logs in and waits for the dashboard
 * to be fully loaded before each test.
 */
export const test = baseTest.extend({
  dashboardPage: async ({ loginPage, dashboardPage }, use) => {
    await loginPage.goto();
    await loginPage.login(ENV.TEST_USERNAME, ENV.TEST_PASSWORD);
    await dashboardPage.expectToBeVisible();
    await dashboardPage.waitForTableData();

    await use(dashboardPage);
  },
});

export { expect };
