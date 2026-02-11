import { test as baseTest, expect } from "./base.fixture";

/**
 * Authenticated test fixture.
 *
 * Automatically logs in and navigates to the Benefits Dashboard
 * before each test.
 */
export const test = baseTest.extend({
  dashboardPage: async ({ loginPage, dashboardPage }, use) => {
    // Navigate to login page and authenticate
    await loginPage.goto();
    await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);

    // Wait for navigation to the dashboard
    await dashboardPage.expectToBeVisible();

    await use(dashboardPage);
  },
});

export { expect };
