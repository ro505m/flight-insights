import { useMemo, useState } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/data/useData";
import type { AirlineStat } from "@/data/types";
import { cn } from "@/lib/utils";

function pctBadge(pct: number, goodHigh = true) {
  const ok = goodHigh ? pct >= 80 : pct <= 2;
  const warn = goodHigh ? pct >= 70 : pct <= 4;
  const tone = ok
    ? "bg-success/15 text-success"
    : warn
      ? "bg-warning/15 text-warning"
      : "bg-destructive/15 text-destructive";
  return <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", tone)}>{pct.toFixed(1)}%</span>;
}

export function AirlineTable() {
  const { airlineStats, loading } = useData();
  const [sorting, setSorting] = useState<SortingState>([{ id: "avgDelay", desc: true }]);
  const [filter, setFilter] = useState("");

  const columns = useMemo<ColumnDef<AirlineStat>[]>(() => [
    {
      accessorKey: "airline",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Airline <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.original.airline}</div>
          {row.original.name ? (
            <div className="text-xs text-muted-foreground">{row.original.name}</div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "avgDelay",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Avg Delay <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const v = row.original.avgDelay;
        const tone = v > 12 ? "text-destructive" : v > 5 ? "text-warning" : "text-success";
        return <span className={cn("font-mono", tone)}>{v >= 0 ? "+" : ""}{v.toFixed(1)} min</span>;
      },
    },
    {
      accessorKey: "flights",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Flights <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono">{row.original.flights.toLocaleString()}</span>,
    },
    { accessorKey: "onTime", header: "On-Time %", cell: ({ row }) => pctBadge(row.original.onTime, true) },
    { accessorKey: "cancel", header: "Cancel %", cell: ({ row }) => pctBadge(row.original.cancel, false) },
  ], []);

  const table = useReactTable({
    data: airlineStats,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  return (
    <Card className="rounded-2xl p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Airline Detail</h3>
          <p className="text-xs text-muted-foreground">Sortable, searchable, paginated</p>
        </div>
        <Input
          placeholder="Search airlines…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                  {loading ? "Loading…" : "No data"}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} ·{" "}
          {table.getFilteredRowModel().rows.length} airlines
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}