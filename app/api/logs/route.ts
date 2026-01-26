import { connectDB } from "@/lib/mongodb";
import Exercise from "@/models/Exercise";

export async function GET() {
  await connectDB();

  const exercises = await Exercise.find({}, { history: 1 });

  const map: Record<string, number> = {};

  exercises.forEach((e) =>
    e.history.forEach((h: any) => {
      const day = new Date(h.date)
        .toISOString()
        .split("T")[0];

      map[day] = (map[day] || 0) + 1;
    })
  );

  return Response.json(map);
}


export async function POST(req: Request) {
  await connectDB();

  const { exerciseId, sets } = await req.json();

  const exercise = await Exercise.findById(exerciseId);

  const maxWeight = Math.max(
    exercise.pr || 0,
    ...sets.map((s: any) => s.weight),
  );

  exercise.pr = maxWeight;

  const day = new Date().toISOString().split("T")[0];

  exercise.history.push({
    date: new Date(),
    day,
    sets,
  });

  await exercise.save();

  return Response.json(exercise);
}

export async function PUT(req: Request) {
  await connectDB();

  const { date } = await req.json(); // yyyy-mm-dd

  // Build UTC day range
  const start = new Date(date + "T00:00:00.000Z");
  const end = new Date(date + "T23:59:59.999Z");

  const exercises = await Exercise.find({
    history: {
      $elemMatch: {
        date: { $gte: start, $lte: end },
      },
    },
  });

  const results = exercises.map((e) => {
    const logs = e.history.filter(
      (h: any) =>
        h.date >= start && h.date <= end
    );

    return {
      name: e.name,
      muscleGroup: e.muscleGroup,
      sets: logs.flatMap((l: any) => l.sets),
    };
  });

  return Response.json(results);
}
