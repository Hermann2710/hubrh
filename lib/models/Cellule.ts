import mongoose, { Schema, model, models } from "mongoose";

const CelluleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    chef: { type: Schema.Types.ObjectId, ref: "User", default: null },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Cellule = models.Cellule || model("Cellule", CelluleSchema);