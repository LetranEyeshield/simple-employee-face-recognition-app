"use server";

import { prisma } from "@/app/lib/prisma";

export async function registerEmployee({
  fullName,
  department,
  role,
  descriptor,
}: {
  fullName: string;
  department: string;
  role: string;
  descriptor: number[];
}) {
  try {
    await prisma.employee.create({
      data: {
        fullName,
        department,
        role,
        descriptor,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving employee:", error);
    return { success: false, error: "Failed to save" };
  }
}
