import type { FC } from 'react';

import type { SummaryCardProps } from "@models/dashboard.model";

export const SummaryCard: FC<SummaryCardProps> = ({
    title,
    value,
    badge,
    badgeColor = 'green',
    icon,
    children,
}) => {
    const badgeClasses =
        badgeColor === 'green'
            ? 'text-green-600 bg-green-50'
            : 'text-red-600 bg-red-50';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                {badge && (
                    <span
                        className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full mt-2 ${badgeClasses}`}
                    >
                        {badge}
                    </span>
                )}
                {children}
            </div>
            {icon}
        </div>
    );
};
