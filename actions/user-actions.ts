"use server";

import { User } from "@/lib/models/User";
import { Department } from "@/lib/models/Department";
import { Cellule } from "@/lib/models/Cellule";
import dbConnect from "@/lib/mongoose";

export async function getUserById(id: string) {
  try {
    await dbConnect();

    const user = await User.findById(id, "-password").lean();

    if (!user) {
      return { error: "Utilisateur non trouvé" };
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return { error: "Une erreur est survenue" };
  }
}

export async function getAvailableDepartmentUsers(currentChefId?: string) {
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

    let excludedUserIds = Array.from(new Set([...chefDeptIds, ...assignedCelluleUserIds]));

    if (currentChefId) {
      excludedUserIds = excludedUserIds.filter(id => id !== currentChefId);
    }

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

export async function getAvailableChefUsers(currentChefId?: string) {
  try {
    await dbConnect();

    const deptChefs = await Department.find({ chef: { $exists: true } }).distinct("chef");
    const cellChefs = await Cellule.find({ chef: { $exists: true } }).distinct("chef");

    let excludedIds = [...new Set([...deptChefs, ...cellChefs])].map(id => id.toString());

    if (currentChefId) {
      excludedIds = excludedIds.filter(id => id !== currentChefId);
    }

    const availableUsers = await User.find({
      _id: { $nin: excludedIds }
    }).select("name email").lean();

    return JSON.parse(JSON.stringify(availableUsers));
  } catch (error) {
    console.error("Erreur users disponibles:", error);
    return [];
  }
}