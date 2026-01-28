"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Toast from "@/components/Toast";

export default function ExercisesPage() {
  const [list, setList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    name: "",
    muscleGroups: [] as string[],
    muscleInput: "",
    type: "exercise",
  };

  const [form, setForm] = useState(emptyForm);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // ----------------------------
  // LOAD
  // ----------------------------
  const load = async () => {
    const r = await fetch("/api/exercises", {
      cache: "no-store",
    });
    setList(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

  // ----------------------------
  // SAVE
  // ----------------------------
  const save = async () => {
    try {
      const response = await fetch("/api/exercises", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? {
                id: editingId,
                name: form.name,
                muscleGroups: form.muscleGroups,
                type: form.type,
              }
            : {
                name: form.name,
                muscleGroups: form.muscleGroups,
                type: form.type,
              },
        ),
      });

      if (response.ok) {
        setToast({
          msg: editingId ? "Exercise updated 💪" : "Exercise added 🔥",
          type: "success",
        });
        setEditingId(null);
        setForm(emptyForm);
        await load();
      } else {
        setToast({
          msg: "Save failed ❌",
          type: "error",
        });
      }
    } catch {
      setToast({
        msg: "Save failed ❌",
        type: "error",
      });
    }
  };

  // ----------------------------
  // DELETE
  // ----------------------------
  const del = async (id: string) => {
    try {
      await fetch("/api/exercises", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      setToast({
        msg: "Exercise deleted 🗑️",
        type: "success",
      });

      load();
    } catch {
      setToast({
        msg: "Delete failed ❌",
        type: "error",
      });
    }
  };

  // ----------------------------
  // ADD MUSCLE TAG
  // ----------------------------
  const addMuscleFromInput = () => {
    const v = form.muscleInput.trim();
    if (!v) return;

    if (form.muscleGroups.some((x) => x.toLowerCase() === v.toLowerCase()))
      return;

    setForm((p) => ({
      ...p,
      muscleGroups: [...p.muscleGroups, v],
      muscleInput: "",
    }));
  };

  // ----------------------------
  // NORMALIZE OLD DB RECORDS
  // ----------------------------
  const normalizeMuscles = (e: any): string[] => {
    if (Array.isArray(e.muscleGroups)) return e.muscleGroups;

    if (typeof e.muscleGroup === "string") return [e.muscleGroup];

    return [];
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Exercises</h1>

      {/* FORM */}
      <div className="bg-zinc-900 p-4 rounded-xl mb-4 space-y-3">
        {/* NAME */}
        <input
          placeholder="Exercise name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 bg-zinc-800 rounded"
        />

        {/* MUSCLE TAG INPUT */}
        <div className="bg-zinc-800 rounded p-2 flex flex-wrap gap-2 items-center">
          {form.muscleGroups.map((m) => (
            <span
              key={m}
              className="bg-zinc-700 px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {m}
              <button
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    muscleGroups: p.muscleGroups.filter((x) => x !== m),
                  }))
                }
                className="text-red-400 text-xs"
              >
                ✕
              </button>
            </span>
          ))}

          <input
            value={form.muscleInput}
            onChange={(e) =>
              setForm({
                ...form,
                muscleInput: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (
                e.key === "Backspace" &&
                !form.muscleInput &&
                form.muscleGroups.length
              ) {
                setForm((p) => ({
                  ...p,
                  muscleGroups: p.muscleGroups.slice(0, -1),
                }));
              }

              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addMuscleFromInput();
              }
            }}
            placeholder={form.muscleGroups.length ? "" : "Add muscle groups..."}
            className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
          />
        </div>

        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="exercise">Exercise</option>
          <option value="warmup">Warmup</option>
          <option value="stretch">Stretch</option>
        </select>

        {/* SAVE */}
        <button onClick={save} className="bg-green-600 w-full p-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      {list.map((e) => {
        const muscles = normalizeMuscles(e);

        return (
          <div
            key={e._id}
            className="bg-zinc-900 p-3 rounded-xl mb-2 flex justify-between"
          >
            <div>
              <p className="font-semibold">{e.name}</p>
              <p className="text-xs text-zinc-400">
                {muscles.join(", ")} · {e.type}
              </p>
            </div>

            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditingId(e._id);
                  setForm({
                    name: e.name,
                    muscleGroups: muscles,
                    muscleInput: "",
                    type: e.type,
                  });
                }}
                className="text-blue-400"
              >
                Edit
              </button>

              <button onClick={() => del(e._id)} className="text-red-500">
                Delete
              </button>
            </div>
          </div>
        );
      })}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Nav />
    </main>
  );
}
