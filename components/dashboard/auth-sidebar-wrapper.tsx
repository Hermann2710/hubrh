import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export async function AuthSidebarWrapper() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <AppSidebar
            user={{
                name: session.user.name,
                email: session.user.email,
                role: session.user.role
            }}
        />
    );
}