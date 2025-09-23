'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import { VirtualCard } from '@/types/card';
import { useAuthStore } from '@/stores/auth-store';
import { formatBalance, formatCardNumber } from '@/lib/utils';

interface CardDisplayProps {
  card: VirtualCard;
  onBlock?: (cardId: number) => void;
  onUnblock?: (cardId: number) => void;
  onReportLoss?: (cardId: number) => void;
  onRequestReplacement?: (cardId: number) => void;
}

export function CardDisplay({
  card,
  onBlock,
  onUnblock,
  onReportLoss,
  onRequestReplacement,
}: CardDisplayProps) {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const { user } = useAuthStore();

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'debit':
        return 'from-blue-500 to-blue-700';
      case 'credit':
        return 'from-purple-500 to-purple-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'blocked':
        return 'bg-warning text-warning-foreground';
      case 'expired':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canManageCard = user && user.role == 'account_executive';

  return (
    <div className="space-y-4">
      {/* Card Visual */}
      <div
        className={`relative w-full h-56 rounded-xl bg-gradient-to-br ${getCardTypeColor(
          card.card_type
        )} p-6 text-white shadow-lg`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">SecureBank</p>
            <p className="text-xs opacity-60 uppercase tracking-wider">
              {card.card_type} Card
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(card.status)}>{card.status}</Badge>
            <CreditCard className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xl font-mono tracking-wider">
              {formatCardNumber(card.card_number, showFullNumber)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullNumber(!showFullNumber)}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              {showFullNumber ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-60">VALID THRU</p>
              <p className="text-sm font-mono">
                {card.expiry_date?.split('T')[0]}
              </p>
            </div>
            {card.balance !== undefined && (
              <div className="text-right">
                <p className="text-xs opacity-60">BALANCE</p>
                <p className="text-lg font-semibold">
                  {formatBalance(card.balance)}
                </p>
              </div>
            )}
            {/* {card.creditLimit && (
              <div className="text-right">
                <p className="text-xs opacity-60">CREDIT LIMIT</p>
                <p className="text-lg font-semibold">
                  {formatBalance(card.creditLimit)}
                </p>
              </div>
            )} */}
          </div>
        </div>

        {card.status === 'blocked' && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-2 text-red-400" />
              <p className="text-lg font-semibold">Card Blocked</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Card Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your card settings and security
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {card.status === 'active' && canManageCard &&  onBlock && (
                    <DropdownMenuItem
                      onClick={() => onBlock(card.id)}
                      className="text-warning"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Block Card
                    </DropdownMenuItem>
                  )}
                  {card.status === 'blocked' && canManageCard && onUnblock && (
                    <DropdownMenuItem
                      onClick={() => onUnblock(card.id)}
                      className="text-success"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Unblock Card
                    </DropdownMenuItem>
                  )}
                  {onReportLoss && (
                    <DropdownMenuItem
                      onClick={() => onReportLoss(card.id)}
                      className="text-destructive"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Lost/Stolen
                    </DropdownMenuItem>
                  )}
                  {onRequestReplacement && (
                    <DropdownMenuItem
                      onClick={() => onRequestReplacement(card.id)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Request Replacement
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>View Statements</DropdownMenuItem>
                  <DropdownMenuItem>Change PIN</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
