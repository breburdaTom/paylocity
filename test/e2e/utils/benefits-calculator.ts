/**
 * Benefits calculation rules:
 * - $2,000 per paycheck, 26 paychecks/year
 * - Employee benefits: $1,000/year
 * - Each dependent: $500/year
 */

const PAYCHECK_AMOUNT = 2000;
const PAYCHECKS_PER_YEAR = 26;
const EMPLOYEE_BENEFITS_COST_PER_YEAR = 1000;
const DEPENDENT_BENEFITS_COST_PER_YEAR = 500;

export interface BenefitsBreakdown {
  salary: number;
  grossPerPaycheck: number;
  annualBenefitsCost: number;
  benefitsCostPerPaycheck: number;
  netPerPaycheck: number;
}

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

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
