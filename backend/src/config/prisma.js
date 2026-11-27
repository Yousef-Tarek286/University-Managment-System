// =================================================================
// config/prisma.js — Shared Prisma Database Client
//
// Why a separate file?
// Every service needs to talk to PostgreSQL, so we create ONE
// PrismaClient instance here and share it across the entire app
// instead of opening a new database connection on every request.
// =================================================================

require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;

