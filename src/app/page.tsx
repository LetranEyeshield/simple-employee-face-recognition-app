import Link from "next/link";
import FaceScanner from "./components/FaceScanner";

export default function Home() {
  return (
    <div className="font-sans flex flex-col w-full pt-2 pb-15">
      <main className="main bg-gray-300 rounded-md shadow pt-10 pb-15 w-8/12 mx-auto">
        <FaceScanner />
      </main>
      <div className="reg-emp flex flex-col mt-10">
        <Link
          href={"/register"}
          className="mx-auto text-center text-white px-5 py-2 rounded-md bg-blue-500 hover:bg-blue-300"
        >
          Register Employee
        </Link>
      </div>
    </div>
  );
}
