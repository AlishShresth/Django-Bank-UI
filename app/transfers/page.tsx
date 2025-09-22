'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransferForm } from '@/components/transfers/transfer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/axios';
import type { Transfer } from '@/types/transaction';
import { useAccountStore } from '@/stores/account-store';
import { useTransactionStore } from '@/stores/transaction-store';
import { formatDate, formatBalance } from '@/lib/utils';
import { toast } from 'sonner';

export default function TransfersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const { getAccounts, account_list, setAccounts } = useAccountStore();
  const { getTransactions, transaction_list, setTransactions } =
    useTransactionStore();

  useEffect(() => {
    if (account_list.length == 0) {
      getAccounts();
    }
    if (transaction_list.length == 0) {
      getTransactions();
    }
  }, []);

  const handleTransfer = async (transfer: Transfer) => {
    // Simulate API call
    try {
      const response = await apiClient.post(
        '/v1/accounts/transfer/initiate/',
        transfer
      );
      return response;
    } catch (error: any) {
      console.error(error);
      throw (
        error.response.data?.initiate_transfer?.non_field_errors[0] || error
      );
    }
  };

  const handleVerifySecurityQuestion = async (security_answer: string) => {
    try {
      const response = await apiClient.post(
        '/v1/accounts/transfer/verify-security-question/',
        { security_answer: security_answer }
      );
      return response;
    } catch (error: any) {
      toast.error('Failed to verity security question');
      console.error(error);
      throw (
        error.response.data?.verification_answer?.non_field_errors[0] || error
      );
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      const response = await apiClient.post(
        '/v1/accounts/transfer/verify-otp/',
        { otp: otp }
      );
      const transfer = response.data.verify_otp;
      setTransactions([transfer, ...transaction_list]);
      // Update account balances
      const updatedAccounts = account_list.map((account) => {
        if (account.account_number === transfer.sender_account) {
          return {
            ...account,
            account_balance: (
              parseFloat(account.account_balance) - parseFloat(transfer.amount)
            ).toString(),
          };
        }
        if (account.account_number === transfer.receiver_account) {
          return {
            ...account,
            account_balance: (
              parseFloat(account.account_balance) + parseFloat(transfer.amount)
            ).toString(),
          };
        }
        return account;
      });
      setAccounts(updatedAccounts);

      const sourceAccount = account_list.find(
        (acc) => acc.account_number === transfer.sender_account
      );
      const destinationAccount = account_list.find(
        (acc) => acc.account_number === transfer.receiver_account
      );

      setTransferSuccess(
        `Successfully transferred ${formatBalance(transfer.amount)} from ${
          sourceAccount?.account_number
        } to ${destinationAccount?.account_number}`
      );

      // Clear success message after 5 seconds
      setTimeout(() => setTransferSuccess(null), 5000);
      return response;
    } catch (error: any) {
      throw error.response.data?.verify_otp?.non_field_errors[0] || error;
    }
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
          <TransferForm
            accounts={account_list}
            onTransfer={handleTransfer}
            onVerifySecurityQuestion={handleVerifySecurityQuestion}
            onVerifyOTP={handleVerifyOTP}
          />

          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transaction_list
                  .filter(
                    (transaction) => transaction.transaction_type == 'transfer'
                  )
                  .slice(0, 5)
                  .map((transfer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {transfer.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transfer.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {formatBalance(transfer.amount.toString())}
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
