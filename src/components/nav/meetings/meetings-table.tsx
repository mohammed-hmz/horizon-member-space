"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Meeting } from "@/lib/types"
import { getMeetings, deleteMeeting } from "@/lib/api-helpers"
import { CreateMeetingDialog } from "./create-meeting-dialog"
import { DeleteDialog } from "@/components/shared/delete-dialog"

export function MeetingsTable() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const data = await getMeetings()
        setMeetings(data)
      } catch (error) {
        console.error("Failed to load meetings:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMeetings()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMeeting(deleteId)
      setMeetings(meetings.filter((m) => m.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete meeting:", error)
    }
  }

  const handleCreateMeeting = (newMeeting: Meeting) => {
    setMeetings([...meetings, newMeeting])
    setCreateOpen(false)
  }

  if (loading) return <div className="text-center text-muted-foreground">Loading meetings...</div>

  return (
    <>
      <DataTable<Meeting>
        data={meetings}
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
            label: "Date",
            render: (date) => new Date(date).toLocaleDateString(),
          },
          {
            key: "agenda",
            label: "Agenda",
            render: (agenda) => (
              <p className="max-w-xs truncate text-sm text-muted-foreground">{agenda || "No agenda"}</p>
            ),
          },
        ]}
        searchKey="title"
        actions={(meeting) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(meeting.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Create Meeting</Button>
      </div>

      <CreateMeetingDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateMeeting} />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Meeting"
        description="This action cannot be undone."
      />
    </>
  )
}
