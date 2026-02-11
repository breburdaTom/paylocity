import { faker } from "@faker-js/faker";

export interface EmployeeData {
  firstName: string;
  lastName: string;
  dependants: number;
}

export function generateEmployee(overrides?: Partial<EmployeeData>): EmployeeData {
  return {
    firstName: overrides?.firstName ?? faker.person.firstName(),
    lastName: overrides?.lastName ?? faker.person.lastName(),
    dependants: overrides?.dependants ?? faker.number.int({ min: 0, max: 10 }),
  };
}

export function generateEmployeeWithDependants(dependants: number): EmployeeData {
  return generateEmployee({ dependants });
}

export function generateEmployeeNoDependants(): EmployeeData {
  return generateEmployee({ dependants: 0 });
}
