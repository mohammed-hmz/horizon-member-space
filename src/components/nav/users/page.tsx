import { PageHeader } from "@/components/ui/page-header"
import { UsersTable } from "./users-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Members" description="Manage and view all club members" />
      <UsersTable />
    </div>
  )
}
