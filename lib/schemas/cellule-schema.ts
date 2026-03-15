import * as z from "zod";

export const celluleSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  description: z.string().optional(),
  department: z.string().min(1, "Le département est requis"),
  chef: z.string().min(1, "Le chef de cellule est requis"),
  members: z.preprocess((val) => {
    if (!Array.isArray(val)) return [];
    return val.map((item) => (typeof item === "object" && item?._id ? item._id : item));
  }, z.array(z.string()).default([])),
});

export type CelluleInput = z.infer<typeof celluleSchema>;