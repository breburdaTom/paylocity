import { test, expect } from "../fixtures/auth.fixture";
import { generateEmployee } from "../utils/data-factory";

test.describe("Scenario 3: Delete Employee", () => {
  test("should delete an employee when clicking the Delete (X) action", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const employee = generateEmployee();

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      employee.firstName,
      employee.lastName,
      employee.dependants
    );
    await employeeModal.expectToBeClosed();
    await dashboardPage.expectEmployeeVisible(
      employee.firstName,
      employee.lastName
    );

    await dashboardPage.clickDeleteForEmployee(
      employee.firstName,
      employee.lastName
    );

    await dashboardPage.expectEmployeeNotVisible(
      employee.firstName,
      employee.lastName
    );
  });

  test("should not affect other employees when deleting one", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const employee1 = generateEmployee();
    const employee2 = generateEmployee();

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      employee1.firstName,
      employee1.lastName,
      employee1.dependants
    );
    await employeeModal.expectToBeClosed();

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      employee2.firstName,
      employee2.lastName,
      employee2.dependants
    );
    await employeeModal.expectToBeClosed();

    await dashboardPage.expectEmployeeVisible(
      employee1.firstName,
      employee1.lastName
    );
    await dashboardPage.expectEmployeeVisible(
      employee2.firstName,
      employee2.lastName
    );

    await dashboardPage.clickDeleteForEmployee(
      employee1.firstName,
      employee1.lastName
    );

    await dashboardPage.expectEmployeeNotVisible(
      employee1.firstName,
      employee1.lastName
    );
    await dashboardPage.expectEmployeeVisible(
      employee2.firstName,
      employee2.lastName
    );

    await dashboardPage.clickDeleteForEmployee(
      employee2.firstName,
      employee2.lastName
    );
  });
});
