"use client"
import { useAuthStore } from "@/stores/auth-store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard"
import { BusinessDashboard } from "@/components/dashboard/business-dashboard"
import { StaffDashboard } from "@/components/dashboard/staff-dashboard"

export default function DashboardPage() {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "customer":
        return <CustomerDashboard />
      case "business_client":
        return <BusinessDashboard />
      case "account_executive":
      case "teller":
      case "branch_manager":
        return <StaffDashboard />
      default:
        return <CustomerDashboard />
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}
