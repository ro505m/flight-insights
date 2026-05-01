import { Plane } from "lucide-react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { DelayTrendsChart } from "@/components/dashboard/charts/DelayTrendsChart";
import { AirlinePerfChart } from "@/components/dashboard/charts/AirlinePerfChart";
import { RecoveryChart } from "@/components/dashboard/charts/RecoveryChart";
import { RoutesChart } from "@/components/dashboard/charts/RoutesChart";
import { AirlineTable } from "@/components/dashboard/AirlineTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-4 md:px-6">
          <div className="rounded-xl bg-gradient-primary p-2 shadow-elevated">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Flight Delay Analytics Dashboard</h1>
            <p className="text-xs text-muted-foreground">Interactive airline performance insights</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-6">
        <FilterBar />
        <div className="space-y-6 pt-6">
          <KpiCards />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DelayTrendsChart />
            <AirlinePerfChart />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecoveryChart />
            <RoutesChart />
          </div>

          <AirlineTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
