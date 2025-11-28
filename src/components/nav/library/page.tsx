import { PageHeader } from "@/components/ui/page-header"
import { LibraryTable } from "./library-table"

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Library" description="Browse and manage club resources" />
      <LibraryTable />
    </div>
  )
}
