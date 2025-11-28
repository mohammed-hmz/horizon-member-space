"use client"

import { useEffect, useState } from "react"
import { DataTable } from "../shared/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Activity } from "@/types/index"
import { getActivities, deleteActivity } from "@/lib/api-helpers"
import { CreateActivityDialog } from "./create-activity-dialog"
import { DeleteDialog } from "../shared/delete-dialog"

export function ActivitiesTable() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await getActivities()
        setActivities(data)
      } catch (error) {
        console.error("Failed to load activities:", error)
      } finally {
        setLoading(false)
      }
    }
    loadActivities()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteActivity(deleteId)
      setActivities(activities.filter((a) => a.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete activity:", error)
    }
  }

  const handleCreateActivity = (newActivity: Activity) => {
    setActivities([...activities, newActivity])
    setCreateOpen(false)
  }

  if (loading) return <div className="text-center text-muted-foreground">Loading activities...</div>

  return (
    <>
      <DataTable<Activity>
        data={activities}
        columns={[
          {
            key: "title",
            label: "Title",
          },
          {
            key: "startAt",
            label: "Date",
            render: (date) => new Date(date).toLocaleDateString(),
          },
          {
            key: "isMemberOnly",
            label: "Type",
            render: (isMemberOnly) => (isMemberOnly ? "Members Only" : "Public"),
          },
          {
            key: "description",
            label: "Description",
            render: (desc) => (
              <p className="max-w-xs truncate text-sm text-muted-foreground">{desc || "No description"}</p>
            ),
          },
        ]}
        searchKey="title"
        actions={(activity) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(activity.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Create Activity</Button>
      </div>

      <CreateActivityDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateActivity} />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Activity"
        description="This action cannot be undone."
      />
    </>
  )
}
