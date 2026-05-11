const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const universityService = require("../services/university.service");

const create = asyncHandler(async (req, res) => {
  const { name, slug, city } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name zorunlu" });
  }
  const uni = await universityService.createUniversity({ name, slug, city });
  res.status(201).json(uni);
});

const list = asyncHandler(async (_req, res) => {
  const items = await universityService.listUniversities();
  res.json(items);
});

const getOne = asyncHandler(async (req, res) => {
  const uni = await universityService.getUniversityById(req.params.id);
  if (!uni) {
    return res.status(404).json({ error: "Üniversite bulunamadı" });
  }
  res.json(uni);
});

const remove = asyncHandler(async (req, res) => {
  const existing = await universityService.getUniversityById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Üniversite bulunamadı" });
  }
  await universityService.deleteUniversity(req.params.id);
  res.status(204).send();
});

module.exports = { create, list, getOne, remove };
