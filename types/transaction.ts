import { User } from "./auth";
import { BankAccount } from "./banking";

export interface Transaction {
  id: number;
  user?: User;
  amount: number;
  description?: string;
  receiver?: User;
  sender?: User;
  receiver_account?: BankAccount;
  sender_account?: BankAccount;
  status: string;
  transaction_type: string;
  created_at: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'interest';
