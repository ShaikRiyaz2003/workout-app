"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/prs", label: "PRs" },
  { href: "/exercises", label: "Exercises" },
  { href: "/workouts", label: "Workouts" },
];

export default function Nav() {
  return (
    <nav className="fixed bottom-0 w-full bg-black text-white flex justify-around p-3">
      {links.map((l) => (
        <Link key={l.href} href={l.href}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
