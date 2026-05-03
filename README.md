# 📂 Data Folder Structure (Required Setup)

## 📌 Overview

For the application to function correctly, the flight data files **must be placed in a specific directory structure** inside the `public` folder. This setup is essential because the application loads data directly from static paths at runtime.

---

## ⚠️ Why This Structure Is Important

The application relies on reading `.parquet` files from a fixed path inside `public/data`.
Any change to:

* Folder name
* File name
* File location

will cause data loading failures or runtime errors.

---

## 📁 Required Path

The files must be placed as follows:

```plaintext
C:\projects\flight-insights\public\data\

│── flights_2018.parquet
│── flights_2019.parquet
│── flights_2020.parquet
│── flights_2021.parquet
│── flights_2022.parquet
```

Or relative to the project:

```plaintext
/public/data/flights_2018.parquet
/public/data/flights_2019.parquet
/public/data/flights_2020.parquet
/public/data/flights_2021.parquet
/public/data/flights_2022.parquet
```

---

## 🧠 How the Application Uses These Files

* Files are loaded directly from the browser using static paths
* DuckDB WASM reads the files from `public/data`
* Any mismatch in the path will break data access

---

## ❗ Important Notes

* File names must match **exactly**
* Do not rename any files
* Do not move files outside `public/data`
* Ensure files exist before running the project

---

## ✅ Expected Result

When this structure is followed:

* Data loads successfully
* Charts and analytics display correctly
* The application runs without data-related errors

---

If you encounter data loading issues, the first thing to verify is this folder structure.
