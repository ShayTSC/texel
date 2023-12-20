"use client";

import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [result, setResult] = useState("");
  const [parsing, setParsing] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error: any) {
      console.error(error);
      setResult(text);
      toast.error(
        `Failed to copy: \n${JSON.stringify(
          error.message
        )}, have write the text into result section, try click to copy or manually copy`,
        {
          duration: 10000,
        }
      );
    }
  }

  function restoreUnicodeEmojis(inputString: string) {
    // Regular expression to match Unicode emoji codes
    const emojiRegex = /\\u([\dA-Fa-f]{4})/g;
  
    return inputString.replace(emojiRegex, (match, hexCode) => {
      const emojiChar = String.fromCodePoint(parseInt(hexCode, 16));
      return emojiChar;
    });
  }

  const convertAndCopy = (result: string) => {
    setParsing(true);
    fetch(
      `${process.env.NEXT_PUBLIC_CONVERSION_API_ENDPOINT}/sub?url=${result}`,
      { method: "POST" }
    )
      .then(
        (res) => {
          res.text().then((text) => {
            copy(text);
          });
        },
        (err) => {
          console.error(err);
          toast.error(`Failed to convert: \n${JSON.stringify(err)}`, {
            duration: 5000,
          });
        }
      )
      .finally(() => setParsing(false));
  };

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
          <textarea
            className={
              "w-full rounded-sm outline outline-0 focus:outline-2 focus:outline-offset-2 outline-blue-300 transition-all px-2 max-w-[70vw]"
            }
            onChange={(e) => {
              setResult(btoa(e.target.value));
            }}
          />
          <div className={"text-sm font-extrabold uppercase mt-2 opacity-25"}>
            RESULT:
          </div>
          <p
            onClick={() => {
              copy(result);
            }}
            className="cursor-pointer text-xs w-full max-w-[70vw] break-all"
          >
            {restoreUnicodeEmojis(result) || "Empty input"}
          </p>
        </div>
        <button
          type="button"
          className={`mt-4 inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-regular text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            parsing && "disabled opacity-50 cursor-not-allowed"
          }`}
          onClick={() => {
            if (!parsing) convertAndCopy(result);
          }}
        >
          <DocumentDuplicateIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
          Convert subscription URL
        </button>
      </div>
      <Toaster />
    </main>
  );
}
