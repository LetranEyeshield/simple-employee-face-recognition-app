"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { logTimeAutomatically } from "@/app/actions/logTime"; // 👈 Server Action
// import Link from "next/link";

export default function FaceScanner() {
  const webcamRef = useRef<Webcam>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastLogTime, setLastLogTime] = useState<number>(0);

  const cooldown = 10 * 1000; // 10 seconds cooldown between logs

  const loadModels = async () => {
    const MODEL_URL = "/models"; // Path to public/models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
  };

  const runRecognition = async () => {
    if (!webcamRef.current || isProcessing) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    const now = Date.now();
    if (now - lastLogTime < cooldown) return;

    setIsProcessing(true);

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const capturedDescriptor = detections[0].descriptor;

        const response = await logTimeAutomatically(
          Array.from(capturedDescriptor) // Convert Float32Array to number[]
        );

        if (response?.success) {
          console.log("🕒 Time logged:", response.message);
          alert(response.message);
          setLastLogTime(now); // ✅ Update last log time
        }
      }
    } catch (error) {
      console.error("Recognition error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadModels();
    const interval = setInterval(runRecognition, 2000); // Run every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="webcam-div w-full max-w-md mx-auto mt-20">
      <div className="webcam-wrapper rounded-md shadow p-10 bg-gray-100">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width="100%"
          className="rounded shadow"
        />
      </div>
      {/* <div className="reg-emp flex flex-col mt-10">
        <Link
          href={"/register"}
          className="mx-auto text-center text-white px-5 py-2 rounded-md bg-blue-500 hover:bg-blue-300"
        >
          Register Employee
        </Link>
      </div> */}
    </div>
  );
}
