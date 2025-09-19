'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransactionList } from '@/components/transactions/transaction-list';
import type { Transaction } from '@/types/transaction';
import { apiClient } from '@/lib/axios';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/v1/accounts/transactions/');
      setTransactions(response.data.transaction_list.results);
    } catch (error: any) {
      console.error(error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTransactions();
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

        <TransactionList transactions={transactions} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
