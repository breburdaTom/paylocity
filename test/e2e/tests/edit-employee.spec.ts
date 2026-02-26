import { test, expect } from "../fixtures/auth.fixture";
import { generateEmployee } from "../utils/data-factory";
import { calculateBenefits } from "../utils/benefits-calculator";

test.describe("Scenario 2: Edit Employee", () => {
  let originalEmployee: ReturnType<typeof generateEmployee>;

  test.beforeEach(async ({ dashboardPage, employeeModal }) => {
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
    // Best-effort cleanup — skip if the employee was already deleted or renamed
    const row = dashboardPage.getEmployeeRow(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
    if (await row.isVisible().catch(() => false)) {
      try {
        await dashboardPage.clickDeleteForEmployee(
          originalEmployee.firstName,
          originalEmployee.lastName
        );
      } catch {
        // ignore
      }
    }
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

    await employeeModal.cancel();

    await dashboardPage.clickDeleteForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
  });

  test("should not save changes when clicking Cancel in Edit modal", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const beforeData = await dashboardPage.getEmployeeRowData(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    await dashboardPage.clickEditForEmployee(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
    await employeeModal.expectToBeVisible();

    await employeeModal.fillEmployeeForm("Changed", "Name", 10);
    await employeeModal.cancel();

    await dashboardPage.expectEmployeeVisible(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    const afterData = await dashboardPage.getEmployeeRowData(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    expect(afterData.dependants).toBe(beforeData.dependants);
    expect(afterData.benefitsCost).toBe(beforeData.benefitsCost);
    expect(afterData.net).toBe(beforeData.net);

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

    await dashboardPage.expectEmployeeNotVisible(
      originalEmployee.firstName,
      originalEmployee.lastName
    );
    await dashboardPage.expectEmployeeVisible(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );

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

    const rowData = await dashboardPage.getEmployeeRowData(
      originalEmployee.firstName,
      originalEmployee.lastName
    );

    expect(rowData.dependants).toBe(newDependants);
    expect(rowData.benefitsCost).toBeCloseTo(expected.benefitsCostPerPaycheck, 2);
    expect(rowData.net).toBeCloseTo(expected.netPerPaycheck, 2);

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

    await dashboardPage.clickDeleteForEmployee(
      updatedEmployee.firstName,
      updatedEmployee.lastName
    );
  });
});
