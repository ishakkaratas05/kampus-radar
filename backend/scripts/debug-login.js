/**
 * Aynı DATABASE_URL ile kullanıcı + bcrypt durumunu yazdırır.
 * Kullanım: npm run debug-login -- ogrencisinav23@gmail.com admin123
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

async function main() {
  const emailArg = process.argv[2] || "ogrencisinav23@gmail.com";
  const password = process.argv[3] || "admin123";
  const emailNorm = normalizeEmail(emailArg);

  // eslint-disable-next-line no-console
  console.log("Normalize e-posta:", JSON.stringify(emailNorm));

  const exact = await prisma.user.findUnique({
    where: { email: emailArg.trim() },
  });
  // eslint-disable-next-line no-console
  console.log("findUnique(gövdedeki metin, trim):", exact ? "VAR" : "YOK");

  const insensitive = await prisma.user.findFirst({
    where: { email: { equals: emailNorm, mode: "insensitive" } },
  });
  // eslint-disable-next-line no-console
  console.log("findFirst(insensitive):", insensitive ? "VAR" : "YOK");

  const row = insensitive || exact;
  if (!row) {
    // eslint-disable-next-line no-console
    console.log(
      "\nKullanıcı bulunamadı. Supabase’de e-posta birebir / farklı mı kontrol edin."
    );
    await prisma.$disconnect();
    return;
  }

  // eslint-disable-next-line no-console
  console.log("DB email:", JSON.stringify(row.email));
  const h = row.passwordHash;
  // eslint-disable-next-line no-console
  console.log("passwordHash tip:", typeof h, "uzunluk:", h?.length);
  // eslint-disable-next-line no-console
  console.log("passwordHash önek:", typeof h === "string" ? h.slice(0, 10) : h);

  const looksBcrypt =
    typeof h === "string" &&
    (h.startsWith("$2a$") ||
      h.startsWith("$2b$") ||
      h.startsWith("$2y$"));
  // eslint-disable-next-line no-console
  console.log("bcrypt formatına benziyor mu:", looksBcrypt);

  const ok = await bcrypt.compare(password, String(h || ""));
  // eslint-disable-next-line no-console
  console.log("bcrypt.compare(şifre, passwordHash):", ok);
  if (!ok && looksBcrypt) {
    // eslint-disable-next-line no-console
    console.log(
      "\nHash bcrypt ama şifre eşleşmiyor: yanlış düz şifre veya farklı bir metin hash’lendi."
    );
  }
  if (!ok && !looksBcrypt) {
    // eslint-disable-next-line no-console
    console.log(
      "\npasswordHash bcrypt gibi değil (düz metin veya yanlış kolon?).\nÇalıştırın: npm run hash-password -- admin123\nSonra: UPDATE \"User\" SET \"passwordHash\" = '<hash>' WHERE id = '...';"
    );
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
