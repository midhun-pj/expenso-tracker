type Header = {
    key: string;
    label: string;
};

type ListProps = {
    list: {
        headers: Header[];
        rows: any[];
    };
};

export const List = ({ list }: ListProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <table className="w-full text-left text-sm text-slate-600">

                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs">
                    <tr>
                        {list.headers.map((header) => (
                            <th key={header.key} className="px-4 md:px-6 py-4">
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                    {list.rows.map((row) => (
                        <tr key={row.id}>
                            {list.headers.map((header) => (
                                <td key={header.key} className="px-4 md:px-6 py-4">
                                    {row[header.key]}
                                </td>
                            ))}

                        </tr>
                    ))}

                </tbody>

            </table>
        </div>
    );
};