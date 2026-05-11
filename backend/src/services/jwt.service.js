const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
  if (!jwtSecret) {
    throw new Error("JWT_SECRET tanımlı değil");
  }
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      universityId: user.universityId,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

module.exports = { signAccessToken };
