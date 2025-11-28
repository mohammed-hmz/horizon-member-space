import { PageHeader } from "@/components/ui/page-header"
import { CalendarView } from "./calendar-view"

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Manage your schedule with events, activities, and meetings" />
      <CalendarView />
    </div>
  )
}
