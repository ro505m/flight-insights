
function tableForRange(yearStart: number, yearEnd: number) {
  const start = Math.min(yearStart, yearEnd);
  const end = Math.max(yearStart, yearEnd);
  const years: number[] = [];
  for (let y = start; y <= end; y++) years.push(y);

  // Each year is its own parquet file. Reading only the requested years avoids
  // downloading/scanning multi-GB data in the browser.
  const files = years.map((y) => `'flights_${y}.parquet'`).join(", ");
  return `read_parquet([${files}])`;
}

function tableForYears(years: number[]) {
  const uniq = Array.from(new Set(years)).sort((a, b) => a - b);
  const files = uniq.map((y) => `'flights_${y}.parquet'`).join(", ");
  return `read_parquet([${files}])`;
}

// وظيفة لإنشاء View مؤقت لتجنب إعادة قراءة Metadata الملفات في كل استعلام
export async function createRangeView(conn: any, yearStart: number, yearEnd: number) {
  const table = tableForRange(yearStart, yearEnd);
  await conn.query(`
    CREATE OR REPLACE TEMP VIEW current_range AS 
    SELECT * FROM ${table}
  `);
}

export async function getKPIs(conn: any) {
  const table = "current_range";
  const res = await conn.query(`
    SELECT
      COUNT(*)::BIGINT AS totalFlights,
      ROUND(AVG(ArrDelay) FILTER (WHERE Cancelled = 0), 2) AS avgDelay,
      100.0 * COUNT(*) FILTER (WHERE ArrDel15 = 0 AND Cancelled = 0) / COUNT(*) AS onTimeRate,
      100.0 * COUNT(*) FILTER (WHERE Cancelled = 1) / COUNT(*) AS cancelRate
    FROM ${table}
  `);

  const data = res.toArray()?.[0];
  return {
    totalFlights: Number(data?.totalFlights ?? 0),
    avgDelay: Number(data?.avgDelay ?? 0),
    onTimeRate: Number(data?.onTimeRate ?? 0),
    cancelRate: Number(data?.cancelRate ?? 0),
  };
}

export async function getTrends(conn: any) {
  const table = "current_range";
  const res = await conn.query(
    `
    SELECT
      strftime(CAST(FlightDate AS DATE), '%Y-%m') AS period,
      AVG(ArrDelay) FILTER (WHERE Cancelled = 0) AS avgDelay
    FROM ${table}
    GROUP BY period
    ORDER BY period
    `
  );

  return res.toArray();
}

export async function getAirlines(conn: any) {
  const table = "current_range";
  const res = await conn.query(
    `
    SELECT
      Operating_Airline AS airline,
      MAX(Airline) AS name,
      COUNT(*) AS flights,
      AVG(ArrDelay) FILTER (WHERE Cancelled = 0) AS avgDelay,
      100.0 * COUNT(*) FILTER (WHERE ArrDel15 = 0 AND Cancelled = 0) / COUNT(*) AS onTime,
      100.0 * COUNT(*) FILTER (WHERE Cancelled = 1) / COUNT(*) AS cancel
    FROM ${table}
    GROUP BY Operating_Airline
    ORDER BY avgDelay DESC
    `
  );

  return res.toArray();
}

export async function getRoutes(conn: any) {
  const table = "current_range";
  const res = await conn.query(
    `
    SELECT
      Origin AS origin,
      Dest AS dest,
      Origin || ' → ' || Dest AS route,
      COUNT(*) AS flights,
      AVG(ArrDelay) FILTER (WHERE Cancelled = 0) AS avgDelay
    FROM ${table}
    GROUP BY origin, dest
    ORDER BY avgDelay DESC
    LIMIT 20
    `
  );

  return res.toArray();
}

export async function getRecovery(conn: any) {
  const table = tableForYears([2019, 2022]);
  const res = await conn.query(`
    SELECT
      Operating_Airline AS airline,
      AVG(ArrDelay) FILTER (WHERE Year = 2019 AND Cancelled = 0) AS delay2019,
      AVG(ArrDelay) FILTER (WHERE Year = 2022 AND Cancelled = 0) AS delay2022,
      AVG(ArrDelay) FILTER (WHERE Year = 2019 AND Cancelled = 0)
      - AVG(ArrDelay) FILTER (WHERE Year = 2022 AND Cancelled = 0) AS recoveryScore
    FROM ${table}
    WHERE Year IN (2019, 2022)
    GROUP BY Operating_Airline
    ORDER BY recoveryScore DESC
  `);

  return res.toArray();
}