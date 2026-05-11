const { Role } = require("@prisma/client");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
  register: registerUser,
  login: loginUser,
  sanitizeUser,
} = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const { email, password, fullName, role, universityId } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email ve password zorunlu" });
  }
  const r = role ?? Role.STUDENT;
  const result = await registerUser({
    email,
    password,
    fullName,
    role: r,
    universityId,
  });
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email ve password zorunlu" });
  }
  const result = await loginUser({ email, password });
  res.status(200).json(result);
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = { register, login, me };
