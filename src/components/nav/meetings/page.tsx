import { PageHeader } from "@/components/ui/page-header"
import { MeetingsTable } from "./meetings-table"

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Meetings" description="Schedule and manage club meetings" />
      <MeetingsTable />
    </div>
  )
}
