const crypto = require("crypto");
const { EventStatus, Role, TicketStatus } = require("@prisma/client");
const { prisma } = require("../lib/prisma");

function randomHolderSecret() {
  return crypto.randomBytes(24).toString("hex");
}

async function purchaseTicket(student, eventId) {
  if (student.role !== Role.STUDENT) {
    const err = new Error("Sadece öğrenciler bilet alabilir");
    err.status = 403;
    throw err;
  }
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.status !== EventStatus.PUBLISHED) {
    const err = new Error("Etkinlik bulunamadı veya yayında değil");
    err.status = 400;
    throw err;
  }
  if (student.universityId !== event.universityId) {
    const err = new Error("Bu etkinlik için üniversiteniz uygun değil");
    err.status = 403;
    throw err;
  }
  if (event.capacity != null) {
    const sold = await prisma.ticket.count({
      where: { eventId, status: { in: [TicketStatus.PAID, TicketStatus.USED] } },
    });
    if (sold >= event.capacity) {
      const err = new Error("Kontenjan doldu");
      err.status = 400;
      throw err;
    }
  }
  try {
    return await prisma.ticket.create({
      data: {
        eventId,
        studentId: student.id,
        holderQrSecret: randomHolderSecret(),
        status: TicketStatus.PAID,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            venue: true,
          },
        },
      },
    });
  } catch (e) {
    if (e.code === "P2002") {
      const err = new Error("Bu etkinlik için zaten biletiniz var");
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

async function verifyHolderScan(actor, holderQrSecret) {
  if (
    ![Role.ORGANIZER, Role.RECTOR, Role.SYSTEM_ADMIN].includes(actor.role)
  ) {
    const err = new Error("Bu doğrulamayı yapamazsınız");
    err.status = 403;
    throw err;
  }
  const ticket = await prisma.ticket.findFirst({
    where: { holderQrSecret },
    include: { event: true, student: { select: { id: true, email: true, fullName: true } } },
  });
  if (!ticket) {
    const err = new Error("Bilet bulunamadı");
    err.status = 404;
    throw err;
  }
  if (actor.role === Role.ORGANIZER && ticket.event.organizerId !== actor.id) {
    const err = new Error("Bu etkinliğin düzenleyicisi değilsiniz");
    err.status = 403;
    throw err;
  }
  if (actor.role === Role.RECTOR || actor.role === Role.ORGANIZER) {
    if (actor.universityId && ticket.event.universityId !== actor.universityId) {
      const err = new Error("Farklı üniversiteye ait bilet");
      err.status = 403;
      throw err;
    }
  }
  if (ticket.status === TicketStatus.REVOKED || ticket.status === TicketStatus.CANCELLED) {
    const err = new Error("Bilet geçersiz");
    err.status = 400;
    throw err;
  }
  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { usedAt: ticket.usedAt || new Date(), status: TicketStatus.USED },
    include: { event: true, student: { select: { id: true, email: true, fullName: true } } },
  });
  return updated;
}

async function verifyVenueByStudent(student, { eventId, venueVerificationSecret }) {
  if (student.role !== Role.STUDENT) {
    const err = new Error("Sadece öğrenci hesabı kullanılabilir");
    err.status = 403;
    throw err;
  }
  const event = await prisma.event.findFirst({
    where: { id: eventId, venueVerificationSecret },
  });
  if (!event) {
    const err = new Error("Etkinlik veya mekân doğrulaması hatalı");
    err.status = 400;
    throw err;
  }
  const ticket = await prisma.ticket.findFirst({
    where: { eventId, studentId: student.id },
  });
  if (!ticket) {
    const err = new Error("Bu etkinlik için biletiniz yok");
    err.status = 404;
    throw err;
  }
  return prisma.ticket.update({
    where: { id: ticket.id },
    data: { venueVerifiedAt: new Date() },
    include: { event: { select: { id: true, title: true, startsAt: true, venue: true } } },
  });
}

module.exports = { purchaseTicket, verifyHolderScan, verifyVenueByStudent };
