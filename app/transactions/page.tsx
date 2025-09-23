'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransactionList } from '@/components/transactions/transaction-list';
import { useTransactionStore } from '@/stores/transaction-store';

export default function TransactionsPage() {
  const { getTransactions, transaction_list, isLoading } =
    useTransactionStore();

  useEffect(() => {
    if (transaction_list.length == 0) {
      getTransactions();
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your transaction history
          </p>
        </div>

        <TransactionList
          transactions={transaction_list}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
