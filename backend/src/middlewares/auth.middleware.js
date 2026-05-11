const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");

async function authMiddleware(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Sunucu yapılandırması eksik" });
  }
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetkisiz: token gerekli" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { university: true },
    });
    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token" });
  }
}

module.exports = { authMiddleware };
