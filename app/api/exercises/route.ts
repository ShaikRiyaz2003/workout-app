import { connectDB } from "@/lib/mongodb";
import Exercise from "@/models/Exercise";

export async function GET() {
  await connectDB();
  return Response.json(await Exercise.find().sort({ createdAt: -1 }));
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  return Response.json(await Exercise.create(body));
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Exercise.findByIdAndDelete(id);
  return Response.json({ success: true });
}

export async function PATCH(req: Request) {
  await connectDB();

  const { id, ...updates } = await req.json();

  const updated = await Exercise.findByIdAndUpdate(id, updates, {
    new: true,
  });

  return Response.json(updated);
}
