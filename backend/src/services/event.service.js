const crypto = require("crypto");
const { prisma } = require("../lib/prisma");

function randomSecret() {
  return crypto.randomBytes(32).toString("hex");
}

async function createEvent(organizer, data) {
  if (organizer.universityId !== data.universityId) {
    const err = new Error("Sadece kendi üniversiteniz için etkinlik oluşturabilirsiniz");
    err.status = 403;
    throw err;
  }
  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      venue: data.venue,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
      capacity: data.capacity,
      status: data.status,
      venueVerificationSecret: randomSecret(),
      universityId: data.universityId,
      organizerId: organizer.id,
    },
  });
}

async function listEvents(filters) {
  const where = {};
  if (filters.universityId) where.universityId = filters.universityId;
  if (filters.organizerId) where.organizerId = filters.organizerId;
  return prisma.event.findMany({
    where,
    orderBy: { startsAt: "asc" },
    include: {
      university: { select: { id: true, name: true, slug: true } },
      organizer: { select: { id: true, email: true, fullName: true } },
    },
  });
}

async function getEventById(id) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      university: true,
      organizer: {
        select: { id: true, email: true, fullName: true, role: true },
      },
    },
  });
}

module.exports = { createEvent, listEvents, getEventById };
