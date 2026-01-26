"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const load = async () => {
    setPlans(await (await fetch("/api/workouts")).json());
    setExercises(await (await fetch("/api/exercises")).json());
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await fetch("/api/workouts", {
      method: editingId ? "PATCH" : "POST",
      body: JSON.stringify({
        id: editingId,
        name,
        workouts: selected,
        warmups: [],
        stretches: [],
      }),
    });

    setEditingId(null);
    setName("");
    setSelected([]);
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/workouts", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Workout Plans</h1>

      <input
        placeholder="Workout name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 bg-zinc-800 rounded"
      />

      {exercises.map((e) => (
        <div
          key={e._id}
          className="bg-zinc-900 p-3 rounded-xl mb-2 flex justify-between"
        >
          <span>{e.name}</span>

          <input
            type="checkbox"
            checked={selected.includes(e._id)}
            onChange={() =>
              setSelected((p) =>
                p.includes(e._id)
                  ? p.filter((x) => x !== e._id)
                  : [...p, e._id]
              )
            }
          />
        </div>
      ))}

      <button
        onClick={save}
        className="mt-3 bg-blue-600 w-full p-3 rounded"
      >
        {editingId ? "Update" : "Save"}
      </button>

      <div className="mt-6 space-y-2">
        {plans.map((p) => (
          <div
            key={p._id}
            className="bg-zinc-900 p-3 rounded-xl flex justify-between"
          >
            <span>{p.name}</span>

            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditingId(p._id);
                  setName(p.name);
                  setSelected(p.workouts.map((x: any) => x._id));
                }}
                className="text-blue-400"
              >
                Edit
              </button>

              <button
                onClick={() => del(p._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Nav />
    </main>
  );
}
