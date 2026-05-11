const { EventStatus, Role } = require("@prisma/client");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const eventService = require("../services/event.service");

function stripEventForRole(event, user) {
  if (!event) return null;
  const copy = { ...event };
  const isOrganizerOwner =
    user.role === Role.ORGANIZER && event.organizerId === user.id;
  const isRectorSameUni =
    user.role === Role.RECTOR &&
    user.universityId &&
    event.universityId === user.universityId;
  const isAdmin = user.role === Role.SYSTEM_ADMIN;
  if (!isOrganizerOwner && !isRectorSameUni && !isAdmin) {
    delete copy.venueVerificationSecret;
  }
  return copy;
}

const create = asyncHandler(async (req, res) => {
  const body = {
    ...req.body,
    status: req.body.status ?? EventStatus.DRAFT,
  };
  if (!body.title || !body.startsAt || !body.universityId) {
    return res
      .status(400)
      .json({ error: "title, startsAt ve universityId zorunlu" });
  }
  const event = await eventService.createEvent(req.user, body);
  res.status(201).json(event);
});

const list = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.universityId) filters.universityId = req.query.universityId;
  if (req.query.organizerId) filters.organizerId = req.query.organizerId;
  const events = await eventService.listEvents(filters);
  const mapped = events.map((e) => stripEventForRole(e, req.user));
  res.json(mapped);
});

const getOne = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: "Etkinlik bulunamadı" });
  }
  res.json(stripEventForRole(event, req.user));
});

module.exports = { create, list, getOne };
