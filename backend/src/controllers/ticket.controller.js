const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const ticketService = require("../services/ticket.service");

const purchase = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) {
    return res.status(400).json({ error: "eventId zorunlu" });
  }
  const ticket = await ticketService.purchaseTicket(req.user, eventId);
  res.status(201).json(ticket);
});

const verifyHolder = asyncHandler(async (req, res) => {
  const { holderQrSecret } = req.body;
  if (!holderQrSecret) {
    return res.status(400).json({ error: "holderQrSecret zorunlu" });
  }
  const ticket = await ticketService.verifyHolderScan(req.user, holderQrSecret);
  res.json({ ok: true, ticket });
});

const verifyVenue = asyncHandler(async (req, res) => {
  const { eventId, venueVerificationSecret } = req.body;
  if (!eventId || !venueVerificationSecret) {
    return res
      .status(400)
      .json({ error: "eventId ve venueVerificationSecret zorunlu" });
  }
  const ticket = await ticketService.verifyVenueByStudent(req.user, {
    eventId,
    venueVerificationSecret,
  });
  res.json({ ok: true, ticket });
});

module.exports = { purchase, verifyHolder, verifyVenue };
