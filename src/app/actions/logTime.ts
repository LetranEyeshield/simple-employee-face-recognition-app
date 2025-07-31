"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";

import * as faceapi from "face-api.js";
import { euclideanDistance } from "@/app/lib/utils"; // we'll define this

export async function logEmployeeTimeScan({
  employeeId,
  fullName,
  role,
  department,
  descriptor,
}: {
  employeeId: string;
  fullName: string;
  role: string;
  department: string;
  descriptor: number[]; // JSON data from face-api
}) {
  await prisma.timeLogs.create({
    data: {
      employeeId,
      fullName,
      role,
      department,
      descriptor,
    },
  });

  revalidatePath("/");
}
//
//
//

//FACE SCAN TO LOG AUTOMATICALLY
export async function logTimeAutomatically(descriptor: number[]) {
  try {
    const employees = await prisma.employee.findMany({
      include: { timeLogs: true },
    });

    const threshold = 0.6;
    for (const emp of employees) {
      const savedDescriptor = emp.descriptor as number[];
      const distance = euclideanDistance(descriptor, savedDescriptor);

      if (distance < threshold) {
        await prisma.timeLogs.create({
          data: {
            employeeId: emp.id,
            fullName: emp.fullName,
            role: emp.role,
            department: emp.department,
            descriptor,
          },
        });

        return {
          success: true,
          message: `Time log saved for ${emp.fullName}`,
        };
      }
    }

    return { success: false, message: "No matching face found" };
  } catch (error) {
    console.error("Log error:", error);
    return { success: false, message: "Server error" };
  }
}
