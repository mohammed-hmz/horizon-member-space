//lib/api-helpers.ts
// API Helper Functions for all models

// ============ USERS ============
export async function getUsers() {
  const res = await fetch("/api/users")
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

export async function getUserById(id: number) {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

export async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete user")
  return res.json()
}

// ============ PROJECTS ============
export async function getProjects() {
  const res = await fetch("/api/projects")
  if (!res.ok) throw new Error("Failed to fetch projects")
  return res.json()
}

export async function getProjectById(id: number) {
  const res = await fetch(`/api/projects/${id}`)
  if (!res.ok) throw new Error("Failed to fetch project")
  return res.json()
}

export async function createProject(data: any) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create project")
  return res.json()
}

export async function updateProject(id: number, data: any) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update project")
  return res.json()
}

export async function deleteProject(id: number) {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete project")
  return res.json()
}

// ============ EVENTS ============
export async function getEvents() {
  const res = await fetch("/api/events")
  if (!res.ok) throw new Error("Failed to fetch events")
  return res.json()
}

export async function getEventById(id: number) {
  const res = await fetch(`/api/events/${id}`)
  if (!res.ok) throw new Error("Failed to fetch event")
  return res.json()
}

export async function createEvent(data: any) {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create event")
  return res.json()
}

export async function updateEvent(id: number, data: any) {
  const res = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update event")
  return res.json()
}

export async function deleteEvent(id: number) {
  const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete event")
  return res.json()
}

// ============ ACTIVITIES ============
export async function getActivities() {
  const res = await fetch("/api/activities")
  if (!res.ok) throw new Error("Failed to fetch activities")
  return res.json()
}

export async function getActivityById(id: number) {
  const res = await fetch(`/api/activities/${id}`)
  if (!res.ok) throw new Error("Failed to fetch activity")
  return res.json()
}

export async function createActivity(data: any) {
  const res = await fetch("/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create activity")
  return res.json()
}

export async function updateActivity(id: number, data: any) {
  const res = await fetch(`/api/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update activity")
  return res.json()
}

export async function deleteActivity(id: number) {
  const res = await fetch(`/api/activities/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete activity")
  return res.json()
}

// ============ MEETINGS ============
export async function getMeetings() {
  const res = await fetch("/api/meetings")
  if (!res.ok) throw new Error("Failed to fetch meetings")
  return res.json()
}

export async function getMeetingById(id: number) {
  const res = await fetch(`/api/meetings/${id}`)
  if (!res.ok) throw new Error("Failed to fetch meeting")
  return res.json()
}

export async function createMeeting(data: any) {
  const res = await fetch("/api/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create meeting")
  return res.json()
}

export async function updateMeeting(id: number, data: any) {
  const res = await fetch(`/api/meetings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update meeting")
  return res.json()
}

export async function deleteMeeting(id: number) {
  const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete meeting")
  return res.json()
}

// ============ LIBRARY ============
const LIBRARY_BASE = "/api/prisma-crud/library-items"

export async function getLibraryItems() {
  const res = await fetch(LIBRARY_BASE)
  if (!res.ok) throw new Error("Failed to fetch library items")
  return res.json()
}

export async function getLibraryItemById(id: number) {
  // The backend provides a collection GET; request the list and find the item.
  const items = await getLibraryItems()
  return items.find((it: any) => it.id === id)
}

export async function createLibraryItem(data: any) {
  const res = await fetch(LIBRARY_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create library item")
  return res.json()
}

export async function updateLibraryItem(id: number, data: any) {
  // The API expects a PATCH with the id in the body
  const res = await fetch(LIBRARY_BASE, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  })
  if (!res.ok) throw new Error("Failed to update library item")
  return res.json()
}

export async function deleteLibraryItem(id: number) {
  const res = await fetch(LIBRARY_BASE, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error("Failed to delete library item")
  return res.json()
}

// ============ FORMS ============
export async function getForms() {
  const res = await fetch("/api/forms")
  if (!res.ok) throw new Error("Failed to fetch forms")
  return res.json()
}

export async function getFormById(id: number) {
  const res = await fetch(`/api/forms/${id}`)
  if (!res.ok) throw new Error("Failed to fetch form")
  return res.json()
}

export async function createForm(data: any) {
  const res = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create form")
  return res.json()
}

export async function updateForm(id: number, data: any) {
  const res = await fetch(`/api/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update form")
  return res.json()
}

export async function deleteForm(id: number) {
  const res = await fetch(`/api/forms/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete form")
  return res.json()
}

export async function getAttendees(formId: number) {
  const res = await fetch(`/api/forms/${formId}/attendees`)
  if (!res.ok) throw new Error("Failed to fetch attendees")
  return res.json()
}

// ============ CALENDAR ============
export async function getCalendarEntries() {
  const res = await fetch("/api/calendar")
  if (!res.ok) throw new Error("Failed to fetch calendar entries")
  return res.json()
}

export async function createCalendarEntry(data: any) {
  const res = await fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create calendar entry")
  return res.json()
}

export async function updateCalendarEntry(id: number, data: any) {
  const res = await fetch(`/api/calendar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update calendar entry")
  return res.json()
}

export async function deleteCalendarEntry(id: number) {
  const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete calendar entry")
  return res.json()
}
