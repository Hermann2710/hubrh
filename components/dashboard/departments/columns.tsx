"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Building2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "@/actions/department-actions";
import { toast } from "sonner";

export const getColumns = (onEdit: (dept: any) => void): ColumnDef<any>[] => [
    {
        accessorKey: "name",
        header: "Nom",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-medium">
                <Building2 className="h-4 w-4 text-primary" />
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "chef.name",
        header: "Chef de Département",
        cell: ({ row }) => row.original.chef?.name || "Non assigné",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell department={row.original} onEdit={onEdit} />,
    },
];

function ActionCell({
    department,
    onEdit
}: {
    department: any;
    onEdit: (dept: any) => void
}) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: handleSafeDelete, isPending } = useMutation({
        mutationFn: () => deleteDepartment(department._id),
        onSuccess: (data) => {
            if (data.error) return toast.error(data.error);
            toast.success("Département supprimé");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            setShowDeleteAlert(false);
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onSelect={() => onEdit(department)}
                    >
                        <Pencil className="h-4 w-4" /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        <Trash2 className="h-4 w-4" /> Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Cela supprimera le département
                            <span className="font-semibold text-foreground ml-1">{department.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleSafeDelete();
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                        >
                            {isPending ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}