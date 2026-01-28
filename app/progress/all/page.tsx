"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function ProgressIndex() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/exercises", { cache: "no-store" })
      .then((r) => r.json())
      .then(setList);
  }, []);

  // normalize old docs
  const normalizeMuscles = (e: any): string[] => {
    if (Array.isArray(e.muscleGroups)) return e.muscleGroups;
    if (typeof e.muscleGroup === "string") return [e.muscleGroup];
    return [];
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Progress</h1>

      <div className="space-y-2">
        {list.map((e) => {
          const muscles = normalizeMuscles(e);

          return (
            <Link
              key={e._id}
              href={`/progress/${e._id}`}
              className="block bg-zinc-900 p-3 rounded-xl hover:bg-zinc-800 transition"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{e.name}</p>

                <span className="text-[10px] bg-zinc-700 px-2 py-1 rounded-full">
                  {e.type}
                </span>
              </div>

              <p className="text-xs text-zinc-400 mt-1">
                {muscles.join(", ") || "—"}
              </p>

              {typeof e.pr === "number" && e.pr > 0 && (
                <p className="text-[11px] text-green-400 mt-1">
                  PR: {e.pr}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      <Nav />
    </main>
  );
}
