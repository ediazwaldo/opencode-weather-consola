// ─── Formateadores de datos (temperatura, clima) ────────────────────

export function convertirTemp(celsius: number, unidad: "C" | "F"): number {
  if (unidad === "F") {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

export function describirClima(codigo: number): string {
  if (codigo === 0) return "☀️  Despejado";
  if (codigo === 1) return "🌤️  Mayormente despejado";
  if (codigo === 2) return "⛅ Parcialmente nublado";
  if (codigo === 3) return "☁️  Nublado";
  if (codigo >= 45 && codigo <= 48) return "🌫️  Niebla";
  if (codigo >= 51 && codigo <= 55) return "🌦️  Llovizna";
  if (codigo >= 56 && codigo <= 57) return "🌧️  Llovizna helada";
  if (codigo >= 61 && codigo <= 65) return "🌧️  Lluvia";
  if (codigo >= 66 && codigo <= 67) return "🌧️  Lluvia helada";
  if (codigo >= 71 && codigo <= 75) return "❄️  Nieve";
  if (codigo === 77) return "❄️  Granos de nieve";
  if (codigo >= 80 && codigo <= 82) return "🌦️  Chubascos";
  if (codigo >= 85 && codigo <= 86) return "🌨️  Chubascos de nieve";
  if (codigo === 95) return "⛈️  Tormenta";
  if (codigo >= 96 && codigo <= 99) return "⛈️  Tormenta con granizo";
  return "❓ Desconocido";
}
