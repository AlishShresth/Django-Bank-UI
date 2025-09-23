import { User } from './auth';
import { Transaction } from './transaction';

export interface BankAccount {
  id: string;
  account_number: string;
  account_balance: string;
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
  annual_interest_rate: number;
  balance_change_percentage: number;
  apply_daily_interest(): number;
  clean(): void;
  save(): void;
  created_at: string;
  recent_transactions?: Transaction[];
}

export type AccountType = 'current' | 'savings' | 'fixed';

export type AccountStatus = 'active' | 'inactive' | 'blocked';

export type AccountCurrency =
  | 'us_dollar'
  | 'pound_sterling'
  | 'nepalese_rupees';

export interface AccountState {
  account_list: BankAccount[];
  isLoading: boolean;
  error: Record<string, any> | null;
  count: number | null;
  next: string | null;
  previous: string | null;
}

export interface BankAccountPayload {
  account_type: AccountType;
  initial_deposit?: number;
  email: string;
  currency: AccountCurrency;
}
