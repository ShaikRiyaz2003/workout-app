"use client";

import { useEffect, useMemo, useState } from "react";

type DayMap = Record<string, number>;

type DayDetail = {
  name: string;
  muscleGroups: string[];
  sets: { weight: number; reps: number }[];
};

function iso(d: Date) {
  return d.toISOString().split("T")[0];
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function endOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0);
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setDate(x.getDate() - x.getDay());
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function StreakCalendar() {
  const [days, setDays] = useState<DayMap>({});

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [selectedDay, setSelectedDay] =
    useState<string | null>(null);

  const [details, setDetails] = useState<DayDetail[]>(
    []
  );

  const [minPerWeek, setMinPerWeek] = useState(3);

  // ----------------------------
  // LOAD SUMMARY MAP
  // ----------------------------
  useEffect(() => {
    fetch("/api/logs", { cache: "no-store" })
      .then((r) => r.json())
      .then(setDays);
  }, []);

  // ----------------------------
  // MONTH GRID
  // ----------------------------
  const daysInMonth = useMemo(() => {
    const first = startOfMonth(year, month);

    const gridStart = startOfWeek(first);

    const cells: string[] = [];

    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      cells.push(iso(d));
    }

    return cells;
  }, [year, month]);

  // ----------------------------
  // STREAK
  // ----------------------------
  const streak = useMemo(() => {
    const weeks: string[][] = [];

    for (let i = 0; i < daysInMonth.length; i += 7) {
      weeks.push(daysInMonth.slice(i, i + 7));
    }

    let countWeeks = 0;

    [...weeks]
      .reverse()
      .every((week) => {
        const count = week.filter((d) => days[d]).length;

        if (count >= minPerWeek) {
          countWeeks++;
          return true;
        }
        return false;
      });

    return countWeeks;
  }, [daysInMonth, days, minPerWeek]);

  // ----------------------------
  // COLOR SCALE
  // ----------------------------
  const color = (n: number) => {
    if (!n) return "bg-zinc-800";
    if (n === 1) return "bg-green-700";
    if (n === 2) return "bg-green-600";
    return "bg-green-500";
  };

  // ----------------------------
  // DAY CLICK
  // ----------------------------
  const openDay = async (d: string) => {
    setSelectedDay(d);

    const r = await fetch("/api/logs", {
      method: "PUT",
      body: JSON.stringify({ date: d }),
    });

    const data = await r.json();

    setDetails(
      data.map((x: any) => ({
        name: x.name,
        muscleGroups:
          x.muscleGroups ||
          (x.muscleGroup
            ? [x.muscleGroup]
            : []),
        sets: x.sets || [],
      }))
    );
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const monthLabel = new Date(year, month).toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    }
  );

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <>
      {/* CARD */}
      <div className="bg-zinc-900 p-4 rounded-2xl mb-5 max-w-sm mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={prevMonth}
            className="px-2 text-lg"
          >
            ◀
          </button>

          <h2 className="font-semibold text-sm">
            {monthLabel}
          </h2>

          <button
            onClick={nextMonth}
            className="px-2 text-lg"
          >
            ▶
          </button>
        </div>

        {/* STREAK */}
        <div className="flex justify-between items-center mb-3 text-xs">
          <span className="text-orange-400 font-bold">
            🔥 {streak} week streak
          </span>

          <div className="flex items-center gap-1">
            <span>Min/wk</span>
            <input
              type="number"
              min={1}
              max={7}
              value={minPerWeek}
              onChange={(e) =>
                setMinPerWeek(+e.target.value)
              }
              className="w-12 bg-zinc-800 rounded px-1 py-0.5"
            />
          </div>
        </div>

        {/* WEEKDAYS */}
        <div className="grid grid-cols-7 text-[10px] mb-1 text-zinc-400">
          {["S", "M", "T", "W", "T", "F", "S"].map(
            (d) => (
              <div
                key={d}
                className="text-center"
              >
                {d}
              </div>
            )
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((d) => {
            const dayNum = new Date(d).getDate();
            const isCurrentMonth =
              new Date(d).getMonth() === month;

            return (
              <button
                key={d}
                title={d}
                onClick={() => openDay(d)}
                className={`h-7 rounded-md flex items-center justify-center text-[10px] font-semibold ${
                  isCurrentMonth
                    ? color(days[d] || 0)
                    : "bg-zinc-900 text-zinc-500"
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 w-[90%] max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">
                Workout on {selectedDay}
              </h3>

              <button
                onClick={() => setSelectedDay(null)}
                className="text-zinc-400"
              >
                ✕
              </button>
            </div>

            {details.length === 0 && (
              <p className="text-zinc-400">
                No workout logged.
              </p>
            )}

            {details.map((e, i) => (
              <div
                key={i}
                className="border-b border-zinc-800 pb-3 mb-3"
              >
                <p className="font-semibold">
                  {e.name}
                </p>

                {e.muscleGroups.length > 0 && (
                  <p className="text-xs text-zinc-400">
                    {e.muscleGroups.join(", ")}
                  </p>
                )}

                <div className="mt-2 text-sm">
                  {e.sets.map((s, idx) => (
                    <div key={idx}>
                      {s.weight} × {s.reps}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
