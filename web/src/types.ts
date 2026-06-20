export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  role_en: string;
  initials: string;
}

export interface Epoch {
  id: number;
  date: string;
  label: string;
  sensor: string;
  gsd_cm: number;
}

export interface KpiCard {
  id: string;
  label: string;
  en: string;
  val: string;
  unit: string;
  trend: string;
  trend_bg: string;
  sub: string;
  color: string;
}

export interface Alert {
  id: string;
  severity: 'KRITIS' | 'TINGGI' | 'SEDANG';
  module: string;
  title: string;
  description: string;
  color: string;
  bg_tint: string;
  time_ago: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  chip_color: string;
}

export interface Stockpile {
  id: string;
  name: string;
  material: string;
  volume_m3: number;
  tonase: number;
  delta_pct: number;
  color: string;
  spark: number[];
  anomaly: boolean;
  detail?: StockpileDetail;
}

export interface StockpileDetail {
  base_plane: string;
  toe_polygon: string;
  cut_fill: string;
  uncertainty: string;
  method: string;
  trend_bars: { m: string; h: number }[];
}

export interface FleetUnit {
  id: string;
  type: string;
  status: string;
  fuel_pct: number;
  position: [number, number];
  color: string;
}

export interface SlopeSegment {
  id: string;
  seg: string;
  fk: number;
  pk: number;
  status: 'AMAN' | 'WASPADA' | 'KRITIS';
  color: string;
}

export type ModuleId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8';
