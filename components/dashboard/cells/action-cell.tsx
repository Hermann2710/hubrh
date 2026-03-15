"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCellule } from "@/actions/cellule-actions";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionCellProps {
    cellule: any;
    onEdit: (cellule: any) => void;
}

export function ActionCell({ cellule, onEdit }: ActionCellProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate: server_deleteCellule, isPending } = useMutation({
        mutationFn: () => deleteCellule(cellule._id),
        onSuccess: (data) => {
            if (data.error) return toast.error(data.error);
            toast.success("Cellule supprimée");
            queryClient.invalidateQueries({ queryKey: ["cellules"] });
        },
        onError: () => toast.error("Une erreur est survenue")
    });

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(cellule)}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => server_deleteCellule()}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}