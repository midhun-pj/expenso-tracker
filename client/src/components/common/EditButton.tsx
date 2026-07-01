import { Pencil } from "lucide-react";
import type { ActionButtonProps } from "@models/common.model";

export const EditButton = ({ onClick }: ActionButtonProps) => {
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-md p-2 transition-colors hover:bg-green-50"
      style={{ color: "var(--color-success-600)" }}
    >
      <Pencil size={16} />
    </button>
  );
};
