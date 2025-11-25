import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { project: true, assignedTo: true },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const task = await prisma.task.create({ data: body });
  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const task = await prisma.task.delete({ where: { id } });
  return NextResponse.json(task);
}
