import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChartCard({
  title, description, loading, children, className, action,
}: {
  title: string;
  description?: string;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "relative flex flex-col rounded-2xl p-5 shadow-card transition-shadow hover:shadow-elevated",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {action}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </Card>
  );
}