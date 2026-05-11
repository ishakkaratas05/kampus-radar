const { Router } = require("express");
const { Role } = require("@prisma/client");
const ticketController = require("../controllers/ticket.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/requireRole.middleware");

const router = Router();

router.post(
  "/purchase",
  authMiddleware,
  requireRole(Role.STUDENT),
  ticketController.purchase
);
router.post(
  "/verify/holder",
  authMiddleware,
  requireRole(Role.ORGANIZER, Role.RECTOR, Role.SYSTEM_ADMIN),
  ticketController.verifyHolder
);
router.post(
  "/verify/venue",
  authMiddleware,
  requireRole(Role.STUDENT),
  ticketController.verifyVenue
);

module.exports = router;
