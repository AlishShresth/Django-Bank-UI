import { useEffect, useState } from 'react';
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
import { useProfileStore } from '@/stores/profile-store';
import { useAccountStore } from '@/stores/account-store';
import { useTransactionStore } from '@/stores/transaction-store';
import { formatDateRelative } from '@/lib/formatDate';
import { formatBalance } from '@/lib/utils';
import { useCardStore } from '@/stores/card-store';

export function CustomerDashboard() {
  const { profile } = useProfileStore();
  const { getAccounts, account_list, isLoading } = useAccountStore();
  const { getTransactions, transaction_list } = useTransactionStore();
  const { getCards, card_list, debit_cards, credit_cards } = useCardStore();
  const [totalBalance, setTotalBalance] = useState(0);
  const [balanceChangePercentage, setBalanceChangePercentage] = useState(0);

  useEffect(() => {
    if (account_list.length == 0) {
      getAccounts();
    }
  }, []);

  useEffect(() => {
    if (account_list.length == 0) return;
    if (transaction_list.length == 0) {
      getTransactions();
    }
    if (card_list.length == 0) {
      getCards();
    }
    let amount = 0;
    let changePercent = 0;
    for (let i = 0; i < account_list.length; i++) {
      amount += parseFloat(account_list[i].account_balance.toString());
      if (account_list[i].balance_change_percentage) {
        changePercent += parseFloat(
          account_list[i].balance_change_percentage.toString()
        );
      }
    }
    changePercent /= account_list.length;
    setTotalBalance(amount);
    setBalanceChangePercentage(changePercent);
  }, [account_list]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        </div>
      )}
      {!isLoading && account_list.length > 0 ? (
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
              value={formatBalance(totalBalance)}
              change={
                balanceChangePercentage >= 0
                  ? '+' +
                    balanceChangePercentage.toString() +
                    '% from last month'
                  : '-' +
                    balanceChangePercentage.toString() +
                    '% from last month'
              }
              changeType={
                balanceChangePercentage > 0
                  ? 'positive'
                  : balanceChangePercentage < 0
                  ? 'negative'
                  : 'neutral'
              }
              icon={<DollarSign className="h-4 w-4" />}
            />
            {account_list.length > 0 &&
              account_list.map((account) => (
                <StatsCard
                  key={account.account_number}
                  title={
                    account.account_type[0].toUpperCase() +
                    account.account_type.slice(1) +
                    'Account'
                  }
                  value={formatBalance(account.account_balance)}
                  change={
                    account.account_balance > 0
                      ? '+' + account.annual_interest_rate * 100 + '% interest'
                      : '+0% interest'
                  }
                  changeType={
                    account.account_balance <= 0 ? 'neutral' : 'positive'
                  }
                  icon={
                    account.account_type == 'current' ? (
                      <Activity className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )
                  }
                />
              ))}
            <StatsCard
              title="Active Cards"
              value={(debit_cards + credit_cards).toString()}
              change={
                debit_cards > 0 && credit_cards > 0
                  ? `${debit_cards} debit, ${credit_cards} credit`
                  : debit_cards
                  ? `${debit_cards} debit`
                  : credit_cards
                  ? `${credit_cards} credit}`
                  : 'No active cards'
              }
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
                  {transaction_list.length > 0 ? (
                    transaction_list.map((transaction, index) => (
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
                            )}{' '}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            transaction.transaction_type == 'deposit'
                              ? 'text-success'
                              : 'text-destructive'
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
        !isLoading && (
          <div className="space-y-8 h-screen flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to SecureBank!
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're excited to have you join our banking family. To get
                started and create your first account, please complete the
                following steps:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Complete Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Fill in your personal information, identification details,
                    and contact information.
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
                    Add at least one primary next of kin for emergency contact
                    and security purposes.
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
                    Once your profile is complete, create your first bank
                    account to start banking with us.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete steps 1 & 2 first
                  </p>
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      disabled={!profile?.next_of_kin?.length}
                      className={`w-full mt-2 ${
                        !profile?.next_of_kin?.length
                          ? 'opacity-50 bg-transparent cursor-not-allowed'
                          : ''
                      }`}
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
        )
      )}
    </>
  );
}
