

import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const accounts = [
        {
            email: "testadmin@university.com",
            fullName: "Test Admin",
            password: "mypassword123",
            role: "ADMIN",
        },
        {
            email: "doctor@test.com",
            fullName: "Test Doctor",
            password: "Doctor123!",
            role: "DOCTOR",
            employeeNumber: "DOC-TEST-001",
        },
        {
            email: "student@test.com",
            fullName: "Test Student",
            password: "Student123!",
            role: "STUDENT",
            studentNumber: "STU-TEST-001",
        },
    ];

    for (const account of accounts) {
        const hashedPassword = await bcrypt.hash(account.password, 10);

        const user = await prisma.user.upsert({
            where: { email: account.email },
            update: {
                fullName: account.fullName,
                passwordHash: hashedPassword,
                role: account.role,
                isActive: true,
                employeeNumber: account.employeeNumber ?? null,
                studentNumber: account.studentNumber ?? null,
            },
            create: {
                email: account.email,
                fullName: account.fullName,
                passwordHash: hashedPassword,
                role: account.role,
                isActive: true,
                employeeNumber: account.employeeNumber ?? null,
                studentNumber: account.studentNumber ?? null,
            },
        });

        console.log(`Created/updated ${user.role}: ${user.email}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
