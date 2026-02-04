// Loan types and enums

export enum LoanType {
  PERSONAL = 'PERSONAL',
  MORTGAGE = 'MORTGAGE',
  AUTO = 'AUTO',
  CREDIT_CARD = 'CREDIT_CARD',
  BNPL = 'BNPL',
  OTHER = 'OTHER',
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  PAID_OFF = 'PAID_OFF',
  DEFAULTED = 'DEFAULTED',
  CLOSED = 'CLOSED',
}

export enum PaymentFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface Loan {
  id: string;
  household_id: string;
  name: string;
  description?: string;
  type: LoanType;
  status: LoanStatus;
  principal_amount: number;
  current_balance: number;
  interest_rate: number;
  payment_amount: number;
  payment_frequency: PaymentFrequency;
  start_date: string;
  end_date?: string;
  next_payment_date?: string;
  lender?: string;
  account_number?: string;
  created_at: string;
  updated_at: string;
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  principal_amount: number;
  interest_amount: number;
  remaining_balance: number;
  notes?: string;
  created_at: string;
}
