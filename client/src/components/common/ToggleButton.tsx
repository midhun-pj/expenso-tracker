import type { ToggleButtonProps } from "@models/common.model";

export default function ToggleButton({ onChange, label, isActive }: ToggleButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onChange()}
            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isActive
                ? "bg-blue-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
        >
            {label}
        </button>
    );
}