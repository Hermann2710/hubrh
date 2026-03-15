"use client";

import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { celluleSchema, CelluleInput } from "@/lib/schemas/cellule-schema";
import { createCellule, updateCellule } from "@/actions/cellule-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CelluleChefSelect } from "./chef-select";
import { DepartmentSelect } from "./department-select";
import { Field, FieldDescription, FieldError, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function CelluleDialog({ open, setOpen, cellule }: { open: boolean, setOpen: (o: boolean) => void, cellule?: any }) {
    const queryClient = useQueryClient();
    const isEditing = !!cellule;

    const methods = useForm<CelluleInput>({
        resolver: zodResolver(celluleSchema as any),
        defaultValues: { name: "", description: "", department: "", chef: "", members: [] },
    });

    const { register, handleSubmit, reset, control, watch, formState: { errors } } = methods;

    useEffect(() => {
        if (open) {
            reset({
                name: cellule?.name || "",
                description: cellule?.description || "",
                department: cellule?.department?._id || cellule?.department || "",
                chef: cellule?.chef?._id || cellule?.chef || "",
                members: cellule?.members || [],
            });
        }
    }, [cellule, open, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (values: CelluleInput) => isEditing ? updateCellule({ id: cellule._id, ...values }) : createCellule(values),
        onSuccess: (data) => {
            if (data.error) return toast.error(data.error);
            toast.success(isEditing ? "Cellule mise à jour" : "Cellule créée");
            queryClient.invalidateQueries({ queryKey: ["cellules"] });
            setOpen(false);
        },
        onError: () => toast.error("Une erreur est survenue")
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier" : "Ajouter"} une cellule</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Nom de la cellule</FieldLabel>
                                <Input {...register("name")} />
                                {errors.name && <FieldError>{errors.name.message}</FieldError>}
                            </Field>

                            <Field className="flex flex-col">
                                <FieldLabel>Département parent</FieldLabel>
                                <Controller
                                    control={control}
                                    name="department"
                                    render={({ field }) => (
                                        <DepartmentSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isPending}
                                        />
                                    )}
                                />
                                {errors.department && <FieldError>{errors.department.message}</FieldError>}
                            </Field>

                            <Field className="flex flex-col">
                                <FieldLabel>Chef de cellule</FieldLabel>
                                <Controller
                                    control={control}
                                    name="chef"
                                    render={({ field }) => (
                                        <CelluleChefSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isPending}
                                            currentChefId={cellule?.chef?._id}
                                        />
                                    )}
                                />
                                {errors.chef && <FieldError>{errors.chef.message}</FieldError>}
                            </Field>

                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Textarea {...register("description")} className="resize-none" />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Enregistrer" : "Créer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}