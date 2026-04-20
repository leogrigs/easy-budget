import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: rowSelection ?? {},
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: (updater) => {
      if (!onRowSelectionChange) return;
      const next =
        typeof updater === "function" ? updater(rowSelection ?? {}) : updater;
      onRowSelectionChange(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: !!onRowSelectionChange,
    getRowId,
  });

  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const pageStart =
    filteredRowCount === 0
      ? 0
      : pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    filteredRowCount
  );
  const totalPages = Math.max(1, table.getPageCount());

  const paginationBar = (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="hidden sm:inline text-muted-foreground mr-1 tabular-nums">
        {pageStart}–{pageEnd} of {filteredRowCount}
      </span>
      <Select
        value={String(pagination.pageSize)}
        onValueChange={(v) => table.setPageSize(Number(v))}
      >
        <SelectTrigger
          className="h-8 w-[74px]"
          aria-label="Rows per page"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {[10, 25, 50, 100].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="hidden md:inline text-muted-foreground mx-1 tabular-nums">
        Page {pagination.pageIndex + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">{renderToolbar?.(table)}</div>
        <div className="shrink-0 self-start lg:self-auto">{paginationBar}</div>
      </div>
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

      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {filteredRowCount} row(s) selected
        </p>
      )}
    </div>
  );
}
