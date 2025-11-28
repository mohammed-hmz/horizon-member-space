"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from "@/lib/types"
import { UserAvatar } from "@/components/ui/user-avatar"
import { StatusBadge } from "@/components/ui/status-badge"

interface UserDetailDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Role</p>
              <StatusBadge status={user.role} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <StatusBadge status={user.isActive ? "ACTIVE" : "ARCHIVED"} />
            </div>
          </div>

          {user.isView && (
            <div className="space-y-2 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Additional Info</p>
              {user.number && (
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {user.number}
                </p>
              )}
              {user.avatar && (
                <p className="text-sm">
                  <span className="font-medium">Avatar:</span> Configured
                </p>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
