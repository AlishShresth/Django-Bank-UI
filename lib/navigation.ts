import {
  Home,
  CreditCard,
  ArrowLeftRight,
  History,
  Users,
  PieChart,
  UserCheck,
} from 'lucide-react';

export const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    role: [
      'customer',
      'branch_manager',
      'account_executive',
      'teller',
    ] as const,
  },
  {
    name: 'Accounts',
    href: '/accounts',
    icon: CreditCard,
    role: [
      'customer',
      'branch_manager',
      'account_executive',
      'teller',
    ] as const,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: History,
    role: [
      'customer',
      'branch_manager',
      'account_executive',
      'teller',
    ] as const,
  },
  {
    name: 'Transfers',
    href: '/transfers',
    icon: ArrowLeftRight,
    role: [
      'customer',
      'branch_manager',
      'account_executive',
      'teller',
    ] as const,
  },
  {
    name: 'Cards',
    href: '/cards',
    icon: CreditCard,
    role: [
      'customer',
      'branch_manager',
      'account_executive',
      'teller',
    ] as const,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
    role: ['branch_manager', 'account_executive', 'teller'] as const,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: PieChart,
    role: ['branch_manager'] as const,
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: UserCheck,
    role: ['branch_manager', 'account_executive'] as const,
  },
];