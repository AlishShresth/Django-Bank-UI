'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import type { Transaction } from '@/types/transaction';
import { formatDate, formatBalance } from '@/lib/utils';
import { toast } from 'sonner';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionList({
  transactions,
  isLoading = false,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction?.description
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      transaction.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === 'all' || transaction.transaction_type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || transaction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const exportToExcel = async () => {
    if (filteredTransactions.length === 0) return;

    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');

      const excelData = filteredTransactions.map((transaction) => ({
        ID: transaction.id,
        Description: transaction.description,
        Type: transaction.transaction_type,
        Amount:
          transaction.transaction_type === 'deposit'
            ? `+${formatBalance(transaction.amount, transaction.currency)}`
            : `-${formatBalance(transaction.amount, transaction.currency)}`,
        Currency: transaction.currency,
        Status: transaction.status,
        Date: formatDate(transaction.created_at),
        'Sender Account': transaction.sender_account
          ? transaction.sender_account
          : 'N/A',
        'Receiver Account': transaction.receiver_account
          ? transaction.receiver_account
          : 'N/A',
      }));

      // Create a workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Generate the Excel file and trigger download
      XLSX.writeFile(
        wb,
        `transactions_${new Date().toISOString().split('T')[0]}.xlsx`
      );
    } catch (error: any) {
      console.error('Error exporting transactions:', error);
      toast.error('Error exporting transactions');
    } finally {
      setIsExporting(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-primary" />;
      case 'payment':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={isExporting || filteredTransactions.length === 0}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>{' '}
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No transactions found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.transaction_type)}
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDate(transaction.created_at)}</span>
                        {transaction.id && (
                          <>
                            <span>•</span>
                            <span>
                              {transaction.id.toString().split('-').at(-1)}
                            </span>
                          </>
                        )}
                        {transaction.receiver_account && (
                          <>
                            <span>•</span>
                            <span>
                              To: ****
                              {transaction.receiver_account
                                ?.toString()
                                ?.slice(-4)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.transaction_type === 'deposit'
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}
                      {formatBalance(transaction.amount, transaction.currency)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
