"use client"

import { useEffect, useState } from "react"
import { DataTable } from "../shared/data-table"
import { StatusBadge } from "../ui/status-badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project } from "@/types/index"
import { getProjects, deleteProject } from "@/lib/api-helpers"
import { CreateProjectDialog } from "./create-project-dialog"
import { DeleteDialog } from "../shared/delete-dialog"

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProject(deleteId)
      setProjects(projects.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  const handleCreateProject = (newProject: Project) => {
    setProjects([...projects, newProject])
    setCreateOpen(false)
  }

  if (loading) return <div className="text-center text-muted-foreground">Loading projects...</div>

  return (
    <>
      <DataTable<Project>
        data={projects}
        columns={[
          {
            key: "title",
            label: "Title",
          },
          {
            key: "status",
            label: "Status",
            render: (status) => <StatusBadge status={status} />,
          },
          {
            key: "createdAt",
            label: "Created",
            render: (date) => new Date(date).toLocaleDateString(),
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
        actions={(project) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(project.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Create Project</Button>
      </div>

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateProject} />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="This action cannot be undone."
      />
    </>
  )
}
