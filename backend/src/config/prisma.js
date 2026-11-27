// =================================================================
// config/prisma.js — Shared Prisma Database Client
//
// Why a separate file?
// Every service needs to talk to PostgreSQL, so we create ONE
// PrismaClient instance here and share it across the entire app
// instead of opening a new database connection on every request.
// =================================================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;