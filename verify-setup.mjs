// verify-setup.mjs
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function verifySetup() {
  try {
    const users = await prisma.user.findMany({ 
      where: {
        email: { 
          contains: "alice@prisma.io",
        },
      },
      cacheStrategy: { ttl: 60 },
    });
    console.log('Accelerate query successful. Users found:', users.length);
  } catch (error) {
    console.error('Error running Accelerate query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();