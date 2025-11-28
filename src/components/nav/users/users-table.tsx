"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { UserAvatar } from "@/components/ui/user-avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/types"
import { getUsers, deleteUser } from "@/lib/api-helpers"
import { UserDetailDialog } from "./user-detail-dialog"
import { DeleteDialog } from "@/components/shared/delete-dialog"

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleDelete = async () => {
    if (!deleteUserId) return
    try {
      await deleteUser(deleteUserId)
      setUsers(users.filter((u) => u.id !== deleteUserId))
      setDeleteUserId(null)
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  if (loading) return <div className="text-center text-muted-foreground">Loading users...</div>

  return (
    <>
      <DataTable<User>
        data={users}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (_, user) => (
              <div className="flex items-center gap-2">
                <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
                <span>{user.name}</span>
              </div>
            ),
          },
          {
            key: "email",
            label: "Email",
          },
          {
            key: "role",
            label: "Role",
            render: (role) => <StatusBadge status={role} />,
          },
          {
            key: "isActive",
            label: "Status",
            render: (isActive) => <StatusBadge status={isActive ? "ACTIVE" : "ARCHIVED"} />,
          },
        ]}
        searchKey="email"
        actions={(user) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedUser(user)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteUserId(user.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {selectedUser && (
        <UserDetailDialog user={selectedUser} open={!!selectedUser} onOpenChange={() => setSelectedUser(null)} />
      )}

      <DeleteDialog
        open={deleteUserId !== null}
        onOpenChange={() => setDeleteUserId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure? This action cannot be undone."
      />
    </>
  )
}
