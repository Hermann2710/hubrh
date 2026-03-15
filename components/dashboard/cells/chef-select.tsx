"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvailableCellsUsers, getUserById } from "@/actions/user-actions";
import { UserSelect } from "@/components/shared/user-select";

interface CelluleChefSelectProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    currentChefId?: string;
}

export function CelluleChefSelect({
    value,
    onChange,
    disabled,
    currentChefId
}: CelluleChefSelectProps) {
    const { data: users, isLoading: isLoadingList } = useQuery({
        queryKey: ["available-chefs", currentChefId],
        queryFn: () => getAvailableCellsUsers(currentChefId),
    });

    const { data: selectedUser, isLoading: isLoadingUser } = useQuery({
        queryKey: ["user", value],
        queryFn: () => getUserById(value!),
        enabled: !!value,
    });

    return (
        <UserSelect
            value={value}
            onChange={onChange}
            disabled={disabled}
            users={users || []}
            selectedUser={selectedUser}
            isLoading={isLoadingList || (!!value && isLoadingUser)}
            placeholder="Sélectionner le chef de cellule..."
        />
    );
}