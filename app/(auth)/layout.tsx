import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-2">
            {/* Côté Gauche : Formulaire et Liens */}
            <div className="flex flex-col p-8 lg:p-12 bg-background">
                <div className="flex w-full items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
                    >
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span>HubRH</span>
                    </Link>

                    <nav className="flex gap-4 text-sm text-muted-foreground">
                        <Link href="/help" className="hover:underline">Besoin d'aide ?</Link>
                    </nav>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-100 space-y-6">
                        {children}
                    </div>
                </div>

                <div className="text-center lg:text-left">
                    <p className="text-xs text-muted-foreground">
                        &copy; 2026 HubRH - Système de Gestion des Ressources Humaines.
                        Développement interne.
                    </p>
                </div>
            </div>

            {/* Côté Droit : Image et Contenu visuel */}
            <div className="relative hidden lg:block bg-muted">
                {/* Tu peux remplacer cette URL par ton image locale dans /public */}
                <Image
                    src="/auth-bg.jpg"
                    alt="Bureaux HubRH"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Overlay pour le texte sur l'image */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Bienvenue sur votre portail RH intelligent.
                        </h2>
                        <p className="text-lg text-white/80">
                            Gérez vos départements, suivez vos effectifs et simplifiez vos processus administratifs en quelques clics.
                        </p>
                        <div className="pt-4">
                            <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                                Version 2.0.1 - Beta
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}