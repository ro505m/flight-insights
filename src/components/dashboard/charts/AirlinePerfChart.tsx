import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ChartCard";
import { useData } from "@/data/useData";

function color(delay: number) {
  if (delay <= 5) return "hsl(var(--chart-2))";
  if (delay <= 12) return "hsl(var(--chart-3))";
  return "hsl(var(--chart-5))";
}

export function AirlinePerfChart() {
  const { airlineStats, loading } = useData();
  const sorted = [...airlineStats].sort((a, b) => b.avgDelay - a.avgDelay);

  return (
    <ChartCard title="Airline Performance" description="Avg arrival delay by airline (sorted)" loading={loading}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={sorted} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="airline" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="m" />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v.toFixed(1)} min`, "Avg delay"]}
          />
          <Bar dataKey="avgDelay" radius={[6, 6, 0, 0]}>
            {sorted.map((d, i) => <Cell key={i} fill={color(d.avgDelay)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}