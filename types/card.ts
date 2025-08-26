import { User } from './auth';
import { BankAccount } from './banking';

export interface VirtualCard {
  id: number;
  user: User;
  bank_account: BankAccount;
  card_number: string;
  expiry_date: string;
  cvv: string;
  balance: number;
  status: CardStatus;
}

export type CardStatus = 'active' | 'inactive' | 'blocked';
