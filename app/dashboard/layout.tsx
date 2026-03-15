import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarSkeleton } from "@/components/dashboard/sidebar-skeleton";
import { AuthSidebarWrapper } from "@/components/dashboard/auth-sidebar-wrapper";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Suspense fallback={<SidebarSkeleton />}>
                <AuthSidebarWrapper />
            </Suspense>
            {children}
        </SidebarProvider>
    );
}