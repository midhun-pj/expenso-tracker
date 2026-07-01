import { Trash } from "lucide-react";
import type { ActionButtonProps } from "@models/common.model";

export const DeleteButton = ({  onClick}: ActionButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-md p-2 transition-colors hover:bg-red-50"
      style={{ color: "var(--color-error-600)" }}
      title="Delete"
    >
      <Trash size={16} />
    </button>
  );
};
