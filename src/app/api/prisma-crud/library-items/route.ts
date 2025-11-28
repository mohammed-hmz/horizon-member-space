
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  const items = await prisma.libraryItem.findMany();
  return NextResponse.json(items);
}

// POST create a new library item
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Creating library item with data:", body);
  // Ensure required fields exist. If createdById isn't supplied by the client,
  // fall back to a safe default (development/testing). In production this
  // should be derived from the authenticated session.
  console.log("body", body);
  const data = {
    title: body.title,
    description: body.description || null,
    type: body.type || undefined,
    url: body.url || null,
    metadata: body.metadata || undefined,
    isPublic: typeof body.isPublic === "boolean" ? body.isPublic : true,
    createdById: body.createdById || 1,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = await prisma.libraryItem.create({ data: data as any })
  return NextResponse.json(item);
}

// PATCH update a library item
export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  const updatedItem = await prisma.libraryItem.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedItem);
}

// DELETE a library item
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const deletedItem = await prisma.libraryItem.delete({
    where: { id },
  });
  return NextResponse.json(deletedItem);
}
