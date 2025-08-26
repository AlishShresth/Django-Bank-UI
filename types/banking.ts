import { User } from './auth';

export interface BankAccount {
  id: number;
  account_number: string;
  account_balance: number;
  currency: AccountCurrency;
  account_status: AccountStatus;
  account_type: AccountType;
  is_primary: boolean;
  kyc_submitted: boolean;
  kyc_verified: boolean;
  verified_by?: User;
  verification_date?: string;
  verification_note?: string;
  fully_activated: boolean;
  interest_rate: number;
  annual_interest_rate: number;
  apply_daily_interest(): number;
  clean(): void;
  save(): void;
  created_at: string;
}

export type AccountType = 'current' | 'savings' | 'fixed';

export type AccountStatus = 'active' | 'inactive' | 'blocked';

export type AccountCurrency =
  | 'us_dollar'
  | 'pound_sterling'
  | 'nepalese_rupees';
