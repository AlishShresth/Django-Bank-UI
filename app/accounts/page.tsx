'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AccountCard } from '@/components/accounts/account-card';
import { CreateAccountDialog } from '@/components/accounts/create-account-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import type { BankAccount } from '@/types/banking';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/axios';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<BankAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();

  const fetchUserAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/v1/accounts/accounts');
      setAccounts(response.data.account_list.results);
      setFilteredAccounts(response.data.account_list.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  useEffect(() => {
    let filtered = accounts;

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.account_number.includes(searchTerm) ||
          account.account_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (account) => account.account_status === statusFilter
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (account) => account.account_type === typeFilter
      );
    }

    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, statusFilter, typeFilter]);

  const handleCreateAccount = async (accountData: any) => {
    try{ 
      const response = await apiClient.post('/v1/accounts/accounts/', accountData);
      setAccounts([...accounts, response.data.account]);
    } catch(error: any) {
      console.error(error);
      throw new Error('Failed to create account');
    }
  };

  const handleFreezeAccount = async (accountId: string) => {
    // setAccounts(
    //   accounts.map((account) => (account.id === accountId ? { ...account, status: "frozen" as const } : account)),
    // )
  };

  const handleUnfreezeAccount = async (accountId: string) => {
    // setAccounts(
    //   accounts.map((account) => (account.id === accountId ? { ...account, status: "active" as const } : account)),
    // )
  };

  const canManageAccounts =
    user &&
    ['account_teller', 'branch_manager', 'account_executive'].includes(
      user.role!
    );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
            <p className="text-muted-foreground">
              {canManageAccounts
                ? 'Manage customer accounts'
                : 'View your account information'}
            </p>
          </div>
          <CreateAccountDialog onCreateAccount={handleCreateAccount} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No accounts found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onFreeze={canManageAccounts ? handleFreezeAccount : undefined}
                onUnfreeze={
                  canManageAccounts ? handleUnfreezeAccount : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
