import { PageHeader } from "@/components/ui/page-header"
import { FormsTable } from "./forms-table"

export default function FormsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Forms" description="Create and manage registration forms" />
      <FormsTable />
    </div>
  )
}
