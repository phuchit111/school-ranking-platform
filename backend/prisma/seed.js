const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@school.com';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: {
      email,
      password: hash,
      role: 'ADMIN',
    },
  });

  console.log('Seed: admin user ready:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
