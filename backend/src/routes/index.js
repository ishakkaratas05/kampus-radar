const { Router } = require("express");
const authRoutes = require("./auth.routes");
const universityRoutes = require("./university.routes");
const eventRoutes = require("./event.routes");
const ticketRoutes = require("./ticket.routes");

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "kampus-radar-api" });
});

router.use("/auth", authRoutes);
router.use("/universities", universityRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);

module.exports = router;
