"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Activity } from "@/lib/types"
import { createActivity } from "@/lib/api-helpers"

interface CreateActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (activity: Activity) => void
}

export function CreateActivityDialog({ open, onOpenChange, onSuccess }: CreateActivityDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [isMemberOnly, setIsMemberOnly] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !startAt) return

    setLoading(true)
    try {
      const newActivity = await createActivity({
        title,
        description,
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        isMemberOnly,
      })
      onSuccess(newActivity)
      setTitle("")
      setDescription("")
      setStartAt("")
      setEndAt("")
      setIsMemberOnly(true)
    } catch (error) {
      console.error("Failed to create activity:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Activity Title</Label>
            <Input
              id="title"
              placeholder="Enter activity title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter activity description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startAt">Start Date & Time</Label>
              <Input id="startAt" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="endAt">End Date & Time</Label>
              <Input id="endAt" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isMemberOnly" checked={isMemberOnly} onCheckedChange={() => setIsMemberOnly(!isMemberOnly)} />
            <Label htmlFor="isMemberOnly">Members only</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !title.trim() || !startAt}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
