import { test, expect } from "../fixtures/auth.fixture";
import { generateEmployee } from "../utils/data-factory";
import { calculateBenefits } from "../utils/benefits-calculator";

test.describe("Scenario 2: Edit Employee", () => {
  let originalEmployee: ReturnType<typeof generateEmployee>;

  test.beforeEach(async ({ dashboardPage, employeeModal }) => {
    // Create an employee to edit in each test
    originalEmployee = generateEmployee({ dependants: 1 });

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName,
      originalEmployee.dependants
    );
    await employeeModal.expectToBeClosed();
    await dashboardPage.expectEmployeeVisible(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
  });

  test.afterEach(async ({ dashboardPage }) => {
    // Best-effort cleanup: try to delete any remaining test employees
    // This is wrapped in try/catch because the employee may already be deleted
    // or the name may have changed during the test
  });

  test("should open the Edit modal with pre-filled employee data", async ({
    dashboardPage,
    employeeModal,
  }) => {
    await dashboardPage.clickEditForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    await employeeModal.expectToBeVisible();
    await employeeModal.expectFormValues(
      originalEmployee.firstName,
      originalEmployee.lastName,
      originalEmployee.dependants
    );

    // Cancel to close without saving
    await employeeModal.cancel();

    // Cleanup
    await dashboardPage.clickDeleteForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
  });

  test("should update employee first name and reflect in the table", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const updatedEmployee = generateEmployee({
      lastName: originalEmployee.lastName,
      dependants: originalEmployee.dependants,
    });

    await dashboardPage.clickEditForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
    await employeeModal.expectToBeVisible();

    await employeeModal.editEmployee(
      updatedEmployee.firstName,
      updatedEmployee.lastName,
      updatedEmployee.dependants
    );
    await employeeModal.expectToBeClosed();

    // Original name should no longer be visible
    await dashboardPage.expectEmployeeNotVisible(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    // Updated name should be visible
    await dashboardPage.expectEmployeeVisible(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );

    // Cleanup
    await dashboardPage.clickDeleteForEmployee(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );
  });

  test("should update employee dependants and recalculate benefits", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const newDependants = 5;
    const expected = calculateBenefits(newDependants);

    await dashboardPage.clickEditForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
    await employeeModal.expectToBeVisible();

    await employeeModal.editEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName,
      newDependants
    );
    await employeeModal.expectToBeClosed();

    // Verify updated row data
    const rowData = await dashboardPage.getEmployeeRowData(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    expect(rowData.dependants).toBe(newDependants);
    expect(rowData.benefitsCost).toBeCloseTo(expected.benefitsCostPerPaycheck, 2);
    expect(rowData.net).toBeCloseTo(expected.netPerPaycheck, 2);

    // Cleanup
    await dashboardPage.clickDeleteForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
  });

  test("should update all employee fields", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const updatedEmployee = generateEmployee({ dependants: 4 });
    const expected = calculateBenefits(updatedEmployee.dependants);

    await dashboardPage.clickEditForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
    await employeeModal.expectToBeVisible();

    await employeeModal.editEmployee(
      updatedEmployee.firstName,
      updatedEmployee.lastName,
      updatedEmployee.dependants
    );
    await employeeModal.expectToBeClosed();

    // Verify updated employee is in the table
    await dashboardPage.expectEmployeeVisible(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );

    const rowData = await dashboardPage.getEmployeeRowData(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );

    expect(rowData.dependants).toBe(updatedEmployee.dependants);
    expect(rowData.benefitsCost).toBeCloseTo(expected.benefitsCostPerPaycheck, 2);
    expect(rowData.net).toBeCloseTo(expected.netPerPaycheck, 2);

    // Cleanup
    await dashboardPage.clickDeleteForEmployee(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );
  });
});
