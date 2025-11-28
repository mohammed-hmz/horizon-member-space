import { PageHeader } from "@/components/ui/page-header"
import { EventsTable } from "./events-table"

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Manage club events and gatherings" />
      <EventsTable />
    </div>
  )
}
