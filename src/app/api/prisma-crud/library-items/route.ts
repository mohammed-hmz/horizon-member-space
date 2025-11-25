
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  const items = await prisma.libraryItem.findMany();
  return NextResponse.json(items);
}

// POST create a new library item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.libraryItem.create({ data: body });
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
