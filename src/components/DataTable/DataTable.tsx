import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (next: RowSelectionState) => void;
  getRowId?: (row: TData, index: number) => string;
  renderToolbar?: (table: TanstackTable<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No results.",
  rowSelection,
  onRowSelectionChange,
  getRowId,
  renderToolbar,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: rowSelection ?? {},
      pagination: { pageIndex: 0, pageSize },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      if (!onRowSelectionChange) return;
      const next =
        typeof updater === "function"
          ? updater(rowSelection ?? {})
          : updater;
      onRowSelectionChange(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: !!onRowSelectionChange,
    getRowId,
  });

  return (
    <div className="space-y-3">
      {renderToolbar?.(table)}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
        <div className="text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </>
          ) : (
            <>{table.getFilteredRowModel().rows.length} row(s)</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground ml-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
