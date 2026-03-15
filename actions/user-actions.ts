"use server";

import { User } from "@/lib/models/User";
import { Department } from "@/lib/models/Department";
import { Cellule } from "@/lib/models/Cellule";
import dbConnect from "@/lib/mongoose";
import { auth } from "@/auth";

async function checkAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Non authentifié");
  return session.user;
}

export async function getUserById(id: string) {
  try {
    await checkAuth();
    await dbConnect();
    const user = await User.findById(id, "-password").lean();
    if (!user) return { error: "Utilisateur non trouvé" };
    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getAvailableDepartmentUsers(currentChefId?: string) {
  try {
    await checkAuth();
    await dbConnect();

    const departments = await Department.find({}, "chef").lean();
    const chefDeptIds = departments.map(d => d.chef?.toString()).filter(Boolean);

    let excludedUserIds = [...new Set(chefDeptIds)];

    if (currentChefId) {
      excludedUserIds = excludedUserIds.filter(id => id !== currentChefId);
    }

    const users = await User.find(
      { _id: { $nin: excludedUserIds } },
      "name email image"
    ).sort({ name: 1 }).lean();

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
}

export async function getAvailableCellsUsers(currentChefId?: string) {
  try {
    await checkAuth();
    await dbConnect();

    const cellChefs = await Cellule.find({ chef: { $exists: true, $ne: null } }).distinct("chef");
    
    let excludedIds = cellChefs.map(id => id.toString());

    if (currentChefId) {
      excludedIds = excludedIds.filter(id => id !== currentChefId);
    }

    const availableUsers = await User.find({
      _id: { $nin: excludedIds }
    }).select("name email image").lean();

    return JSON.parse(JSON.stringify(availableUsers));
  } catch (error) {
    return [];
  }
}