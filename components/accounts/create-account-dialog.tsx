'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormInput } from '@/components/ui/form-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useAccountStore } from '@/stores/account-store';
import { AccountCurrency, AccountType } from '@/types/banking';

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_type: '',
    initial_deposit: 0,
    email: '',
    currency: 'nepalese_rupees',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuthStore();
  const { createAccount } = useAccountStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_type) {
      newErrors.account_type = 'Account type is required';
    }

    if (!formData.currency) {
      newErrors.currency = 'Account currency is required';
    }

    if (
      isNaN(Number(formData.initial_deposit)) ||
      Number(formData.initial_deposit) < 0
    ) {
      newErrors.initial_deposit = 'Please enter a valid amount';
    }

    if (!formData.email) {
      newErrors.email = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createAccount({
        account_type: formData.account_type as AccountType,
        initial_deposit: Number(formData.initial_deposit),
        email: formData.email,
        currency: formData.currency as AccountCurrency,
      });
      setOpen(false);
      setFormData({
        account_type: '',
        initial_deposit: 0,
        email: '',
        currency: 'nepalese_rupees',
      });
      setErrors({});
    } catch (error: any) {
      console.log('error', error);
      setErrors({
        general: error.message || 'Failed to create account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user!.role == 'customer') {
      setFormData({ ...formData, email: user!.email });
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Create a new bank account for a customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Customer Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            placeholder="customer@example.com"
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Account Currency
            </label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nepalese_rupees">Nepalese Rupees</SelectItem>
                <SelectItem value="us_dollar">US Dollar</SelectItem>
                <SelectItem value="pound_sterling">Pound Sterling</SelectItem>
              </SelectContent>
            </Select>
            {errors.accountCurrency && (
              <p className="text-sm text-destructive">
                {errors.accountCurrency}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Account Type
            </label>
            <Select
              value={formData.account_type}
              onValueChange={(value) =>
                setFormData({ ...formData, account_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="fixed">Fixed Account</SelectItem>
              </SelectContent>
            </Select>
            {errors.account_type && (
              <p className="text-sm text-destructive">{errors.account_type}</p>
            )}
          </div>
          {user!.role !== 'customer' && (
            <FormInput
              label="Initial Deposit"
              type="number"
              value={formData.initial_deposit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  initial_deposit: Number(e.target.value),
                })
              }
              error={errors.initial_deposit}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          )}

          {errors.general && (
            <p className="text-sm text-destructive">{errors.general}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setErrors({});
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
