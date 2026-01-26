"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/Nav";
import ProgressChart from "@/components/ProgressChart";

export default function ProgressPage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState<any>();

  useEffect(() => {
    fetch("/api/exercises")
      .then((r) => r.json())
      .then((data) =>
        setExercise(data.find((x: any) => x._id === id))
      );
  }, [id]);

  if (!exercise) return null;

  const points = exercise.history.flatMap((h: any) =>
    h.sets.map((s: any) => ({
      date: new Date(h.date).toLocaleDateString(),
      weight: s.weight,
    }))
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">
        {exercise.name} Progress
      </h1>

      <ProgressChart data={points} />

      <Nav />
    </main>
  );
}
