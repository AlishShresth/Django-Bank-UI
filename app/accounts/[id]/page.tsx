'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Settings,
  Fence as Freeze,
  Play,
} from 'lucide-react';
import type { BankAccount } from '@/types/banking';
import type { Transaction } from '@/types/transaction';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/axios';

export default function AccountDetailsPage() {
  const params = useParams();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();

  const fetchUserAccount = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/v1/accounts/accounts/${id}`);
      setAccount(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccount(params.id as string);
  }, [params.id]);

  const formatBalance = (balance: number, currency: string) => {
    if (currency == 'pound_sterling') {
      currency = 'gbp';
    } else if (currency == 'us_dollars') {
      currency = 'usd';
    } else {
      currency = 'npr';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(balance);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const canManageAccount =
    user &&
    ['account_teller', 'branch_manager', 'account_executive'].includes(
      user.role!
    );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Account not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {account.account_type.charAt(0).toUpperCase() +
                account.account_type.slice(1)}{' '}
              Account
            </h1>
            <p className="text-muted-foreground">
              Account Number: ****{account.account_number.slice(-4)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                account.account_status === 'active' ? 'default' : 'secondary'
              }
            >
              {account.account_status}
            </Badge>
            {canManageAccount && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                {account.account_status === 'active' ? (
                  <Button variant="outline" size="sm">
                    <Freeze className="h-4 w-4 mr-2" />
                    Block
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Unblock
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {formatBalance(account.account_balance, account.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Account Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground capitalize">
                {account.account_type}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Opened
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">
                {formatDate(account.created_at)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions" className="cursor-pointer">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="statements" className="cursor-pointer">
              Statements
            </TabsTrigger>
            <TabsTrigger value="details" className="cursor-pointer">
              Account Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {account.recent_transactions?.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.created_at)}
                            {/* •{' '} */}
                            {/* {transaction.id} */}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.transaction_type === 'deposit'
                              ? 'text-success'
                              : 'text-foreground'
                          }`}
                        >
                          {transaction.transaction_type === 'deposit'
                            ? '+'
                            : '-'}
                          {formatBalance(
                            transaction.amount,
                            transaction.currency!
                          )}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {account?.recent_transactions?.length == 0 && (
                    <div className="flex items-center px-4 text-muted-foreground">
                      No Recent Transactions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statements">
            <Card>
              <CardHeader>
                <CardTitle>Account Statements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Download your monthly account statements.
                </p>
                <div className="mt-4 space-y-2">
                  {['January 2024', 'December 2023', 'November 2023'].map(
                    (month) => (
                      <div
                        key={month}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium">{month}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </p>
                    <p className="font-mono">{account.account_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Routing Number
                    </p>
                    <p className="font-mono">021000021</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Account Type
                    </p>
                    <p className="capitalize">{account.account_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={
                        account.account_status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {account.account_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
