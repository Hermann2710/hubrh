"use server";

import { Cellule } from "@/lib/models/Cellule";
import { Department } from "@/lib/models/Department";
import dbConnect from "@/lib/mongoose";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAccess() {
  const session = await auth();
  if (!session?.user) throw new Error("Non authentifié");

  const user = session.user as any;
  if (user.role === "admin") return { isAdmin: true, userId: user.id };

  const managedDepts = await Department.find({ chef: user.id }).select("_id");
  if (managedDepts.length > 0) {
    return { 
      isAdmin: false, 
      isChef: true, 
      userId: user.id, 
      deptIds: managedDepts.map(d => d._id.toString()) 
    };
  }

  throw new Error("Accès refusé");
}

export async function getCellules() {
  try {
    const access = await checkAccess();
    await dbConnect();

    let query = {};
    if (!access.isAdmin && access.isChef) {
      query = { department: { $in: access.deptIds } };
    }

    const cellules = await Cellule.find(query)
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
    const access = await checkAccess();
    await dbConnect();

    if (!access.isAdmin && access.isChef) {
      if (!access.deptIds.includes(values.department)) {
        return { error: "Vous ne pouvez créer une cellule que dans votre département" };
      }
    }

    await Cellule.create(values);
    revalidatePath("/dashboard/cellules");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCellule({ id, ...values }: any) {
  try {
    const access = await checkAccess();
    await dbConnect();

    const cellule = await Cellule.findById(id);
    if (!cellule) return { error: "Cellule introuvable" };

    if (!access.isAdmin && access.isChef) {
      if (!access.deptIds.includes(cellule.department.toString())) {
        return { error: "Accès non autorisé à cette cellule" };
      }
    }

    await Cellule.findByIdAndUpdate(id, values);
    revalidatePath("/dashboard/cellules");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCellule(id: string) {
  try {
    const access = await checkAccess();
    await dbConnect();

    const cellule = await Cellule.findById(id);
    if (!cellule) return { error: "Cellule introuvable" };

    if (!access.isAdmin && access.isChef) {
      if (!access.deptIds.includes(cellule.department.toString())) {
        return { error: "Accès non autorisé" };
      }
    }

    await Cellule.findByIdAndDelete(id);
    revalidatePath("/dashboard/cellules");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}