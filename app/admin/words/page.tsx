"use client";

import { useState } from "react";
import InsultsAdmin from "@/components/features/InsultsAdmin";
import WordsAdmin from "@/components/features/WordsAdmin";
import RespectAdmin from "@/components/features/RespectAdmin";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"words" | "insults" | "respect">("words");

  return (
    // <div className="p-5">
    <div className="w-full lg:w-[1000] m-5">
    
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-4 justify-center md:justify-start">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "words"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("words")}
        >
          Palabras
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "insults"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("insults")}
        >
          Puteadas
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "respect"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("respect")}
        >
          Guayaco que se Respeta
        </button>
      </div>

      {/* Content */}
      <div className="p-3 rounded-md bg-white">
        {activeTab === "words" && <WordsAdmin />}
        {activeTab === "insults" && <InsultsAdmin />}
        {activeTab === "respect" && <RespectAdmin />}
      </div>
    </div>
  );
};

export default Admin;
