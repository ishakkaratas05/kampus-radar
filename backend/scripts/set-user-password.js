/**
 * Geliştirme: mevcut kullanıcının passwordHash alanını uygulama ile uyumlu bcrypt (12) yapar.
 * Kullanım: npm run set-password -- ogrencisinav23@gmail.com admin123
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

async function main() {
  const emailArg = process.argv[2];
  const plain = process.argv[3];
  if (!emailArg || !plain) {
    // eslint-disable-next-line no-console
    console.error(
      "Kullanım: npm run set-password -- <email> <yeni-düz-şifre>"
    );
    process.exit(1);
  }
  const emailNorm = normalizeEmail(emailArg);
  const user = await prisma.user.findFirst({
    where: { email: { equals: emailNorm, mode: "insensitive" } },
  });
  if (!user) {
    // eslint-disable-next-line no-console
    console.error("Kullanıcı bulunamadı:", emailArg);
    process.exit(1);
  }
  const passwordHash = bcrypt.hashSync(plain, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  // eslint-disable-next-line no-console
  console.log("Şifre güncellendi:", user.email);
  await prisma.$disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
