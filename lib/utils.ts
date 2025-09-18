import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBalance = (balance: number, currency: string="npr") => {
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
  }).format(balance);
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

export const formatCardNumber = (cardNumber: string, showFullNumber: boolean = false) => {
    if (showFullNumber) {
      return cardNumber.replace(/(.{4})/g, '$1 ').trim();
    }
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };