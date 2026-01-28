import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";

export async function GET() {
  await connectDB();

  const plans = await Workout.find().populate(
    "workouts.exercise warmups.exercise stretches.exercise"
  );

  return Response.json(plans);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  return Response.json(await Workout.create(body));
}

export async function DELETE(req: Request) {
  await connectDB();

  const { id } = await req.json();

  await Workout.findByIdAndDelete(id);

  return Response.json({ success: true });
}

export async function PATCH(req: Request) {
  await connectDB();

  const { id, ...updates } = await req.json();

  const updated = await Workout.findByIdAndUpdate(id, updates, {
    new: true,
  });

  return Response.json(updated);
}
