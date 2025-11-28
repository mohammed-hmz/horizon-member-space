"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Form } from "@/lib/types"
import { createForm } from "@/lib/api-helpers"

interface CreateFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (form: Form) => void
}

export function CreateFormDialog({ open, onOpenChange, onSuccess }: CreateFormDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return

    setLoading(true)
    try {
      const newForm = await createForm({
        title,
        description,
        isActive,
        fields: JSON.stringify([
          { id: "email", label: "Email", type: "email", required: true },
          { id: "name", label: "Full Name", type: "text", required: true },
        ]),
      })
      onSuccess(newForm)
      setTitle("")
      setDescription("")
      setIsActive(true)
    } catch (error) {
      console.error("Failed to create form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Form Title</Label>
            <Input id="title" placeholder="Enter form title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter form description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-secondary/50 p-3 space-y-2">
            <p className="text-sm font-medium">Default Fields</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Email (required)</li>
              <li>✓ Full Name (required)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">You can customize fields after creation</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" checked={isActive} onCheckedChange={() => setIsActive(!isActive)} />
            <Label htmlFor="isActive">Make active immediately</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !title.trim()}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
