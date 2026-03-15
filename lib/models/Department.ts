import mongoose, { Schema, model, models } from "mongoose";

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    chef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = models.Department || model("Department", DepartmentSchema);