import type { AirlineStat } from "@/data/types";
import { ArrowUpDown } from "lucide-react";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function pctBadge(pct: number, goodHigh = true) {
  const ok = goodHigh ? pct >= 80 : pct <= 2;
  const warn = goodHigh ? pct >= 70 : pct <= 4;
  const tone = ok
    ? "bg-success/15 text-success"
    : warn
      ? "bg-warning/15 text-warning"
      : "bg-destructive/15 text-destructive";
  return <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", tone)}>{pct.toFixed(1)}%</span>;
}

export const columns: ColumnDef<AirlineStat>[] = [
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
];