import { Schema, model, models } from "mongoose";

const SetSchema = new Schema(
  {
    weight: Number,
    reps: Number,
  },
  { _id: false }
);

const HistorySchema = new Schema(
  {
    date: Date,
    sets: [SetSchema],
  },
  { _id: false }
);

const ExerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    muscleGroups: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one muscle group required",
      },
    },

    type: {
      type: String,
      enum: ["exercise", "warmup", "stretch"],
      required: true,
    },

    pr: {
      type: Number,
      default: 0,
    },

    history: {
      type: [HistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default models.Exercise ||
  model("Exercise", ExerciseSchema);
