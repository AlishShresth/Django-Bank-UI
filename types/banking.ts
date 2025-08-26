export interface Account {
  id: string
  accountNumber: string
  accountType: "checking" | "savings" | "business" | "credit"
  balance: number
  currency: string
  status: "active" | "frozen" | "closed"
  createdAt: string
  userId: string
}

export interface Transaction {
  id: string
  accountId: string
  type: "deposit" | "withdrawal" | "transfer" | "payment"
  amount: number
  currency: string
  description: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  reference?: string
  beneficiaryAccount?: string
}

export interface Card {
  id: string
  accountId: string
  cardNumber: string
  cardType: "debit" | "credit"
  status: "active" | "blocked" | "expired"
  expiryDate: string
  balance?: number
  creditLimit?: number
}

export interface Transfer {
  fromAccountId: string
  toAccountId: string
  amount: number
  description: string
  reference?: string
}
