import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

export type ResponsiveTableColumn<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  /**
   * Papel da coluna no card mobile: "title" (destaque principal, 1 por tabela),
   * "subtitle" (ao lado do título, ex: um badge de status), "meta" (linha
   * label/valor no corpo do card) ou "hide" (omitida no mobile). Padrão: "meta".
   */
  mobile?: "title" | "subtitle" | "meta" | "hide";
};

export function ResponsiveTable<T>({
  data,
  keyField,
  columns,
  onRowClick,
}: {
  data: T[];
  keyField: (row: T) => string;
  columns: ResponsiveTableColumn<T>[];
  onRowClick?: (row: T) => void;
}) {
  const titleColumn = columns.find((c) => c.mobile === "title") ?? columns[0];
  const subtitleColumn = columns.find((c) => c.mobile === "subtitle");
  const metaColumns = columns.filter(
    (c) =>
      c !== titleColumn && c !== subtitleColumn && c.mobile !== "hide",
  );

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-text-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-2 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyField(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-t border-border",
                  onRowClick && "cursor-pointer hover:bg-surface-2",
                )}
              >
                {columns.map((column) => (
                  <td key={column.header} className="px-4 py-2.5">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        {data.map((row) => (
          <div
            key={keyField(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={
              onRowClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }
                : undefined
            }
            className={cn(
              "rounded-xl border border-border bg-surface p-4",
              onRowClick &&
                "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-surface-2",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-text">
                {titleColumn.cell(row)}
              </div>
              {subtitleColumn && (
                <div className="shrink-0">{subtitleColumn.cell(row)}</div>
              )}
            </div>

            {metaColumns.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {metaColumns.map((column) => (
                  <div
                    key={column.header}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-xs text-text-muted">
                      {column.header}
                    </span>
                    <span className="text-sm">{column.cell(row)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
