import { test, expect } from "../fixtures/base.fixture";
import { ENV } from "../utils/env";

test.describe("Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("should display the login form", async ({ loginPage }) => {
    await loginPage.expectToBeVisible();
  });

  test("should login successfully with valid credentials", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(ENV.TEST_USERNAME, ENV.TEST_PASSWORD);
    await dashboardPage.expectToBeVisible();
  });

  test("should show error with invalid credentials", async ({ loginPage }) => {
    await loginPage.login("invalidUser", "invalidPassword");
    await loginPage.expectErrorMessage();
  });

  test("should show error with valid username and invalid password", async ({
    loginPage,
  }) => {
    await loginPage.login(ENV.TEST_USERNAME, "invalidPassword");
    await loginPage.expectErrorMessage();
  });

  test("should show error with empty username", async ({ loginPage }) => {
    await loginPage.login("", ENV.TEST_PASSWORD);
    await loginPage.expectErrorMessage();
  });

  test("should show error with empty password", async ({ loginPage }) => {
    await loginPage.login(ENV.TEST_USERNAME, "");
    await loginPage.expectErrorMessage();
  });
});

test.describe("Authentication", () => {
  test("should redirect to login when accessing dashboard without authentication", async ({
    dashboardPage,
    loginPage,
  }) => {
    await dashboardPage.goto();
    await loginPage.expectToBeVisible();
  });

  test("should redirect to login after logging out", async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(ENV.TEST_USERNAME, ENV.TEST_PASSWORD);
    await dashboardPage.expectToBeVisible();

    await page.getByRole("link", { name: "Log Out" }).click();
    await loginPage.expectToBeVisible();
  });
});
