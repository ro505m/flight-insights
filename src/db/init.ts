import * as duckdb from "@duckdb/duckdb-wasm";

const PARQUET_FILES = [
  "flights_2018.parquet",
  "flights_2019.parquet",
  "flights_2020.parquet",
  "flights_2021.parquet",
  "flights_2022.parquet",
] as const;

let connPromise: Promise<any> | null = null;

export async function initDB() {
  if (connPromise) return connPromise;

  connPromise = (async () => {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);

  const worker = new Worker(
    new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
      import.meta.url
    ),
    { type: "module" }
  );

  const db = new duckdb.AsyncDuckDB(
    new duckdb.ConsoleLogger(),
    worker
  );

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  try {
    await db.open({
      filesystem: {
        reliableHeadRequests: false,
        allowFullHttpReads: true,
      },
    } as any);
  } catch (e) {
    console.warn("DuckDB open() config failed:", e);
  }

  try {
    const base = new URL("/data/", window.location.href);
    await Promise.all(
      PARQUET_FILES.map((name) =>
        db.registerFileURL(
          name,
          new URL(name, base).toString(),
          duckdb.DuckDBDataProtocol.HTTP
        )
      )
    );
  } catch (e) {
    console.warn("DuckDB file registration failed:", e);
  }

  const conn = await db.connect();

  
  try {
    const res = await conn.query(
      "SELECT FlightDate FROM read_parquet('flights_2018.parquet') LIMIT 1"
    );
    const row = res.toArray()?.[0];
    if (row) {
      console.info("DuckDB connection established successfully.");
    } else {
      console.warn("DuckDB parquet check returned 0 rows.");
    }
  } catch (e) {
    console.warn("DuckDB parquet check failed:", e);
  }

  return conn;
  })();

  return connPromise;
}