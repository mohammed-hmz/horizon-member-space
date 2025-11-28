"use client"

import { useEffect, useState } from "react"
import { DataTable } from "../shared/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LibraryItem, LibraryType } from "@/types/index"
import { getLibraryItems, deleteLibraryItem } from "@/lib/api-helpers"
import { CreateLibraryItemDialog } from "./create-library-item-dialog"
import { DeleteDialog } from "../shared/delete-dialog"

export function LibraryTable() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<LibraryType | "ALL">("ALL")

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getLibraryItems()
        setItems(data)
      } catch (error) {
        console.error("Failed to load library items:", error)
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteLibraryItem(deleteId)
      setItems(items.filter((i) => i.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  const handleCreateItem = (newItem: LibraryItem) => {
    setItems([...items, newItem])
    setCreateOpen(false)
  }

  const filteredItems = filterType === "ALL" ? items : items.filter((item) => item.type === filterType)

  if (loading) return <div className="text-center text-muted-foreground">Loading library items...</div>

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="BOOK">Books</SelectItem>
            <SelectItem value="JOURNAL">Journals</SelectItem>
            <SelectItem value="VIDEO">Videos</SelectItem>
            <SelectItem value="AUDIO">Audio</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setCreateOpen(true)}>Add Item</Button>
      </div>

      <DataTable<LibraryItem>
        data={filteredItems}
        columns={[
          {
            key: "title",
            label: "Title",
          },
          {
            key: "type",
            label: "Type",
          },
          {
            key: "description",
            label: "Description",
            render: (desc) => <p className="max-w-xs truncate text-sm text-muted-foreground">{desc || "-"}</p>,
          },
          {
            key: "isPublic",
            label: "Access",
            render: (isPublic) => (isPublic ? "Public" : "Private"),
          },
        ]}
        searchKey="title"
        actions={(item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {item.url && (
                <DropdownMenuItem asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <CreateLibraryItemDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateItem} />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        description="This action cannot be undone."
      />
    </>
  )
}
