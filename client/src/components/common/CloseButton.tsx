import type { ActionButtonProps } from "@models/common.model";
import { X } from "lucide-react";

export const CloseButton = ({ onClick, title }: ActionButtonProps) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className="text-slate-400 hover:text-slate-600"
            title={title}
        >
            <X className="h-5 w-5" />
        </button>
    );
};
