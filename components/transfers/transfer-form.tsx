'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import { ArrowRight, Clock, Mail, Shield } from 'lucide-react';
import type { BankAccount } from '@/types/banking';
import type { Transfer } from '@/types/transaction';
import { formatBalance } from '@/lib/utils';
import { toast } from 'sonner';
import { security_questions } from '@/lib/security_questions';
import { useProfileStore } from '@/stores/profile-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { parseExpiryTime } from '@/lib/utils';

interface TransferFormProps {
  accounts: BankAccount[];
  onTransfer: (transfer: Transfer) => Promise<any>;
  onVerifySecurityQuestion: (security_answer: string) => Promise<any>;
  onVerifyOTP: (otp: string) => Promise<any>;
}

export function TransferForm({
  accounts,
  onTransfer,
  onVerifySecurityQuestion,
  onVerifyOTP,
}: TransferFormProps) {
  const [formData, setFormData] = useState({
    sender_account: '',
    receiver_account: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [otp, setOtp] = useState('');
  const expiryTime = 3 * 60;
  const [timeLeft, setTimeLeft] = useState(expiryTime); // 3 minute countdown
  const [canResend, setCanResend] = useState(false);

  const { profile } = useProfileStore();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Verify otp
  useEffect(() => {
    if (otp.length == 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sender_account) {
      newErrors.sender_account = 'Please select a source account';
    }

    if (!formData.receiver_account) {
      newErrors.receiver_account = 'Please select a destination account';
    }

    if (formData.sender_account === formData.receiver_account) {
      newErrors.receiver_account =
        'Source and destination accounts must be different';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else {
      const sourceAccount = accounts.find(
        (acc) => acc.id === formData.sender_account
      );
      if (
        sourceAccount &&
        Number(formData.amount) > parseFloat(sourceAccount.account_balance)
      ) {
        newErrors.amount = 'Insufficient funds';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!showConfirmation) {
      setIsLoading(true);
      try {
        const response = await onTransfer({
          sender_account: formData.sender_account,
          receiver_account: formData.receiver_account,
          amount: Number(formData.amount),
          description: formData.description,
        });
        if (response?.data?.status_code == 200) {
          setShowConfirmation(true);
        } else {
          toast.error('Error initiating transfer. Please try again.');
        }
      } catch (error: any) {
        toast.error('Error initiating transfer. Please try again.');
        setErrors({
          general:
            error.toString() ||
            'Error initiating transfer. Please verify account numbers.',
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  const sourceAccount = accounts.find(
    (acc) => acc.account_number === formData.sender_account
  );
  // const destinationAccount = accounts.find(
  //   (acc) => acc.id === formData.receiver_account
  // );

  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onVerifySecurityQuestion(securityAnswer);

      const expiryMinutes = parseExpiryTime(
        response.data?.verification_answer?.expiry_time
      );
      setTimeLeft(expiryMinutes * 60);
      setShowOTPModal(true);
      setErrors({});
    } catch (error: any) {
      setErrors({
        general: error.toString() || 'Transfer failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await onVerifyOTP(otp);
      // Reset form
      setFormData({
        sender_account: '',
        receiver_account: '',
        amount: '',
        description: '',
      });
      setShowOTPModal(false);
      setShowConfirmation(false);
      toast.success('Transfer successful');
    } catch (error: any) {
      toast.error('Error verifying otp');
      setErrors({ otp: error.toString() || 'Error verifying otp' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {};

  if (showConfirmation) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confirm Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                Please review the transfer details and answer your security
                question before confirming.
              </AlertDescription>
            </Alert>
            <form onSubmit={handleConfirmTransfer}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">From</p>
                    <p className="text-sm text-muted-foreground">
                      {sourceAccount?.account_type} ****
                      {sourceAccount?.account_number.slice(-4)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">To</p>
                    <p className="text-sm text-muted-foreground">
                      {/* {destinationAccount?.account_type} **** */}
                      {/* {destinationAccount?.account_number.slice(-4)} */}
                      {formData.receiver_account}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Amount
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatBalance(
                        formData.amount,
                        sourceAccount?.currency || 'USD'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="font-medium">{formData.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col my-2 space-y-1">
                <label
                  htmlFor="security_answer"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  {security_questions[profile!.security_question]}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <FormInput
                  id="security_answer"
                  value={securityAnswer}
                  onChange={(e) => {
                    setSecurityAnswer(e.target.value);
                  }}
                  autoFocus={true}
                  required={true}
                />
              </div>

              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button disabled={isLoading} className="flex-1" type="submit">
                  {isLoading ? 'Processing...' : 'Verify & Continue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showOTPModal && (
          <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Verify Your Identity</DialogTitle>
                <DialogDescription>
                  We've sent a 6-digit verification code to your email address
                </DialogDescription>
              </DialogHeader>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">{profile!.email}</span>
                </div>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="justify-center h-12 w-10"
                      />
                      <InputOTPSlot
                        index={1}
                        className="justify-center h-12 w-10"
                      />
                      <InputOTPSlot
                        index={2}
                        className="justify-center h-12 w-10"
                      />
                      <InputOTPSlot
                        index={3}
                        className="justify-center h-12 w-10"
                      />
                      <InputOTPSlot
                        index={4}
                        className="justify-center h-12 w-10"
                      />
                      <InputOTPSlot
                        index={5}
                        className="justify-center h-12 w-10"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {errors && errors.otp && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.otp}</AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Code expires in {formatTime(timeLeft)}</span>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={!canResend || isLoading}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {canResend
                    ? 'Resend OTP'
                    : `Resend in ${formatTime(timeLeft)}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                From Account
              </label>
              <Select
                value={formData.sender_account}
                onValueChange={(value) =>
                  setFormData({ ...formData, sender_account: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.account_number}>
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
              {errors.sender_account && (
                <p className="text-sm text-destructive">
                  {errors.sender_account}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="to_account"
              >
                To Account
              </label>
              <FormInput
                id="to_account"
                value={formData.receiver_account}
                onChange={(e) =>
                  setFormData({ ...formData, receiver_account: e.target.value })
                }
                required={true}
                placeholder="Account Number"
              />
              {errors.receiver_account && (
                <p className="text-sm text-destructive">
                  {errors.receiver_account}
                </p>
              )}
            </div>
          </div>

          <FormInput
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
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
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={errors.description}
            placeholder="What is this transfer for?"
            required
          />

          {sourceAccount && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Available balance:{' '}
                {formatBalance(
                  sourceAccount.account_balance,
                  sourceAccount.currency
                )}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Review Transfer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
