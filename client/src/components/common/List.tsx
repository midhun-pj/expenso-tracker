type Header = {
    key: string;
    label: string;
};

type ListProps = {
    list: {
        headers: Header[];
        rows: any[];
    };
    title?: string;
};

// Rotating accent colors for row indicators
const ROW_COLORS = [
    'var(--color-primary-500)',
    'var(--color-success-500)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
    'var(--color-info-500)',
];

export const List = ({ list, title }: ListProps) => {
    return (
        <div className="rounded-2xl shadow-sm border overflow-hidden flex flex-col"
            style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--color-border)',
            }}
        >
            {/* Colorful gradient header bar */}
            <div
                className="h-1.5"
                style={{
                    background: `linear-gradient(90deg, var(--color-primary-500), var(--color-chart-2), var(--color-chart-3), var(--color-chart-4), var(--color-chart-5))`,
                }}
            />

            {title && (
                <div className="px-4 md:px-6 pt-4 pb-2">
                    <h3 className="text-base font-bold tracking-tight"
                        style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h3>
                </div>
            )}

            <table className="w-full text-left text-sm">
                <thead>
                    <tr
                        style={{
                            background: 'var(--color-primary-50)',
                        }}
                    >
                        {/* Empty th for the color indicator column */}
                        <th className="w-1" />
                        {list.headers.map((header) => (
                            <th
                                key={header.key}
                                className="px-4 md:px-6 py-3.5 uppercase tracking-wider font-semibold text-xs"
                                style={{ color: 'var(--color-primary-700)' }}
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {list.rows.map((row, index) => {
                        const accentColor = ROW_COLORS[index % ROW_COLORS.length];
                        return (
                            <tr
                                key={row.id}
                                className="transition-colors duration-150 group"
                                style={{
                                    borderBottom: '1px solid var(--color-border)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-neutral-50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {/* Color indicator bar */}
                                <td className="w-1 p-0">
                                    <div
                                        className="w-1 h-full min-h-[48px] rounded-r-full"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                </td>

                                {list.headers.map((header) => (
                                    <td
                                        key={header.key}
                                        className="px-4 md:px-6 py-4 font-medium"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {row[header.key]}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}

                    {list.rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={list.headers.length + 1}
                                className="px-6 py-10 text-center text-sm"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                No data to display
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};