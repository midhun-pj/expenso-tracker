import type { ReactNode } from "react";

export type Header<T> = {
  key: keyof T;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type ListProps<T extends { id: string | number }> = {
  title?: string;

  data: T[];

  headers: Header<T>[];

  renderActions?: (row: T) => ReactNode;

  onRowClick?: (row: T) => void;

  emptyMessage?: string;
};

function List<T extends { id: string | number }>({
  title,
  data,
  headers,
  renderActions,
  onRowClick,
  emptyMessage = "No data available",
}: ListProps<T>) {
  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-sm"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--color-border)",
      }}
    >

      {title && (
        <div className="border-b px-6 py-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr
            style={{
              background: "var(--color-primary-50)",
            }}
          >

            {headers.map((header) => (
              <th
                key={String(header.key)}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                style={{
                  width: header.width,
                  color: "var(--color-primary-700)",
                  textAlign: header.align ?? "left",
                }}
              >
                {header.label}
              </th>
            ))}

            {renderActions && (
              <th
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-center"
                style={{
                  color: "var(--color-primary-700)",
                  width: "120px",
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={headers.length + (renderActions ? 2 : 1)}
                className="py-12 text-center text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {data.map((row) => {

            return (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`
                  group
                  border-b
                  transition-colors
                  duration-200
                  hover:bg-neutral-50
                  ${onRowClick ? "cursor-pointer" : ""}
                `}
                style={{
                  borderColor: "var(--color-border)",
                }}
              >

                {headers.map((header) => (
                  <td
                    key={String(header.key)}
                    className="px-6 py-4"
                    style={{
                      textAlign: header.align ?? "left",
                      color: "var(--text-primary)",
                    }}
                  >
                    {header.render
                      ? header.render(row[header.key], row)
                      : String(row[header.key] ?? "")}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default List;