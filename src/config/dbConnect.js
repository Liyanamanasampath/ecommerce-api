const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({}); // ✅ REQUIRED in Prisma v7

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  connectDB,
};