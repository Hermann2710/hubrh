"use server";

import { User } from "@/lib/models/User";
import { Department } from "@/lib/models/Department";
import { Cellule } from "@/lib/models/Cellule";
import dbConnect from "@/lib/mongoose";

export async function getUserById(id: string) {
  try {
    await dbConnect();

    const user = await User.findById(id, "-password")
      .lean();

    if (!user) {
      return { error: "Utilisateur non trouvé" };
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return { error: "Une erreur est survenue lors de la récupération de l'utilisateur" };
  }
}

export async function getAvailableDepartmentUsers() {
  try {
    await dbConnect();

    const [departments, cellules] = await Promise.all([
      Department.find({}, "chef").lean(),
      Cellule.find({}, "chef members").lean()
    ]);

    const chefDeptIds = departments
      .map(d => d.chef?.toString())
      .filter(Boolean);

    const assignedCelluleUserIds = cellules.flatMap(c => [
      c.chef?.toString(),
      ...(c.members?.map((m: any) => m.toString()) || [])
    ]).filter(Boolean);

    const excludedUserIds = Array.from(new Set([...chefDeptIds, ...assignedCelluleUserIds]));

    const users = await User.find(
      { _id: { $nin: excludedUserIds } },
      "name email image _id"
    )
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
}