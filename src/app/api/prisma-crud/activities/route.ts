import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { projectMembers: true, notifications: true, tasks: true },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const project = await prisma.project.create({ data: body });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const project = await prisma.project.delete({ where: { id } });
  return NextResponse.json(project);
}

