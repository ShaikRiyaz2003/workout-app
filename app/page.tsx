import Link from "next/link";
import { Dumbbell, TrendingUp, Flame, ListChecks } from "lucide-react";
import Nav from "@/components/Nav";
import WorkoutCalendar from "@/components/StreakCalender";

const cards = [
  { title: "Workouts", href: "/workouts", icon: Dumbbell },
  { title: "PRs", href: "/prs", icon: Flame },
  { title: "Exercises", href: "/exercises", icon: ListChecks },
  { title: "Progress", href: "/progress/all", icon: TrendingUp },
  { title: "Run Workout", href: "/run-workout", icon: Dumbbell },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">🏋️ Workout Tracker</h1>
      <WorkoutCalendar />

      <div className="grid grid-cols-2 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-4 h-36"
            >
              <Icon size={32} />
              <span className="font-semibold">{c.title}</span>
            </Link>
          );
        })}
      </div>

      <Nav />
    </main>
  );
}
