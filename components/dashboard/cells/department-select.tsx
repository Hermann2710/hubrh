"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getDepartments } from "@/actions/department-actions";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DepartmentSelectProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function DepartmentSelect({ value, onChange, disabled }: DepartmentSelectProps) {
    const [open, setOpen] = useState(false);

    const { data: departments, isLoading } = useQuery({
        queryKey: ["departments"],
        queryFn: () => getDepartments(),
    });

    const selectedDept = departments?.find((d: any) => d._id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled || isLoading}
                    className="w-full justify-between font-normal"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Chargement...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {selectedDept && <Building2 className="h-3.5 w-3.5 text-muted-foreground" />}
                            {selectedDept?.name || "Choisir un département..."}
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Rechercher un département..." />
                    <CommandList>
                        <CommandEmpty>Aucun département trouvé.</CommandEmpty>
                        <CommandGroup>
                            {departments?.map((dept: any) => (
                                <CommandItem
                                    key={dept._id}
                                    value={dept.name}
                                    onSelect={() => {
                                        onChange(dept._id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === dept._id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {dept.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}