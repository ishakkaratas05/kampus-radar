require("dotenv").config();

const required = ["DATABASE_URL", "JWT_SECRET"];

function loadEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Eksik ortam değişkenleri: ${missing.join(", ")}`);
  }
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 4000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };
}

module.exports = { loadEnv };
