"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CalendarEntry } from "@/lib/types"
import { getCalendarEntries, deleteCalendarEntry } from "@/lib/api-helpers"
import { CreateCalendarEntryDialog } from "./create-calendar-entry-dialog"
import { DeleteDialog } from "@/components/shared/delete-dialog"
import { format } from "date-fns"

export function CalendarView() {
  const [entries, setEntries] = useState<CalendarEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await getCalendarEntries()
        setEntries(data)
      } catch (error) {
        console.error("Failed to load calendar entries:", error)
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCalendarEntry(deleteId)
      setEntries(entries.filter((e) => e.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }

  const handleCreateEntry = (newEntry: CalendarEntry) => {
    setEntries([...entries, newEntry])
    setCreateOpen(false)
  }

  const selectedDateEntries = selectedDate
    ? entries.filter((entry) => new Date(entry.startAt).toDateString() === selectedDate.toDateString())
    : []

  if (loading) return <div className="text-center text-muted-foreground">Loading calendar...</div>

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View and manage events, activities, and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{selectedDate && format(selectedDate, "MMM dd, yyyy")}</CardTitle>
            <CardDescription>
              {selectedDateEntries.length} item{selectedDateEntries.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDateEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items scheduled</p>
            ) : (
              selectedDateEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">{entry.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(entry.id)}
                      className="text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                  {entry.location && <p className="text-xs text-muted-foreground">📍 {entry.location}</p>}
                </div>
              ))
            )}
            <Button onClick={() => setCreateOpen(true)} className="w-full mt-4">
              Add Event
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateCalendarEntryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateEntry}
        initialDate={selectedDate}
      />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Calendar Entry"
        description="This action cannot be undone."
      />
    </>
  )
}
