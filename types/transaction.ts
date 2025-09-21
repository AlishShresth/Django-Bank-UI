import { User } from './auth';
import { AccountCurrency, BankAccount } from './banking';

export interface Transaction {
  id: number;
  user?: User;
  amount: number;
  description?: string;
  receiver?: User;
  sender?: User;
  receiver_account?: BankAccount;
  sender_account?: BankAccount;
  currency?: AccountCurrency;
  status: string;
  transaction_type: string;
  created_at: string;
  reference_number: string | null;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'interest';

export interface Transfer {
  sender_account: string;
  receiver_account: string;
  amount: number;
  description: string;
  reference_number?: string;
}

export interface TransactionState {
  transaction_list: Transaction[];
  isLoading: boolean;
  error: Record<string, any> | null;
}
