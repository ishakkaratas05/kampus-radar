const { Router } = require("express");
const { Role } = require("@prisma/client");
const eventController = require("../controllers/event.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/requireRole.middleware");

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(Role.ORGANIZER),
  eventController.create
);
router.get("/", authMiddleware, eventController.list);
router.get("/:id", authMiddleware, eventController.getOne);

module.exports = router;
