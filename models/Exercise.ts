import { Schema, models, model } from "mongoose";

const SetSchema = new Schema({
  weight: Number,
  reps: Number,
});

const HistorySchema = new Schema({
  date: Date,
  day: String,
  sets: [SetSchema],
});


const ExerciseSchema = new Schema(
  {
    name: String,
    muscleGroup: String,
    type: {
      type: String,
      enum: ["exercise", "warmup", "stretch"],
    },
    pr: { type: Number, default: 0 },
    history: [HistorySchema],
  },
  { timestamps: true }
);

export default models.Exercise || model("Exercise", ExerciseSchema);
