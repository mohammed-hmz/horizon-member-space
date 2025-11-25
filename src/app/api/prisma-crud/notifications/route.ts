import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    include: { user: true, project: true },
  });
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notification = await prisma.notification.create({ data: body });
  return NextResponse.json(notification);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const notification = await prisma.notification.delete({ where: { id } });
  return NextResponse.json(notification);
}
