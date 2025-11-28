import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // --------------------------------------------------
  // 1) Create Users
  // --------------------------------------------------
  const admin = await prisma.user.create({
    data: {
      uid: "firebase_uid_admin_123",
      email: "admin@club.com",
      name: "Club Admin",
      role: "ADMIN",
      number: "0123456789"
    },
  })

  const officer = await prisma.user.create({
    data: {
      uid: "firebase_uid_officer_123",
      email: "officer@club.com",
      name: "Club Officer",
      role: "OFFICER"
    },
  })

  const member = await prisma.user.create({
    data: {
      uid: "firebase_uid_member_123",
      email: "member@club.com",
      name: "Club Member",
      role: "MEMBER"
    },
  })

  // --------------------------------------------------
  // 2) Notification example
  // --------------------------------------------------
  const notification = await prisma.notification.create({
    data: {
      title: "Welcome to the Club!",
      body: "This is your first notification."
    }
  })

  await prisma.notificationRead.create({
    data: {
      notificationId: notification.id,
      userId: admin.id,
    }
  })

  // --------------------------------------------------
  // 3) Projects
  // --------------------------------------------------
  const project = await prisma.project.create({
    data: {
      title: "Robotics Workshop",
      slug: "robotics-workshop",
      description: "A project to build small autonomous robots.",
      creatorId: admin.id,
      projectMembers: {
        create: [
          { userId: admin.id, role: "ADMIN" },
          { userId: officer.id, role: "OFFICER" },
          { userId: member.id, role: "MEMBER" },
        ]
      }
    }
  })

  // --------------------------------------------------
  // 4) Project update
  // --------------------------------------------------
  await prisma.projectUpdate.create({
    data: {
      title: "Kickoff Meeting",
      content: "We have planned the initial schedule.",
      projectId: project.id,
      createdById: admin.id
    }
  })

  // --------------------------------------------------
  // 5) Library Items
  // --------------------------------------------------
  await prisma.libraryItem.create({
    data: {
      title: "Intro to AI",
      description: "A beginner friendly guide to AI.",
      type: "BOOK",
      createdById: admin.id
    }
  })

  await prisma.libraryItem.create({
    data: {
      title: "Workshop Video",
      type: "VIDEO",
      url: "https://example.com/video",
      createdById: officer.id
    }
  })

  // --------------------------------------------------
  // 6) Events
  // --------------------------------------------------
  const event = await prisma.event.create({
    data: {
      title: "General Assembly",
      description: "Semester kickoff meeting",
      location: "Auditorium A3",
      createdById: admin.id,
      startAt: new Date(),
    }
  })

  // --------------------------------------------------
  // 7) Form for Event
  // --------------------------------------------------
  const form = await prisma.form.create({
    data: {
      title: "Event Registration",
      description: "Please register before attending",
      createdById: officer.id,
      fields: { questions: ["Name", "Major", "Phone"] },
      eventId: event.id
    }
  })

  // --------------------------------------------------
  // 8) Attendees
  // --------------------------------------------------
  await prisma.attendee.create({
    data: {
      formId: form.id,
      userId: member.id,
      formData: { answers: ["John", "CS", "0555"] }
    }
  })

  // --------------------------------------------------
  // 9) A simple Audit Log
  // --------------------------------------------------
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "DATABASE_SEEDED",
      details: { message: "Initial seed completed" }
    }
  })

  console.log("🌱 Seed completed!")
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
