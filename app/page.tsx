"use client";

import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className={"text-3xl font-thin"}>Convert</h1>
        <div className="mt-4">
          <label
            className={"pe-2 text-sm font-extrabold opacity-25 mt-2 uppercase"}
          >
            Convert string to base64
          </label>
          <input
            type="text"
            className={
              "w-full rounded-sm outline outline-0 focus:outline-2 focus:outline-offset-2 outline-blue-300 transition-all px-2"
            }
            onChange={(e) => {
              setResult(btoa(e.target.value));
            }}
          />
          <div className={"text-sm font-extrabold uppercase mt-2 opacity-25"}>
            RESULT:
          </div>
          <code
            onClick={() => {
              navigator.clipboard.writeText(result);
              toast.success("Copied to clipboard");
            }}
            className="cursor-pointer"
          >
            {result}
          </code>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
