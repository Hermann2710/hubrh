"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Field,
    FieldContent,
    FieldLabel,
    FieldError
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoginInput, loginSchema } from "@/lib/schemas/auth-schema";

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema as any),
    });

    const onSubmit = async (values: LoginInput) => {
        setLoading(true);

        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (result?.error) {
            setLoading(false);
            toast.error("Erreur d'authentification", {
                description: "Email ou mot de passe incorrect.",
            });
        } else {
            toast.success("Connexion réussie", {
                description: "Bienvenue sur HubRH.",
            });
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                    <Input
                        {...register("email")}
                        placeholder="nom@exemple.com"
                        className={errors.email ? "border-destructive" : ""}
                    />
                </FieldContent>
                {errors.email && <FieldError className="text-xs">{errors.email.message}</FieldError>}
            </Field>

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

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Se connecter"}
            </Button>
        </form>
    );
}