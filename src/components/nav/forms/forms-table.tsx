"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Form } from "@/lib/types"
import { getForms, deleteForm } from "@/lib/api-helpers"
import { CreateFormDialog } from "./create-form-dialog"
import { DeleteDialog } from "@/components/shared/delete-dialog"

export function FormsTable() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const loadForms = async () => {
      try {
        const data = await getForms()
        setForms(data)
      } catch (error) {
        console.error("Failed to load forms:", error)
      } finally {
        setLoading(false)
      }
    }
    loadForms()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteForm(deleteId)
      setForms(forms.filter((f) => f.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete form:", error)
    }
  }

  const handleCreateForm = (newForm: Form) => {
    setForms([...forms, newForm])
    setCreateOpen(false)
  }

  const getShareLink = (formId: number) => {
    return `${window.location.origin}/forms/${formId}/public`
  }

  if (loading) return <div className="text-center text-muted-foreground">Loading forms...</div>

  return (
    <>
      <DataTable<Form>
        data={forms}
        columns={[
          {
            key: "title",
            label: "Title",
          },
          {
            key: "isActive",
            label: "Status",
            render: (isActive) => (isActive ? "Active" : "Inactive"),
          },
          {
            key: "createdAt",
            label: "Created",
            render: (date) => new Date(date).toLocaleDateString(),
          },
          {
            key: "description",
            label: "Description",
            render: (desc) => <p className="max-w-xs truncate text-sm text-muted-foreground">{desc || "-"}</p>,
          },
        ]}
        searchKey="title"
        actions={(form) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(getShareLink(form.id))
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>View Attendees</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(form.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Create Form</Button>
      </div>

      <CreateFormDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateForm} />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Form"
        description="This action cannot be undone."
      />
    </>
  )
}
