"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2, LayoutGrid } from "lucide-react";
import { getCellules } from "@/actions/cellule-actions";
import { getColumns } from "@/components/dashboard/cells/columns";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { CelluleDialog } from "@/components/dashboard/cells/cellule-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";

export default function CellsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCellule, setSelectedCellule] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["cellules"],
        queryFn: () => getCellules(),
    });

    const handleCreate = () => {
        setSelectedCellule(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (cellule: any) => {
        setSelectedCellule(cellule);
        setIsDialogOpen(true);
    };

    return (
        <DashboardContainer title="Gestion des Cellules">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutGrid className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Cellules</h2>
                            <p className="text-muted-foreground">
                                Gérez les unités de travail et leurs rattachements aux départements.
                            </p>
                        </div>
                    </div>

                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nouvelle cellule
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col h-100 items-center justify-center gap-4 border rounded-xl bg-muted/5">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Chargement des cellules...
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={getColumns(handleEdit)}
                        data={data || []}
                        searchKey="name"
                    />
                )}
            </div>

            <CelluleDialog
                open={isDialogOpen}
                setOpen={setIsDialogOpen}
                cellule={selectedCellule}
            />
        </DashboardContainer>
    );
}