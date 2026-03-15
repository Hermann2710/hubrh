"use server";

import { revalidatePath } from "next/cache";
import { Department } from "@/lib/models/Department";
import { departmentSchema, updateDepartmentSchema } from "@/lib/schemas/department-schema";
import dbConnect from "@/lib/mongoose";

export async function createDepartment(data: unknown) {
  try {
    await dbConnect();
    
    const result = departmentSchema.safeParse(data);
    if (!result.success) {
      return { error: "Données invalides" };
    }

    const { name, description, chef } = result.data;

    const existing = await Department.findOne({ name });
    if (existing) {
      return { error: "Un département avec ce nom existe déjà" };
    }

    await Department.create({
      name,
      description,
      chef: chef || null,
    });

    revalidatePath("/dashboard/structure");
    return { success: "Département créé avec succès" };
  } catch (error) {
    return { error: "Une erreur est survenue lors de la création" };
  }
}

export async function updateDepartment(data: unknown) {
  try {
    await dbConnect();

    const result = updateDepartmentSchema.safeParse(data);
    if (!result.success) {
      return { error: "Données invalides" };
    }

    const { id, ...updateData } = result.data;

    const updated = await Department.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return { error: "Département introuvable" };
    }

    revalidatePath("/dashboard/structure");
    return { success: "Département mis à jour" };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteDepartment(id: string) {
  try {
    await dbConnect();

    // Vérifier si des cellules sont rattachées (Règle de gestion n°2)
    // const hasCells = await Cell.exists({ department: id });
    // if (hasCells) return { error: "Impossible de supprimer : contient des cellules actives" };

    await Department.findByIdAndDelete(id);

    revalidatePath("/dashboard/structure");
    return { success: "Département supprimé" };
  } catch (error) {
    return { error: "Erreur lors de la suppression" };
  }
}

export async function getDepartments() {
  try {
    await dbConnect();
    const departments = await Department.find()
      .populate("chef", "name image email")
      .sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(departments));
  } catch (error) {
    return [];
  }
}