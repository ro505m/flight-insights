import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ChartCard";
import { useData } from "@/data/useData";

export function RecoveryChart() {
  const { recovery, loading } = useData();

  return (
    <ChartCard
      title="Recovery Analysis (2019 → 2022)"
      description="Higher = bigger improvement post-COVID. Top 5 highlighted."
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={recovery} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
            formatter={(v: number, name) => {
              const num = v as number;
              if (name === "recoveryScore") return [`${num.toFixed(2)} min`, "Recovery"];
              return [num.toFixed(1), name as string];
            }}
          />
          <Bar dataKey="recoveryScore" radius={[6, 6, 0, 0]}>
            {recovery.map((_, i) => (
              <Cell key={i} fill={i < 5 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}