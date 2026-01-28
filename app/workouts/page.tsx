"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

type Block = {
  exercise: string;
  name: string;
  order: number;
};

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const [name, setName] = useState("");

  const [warmups, setWarmups] = useState<Block[]>([]);
  const [workoutsList, setWorkoutsList] = useState<Block[]>(
    []
  );
  const [stretches, setStretches] = useState<Block[]>(
    []
  );

  // 🔍 muscle filters
  const [muscleFilter, setMuscleFilter] = useState<
    string[]
  >([]);
  const [muscleSearch, setMuscleSearch] = useState("");

  // ----------------------------
  // LOAD
  // ----------------------------
  const load = async () => {
    setPlans(await (await fetch("/api/workouts")).json());
    setExercises(
      await (await fetch("/api/exercises")).json()
    );
  };

  useEffect(() => {
    load();
  }, []);

  // ----------------------------
  // UNIQUE MUSCLES
  // ----------------------------
  const allMuscles = Array.from(
    new Set(
      exercises.flatMap(
        (e) => e.muscleGroups || []
      )
    )
  );

  // ----------------------------
  // FILTERED EXERCISES
  // ----------------------------
  const filteredExercises =
    muscleFilter.length === 0
      ? exercises
      : exercises.filter((e) =>
          e.muscleGroups?.some((m: string) =>
            muscleFilter.includes(m)
          )
        );

  // ----------------------------
  // FIND SECTION
  // ----------------------------
  const findSection = (id: string) => {
    if (warmups.find((x) => x.exercise === id))
      return "warmups";

    if (
      workoutsList.find((x) => x.exercise === id)
    )
      return "workouts";

    if (stretches.find((x) => x.exercise === id))
      return "stretches";

    return null;
  };

  // ----------------------------
  // REMOVE
  // ----------------------------
  const removeFromSection = (
    section: string,
    id: string
  ) => {
    if (section === "warmups")
      setWarmups((p) =>
        p.filter((x) => x.exercise !== id)
      );

    if (section === "workouts")
      setWorkoutsList((p) =>
        p.filter((x) => x.exercise !== id)
      );

    if (section === "stretches")
      setStretches((p) =>
        p.filter((x) => x.exercise !== id)
      );
  };

  // ----------------------------
  // ADD / TOGGLE BY TYPE
  // ----------------------------
  const addByType = (ex: any) => {
    const existing = findSection(ex._id);

    if (existing) {
      removeFromSection(existing, ex._id);
      return;
    }

    const section =
      ex.type === "warmup"
        ? "warmups"
        : ex.type === "stretch"
        ? "stretches"
        : "workouts";

    const map: any = {
      warmups,
      workouts: workoutsList,
      stretches,
    };

    const next = [
      ...map[section],
      {
        exercise: ex._id,
        name: ex.name,
        order: map[section].length + 1,
      },
    ];

    if (section === "warmups") setWarmups(next);
    if (section === "workouts")
      setWorkoutsList(next);
    if (section === "stretches")
      setStretches(next);
  };

  // ----------------------------
  // DRAG HANDLER
  // ----------------------------
  const reorder = (
    list: Block[],
    setList: Function,
    result: any
  ) => {
    if (!result.destination) return;

    const items = [...list];
    const [moved] = items.splice(
      result.source.index,
      1
    );
    items.splice(result.destination.index, 0, moved);

    setList(
      items.map((x, i) => ({
        ...x,
        order: i + 1,
      }))
    );
  };

  // ----------------------------
  // SAVE
  // ----------------------------
  const save = async () => {
    await fetch("/api/workouts", {
      method: editingId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        name,
        warmups,
        workouts: workoutsList,
        stretches,
      }),
    });

    setEditingId(null);
    setName("");
    setWarmups([]);
    setWorkoutsList([]);
    setStretches([]);
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/workouts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    load();
  };

  // ----------------------------
  // EDIT PLAN
  // ----------------------------
  const editPlan = (p: any) => {
    setEditingId(p._id);
    setName(p.name);

    setWarmups(
      [...p.warmups].sort((a, b) => a.order - b.order)
    );

    setWorkoutsList(
      [...p.workouts].sort(
        (a, b) => a.order - b.order
      )
    );

    setStretches(
      [...p.stretches].sort(
        (a, b) => a.order - b.order
      )
    );
  };

  // ----------------------------
  // RENDER SECTION
  // ----------------------------
  const renderSection = (
    title: string,
    color: string,
    items: Block[],
    setter: Function,
    key: string
  ) => (
    <div className={`mb-6 p-3 rounded-xl ${color}`}>
      <h2 className="font-semibold mb-3">{title}</h2>

      <Droppable droppableId={key}>
        {(prov) => (
          <div
            ref={prov.innerRef}
            {...prov.droppableProps}
            className="space-y-2"
          >
            {items.map((e, i) => (
              <Draggable
                key={e.exercise}
                draggableId={`${key}-${e.exercise}`}
                index={i}
              >
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className="bg-black/40 p-3 rounded-lg flex justify-between"
                  >
                    <span>
                      {i + 1}. {e.name}
                    </span>

                    <button
                      onClick={() =>
                        setter(
                          items.filter(
                            (_, idx) => idx !== i
                          )
                        )
                      }
                      className="text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {prov.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">
        Workout Builder
      </h1>

      {/* NAME */}
      <input
        placeholder="Workout name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 bg-zinc-800 rounded"
      />

      {/* 🔍 MUSCLE FILTER */}
      <div className="mb-4">
        <p className="text-sm mb-1">
          Filter by muscle:
        </p>

        <input
          placeholder="Search muscle..."
          value={muscleSearch}
          onChange={(e) => setMuscleSearch(e.target.value)}
          className="w-full mb-2 p-2 bg-zinc-800 rounded text-sm"
        />

        <div className="flex flex-wrap gap-2">
          {allMuscles
            .filter((m) =>
              m
                .toLowerCase()
                .includes(
                  muscleSearch.toLowerCase()
                )
            )
            .map((m) => (
              <button
                key={m}
                onClick={() =>
                  setMuscleFilter((p) =>
                    p.includes(m)
                      ? p.filter((x) => x !== m)
                      : [...p, m]
                  )
                }
                className={`px-3 py-1 rounded-full text-xs ${
                  muscleFilter.includes(m)
                    ? "bg-green-600"
                    : "bg-zinc-800"
                }`}
              >
                {m}
              </button>
            ))}
        </div>
      </div>

      {/* EXERCISE POOL */}
      <div className="mb-6">
        <p className="text-sm mb-2">    
          Add exercises:
        </p>

        <div className="flex flex-wrap gap-2 max-h-[33vh] overflow-y-auto pr-1">

          {filteredExercises.map((e) => {
            const section = findSection(e._id);

            return (
              <div
                key={e._id}
                className="bg-zinc-900 p-2 rounded-lg flex justify-between items-start w-fit min-w-[220px] max-w-[32%]"
              >
                <div>
                  <p className="text-sm font-medium">
                    {e.name}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {(e.muscleGroups || []).map(
                      (m: string) => (
                        <span
                          key={m}
                          className="bg-zinc-700 px-2 py-[2px] rounded text-[10px]"
                        >
                          {m}
                        </span>
                      )
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-400 mt-1">
                    {e.type}
                  </p>
                </div>

                <button
                  onClick={() => addByType(e)}
                  className={`text-xs px-3 py-1 rounded ${
                    section
                      ? "bg-red-600"
                      : "bg-purple-600"
                  }`}
                >
                  {section ? "Remove" : "➕ Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRAG ZONES */}
      <DragDropContext
        onDragEnd={(r) => {
          if (r.source.droppableId === "warmups")
            reorder(warmups, setWarmups, r);

          if (r.source.droppableId === "workouts")
            reorder(
              workoutsList,
              setWorkoutsList,
              r
            );

          if (r.source.droppableId === "stretches")
            reorder(
              stretches,
              setStretches,
              r
            );
        }}
      >
        {renderSection(
          "🔥 Warmups",
          "bg-orange-900/40",
          warmups,
          setWarmups,
          "warmups"
        )}

        {renderSection(
          "💪 Workouts",
          "bg-blue-900/40",
          workoutsList,
          setWorkoutsList,
          "workouts"
        )}

        {renderSection(
          "🧘 Stretches",
          "bg-green-900/40",
          stretches,
          setStretches,
          "stretches"
        )}
      </DragDropContext>

      {/* SAVE */}
      <button
        onClick={save}
        className="mt-6 w-full bg-purple-600 p-3 rounded-xl font-semibold"
      >
        {editingId ? "Update Plan" : "Save Plan"}
      </button>

      {/* EXISTING PLANS */}
      <div className="mt-8 space-y-2">
        {plans.map((p) => (
          <div
            key={p._id}
            className="bg-zinc-900 p-3 rounded-xl flex justify-between"
          >
            <span>{p.name}</span>

            <div className="space-x-3">
              <button
                onClick={() => editPlan(p)}
                className="text-blue-400"
              >
                Edit
              </button>

              <button
                onClick={() => del(p._id)}
                className="text-red-400"
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
