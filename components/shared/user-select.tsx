"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface UserSelectProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    users: any[];
    selectedUser?: any;
    isLoading: boolean;
    placeholder?: string;
}

export function UserSelect({
    value,
    onChange,
    disabled,
    users,
    selectedUser,
    isLoading,
    placeholder = "Sélectionner un utilisateur..."
}: UserSelectProps) {
    const [open, setOpen] = useState(false);

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
                        selectedUser?.name || placeholder
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