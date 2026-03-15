import * as z from "zod";

export const celluleSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  description: z.string().optional(),
  department: z.string().min(1, "Le département est requis"),
  chef: z.string().min(1, "Le chef de cellule est requis"),
  members: z.array(z.string()).default([]),
});

export type CelluleInput = z.infer<typeof celluleSchema>;