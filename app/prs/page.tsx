"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function PRsPage() {
  const [prs, setPrs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/exercises").then((r) => r.json()).then(setPrs);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Personal Records</h1>

      <div className="grid grid-cols-2 gap-3">
        {prs.map((e) => (
          <div key={e._id} className="bg-zinc-900 rounded-xl p-4">
            <p className="font-semibold">{e.name}</p>
            <p className="text-xs text-zinc-400">{e.muscleGroups?.join(", ")}</p>
            <p className="text-2xl mt-2 text-green-500">
              {e.pr || 0} kg
            </p>
          </div>
        ))}
      </div>

      <Nav />
    </main>
  );
}
