"use client";

import { useState } from "react";
import InsultsAdmin from "@/components/features/InsultsAdmin";
import WordsAdmin from "@/components/features/WordsAdmin";
import RespectAdmin from "@/components/features/RespectAdmin";

const tabs = [
  { id: "words" as const, label: "Palabras" },
  { id: "insults" as const, label: "Puteadas" },
  { id: "respect" as const, label: "Test Guayaco" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"words" | "insults" | "respect">("words");

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Panel de administración</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestiona palabras, puteadas y contenido.</p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg border border-border bg-muted/30 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-soft p-4 md:p-6">
        {activeTab === "words" && <WordsAdmin />}
        {activeTab === "insults" && <InsultsAdmin />}
        {activeTab === "respect" && <RespectAdmin />}
      </div>
    </div>
  );
}
