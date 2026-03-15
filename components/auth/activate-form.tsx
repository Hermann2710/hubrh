"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { activateAccountSchema, ActivateAccountInput } from "@/lib/schemas/auth-schema";

import {
    Field,
    FieldContent,
    FieldLabel,
    FieldError
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ActivateForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<ActivateAccountInput>({
        resolver: zodResolver(activateAccountSchema as any),
    });

    const onSubmit = async (values: ActivateAccountInput) => {
        setLoading(true);
        try {
            console.log(values);
            toast.success("Compte activé");
            router.push("/login");
        } catch (error) {
            toast.error("Erreur d'activation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
                <FieldLabel>Matricule</FieldLabel>
                <FieldContent>
                    <Input
                        {...register("matricule")}
                        placeholder="Matricule employé"
                        className={errors.matricule ? "border-destructive" : ""}
                    />
                </FieldContent>
                {errors.matricule && <FieldError className="text-xs">{errors.matricule.message}</FieldError>}
            </Field>

            <Field>
                <FieldLabel>Email professionnel</FieldLabel>
                <FieldContent>
                    <Input
                        {...register("email")}
                        placeholder="nom@exemple.com"
                        className={errors.email ? "border-destructive" : ""}
                    />
                </FieldContent>
                {errors.email && <FieldError className="text-xs">{errors.email.message}</FieldError>}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                    <FieldLabel>Mot de passe</FieldLabel>
                    <FieldContent>
                        <Input
                            {...register("password")}
                            type="password"
                            className={errors.password ? "border-destructive" : ""}
                        />
                    </FieldContent>
                    {errors.password && <FieldError className="text-xs">{errors.password.message}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel>Confirmation</FieldLabel>
                    <FieldContent>
                        <Input
                            {...register("confirmPassword")}
                            type="password"
                            className={errors.confirmPassword ? "border-destructive" : ""}
                        />
                    </FieldContent>
                    {errors.confirmPassword && <FieldError className="text-xs">{errors.confirmPassword.message}</FieldError>}
                </Field>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Activer mon compte"}
            </Button>
        </form>
    );
}