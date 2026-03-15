import { ActivateForm } from "@/components/auth/activate-form";
import Link from "next/link";

export default function ActivatePage() {
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col space-y-2 text-left">
                <h1 className="text-3xl font-bold tracking-tight">Activation</h1>
                <p className="text-sm text-muted-foreground">
                    Remplissez les informations pour activer votre compte.
                </p>
            </div>

            <ActivateForm />

            <div className="text-center text-sm">
                Déjà un compte ?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                    Se connecter
                </Link>
            </div>
        </div>
    );
}