import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySetup() {
  try {
    const users = await prisma.user.findMany({ 
      where: {
        email: { 
          contains: "alice@prisma.io",
        },
      },
    });
    console.log('Query successful. Users found:', users.length);
  } catch (error) {
    console.error('Error running query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();