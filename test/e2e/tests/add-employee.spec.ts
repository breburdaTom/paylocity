import { test, expect } from "../fixtures/auth.fixture";
import { generateEmployee, generateEmployeeNoDependants, generateEmployeeWithDependants } from "../utils/data-factory";
import { calculateBenefits } from "../utils/benefits-calculator";

test.describe("Scenario 1: Add Employee", () => {
  test("should open the Add Employee modal when clicking Add Employee", async ({
    dashboardPage,
    employeeModal,
  }) => {
    await dashboardPage.clickAddEmployee();
    await employeeModal.expectToBeVisible();
  });

  test("should add a new employee and display them in the table", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const employee = generateEmployee();

    await dashboardPage.clickAddEmployee();
    await employeeModal.expectToBeVisible();

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
  });

  test("should calculate correct benefits for employee with no dependants", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const employee = generateEmployeeNoDependants();
    const expected = calculateBenefits(0);

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      employee.firstName,
      employee.lastName,
      employee.dependants
    );
    await employeeModal.expectToBeClosed();

    const rowData = await dashboardPage.getEmployeeRowData(
      employee.firstName,
      employee.lastName
    );

    expect(rowData.salary).toBeCloseTo(expected.salary, 2);
    expect(rowData.gross).toBeCloseTo(expected.grossPerPaycheck, 2);
    expect(rowData.benefitsCost).toBeCloseTo(expected.benefitsCostPerPaycheck, 2);
    expect(rowData.net).toBeCloseTo(expected.netPerPaycheck, 2);
    expect(rowData.dependants).toBe(0);

    await dashboardPage.clickDeleteForEmployee(
      employee.firstName,
      employee.lastName
    );
  });

  test("should calculate correct benefits for employee with dependants", async ({
    dashboardPage,
    employeeModal,
  }) => {
    const dependants = 3;
    const employee = generateEmployeeWithDependants(dependants);
    const expected = calculateBenefits(dependants);

    await dashboardPage.clickAddEmployee();
    await employeeModal.addEmployee(
      employee.firstName,
      employee.lastName,
      employee.dependants
    );
    await employeeModal.expectToBeClosed();

    const rowData = await dashboardPage.getEmployeeRowData(
      employee.firstName,
      employee.lastName
    );

    expect(rowData.salary).toBeCloseTo(expected.salary, 2);
    expect(rowData.gross).toBeCloseTo(expected.grossPerPaycheck, 2);
    expect(rowData.benefitsCost).toBeCloseTo(expected.benefitsCostPerPaycheck, 2);
    expect(rowData.net).toBeCloseTo(expected.netPerPaycheck, 2);
    expect(rowData.dependants).toBe(dependants);

    await dashboardPage.clickDeleteForEmployee(
      employee.firstName,
      employee.lastName
    );
  });

  test("should close the modal when clicking Cancel", async ({
    dashboardPage,
    employeeModal,
  }) => {
    await dashboardPage.clickAddEmployee();
    await employeeModal.expectToBeVisible();

    await employeeModal.cancel();
    await employeeModal.expectToBeClosed();
  });
});
