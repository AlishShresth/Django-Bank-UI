'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransferForm } from '@/components/transfers/transfer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/axios';
import type { BankAccount } from '@/types/banking';
import type { Transfer } from '@/types/transaction';

export default function TransfersPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const fetchUserAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/v1/accounts/accounts');
      setAccounts(response.data.account_list.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserAccounts();
  }, []);

  const handleTransfer = async (transfer: Transfer) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update account balances
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        if (account.account_number === transfer.sender_account) {
          return {
            ...account,
            balance: account.account_balance - transfer.amount,
          };
        }
        if (account.account_number === transfer.receiver_account) {
          return {
            ...account,
            balance: account.account_balance + transfer.amount,
          };
        }
        return account;
      })
    );

    const sourceAccount = accounts.find(
      (acc) => acc.account_number === transfer.sender_account
    );
    const destinationAccount = accounts.find(
      (acc) => acc.account_number === transfer.receiver_account
    );

    setTransferSuccess(
      `Successfully transferred $${transfer.amount.toFixed(2)} from ${
        sourceAccount?.account_type
      } to ${destinationAccount?.account_type}`
    );

    // Clear success message after 5 seconds
    setTimeout(() => setTransferSuccess(null), 5000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transfer Money</h1>
          <p className="text-muted-foreground">
            Send money between your accounts or to other accounts
          </p>
        </div>

        {transferSuccess && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              {transferSuccess}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransferForm accounts={accounts} onTransfer={handleTransfer} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    description: 'Transfer to Savings',
                    amount: '$100.00',
                    date: 'Today',
                    status: 'completed',
                  },
                  {
                    description: 'Transfer to John Doe',
                    amount: '$250.00',
                    date: 'Yesterday',
                    status: 'completed',
                  },
                  {
                    description: 'Transfer to Business Account',
                    amount: '$500.00',
                    date: '2 days ago',
                    status: 'pending',
                  },
                ].map((transfer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {transfer.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {transfer.amount}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transfer.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
