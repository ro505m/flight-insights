import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ChartCard";
import { useData } from "@/data/useData";

export function RoutesChart() {
  const { routes, routesLoading } = useData();

  return (
    <ChartCard title="Top Delayed Routes" description="Origin → destination pairs with worst avg delay" loading={routesLoading}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={routes} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="m" />
          <YAxis
            type="category"
            dataKey="route"
            width={100}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontSize: 12,
            }}
            formatter={(v: number, name) =>
              name === "avgDelay"
                ? [`${v.toFixed(1)} min`, "Avg delay"]
                : [v.toLocaleString(), "Flights"]
            }
          />
          <Bar dataKey="avgDelay" radius={[0, 6, 6, 0]}>
            {routes.map((r, i) => (
              <Cell key={i} fill={r.avgDelay > 18 ? "hsl(var(--chart-5))" : r.avgDelay > 10 ? "hsl(var(--chart-3))" : "hsl(var(--chart-2))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}