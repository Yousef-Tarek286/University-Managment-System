
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
console.log("Prisma model names:", Object.keys(prisma));
console.log("User model:", prisma.user);

async function main() {
    const hashedPassword = await bcrypt.hash("mypassword123", 10);

    const user = await prisma.user.create({
        data: {
            email: "testadmin@university.com",
            fullName: "Test Admin",
            passwordHash: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Created user:", user.email);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
