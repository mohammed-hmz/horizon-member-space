import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-200",
  COMPLETED: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  ARCHIVED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 hover:bg-green-200",
  DECLINED: "bg-red-100 text-red-800 hover:bg-red-200",
  TENTATIVE: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  MEMBER: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  OFFICER: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  ADMIN: "bg-red-100 text-red-800 hover:bg-red-200",
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const color = statusColors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200"
  return <Badge className={cn(color, "font-medium")}>{status}</Badge>
}
