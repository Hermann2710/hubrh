"use client";

import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { departmentSchema, DepartmentInput } from "@/lib/schemas/department-schema";
import { createDepartment, updateDepartment } from "@/actions/department-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChefSelect } from "./chef-select";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldGroup,
} from "@/components/ui/field";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface DepartmentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    department?: any;
}

export function DepartmentDialog({ open, setOpen, department }: DepartmentDialogProps) {
    const queryClient = useQueryClient();
    const isEditing = !!department;

    const methods = useForm<DepartmentInput>({
        resolver: zodResolver(departmentSchema as any),
        defaultValues: { name: "", description: "", chef: "" },
    });

    const { register, handleSubmit, reset, control, formState: { errors } } = methods;

    useEffect(() => {
        if (open) {
            reset({
                name: department?.name || "",
                description: department?.description || "",
                chef: department?.chef?._id || department?.chef || "",
            });
        }
    }, [department, open, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (values: DepartmentInput) =>
            isEditing
                ? updateDepartment({ id: department._id, ...values })
                : createDepartment(values),
        onSuccess: (data) => {
            if (data.error) return toast.error(data.error);
            toast.success(isEditing ? "Mis à jour" : "Créé");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            setOpen(false);
        },
        onError: () => toast.error("Une erreur est survenue")
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Modifier le département" : "Ajouter un département"}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Nom</FieldLabel>
                                <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                                {errors.name && <FieldError>{errors.name.message}</FieldError>}
                            </Field>

                            <Field className="flex flex-col">
                                <FieldLabel>Chef de département</FieldLabel>
                                <Controller
                                    control={control}
                                    name="chef"
                                    render={({ field }) => (
                                        <ChefSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isPending}
                                            currentChefId={department?.chef?._id}
                                        />
                                    )}
                                />
                                <FieldDescription>Responsable hiérarchique.</FieldDescription>
                                {errors.chef && <FieldError>{errors.chef.message}</FieldError>}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea id="description" className="resize-none" {...register("description")} />
                                {errors.description && <FieldError>{errors.description.message}</FieldError>}
                            </Field>
                        </FieldGroup>

                        <DialogFooter className="gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                                Annuler
                            </Button>
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