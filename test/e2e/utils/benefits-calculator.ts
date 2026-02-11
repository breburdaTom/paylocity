/**
 * Benefits cost calculation helpers.
 *
 * Business rules:
 * - All employees are paid $2,000 per paycheck before deductions
 * - There are 26 paychecks in a year
 * - The cost of benefits is $1,000/year for each employee
 * - Each dependent incurs a cost of $500/year
 */

const PAYCHECK_AMOUNT = 2000;
const PAYCHECKS_PER_YEAR = 26;
const EMPLOYEE_BENEFITS_COST_PER_YEAR = 1000;
const DEPENDENT_BENEFITS_COST_PER_YEAR = 500;

export interface BenefitsBreakdown {
  /** Annual salary (paychecks × paycheck amount) */
  salary: number;
  /** Gross pay per paycheck */
  grossPerPaycheck: number;
  /** Total annual benefits cost */
  annualBenefitsCost: number;
  /** Benefits cost per paycheck */
  benefitsCostPerPaycheck: number;
  /** Net pay per paycheck */
  netPerPaycheck: number;
}

/**
 * Calculate the expected benefits breakdown for an employee.
 *
 * @param dependants - number of dependants
 * @returns BenefitsBreakdown with all calculated values
 */
export function calculateBenefits(dependants: number): BenefitsBreakdown {
  const salary = PAYCHECK_AMOUNT * PAYCHECKS_PER_YEAR;
  const grossPerPaycheck = PAYCHECK_AMOUNT;

  const annualBenefitsCost =
    EMPLOYEE_BENEFITS_COST_PER_YEAR +
    dependants * DEPENDENT_BENEFITS_COST_PER_YEAR;

  const benefitsCostPerPaycheck = round(annualBenefitsCost / PAYCHECKS_PER_YEAR);
  const netPerPaycheck = round(grossPerPaycheck - benefitsCostPerPaycheck);

  return {
    salary,
    grossPerPaycheck,
    annualBenefitsCost,
    benefitsCostPerPaycheck,
    netPerPaycheck,
  };
}

/**
 * Round a number to 2 decimal places.
 */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}
