"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2, Building2 } from "lucide-react";
import { getDepartments } from "@/actions/department-actions";
import { getColumns } from "@/components/dashboard/departments/columns";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DepartmentDialog } from "@/components/dashboard/departments/department-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";

export default function StructurePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["departments"],
        queryFn: () => getDepartments(),
    });

    const handleCreate = () => {
        setSelectedDepartment(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (department: any) => {
        setSelectedDepartment(department);
        setIsDialogOpen(true);
    };

    return (
        <DashboardContainer title="Gestion de la Structure">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Départements</h2>
                            <p className="text-muted-foreground">
                                Gérez les unités organisationnelles et leurs responsables.
                            </p>
                        </div>
                    </div>

                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nouveau département
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col h-100 items-center justify-center gap-4 border rounded-xl bg-muted/5">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Chargement des départements...
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

            <DepartmentDialog
                open={isDialogOpen}
                setOpen={setIsDialogOpen}
                department={selectedDepartment}
            />
        </DashboardContainer>
    );
}