"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, User, Building2 } from "lucide-react";
import { ActionCell } from "./action-cell";

export const getColumns = (onEdit: (cellule: any) => void): ColumnDef<any>[] => [
    {
        accessorKey: "name",
        header: "Cellule",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LayoutGrid className="h-4 w-4" />
                </div>
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "department.name",
        header: "Département",
        cell: ({ row }) => {
            const deptName = row.original.department?.name;
            return (
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="font-normal">
                        {deptName || "Aucun"}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "chef.name",
        header: "Chef de Cellule",
        cell: ({ row }) => {
            const chef = row.original.chef;
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{chef?.name || "Non assigné"}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell cellule={row.original} onEdit={onEdit} />,
    },
];