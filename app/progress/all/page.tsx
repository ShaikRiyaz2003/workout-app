"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function ProgressIndex() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/exercises")
      .then((r) => r.json())
      .then(setList);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Progress</h1>

      <div className="space-y-2">
        {list.map((e) => (
          <Link
            key={e._id}
            href={`/progress/${e._id}`}
            className="block bg-zinc-900 p-3 rounded-xl"
          >
            <p className="font-semibold">{e.name}</p>
            <p className="text-xs text-zinc-400">{e.muscleGroup}</p>
          </Link>
        ))}
      </div>

      <Nav />
    </main>
  );
}
