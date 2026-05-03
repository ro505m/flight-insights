import { useEffect, useRef, useState } from "react";
import { initDB } from "@/db/init";
import {
  createRangeView,
  getKPIs,
  getTrends,
  getAirlines,
  getRoutes,
  getRecovery,
} from "@/db/queries";
import { useFilters } from "@/store/filters";
import type {
  AirlineStat,
  KPIs,
  RecoveryRow,
  RouteStat,
  TrendPoint,
} from "@/data/types";

const EMPTY_KPIS = {
  totalFlights: 0,
  avgDelay: 0,
  onTimeRate: 0,
  cancelRate: 0,
};

function cacheKeyForRangeAndFilters(
  start: number,
  end: number,
  airlines: string[],
  origins: string[],
) {
  const a = [...airlines].sort().join(",");
  const o = [...origins].sort().join(",");
  return `${start}-${end}|${a}|${o}`;
}

// مخزن بيانات عالمي مشترك بين جميع المكونات لمنع تكرار الاستعلامات
const globalCache = new Map<string, any>();
const globalInflight = new Map<string, Promise<any>>();

export function useData() {
  const { yearRange, airlines, origins } = useFilters();

  const [conn, setConn] = useState<any>(null);
  const [dbReady, setDbReady] = useState(false);
  const [dbFailed, setDbFailed] = useState(false);

  const [loading, setLoading] = useState(true);

  const [kpiData, setKpiData] = useState<KPIs>(EMPTY_KPIS);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [airlineData, setAirlineData] = useState<AirlineStat[]>([]);
  const [routeData, setRouteData] = useState<RouteStat[]>([]);
  const [recoveryData, setRecoveryData] = useState<RecoveryRow[]>([]);

  // ---------------- INIT DB (safe mount) ----------------
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const c = await initDB();
        if (!alive) return;
        setConn(c);
        setDbReady(true);
        setDbFailed(false);
      } catch (e) {
        console.warn("DB init failed:", e);
        if (!alive) return;
        setConn(null);
        setDbReady(false);
        setDbFailed(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ---------------- MAIN QUERY ----------------
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const [start, end] = yearRange;

      if (!conn) {
        if (!cancelled) setLoading(!dbFailed);
        return;
      }

      const key = cacheKeyForRangeAndFilters(start, end, airlines, origins);

      setLoading(true);

      // ⚡ CACHE FIRST
      const cached = globalCache.get(key);

      if (cached) {
        if (!cancelled) {
          setKpiData(cached.k);
          setTrendData(cached.t);
          setAirlineData(cached.a);
          setRouteData(cached.r);
          setLoading(false);
        }
        return;
      }

      try {
        let p = globalInflight.get(key);

        if (!p) {
          p = (async () => {
            try {
              // إنشاء الـ View مرة واحدة فقط لهذا النطاق الزمني
              await createRangeView(conn, start, end);

              // تنفيذ الاستعلامات بشكل تتابعي لتقليل الضغط على المعالج ومنع التجمد
              const k = await getKPIs(conn, airlines, origins);
              const t = await getTrends(conn, airlines, origins);
              const a = await getAirlines(conn, airlines, origins);
              const r = await getRoutes(conn, airlines, origins);

              const payload = {
                k: k ?? EMPTY_KPIS,
                t: t ?? [],
                a: a ?? [],
                r: r ?? [],
              };

              globalCache.set(key, payload);
              return payload;
            } finally {
              // إزالة الاستعلام من قائمة الاستعلامات الجارية بعد اكتماله (سواء بنجاح أو فشل)
              globalInflight.delete(key);
            }
          })();
          // تخزين الوعد في globalInflight لمنع تكرار الاستعلامات المتزامنة
          globalInflight.set(key, p);
        }
        
        const data = await p;
        
        if (!cancelled) {
          setKpiData(data.k);
          setTrendData(data.t);
          setAirlineData(data.a);
          setRouteData(data.r);
        }
      } catch (e) {
        console.warn("Query error:", e);

        if (!cancelled) {
          // On query failure, keep zeros/empty rather than mocking.
          setKpiData(EMPTY_KPIS);
          setTrendData([]);
          setAirlineData([]);
          setRouteData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [yearRange, conn, dbFailed, airlines, origins]);

  // ---------------- RECOVERY ----------------
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!conn) {
        if (!cancelled) setRecoveryData([]);
        return;
      }

      try {
        const recoveryKey = `recovery|${[...airlines].sort().join(",")}|${[...origins].sort().join(",")}`;
        const cached = globalCache.get(recoveryKey);
        if (cached) {
          if (!cancelled) setRecoveryData(cached);
          return;
        }

        let p = globalInflight.get(recoveryKey);

        if (!p) {
          p = (async () => {
            try {
              const data = await getRecovery(conn, airlines, origins);
              const payload = data ?? [];
              globalCache.set(recoveryKey, payload);
              return payload;
            } finally {
              globalInflight.delete(recoveryKey);
            }
          })();
          globalInflight.set(recoveryKey, p);
        }

        const data = await p;
        if (!cancelled) setRecoveryData(data);
      } catch (e) {
        console.warn("Recovery error:", e);
        if (!cancelled) setRecoveryData([]);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [conn, airlines, origins]);

  // ---------------- RETURN ----------------
  return {
    loading: loading || (!dbReady && !dbFailed),
    routesLoading: loading,
    kpis: kpiData,
    trends: trendData,
    airlineStats: airlineData,
    routes: routeData,
    recovery: recoveryData,
    dbReady,
    dbFailed,
  };
}