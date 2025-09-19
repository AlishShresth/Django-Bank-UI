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
import { BankAccount } from '@/types/banking';
import { Transaction } from '@/types/transaction';
import { VirtualCard } from '@/types/card';
import { useProfileStore } from '@/stores/profile-store';
import { apiClient } from '@/lib/axios';
import { formatDateRelative } from '@/lib/formatDate';
import { formatBalance } from '@/lib/utils';

export function CustomerDashboard() {
  const { profile } = useProfileStore();
  const [accounts, setAccounts] = useState([] as BankAccount[]);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [cards, setCards] = useState([] as VirtualCard[]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [balanceChangePercentage, setBalanceChangePercentage] = useState(0);
  const [debitCards, setDebitCards] = useState(0);
  const [creditCards, setCreditCards] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const currency = 'NPR';
  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/v1/accounts/accounts/');
      setAccounts(response.data.account_list.results);
    } catch (error: any) {
      console.error(error);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get('/v1/accounts/transactions/');
      setTransactions(response.data.transaction_list.results);
    } catch (error: any) {
      console.error(error);
      setTransactions([]);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await apiClient.get('/v1/cards/virtual-cards/');
      setCards(response.data.card_list.results);
      if (response.data.card_list.results.length > 0) {
        setDebitCards(response.data.card_list.results[0].debit_cards_count);
        setCreditCards(response.data.card_list.results[0].credit_cards_count);
      }
    } catch (error: any) {
      console.error(error);
      setCards([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accounts.length == 0) return;
    fetchTransactions();
    fetchCards();
    let amount = 0;
    let changePercent = 0;
    for (let i = 0; i < accounts.length; i++) {
      amount += parseFloat(accounts[i].account_balance.toString());
      if(accounts[i].balance_change_percentage){ 
        changePercent += parseFloat(
          accounts[i].balance_change_percentage.toString()
        );
      }
    }
    changePercent /= accounts.length;
    setTotalBalance(amount);
    setBalanceChangePercentage(changePercent);
  }, [accounts]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        </div>
      )}
      {!isLoading && accounts.length > 0 ? (
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
            {accounts.length > 0 &&
              accounts.map((account) => (
                <StatsCard
                  key={account.account_number}
                  title={
                    account.account_type[0].toUpperCase() +
                    account.account_type.slice(1) +
                    'Account'
                  }
                  value={formatBalance(account.account_balance)}
                  change={account.account_balance > 0 ?
                    '+' + account.annual_interest_rate * 100 + '% interest' : '+0% interest'
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
              value={(debitCards + creditCards).toString()}
              change={
                debitCards > 0 && creditCards > 0
                  ? `${debitCards} debit, ${creditCards} credit`
                  : debitCards
                  ? `${debitCards} debit`
                  : creditCards
                  ? `${creditCards} credit}`
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
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
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
