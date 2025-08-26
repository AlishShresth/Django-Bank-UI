import type { UserRole } from "@/types/auth"

export type Permission =
  | "view_dashboard"
  | "view_accounts"
  | "view_transactions"
  | "create_transaction"
  | "transfer_funds"
  | "manage_cards"
  | "view_all_customers"
  | "manage_customer_accounts"
  | "process_deposits"
  | "process_withdrawals"
  | "view_branch_reports"
  | "manage_staff"

const rolePermissions: Record<UserRole, Permission[]> = {
  customer: ["view_dashboard", "view_accounts", "view_transactions", "transfer_funds", "manage_cards"],
  business_client: [
    "view_dashboard",
    "view_accounts",
    "view_transactions",
    "create_transaction",
    "transfer_funds",
    "manage_cards",
  ],
  account_executive: [
    "view_dashboard",
    "view_accounts",
    "view_transactions",
    "view_all_customers",
    "manage_customer_accounts",
  ],
  teller: [
    "view_dashboard",
    "view_accounts",
    "view_transactions",
    "view_all_customers",
    "process_deposits",
    "process_withdrawals",
  ],
  branch_manager: [
    "view_dashboard",
    "view_accounts",
    "view_transactions",
    "create_transaction",
    "transfer_funds",
    "manage_cards",
    "view_all_customers",
    "manage_customer_accounts",
    "process_deposits",
    "process_withdrawals",
    "view_branch_reports",
    "manage_staff",
  ],
}

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return rolePermissions[userRole]?.includes(permission) || false
}

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

export const getUserPermissions = (userRole: UserRole): Permission[] => {
  return rolePermissions[userRole] || []
}
