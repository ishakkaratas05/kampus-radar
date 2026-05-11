require("dotenv").config();
const { loadEnv } = require("./config/env");
const app = require("./app");
const { prisma } = require("./lib/prisma");

const env = loadEnv();

async function main() {
  await prisma.$connect();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API http://localhost:${env.port}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
