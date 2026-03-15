"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getAvailableDepartmentUsers, getUserById } from "@/actions/user-actions";

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

interface ChefSelectProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function ChefSelect({ value, onChange, disabled }: ChefSelectProps) {
    const [open, setOpen] = useState(false);

    const { data: users, isLoading: isLoadingList } = useQuery({
        queryKey: ["available-dept-users"],
        queryFn: () => getAvailableDepartmentUsers(),
    });

    const { data: selectedUser, isLoading: isLoadingUser } = useQuery({
        queryKey: ["user", value],
        queryFn: () => getUserById(value!),
        enabled: !!value,
    });

    const isLoading = isLoadingList || (!!value && isLoadingUser);

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
                        selectedUser?.name || "Sélectionner un chef..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                        <CommandGroup>
                            {selectedUser && !users?.find((u: any) => u._id === selectedUser._id) && (
                                <CommandItem
                                    value={selectedUser.name}
                                    onSelect={() => {
                                        onChange(selectedUser._id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className="mr-2 h-4 w-4 opacity-100" />
                                    {selectedUser.name}
                                </CommandItem>
                            )}

                            {users?.map((user: any) => (
                                <CommandItem
                                    key={user._id}
                                    value={user.name}
                                    onSelect={() => {
                                        onChange(user._id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === user._id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}