import { Schema, model, models } from "mongoose";

const WorkoutSchema = new Schema({
  name: String,
  warmups: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  workouts: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  stretches: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
});

export default models.Workout || model("Workout", WorkoutSchema);
