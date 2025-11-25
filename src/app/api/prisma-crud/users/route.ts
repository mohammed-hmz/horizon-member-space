import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await prisma.user.create({
    data: body,
  });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const user = await prisma.user.delete({
    where: { id },
  });
  return NextResponse.json(user);
}
