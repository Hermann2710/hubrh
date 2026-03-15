import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col space-y-2 text-left">
                <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
                <p className="text-sm text-muted-foreground">
                    Entrez vos accès pour gérer vos départements HubRH.
                </p>
            </div>

            <LoginForm />

            <div className="text-center text-sm">
                Pas encore de compte ?{" "}
                <Link
                    href="/activate"
                    className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                    Créer un compte
                </Link>
            </div>
        </div>
    );
}