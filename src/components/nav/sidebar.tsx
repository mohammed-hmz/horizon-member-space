"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, FolderOpen, Calendar, Zap, Users2, BookOpen, Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Members", href: "/members", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Activities", href: "/activities", icon: Zap },
  { name: "Meetings", href: "/meetings", icon: Users2 },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Calendar", href: "/calendar", icon: Clock },
  { name: "Forms", href: "/forms", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <div className="sticky top-0 h-screen overflow-y-auto py-6 px-4 space-y-6">
        <div className="px-2">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Club Hub</h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground/60 px-2 pb-3">INFORMATION</p>
          <div className="space-y-1 text-xs text-sidebar-foreground/70">
            <p className="px-3">Version 1.0</p>
            <p className="px-3">University Club Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
