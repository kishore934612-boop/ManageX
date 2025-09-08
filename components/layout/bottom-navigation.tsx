"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Tasks",
    href: "/dashboard",
    icon: Icons.tasks,
  },
  {
    name: "Notes",
    href: "/notes",
    icon: Icons.notes,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Icons.dashboard,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
