const { Router } = require("express");
const { Role } = require("@prisma/client");
const universityController = require("../controllers/university.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/requireRole.middleware");

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(Role.SYSTEM_ADMIN),
  universityController.create
);
router.get("/", authMiddleware, universityController.list);
router.get("/:id", authMiddleware, universityController.getOne);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.SYSTEM_ADMIN),
  universityController.remove
);

module.exports = router;
