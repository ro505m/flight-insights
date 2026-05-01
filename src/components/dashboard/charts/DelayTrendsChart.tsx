import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ChartCard";
import { useData } from "@/data/useData";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
  fontSize: 12,
};

export function DelayTrendsChart() {
  const { trends, loading } = useData();

  return (
    <ChartCard title="Delay Trends Over Time" description="Average arrival delay per month" loading={loading}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={trends} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.45} />
              <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            interval={Math.max(0, Math.floor(trends.length / 12))}
          />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="m" />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [`${v.toFixed(1)} min`, "Avg delay"]}
          />
          <Area type="monotone" dataKey="avgDelay" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}