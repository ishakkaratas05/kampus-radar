const { Role } = require("@prisma/client");
const { prisma } = require("../lib/prisma");
const { hashPassword, verifyPassword } = require("./password.service");
const { signAccessToken } = require("./jwt.service");

const REGISTERABLE_ROLES = new Set([Role.STUDENT, Role.ORGANIZER]);

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

async function register({ email, password, fullName, role, universityId }) {
  if (!REGISTERABLE_ROLES.has(role)) {
    const err = new Error("Bu rol ile kayıt açık değil");
    err.status = 403;
    throw err;
  }
  if (!universityId) {
    const err = new Error("universityId zorunlu");
    err.status = 400;
    throw err;
  }
  const uni = await prisma.university.findUnique({
    where: { id: universityId },
  });
  if (!uni) {
    const err = new Error("Üniversite bulunamadı");
    err.status = 400;
    throw err;
  }
  const emailNorm = normalizeEmail(email);
  if (!emailNorm) {
    const err = new Error("Geçerli bir e-posta gerekli");
    err.status = 400;
    throw err;
  }
  const existing = await prisma.user.findFirst({
    where: { email: { equals: emailNorm, mode: "insensitive" } },
  });
  if (existing) {
    const err = new Error("Bu e-posta zaten kayıtlı");
    err.status = 409;
    throw err;
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: emailNorm,
      passwordHash,
      fullName,
      role,
      universityId,
    },
  });
  const token = signAccessToken(user);
  return { user: sanitizeUser(user), token };
}

async function login({ email, password }) {
  const emailNorm = normalizeEmail(email);
  if (!emailNorm) {
    const err = new Error("E-posta veya şifre hatalı");
    err.status = 401;
    throw err;
  }
  const user = await prisma.user.findFirst({
    where: {
      email: { equals: emailNorm, mode: "insensitive" },
    },
  });
  if (!user) {
    const err = new Error("E-posta veya şifre hatalı");
    err.status = 401;
    throw err;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error("E-posta veya şifre hatalı");
    err.status = 401;
    throw err;
  }
  const token = signAccessToken(user);
  return {
    message: "Giriş başarılı",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

function sanitizeUser(user) {
  const { passwordHash: _p, ...rest } = user;
  return rest;
}

module.exports = { register, login, sanitizeUser };
