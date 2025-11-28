"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarEntry, CalendarItemType } from "@/lib/types"
import { createCalendarEntry } from "@/lib/api-helpers"

interface CreateCalendarEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (entry: CalendarEntry) => void
  initialDate?: Date
}

export function CreateCalendarEntryDialog({
  open,
  onOpenChange,
  onSuccess,
  initialDate,
}: CreateCalendarEntryDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState<CalendarItemType>("EVENT")
  const [startAt, setStartAt] = useState(initialDate ? initialDate.toISOString().split("T")[0] : "")
  const [endAt, setEndAt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !startAt) return

    setLoading(true)
    try {
      const newEntry = await createCalendarEntry({
        title,
        description,
        location,
        type,
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
      })
      onSuccess(newEntry)
      setTitle("")
      setDescription("")
      setLocation("")
      setType("EVENT")
      setStartAt("")
      setEndAt("")
    } catch (error) {
      console.error("Failed to create calendar entry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Calendar Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter item title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(val) => setType(val as CalendarItemType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="ACTIVITY">Activity</SelectItem>
                <SelectItem value="MEETING">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startAt">Start Date</Label>
              <Input id="startAt" type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="endAt">End Date</Label>
              <Input id="endAt" type="date" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !title.trim() || !startAt}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
