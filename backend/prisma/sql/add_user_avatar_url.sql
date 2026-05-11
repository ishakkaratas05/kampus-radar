-- Şema: User.avatarUrl (nullable). Bir kez çalıştırın (Supabase SQL Editor).
-- Sonrasında: backend klasöründe nodemon kapalıyken `npx prisma generate`

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
