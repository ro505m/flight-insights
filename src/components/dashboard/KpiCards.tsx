import { CheckCircle2, Clock, Loader2, Plane, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/data/useData";
import { cn } from "@/lib/utils";

function formatNumber(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function Kpi({
  label, value, icon: Icon, tone = "default", badge, loading,
}: {
  label: string;
  value: string;
  icon: any;
  tone?: "default" | "success" | "danger" | "warning";
  badge?: { label: string; tone: "success" | "warning" | "danger" };
  loading: boolean;
}) {
  const toneCls = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    danger: "text-destructive bg-destructive/10",
    warning: "text-warning bg-warning/10",
  }[tone];
  const badgeCls = badge && {
    success: "bg-success/15 text-success hover:bg-success/20",
    warning: "bg-warning/15 text-warning hover:bg-warning/20",
    danger: "bg-destructive/15 text-destructive hover:bg-destructive/20",
  }[badge.tone];

  return (
    <Card className="group relative overflow-hidden rounded-2xl p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : value}
          </p>
          {badge && !loading && (
            <Badge className={cn("mt-2 border-0 font-medium", badgeCls)}>{badge.label}</Badge>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5", toneCls)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function KpiCards() {
  const { kpis, loading } = useData();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi
        label="Total Flights"
        value={formatNumber(kpis.totalFlights)}
        icon={Plane}
        loading={loading}
      />
      <Kpi
        label="Avg Arrival Delay"
        value={`${kpis.avgDelay >= 0 ? "+" : ""}${kpis.avgDelay.toFixed(1)} min`}
        icon={Clock}
        tone={kpis.avgDelay > 10 ? "danger" : kpis.avgDelay > 6 ? "warning" : "success"}
        badge={{
          label: kpis.avgDelay > 10 ? "Bad" : kpis.avgDelay > 6 ? "Average" : "Good",
          tone: kpis.avgDelay > 10 ? "danger" : kpis.avgDelay > 6 ? "warning" : "success",
        }}
        loading={loading}
      />
      <Kpi
        label="On-Time Rate"
        value={`${kpis.onTimeRate.toFixed(1)}%`}
        icon={CheckCircle2}
        tone={kpis.onTimeRate > 80 ? "success" : kpis.onTimeRate > 70 ? "warning" : "danger"}
        badge={{
          label: kpis.onTimeRate > 80 ? "Good" : kpis.onTimeRate > 70 ? "Average" : "Bad",
          tone: kpis.onTimeRate > 80 ? "success" : kpis.onTimeRate > 70 ? "warning" : "danger",
        }}
        loading={loading}
      />
      <Kpi
        label="Cancellation Rate"
        value={`${kpis.cancelRate.toFixed(2)}%`}
        icon={XCircle}
        tone={kpis.cancelRate < 1.5 ? "success" : kpis.cancelRate < 3 ? "warning" : "danger"}
        badge={{
          label: kpis.cancelRate < 1.5 ? "Good" : kpis.cancelRate < 3 ? "Average" : "Bad",
          tone: kpis.cancelRate < 1.5 ? "success" : kpis.cancelRate < 3 ? "warning" : "danger",
        }}
        loading={loading}
      />
    </div>
  );
}