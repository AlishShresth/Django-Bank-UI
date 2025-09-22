import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { useAccountStore } from '@/stores/account-store';
import { useTransactionStore } from '@/stores/transaction-store';
import { useCardStore } from '@/stores/card-store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBalance = (balance: string, currency: string = 'npr') => {
  if (currency == 'pound_sterling') {
    currency = 'gbp';
  } else if (currency == 'us_dollars') {
    currency = 'usd';
  } else {
    currency = 'npr';
  }
  let format = 'en-US';
  if (currency == 'npr') {
    format = 'en-IN';
  }
  return new Intl.NumberFormat(format, {
    style: 'currency',
    currency: currency,
  }).format(parseFloat(balance));
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCardNumber = (
  cardNumber: string,
  showFullNumber: boolean = false
) => {
  if (showFullNumber) {
    return cardNumber.replace(/(.{4})/g, '$1 ').trim();
  }
  return `**** **** **** ${cardNumber.slice(-4)}`;
};

export const parseExpiryTime = (timeStr: string): number => {
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 3; // Default to 3 minutes if format is unexpected

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  return hours * 60 + minutes;
};

export const resetAllStores = () => {
  useAuthStore.getState().resetUsers();
  useProfileStore.getState().resetProfile();
  useAccountStore.getState().resetAccounts();
  useTransactionStore.getState().resetTransactions();
  useCardStore.getState().resetCards();
};
