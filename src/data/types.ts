export interface KPIs {
  totalFlights: number;
  avgDelay: number;
  onTimeRate: number;
  cancelRate: number;
}

export interface TrendPoint {
  period: string;
  avgDelay: number;
}

export interface AirlineStat {
  airline: string;
  name?: string;
  flights: number;
  avgDelay: number;
  onTime: number;
  cancel: number;
}

export interface RouteStat {
  origin: string;
  dest: string;
  route: string;
  flights: number;
  avgDelay: number;
}

export interface RecoveryRow {
  airline: string;
  delay2019: number;
  delay2022: number;
  recoveryScore: number;
}

