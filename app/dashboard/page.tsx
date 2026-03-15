import { DashboardContainer } from "@/components/dashboard/dashboard-container";

export default function DashboardPage() {
    return (
        <DashboardContainer title="Vue d'ensemble">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="h-[120px] rounded-xl bg-muted/50" />
                <div className="h-[120px] rounded-xl bg-muted/50" />
                <div className="h-[120px] rounded-xl bg-muted/50" />
                <div className="h-[120px] rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </DashboardContainer>
    );
}