"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Event } from "@/lib/types"
import { getEvents, deleteEvent } from "@/lib/api-helpers"
import { CreateEventDialog } from "./create-event-dialog"
import { DeleteDialog } from "@/components/shared/delete-dialog"

export function EventsTable() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteEvent(deleteId)
      setEvents(events.filter((e) => e.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([...events, newEvent])
    setCreateOpen(false)
  }

  if (loading) return <div className="text-center text-muted-foreground">Loading events...</div>

  return (
    <>
      <DataTable<Event>
        data={events}
        columns={[
          {
            key: "title",
            label: "Title",
          },
          {
            key: "location",
            label: "Location",
            render: (loc) => loc || "-",
          },
          {
            key: "startAt",
            label: "Start Date",
            render: (date) => new Date(date).toLocaleDateString(),
          },
          {
            key: "isPublic",
            label: "Type",
            render: (isPublic) => (isPublic ? "Public" : "Private"),
          },
        ]}
        searchKey="title"
        actions={(event) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(event.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Create Event</Button>
      </div>

      <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateEvent} />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        description="This action cannot be undone."
      />
    </>
  )
}
