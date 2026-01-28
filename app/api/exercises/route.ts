import { connectDB } from "@/lib/mongodb";
import Exercise from "@/models/Exercise";

export async function GET() {
  await connectDB();

  const data = await Exercise.find().sort({
    createdAt: -1,
  });

  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  if (
    !body.name ||
    !body.type ||
    !Array.isArray(body.muscleGroups) ||
    body.muscleGroups.length === 0
  ) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const name = body.name.trim();

  // 🔍 case-insensitive search
  const existing = await Exercise.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  let result;

  if (existing) {
    // ✅ update instead of create
    result = await Exercise.findByIdAndUpdate(
      existing._id,
      {
        name,
        muscleGroups: body.muscleGroups,
        type: body.type,
      },
      { new: true, runValidators: true }
    );
  } else {
    // 🆕 create
    result = await Exercise.create({
      name,
      muscleGroups: body.muscleGroups,
      type: body.type,
    });
  }

  return Response.json(result);
}


export async function PATCH(req: Request) {
  await connectDB();
  const body = await req.json();

  if (!body.id)
    return Response.json(
      { error: "Missing id" },
      { status: 400 }
    );
    console.log(body)
  const updated = await Exercise.findByIdAndUpdate(
    body.id,
    {
      name: body.name,
      muscleGroups: body.muscleGroups,
      type: body.type,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return Response.json(updated);
}

export async function DELETE(req: Request) {
  await connectDB();

  const { id } = await req.json();

  await Exercise.findByIdAndDelete(id);

  return Response.json({ success: true });
}
