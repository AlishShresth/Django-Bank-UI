import { User } from './auth';
import { BankAccount } from './banking';

export interface VirtualCard {
  id: number;
  user: User;
  bank_account: BankAccount;
  card_type: CardType;
  card_number: string;
  expiry_date: string;
  cvv: string;
  balance: number;
  status: CardStatus;
  debit_cards_count: number;
  credit_cards_count: number;
}

export type CardStatus = 'active' | 'inactive' | 'blocked';

export type CardType = 'credit' | 'debit';

export interface CardState {
  card_list: VirtualCard[];
  isLoading: boolean;
  error: Record<string, any>|null;
  debit_cards: number;
  credit_cards: number;
}
