'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { BankAccount } from '@/types/banking';
import { useAuthStore } from '@/stores/auth-store';
import { formatBalance } from '@/lib/utils';

interface DepositWithdrawalFormProps {
  accounts: BankAccount[];
  onTransaction: (transaction: any) => Promise<void>;
}

export function DepositWithdrawalForm({
  accounts,
  onTransaction,
}: DepositWithdrawalFormProps) {
  const [depositData, setDepositData] = useState({
    accountId: '',
    amount: '',
    description: '',
    reference: '',
  });
  const [withdrawalData, setWithdrawalData] = useState({
    accountId: '',
    amount: '',
    description: '',
    reference: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthStore();

  if (!user || user.role == 'customer') {
    return null;
  }

  const validateForm = (data: any, type: 'deposit' | 'withdrawal') => {
    const newErrors: Record<string, string> = {};

    if (!data.accountId) {
      newErrors.accountId = 'Please select an account';
    }

    if (!data.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (type === 'withdrawal') {
      const account = accounts.find((acc) => acc.id === data.accountId);
      if (account && Number(data.amount) > account.account_balance) {
        newErrors.amount = 'Insufficient funds';
      }
    }

    if (!data.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent,
    type: 'deposit' | 'withdrawal'
  ) => {
    e.preventDefault();

    const data = type === 'deposit' ? depositData : withdrawalData;

    if (!validateForm(data, type)) return;

    setIsLoading(true);
    try {
      await onTransaction({
        type,
        accountId: data.accountId,
        amount: Number(data.amount),
        description: data.description,
        reference: data.reference || undefined,
      });

      // Reset form
      if (type === 'deposit') {
        setDepositData({
          accountId: '',
          amount: '',
          description: '',
          reference: '',
        });
      } else {
        setWithdrawalData({
          accountId: '',
          amount: '',
          description: '',
          reference: '',
        });
      }
      setErrors({});
    } catch (error: any) {
      setErrors({
        general: error.message || `${type} failed. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdrawal" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Withdrawal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <form
              onSubmit={(e) => handleSubmit(e, 'deposit')}
              className="space-y-4"
            >
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Account
                </label>
                <Select
                  value={depositData.accountId}
                  onValueChange={(value) =>
                    setDepositData({ ...depositData, accountId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {account.account_type} ****
                            {account.account_number.slice(-4)}
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            {formatBalance(
                              account.account_balance,
                              account.currency
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.accountId && (
                  <p className="text-sm text-destructive">{errors.accountId}</p>
                )}
              </div>

              <FormInput
                label="Amount"
                type="number"
                value={depositData.amount}
                onChange={(e) =>
                  setDepositData({ ...depositData, amount: e.target.value })
                }
                error={errors.amount}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />

              <FormInput
                label="Description"
                type="text"
                value={depositData.description}
                onChange={(e) =>
                  setDepositData({
                    ...depositData,
                    description: e.target.value,
                  })
                }
                error={errors.description}
                placeholder="Cash deposit, check deposit, etc."
                required
              />

              <FormInput
                label="Reference (Optional)"
                type="text"
                value={depositData.reference}
                onChange={(e) =>
                  setDepositData({ ...depositData, reference: e.target.value })
                }
                placeholder="Check number, reference ID, etc."
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Process Deposit'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="withdrawal">
            <form
              onSubmit={(e) => handleSubmit(e, 'withdrawal')}
              className="space-y-4"
            >
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Account
                </label>
                <Select
                  value={withdrawalData.accountId}
                  onValueChange={(value) =>
                    setWithdrawalData({ ...withdrawalData, accountId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {account.account_type} ****
                            {account.account_number.slice(-4)}
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            {formatBalance(
                              account.account_balance,
                              account.currency
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.accountId && (
                  <p className="text-sm text-destructive">{errors.accountId}</p>
                )}
              </div>

              <FormInput
                label="Amount"
                type="number"
                value={withdrawalData.amount}
                onChange={(e) =>
                  setWithdrawalData({
                    ...withdrawalData,
                    amount: e.target.value,
                  })
                }
                error={errors.amount}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />

              <FormInput
                label="Description"
                type="text"
                value={withdrawalData.description}
                onChange={(e) =>
                  setWithdrawalData({
                    ...withdrawalData,
                    description: e.target.value,
                  })
                }
                error={errors.description}
                placeholder="Cash withdrawal, ATM, etc."
                required
              />

              <FormInput
                label="Reference (Optional)"
                type="text"
                value={withdrawalData.reference}
                onChange={(e) =>
                  setWithdrawalData({
                    ...withdrawalData,
                    reference: e.target.value,
                  })
                }
                placeholder="ATM location, reference ID, etc."
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Process Withdrawal'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
