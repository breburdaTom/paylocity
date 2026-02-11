import { test, expect } from "../fixtures/auth.fixture";
import { generateEmployee } from "../utils/data-factory";

test.describe("Scenario 3: Delete Employee", () => {
  test("should delete an employee when clicking the Delete (X) action", async ({
    dashboardPage,
    employeeModal,
  }) => {
    // First, create an employee to delete
    const employee = generateEmployee();

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      employee.firstName,
      employee.lastName,
      employee.dependants
    );
    await employeeModal.expectToBeClosed();

    // Verify the employee exists in the table
    await dashboardPage.expectEmployeeVisible(
      employee.firstName,
      employee.lastName
    );

    // Delete the employee
    await dashboardPage.clickDeleteForEmployee(
      employee.firstName,
      employee.lastName
    );

    // Verify the employee is no longer in the table
    await dashboardPage.expectEmployeeNotVisible(
      employee.firstName,
      employee.lastName
    );
  });

  test("should not affect other employees when deleting one", async ({
    dashboardPage,
    employeeModal,
  }) => {
    // Create two employees
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

    // Verify both employees exist
    await dashboardPage.expectEmployeeVisible(
      employee1.firstName,
      employee1.lastName
    );
    await dashboardPage.expectEmployeeVisible(
      employee2.firstName,
      employee2.lastName
    );

    // Delete only the first employee
    await dashboardPage.clickDeleteForEmployee(
      employee1.firstName,
      employee1.lastName
    );

    // First employee should be gone
    await dashboardPage.expectEmployeeNotVisible(
      employee1.firstName,
      employee1.lastName
    );

    // Second employee should still be present
    await dashboardPage.expectEmployeeVisible(
      employee2.firstName,
      employee2.lastName
    );

    // Cleanup: delete the second employee
    await dashboardPage.clickDeleteForEmployee(
      employee2.firstName,
      employee2.lastName
    );
  });
});
