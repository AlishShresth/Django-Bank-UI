import { useEffect } from 'react';
import Link from 'next/link';
import { StatsCard } from './stats-card';
import { QuickActions } from './quick-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Activity,
  UserCheck,
  Users,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createApiStore } from '@/stores/generic-store';
import { BankAccount } from '@/types/banking';
import { Transaction } from '@/types/transaction';
import { VirtualCard } from '@/types/card';
import { formatDateRelative } from '@/lib/formatDate';

export function CustomerDashboard() {
  const useAccountsStore = createApiStore<BankAccount>();
  const useTransactionStore = createApiStore<Transaction>();
  const useCardsStore = createApiStore<VirtualCard>();
  const accountStore = useAccountsStore();
  const transactionStore = useTransactionStore();
  const cardsStore = useCardsStore();

  useEffect(() => {
    accountStore.fetch('/v1/accounts/accounts/');
  }, []);

  useEffect(() => {
    const fetchData = () => {
      transactionStore.fetch('/v1/accounts/transactions/');
      cardsStore.fetch('/v1/cards/virtual-cards/');
    };
    if (accountStore.data.length > 0) {
      fetchData();
    }
  }, [accountStore]);

  return (
    <>
      {accountStore.data.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your accounts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Balance"
              value="$12,345.67"
              change="+2.5% from last month"
              changeType="positive"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <StatsCard
              title="Checking Account"
              value="$8,234.50"
              change="+$1,200 this month"
              changeType="positive"
              icon={<Activity className="h-4 w-4" />}
            />
            <StatsCard
              title="Savings Account"
              value="$4,111.17"
              change="+0.5% interest"
              changeType="positive"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Cards"
              value="3"
              change="2 debit, 1 credit"
              changeType="neutral"
              icon={<CreditCard className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickActions />
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionStore.data.length > 0 ? (
                    transactionStore.data.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateRelative(
                              transaction.created_at.split('T')[0]
                            )}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            transaction.transaction_type == 'deposit'
                              ? 'text-success'
                              : 'text-foreground'
                          }`}
                        >
                          {transaction.transaction_type == 'deposit'
                            ? '+'
                            : '-'}
                          {transaction.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      No recent transactions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-8 h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to SecureBank!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're excited to have you join our banking family. To get started
              and create your first account, please complete the following
              steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Complete Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Fill in your personal information, identification details, and
                  contact information.
                </p>
                <Link href="/profile">
                  <Button className="w-full cursor-pointer">
                    Complete Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Add Next of Kin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Add at least one primary next of kin for emergency contact and
                  security purposes.
                </p>
                <p>&nbsp;</p>
                <Link href="/profile?tab=next-of-kin">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                  >
                    Add Next of Kin
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-xl">Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Once your profile is complete, create your first bank account
                  to start banking with us.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete steps 1 & 2 first
                </p>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    disabled
                    className="w-full cursor-not-allowed opacity-50 bg-transparent"
                  >
                    Create Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Our customer support team is here to help you get started.
                Contact us if you have any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                >
                  Call Support: 1-800-SECUREBANK
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                >
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
