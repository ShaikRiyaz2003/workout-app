"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

type Unit = "kg" | "lb";
type SetEntry = { weight: number; reps: number };

export default function RunWorkoutPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [unit, setUnit] = useState<Unit>("kg");

  const [logs, setLogs] = useState<Record<string, SetEntry[]>>(
    {}
  );

  useEffect(() => {
    fetch("/api/workouts")
      .then((r) => r.json())
      .then(setWorkouts);
  }, []);

  const addSet = (id: string) => {
    setLogs((p) => ({
      ...p,
      [id]: [...(p[id] || []), { weight: 0, reps: 8 }],
    }));
  };

  const removeSet = (id: string, idx: number) => {
    setLogs((p) => {
      const arr = [...(p[id] || [])];
      arr.splice(idx, 1);
      return { ...p, [id]: arr };
    });
  };

  const updateSet = (
    id: string,
    idx: number,
    field: "weight" | "reps",
    value: number
  ) => {
    setLogs((p) => {
      const arr = [...(p[id] || [])];
      arr[idx][field] = value;
      return { ...p, [id]: arr };
    });
  };

  const submit = async () => {
    for (const id of Object.keys(logs)) {
      await fetch("/api/logs", {
        method: "POST",
        body: JSON.stringify({
          exerciseId: id,
          sets: logs[id],
        }),
      });
    }

    alert("Workout saved 💪🔥");

    setActive(null);
    setLogs({});
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white p-4 pb-40">
      <h1 className="text-2xl font-bold mb-3">
        🏃 Run Workout
      </h1>

      {/* UNIT TOGGLE */}
      <div className="flex gap-2 mb-4">
        {(["kg", "lb"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-4 py-1 rounded-full text-sm ${
              unit === u
                ? "bg-green-600"
                : "bg-zinc-800"
            }`}
          >
            {u.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PICK WORKOUT */}
      {!active && (
        <div className="space-y-3">
          {workouts.map((w) => (
            <button
              key={w._id}
              onClick={() => setActive(w)}
              className="w-full bg-zinc-900 p-5 rounded-2xl shadow-lg text-left"
            >
              <p className="font-semibold text-lg">
                {w.name}
              </p>
              <p className="text-xs text-zinc-400">
                {w.workouts.length} exercises
              </p>
            </button>
          ))}
        </div>
      )}

      {/* ACTIVE SESSION */}
      {active && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            {active.name}
          </h2>

          {active.workouts.map((e: any, exIdx: number) => {
            const history = e.history || [];
            const last =
              history.length > 0
                ? history[history.length - 1].sets.reduce(
                    (a: any, b: any) =>
                      b.weight > a.weight ? b : a,
                    { weight: 0, reps: 0 }
                  )
                : null;

            return (
              <div
                key={e._id}
                className="bg-zinc-900 rounded-2xl p-4 shadow-md"
              >
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold text-lg">
                    {exIdx + 1}. {e.name}
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {e.muscleGroup}
                  </span>
                </div>

                {/* PR + LAST */}
                <div className="flex gap-4 text-xs mb-3">
                  <span className="text-orange-400">
                    PR: {e.pr || 0}kg
                  </span>
                  {last && (
                    <span className="text-blue-400">
                      Last: {last.weight}×{last.reps}
                    </span>
                  )}
                </div>

                {(logs[e._id] || []).map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 mb-2"
                  >
                    <span className="text-xs text-zinc-400 w-12">
                      Set {i + 1}
                    </span>

                    <input
                      type="number"
                      className="flex-1 bg-zinc-800 p-2 rounded-xl text-center"
                      value={s.weight}
                      onChange={(x) =>
                        updateSet(
                          e._id,
                          i,
                          "weight",
                          +x.target.value
                        )
                      }
                    />

                    <span className="text-sm text-zinc-400">
                      {unit}
                    </span>

                    <input
                      type="number"
                      className="w-20 bg-zinc-800 p-2 rounded-xl text-center"
                      value={s.reps}
                      onChange={(x) =>
                        updateSet(
                          e._id,
                          i,
                          "reps",
                          +x.target.value
                        )
                      }
                    />

                    <button
                      onClick={() =>
                        removeSet(e._id, i)
                      }
                      className="text-red-500 text-lg px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addSet(e._id)}
                  className="mt-1 text-sm text-green-400"
                >
                  ➕ Add set
                </button>
              </div>
            );
          })}

          {/* BOTTOM ACTION BAR */}
          <div className="fixed bottom-16 left-0 right-0 bg-black/90 backdrop-blur p-4 border-t border-zinc-800">
            <button
              onClick={submit}
              className="bg-green-600 p-3 rounded-2xl w-full font-semibold text-lg"
            >
              Finish Workout
            </button>

            <button
              onClick={() => setActive(null)}
              className="mt-2 w-full text-sm text-zinc-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Nav />
    </main>
  );
}
