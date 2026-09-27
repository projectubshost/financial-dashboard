"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, TrendingUp, Receipt, FileText, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Profile } from "@/lib/types"

interface DashboardLayoutProps {
  children: React.ReactNode
  profile: Pick<Profile, "full_name" | "email" | "role"> | null
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/sales", label: "Sales", icon: TrendingUp },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reports", label: "Reports", icon: FileText },
]

export function DashboardLayout({ children, profile }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      setIsSigningOut(false)
      return
    }

    router.replace("/auth/login")
  }

  const renderNavigation = (mobile = false) => (
    <nav aria-label="Main navigation" className={mobile ? "flex gap-1 overflow-x-auto pb-1" : "flex flex-col gap-1 p-4"}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:gap-3 md:px-4 md:py-3 ${
              isActive ? "bg-emerald-50 text-emerald-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Icon aria-hidden="true" className="size-4 md:size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-emerald-900">FinanceFlow</h1>
            <p className="text-xs text-emerald-700">Financial Dashboard</p>
          </div>

          <div className="flex-1">{renderNavigation()}</div>

          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <p className="truncate text-sm font-medium text-gray-900">{profile?.full_name ?? "Account"}</p>
              <p className="truncate text-xs text-gray-600">{profile?.email}</p>
              {profile?.role && (
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  {profile.role}
                </span>
              )}
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start gap-2 border-gray-300 bg-transparent"
              disabled={isSigningOut}
            >
              <LogOut data-icon="inline-start" />
              {isSigningOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-emerald-900">FinanceFlow</p>
            <p className="truncate text-xs text-gray-600">{profile?.full_name ?? profile?.email ?? "Financial Dashboard"}</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            title="Sign out"
            disabled={isSigningOut}
          >
            <LogOut aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-3">{renderNavigation(true)}</div>
      </header>

      <main className="min-w-0 flex-1 p-4 sm:p-6 md:ml-64 md:p-8">{children}</main>
    </div>
  )
}
