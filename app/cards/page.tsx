'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CardDisplay } from '@/components/cards/card-display';
import { CardTopupDialog } from '@/components/cards/card-topup-dialog';
import { RequestCardDialog } from '@/components/cards/request-card-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useAccountStore } from '@/stores/account-store';
import { useCardStore } from '@/stores/card-store';

export default function CardsPage() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { user } = useAuthStore();
  const { getAccounts, account_list } = useAccountStore();
  const { getCards, card_list, isLoading } = useCardStore();

  useEffect(() => {
    if (account_list.length == 0) {
      getAccounts();
    }
    if (card_list.length == 0) {
      getCards();
    }
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBlockCard = async (cardId: number) => {
    // try {
    //   setCards(cards.map((card) => (card.id === cardId ? { ...card, status: "blocked" as const } : card)))
    //   showNotification("success", "Card has been blocked successfully")
    // } catch (error) {
    //   showNotification("error", "Failed to block card")
    // }
  };

  const handleUnblockCard = async (cardId: number) => {
    // try {
    //   setCards(cards.map((card) => (card.id === cardId ? { ...card, status: "active" as const } : card)))
    //   showNotification("success", "Card has been unblocked successfully")
    // } catch (error) {
    //   showNotification("error", "Failed to unblock card")
    // }
  };

  const handleReportLoss = async (cardId: number) => {
    // try {
    //   setCards(cards.map((card) => (card.id === cardId ? { ...card, status: "blocked" as const } : card)))
    //   showNotification("success", "Card has been reported as lost/stolen and blocked")
    // } catch (error) {
    //   showNotification("error", "Failed to report card loss")
    // }
  };

  const handleRequestReplacement = async (cardId: number) => {
    try {
      showNotification(
        'success',
        'Replacement card request submitted successfully'
      );
    } catch (error) {
      showNotification('error', 'Failed to submit replacement request');
    }
  };

  const handleTopup = async (
    cardId: number,
    amount: number,
    fromAccountId: string
  ) => {
    try {
      // Update card balance
      // setCards(
      //   cards.map((card) =>
      //     card.id === cardId && card.balance !== undefined ? { ...card, balance: card.balance + amount } : card,
      //   ),
      // )
      // Update account balance
      // setAccounts(
      //   accounts.map((account) =>
      //     account.id === fromAccountId ? { ...account, balance: account.balance - amount } : account,
      //   ),
      // )
      showNotification(
        'success',
        `Card topped up with $${amount.toFixed(2)} successfully`
      );
    } catch (error) {
      showNotification('error', 'Failed to top up card');
    }
  };

  const handleRequestCard = async (cardData: any) => {
    try {
      showNotification(
        'success',
        'New card request submitted successfully. You will receive it within 7-10 business days.'
      );
    } catch (error) {
      showNotification('error', 'Failed to submit card request');
    }
  };

  const canManageCards = user && (user.role == 'teller' || user.role == "account_executive" || user.role=="branch_manager");

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Cards</h1>
            <p className="text-muted-foreground">
              Manage your debit and credit cards
            </p>
          </div>
          {canManageCards && (
            <RequestCardDialog
              accounts={account_list}
              onRequestCard={handleRequestCard}
            />
          )}
        </div>
        {notification && (
          <Alert
            className={
              notification.type === 'success'
                ? 'border-success bg-success/10'
                : 'border-destructive'
            }
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            <AlertDescription
              className={
                notification.type === 'success'
                  ? 'text-success'
                  : 'text-destructive'
              }
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        )}
        {card_list.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You don't have any cards yet.
            </p>
            {canManageCards && (
              <RequestCardDialog
                accounts={account_list}
                onRequestCard={handleRequestCard}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {card_list.map((card) => (
              <div key={card.id} className="space-y-4">
                <CardDisplay
                  card={card}
                  onBlock={handleBlockCard}
                  onUnblock={handleUnblockCard}
                  onReportLoss={handleReportLoss}
                  onRequestReplacement={handleRequestReplacement}
                />
                {card.balance !== undefined && (
                  <CardTopupDialog
                    card={card}
                    accounts={account_list}
                    onTopup={handleTopup}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        ˝
        {card_list.length > 0 && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">
              Card Security Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Never share your PIN or card details with anyone</li>
              <li>• Report lost or stolen cards immediately</li>
              <li>• Monitor your transactions regularly</li>
              <li>• Use secure networks when making online purchases</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
