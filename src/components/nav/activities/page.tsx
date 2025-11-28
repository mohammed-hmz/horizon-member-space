import { PageHeader } from "@/components/ui/page-header"
import { ActivitiesTable } from "./activities-table"

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activities" description="Manage club activities and programs" />
      <ActivitiesTable />
    </div>
  )
}
