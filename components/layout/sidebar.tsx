"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import {
  Home,
  CreditCard,
  ArrowLeftRight,
  History,
  Users,
  Settings,
  LogOut,
  Shield,
  PieChart,
  UserCheck,
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    role: ["customer", "branch_manager", "account_executive", "teller"] as const,
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: CreditCard,
    role: ["customer", "branch_manager", "account_executive", "teller"] as const,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: History,
    role: ["customer", "branch_manager", "account_executive", "teller"] as const,
  },
  {
    name: "Transfers",
    href: "/transfers",
    icon: ArrowLeftRight,
    role: ["customer", "branch_manager", "account_executive", "teller"] as const,
  },
  {
    name: "Cards",
    href: "/cards",
    icon: CreditCard,
    role: ["customer", "branch_manager", "account_executive", "teller"] as const,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    role: ["branch_manager", "account_executive", "teller"] as const,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: PieChart,
    role: ["branch_manager"] as const,
  },
  {
    name: "Staff",
    href: "/staff",
    icon: UserCheck,
    role: ["branch_manager", "account_executive"] as const,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  if (!user) return null

  const filteredNavigation = navigationItems.filter((item) => item.role.includes(user.role))

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center gap-2 p-6 border-b border-border">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-foreground">SecureBank</h1>
          <p className="text-sm text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.first_name[0]}
              {user.last_name[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
