/**
 * bcrypt salt rounds = 12 (password.service.js ile aynı).
 * Kullanım: npm run hash-password -- admin123
 * Çıktıyı Supabase SQL'de "passwordHash" alanına yazın.
 */
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;
const plain = process.argv[2] || "admin123";

// eslint-disable-next-line no-console
console.log(bcrypt.hashSync(plain, SALT_ROUNDS));
