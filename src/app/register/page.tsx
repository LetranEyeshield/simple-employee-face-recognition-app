"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { loadModels } from "@/app/lib/api";
import { registerEmployee } from "@/app/actions/registerEmployee";
import Link from "next/link";

export default function RegisterForm() {
  const webcamRef = useRef<Webcam>(null);
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roles: string[] = [
    "Doctor",
    "Nurse",
    "Midwife",
    "Pharmacist",
    "Dentist",
    "Medical Technologist",
    "Information Technology",
    "Programmer/Web Developer",
    "Administrative Aide",
  ];

  const department: string[] = [
    "Doctor's Office",
    "Pharmacy",
    "Midwives",
    "Laboratory",
    "TB Dots",
    "Dental",
    "IT Department",
    "Sanitary",
  ];

  const handleRegister = async () => {
    // Load face-api models
    await loadModels();
    setIsLoading(true);
    const video = webcamRef.current?.video;
    if (!video) {
      alert("Webcam not ready");
      return;
    }

    // Detect single face
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected. Please try again.");
      setIsLoading(false);
      return;
    }

    const descriptor = Array.from(detection.descriptor); // Float32Array to plain array

    console.log({
      fullName,
      department: selectedDepartment,
      role: selectedRole,
      descriptor,
    });

    const result = await registerEmployee({
      fullName,
      department: selectedDepartment,
      role: selectedRole,
      descriptor,
    });

    // Next: Send to server action to save in SQLite
    //alert("Face descriptor captured! Ready to save.");
    if (result.success) {
      alert("Employee registered successfully!");
      setFullName("");
      setSelectedDepartment("");
      setSelectedRole("");
    } else {
      alert(result.error || "Something went wrong.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="main bg-gray-300 rounded-md shadow pb-6 pt-10 w-8/12 mx-auto mt-2">
        <div className="reg-wrapper max-w-md mx-auto p-4 border rounded-xl shadow bg-white space-y-4">
          <h2 className="text-3xl text-center font-bold">Register Employee</h2>

          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="" disabled>
              Select Department
            </option>
            {department.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded w-full"
          />

          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
      <div className="flex flex-col align-center mt-10 mb-6">
        <Link
          href={"/"}
          className="mx-auto text-l sm:text-2xl text-center text-white px-5 py-2 rounded-md bg-blue-500 hover:bg-blue-300"
        >
          Back
        </Link>
      </div>
    </>
  );
}
