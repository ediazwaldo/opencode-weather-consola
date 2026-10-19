// ─── Tipos de dominio: Ciudad ───────────────────────────────────────

export interface Ciudad {
  nombre: string;
  lat: number;
  lon: number;
}

export interface Configuracion {
  ciudadDefault: string | null;
  unidad: "C" | "F";
}

export interface Almacenamiento {
  ciudades: Ciudad[];
  config: Configuracion;
}
