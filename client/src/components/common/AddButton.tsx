import { Plus } from "lucide-react";
import type { AddButtonProps } from "@models/common.model";

export const AddButton = ({ onClick, label, mobileLabel, buttonClasses }: AddButtonProps) => {
    return (
        <button onClick={onClick} className={buttonClasses + " mr-5"}>
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{mobileLabel}</span>
        </button>
    );
};