const { prisma } = require("../lib/prisma");

async function createUniversity({ name, slug, city }) {
  return prisma.university.create({
    data: { name, slug, city },
  });
}

async function listUniversities() {
  return prisma.university.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true, events: true } } },
  });
}

async function getUniversityById(id) {
  return prisma.university.findUnique({
    where: { id },
    include: { _count: { select: { users: true, events: true } } },
  });
}

async function deleteUniversity(id) {
  return prisma.university.delete({
    where: { id },
  });
}

module.exports = {
  createUniversity,
  listUniversities,
  getUniversityById,
  deleteUniversity,
};
