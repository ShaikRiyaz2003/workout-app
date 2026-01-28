import { Schema, model, models } from "mongoose";

/**
 * Ordered exercise block
 */
const OrderedExerciseSchema = new Schema(
  {
    exercise: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const WorkoutSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    warmups: {
      type: [OrderedExerciseSchema],
      default: [],
    },

    workouts: {
      type: [OrderedExerciseSchema],
      default: [],
    },

    stretches: {
      type: [OrderedExerciseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default models.Workout ||
  model("Workout", WorkoutSchema);
