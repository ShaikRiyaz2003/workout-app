"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function ExercisesPage() {
  const [list, setList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    muscleGroup: "",
    type: "exercise",
  });

  const load = async () => {
    const r = await fetch("/api/exercises");
    setList(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await fetch("/api/exercises", {
      method: editingId ? "PATCH" : "POST",
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });

    setEditingId(null);
    setForm({ name: "", muscleGroup: "", type: "exercise" });
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/exercises", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Exercises</h1>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4 space-y-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Muscle"
          value={form.muscleGroup}
          onChange={(e) =>
            setForm({ ...form, muscleGroup: e.target.value })
          }
          className="w-full p-2 bg-zinc-800 rounded"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="exercise">Exercise</option>
          <option value="warmup">Warmup</option>
          <option value="stretch">Stretch</option>
        </select>

        <button onClick={save} className="bg-green-600 w-full p-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {list.map((e) => (
        <div
          key={e._id}
          className="bg-zinc-900 p-3 rounded-xl mb-2 flex justify-between"
        >
          <div>
            <p className="font-semibold">{e.name}</p>
            <p className="text-xs text-zinc-400">
              {e.muscleGroup} · {e.type}
            </p>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => {
                setEditingId(e._id);
                setForm(e);
              }}
              className="text-blue-400"
            >
              Edit
            </button>

            <button
              onClick={() => del(e._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <Nav />
    </main>
  );
}
