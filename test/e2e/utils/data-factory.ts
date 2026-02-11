import { faker } from "@faker-js/faker";

export interface EmployeeData {
  firstName: string;
  lastName: string;
  dependants: number;
}

/**
 * Generate random employee data for test scenarios.
 *
 * @param overrides - optional partial overrides for any field
 * @returns EmployeeData with random or overridden values
 */
export function generateEmployee(overrides?: Partial<EmployeeData>): EmployeeData {
  return {
    firstName: overrides?.firstName ?? faker.person.firstName(),
    lastName: overrides?.lastName ?? faker.person.lastName(),
    dependants: overrides?.dependants ?? faker.number.int({ min: 0, max: 10 }),
  };
}

/**
 * Generate employee data with a specific number of dependants.
 */
export function generateEmployeeWithDependants(dependants: number): EmployeeData {
  return generateEmployee({ dependants });
}

/**
 * Generate employee data with zero dependants.
 */
export function generateEmployeeNoDependants(): EmployeeData {
  return generateEmployee({ dependants: 0 });
}
