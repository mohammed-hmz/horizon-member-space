import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/messages - Fetch messages with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      include: {
        reactions: true,
        readBy: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });

    const totalMessages = await prisma.message.count();
    const hasMore = skip + messages.length < totalMessages;

    return NextResponse.json({
      messages: messages.reverse(), // Reverse to show oldest first
      hasMore,
      total: totalMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/messages - Handle multiple actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Send a new message
    if (!action || action === "send") {
      const { userId, text, username, userImage, replyingTo } = body;

      const message = await prisma.message.create({
        data: {
          userId,
          text,
          username,
          userImage,
          pinned: false,
          replyingTo: replyingTo
            ? {
                messageId: replyingTo.messageId,
                username: replyingTo.username,
                text: replyingTo.text,
              }
            : undefined,
        },
        include: {
          reactions: true,
          readBy: true,
        },
      });

      return NextResponse.json(message, { status: 201 });
    }

    // Add reaction
    if (action === "add-reaction") {
      const { messageId, username, emoji } = body;

      await prisma.reaction.create({
        data: {
          messageId: messageId,
          username: username,
          emoji: emoji,
        },
      });

      const updatedMessage = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          reactions: true,
          readBy: true,
        },
      });

      return NextResponse.json(updatedMessage, { status: 200 });
    }

    // Remove reaction
    if (action === "remove-reaction") {
      const { messageId, username, emoji } = body;

      const reaction = await prisma.reaction.findFirst({
        where: {
          messageId: messageId,
          username: username,
          emoji: emoji,
        },
      });

      if (reaction) {
        await prisma.reaction.delete({
          where: { id: reaction.id },
        });
      }

      const updatedMessage = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          reactions: true,
          readBy: true,
        },
      });

      return NextResponse.json(updatedMessage, { status: 200 });
    }

    // Toggle pin
    if (action === "toggle-pin") {
      const { messageId, pinned, pinnedBy } = body;

      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: {
          pinned: pinned,
          pinnedBy: pinnedBy,
        },
        include: {
          reactions: true,
          readBy: true,
        },
      });

      return NextResponse.json(updatedMessage, { status: 200 });
    }

    // Mark as read
    if (action === "mark-read") {
      const { messageIds, userId, userImage } = body;

      for (const messageId of messageIds) {
        const existingRead = await prisma.messageRead.findFirst({
          where: {
            messageId: messageId,
            userId: userId,
          },
        });

        if (!existingRead) {
          await prisma.messageRead.create({
            data: {
              messageId: messageId,
              userId: userId,
              userImage: userImage,
            },
          });
        }
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages?messageId=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { error: "messageId is required" },
        { status: 400 }
      );
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}