"use server";

import { Cellule } from "@/lib/models/Cellule";
import dbConnect from "@/lib/mongoose";
import { revalidatePath } from "next/cache";

export async function getCellules() {
  try {
    await dbConnect();
    const cellules = await Cellule.find({})
      .populate("department", "name")
      .populate("chef", "name email image")
      .populate("members", "name email")
      .lean();
    return JSON.parse(JSON.stringify(cellules));
  } catch (error) {
    return [];
  }
}

export async function createCellule(values: any) {
  try {
    await dbConnect();
    await Cellule.create(values);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCellule({ id, ...values }: any) {
  try {
    await dbConnect();
    await Cellule.findByIdAndUpdate(id, values);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCellule(id: string) {
  try {
    await dbConnect();
    await Cellule.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression" };
  }
}