import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long"),
  description: z
    .string()
    .max(200, "La description ne doit pas dépasser 200 caractères")
    .optional()
    .or(z.literal("")),
  chef: z
    .string()
    .min(1, "Veuillez sélectionner un chef de département")
    .optional()
    .or(z.literal("")),
});

export const updateDepartmentSchema = departmentSchema.partial().extend({
  id: z.string().min(1, "L'identifiant est requis"),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;