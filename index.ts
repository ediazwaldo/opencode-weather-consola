// ─── Weather CLI App ────────────────────────────────────────────────

// Desactivar verificación de certificados SSL/TLS (necesario en Windows con proxies/firewalls)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { createInterface } from "node:readline";
import { cargarDatos, agregarCiudad, eliminarCiudad, guardarDatos } from "./storage";
import { buscarCiudad, obtenerTemperatura, obtenerPronostico7Dias } from "./weather";
import type { Almacenamiento, Ciudad } from "./types";

// ─── Utilidades de UI ───────────────────────────────────────────────

// Códigos ANSI para colores en consola
const CYAN = "\x1b[96m";
const AMARILLO = "\x1b[33m";
const ROJO = "\x1b[31m";
const RESET = "\x1b[0m";

function cyan(texto: string): string {
  return `${CYAN}${texto}${RESET}`;
}

function amarillo(texto: string): string {
  return `${AMARILLO}${texto}${RESET}`;
}

function rojo(texto: string): string {
  return `${ROJO}${texto}${RESET}`;
}

function linea(): string {
  return "════════════════════════════════════════";
}

function limpiarPantalla(): void {
  process.stdout.write("\x1b[2J\x1b[0f");
}

function mostrarMenu(datos: Almacenamiento): void {
  console.log(cyan(linea()));
  console.log(cyan("          WEATHER CLI"));
  console.log(cyan(linea()));
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${datos.ciudades.length})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan("  7. Pronóstico 7 días (ciudad default)"));
  console.log(cyan(`  8. Ajustes (°${datos.config.unidad})`));
  console.log(cyan("  9. Salir"));
  console.log(cyan(linea()));
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function leerEntrada(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}

function convertirTemp(celsius: number, unidad: "C" | "F"): number {
  if (unidad === "F") {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

// ─── Opciones del menú ─────────────────────────────────────────────

async function opcionClimaDefault(datos: Almacenamiento): Promise<void> {
  const nombre = datos.config.ciudadDefault;
  if (!nombre) {
    console.log("  ⚠️  No hay ciudad default establecida.");
    console.log("     Usa la opción 3 para agregar una ciudad.");
    return;
  }

  const ciudad = datos.ciudades.find(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
  );
  if (!ciudad) {
    console.log("  ⚠️  La ciudad default ya no existe en tu lista.");
    return;
  }

  try {
    const temp = await obtenerTemperatura(ciudad.lat, ciudad.lon);
    const tempConvertida = convertirTemp(temp, datos.config.unidad);
    console.log(amarillo(`  📍 ${ciudad.nombre}: ${tempConvertida.toFixed(1)}°${datos.config.unidad}`));
  } catch (error) {
    console.error(rojo(`  ❌ Error al obtener el clima: ${error instanceof Error ? error.message : error}`));
  }
}

async function opcionClimaTodas(datos: Almacenamiento): Promise<void> {
  if (datos.ciudades.length === 0) {
    console.log("  ⚠️  No hay ciudades registradas.");
    console.log("     Usa la opción 3 para agregar una ciudad.");
    return;
  }

  for (const ciudad of datos.ciudades) {
    try {
      const temp = await obtenerTemperatura(ciudad.lat, ciudad.lon);
      const tempConvertida = convertirTemp(temp, datos.config.unidad);
      console.log(amarillo(`  📍 ${ciudad.nombre}: ${tempConvertida.toFixed(1)}°${datos.config.unidad}`));
    } catch (error) {
      console.error(rojo(`  ❌ Error para ${ciudad.nombre}: ${error instanceof Error ? error.message : error}`));
    }
  }
}

async function opcionBuscarYAgregar(datos: Almacenamiento): Promise<void> {
  const nombre = await leerEntrada("  Nombre de la ciudad: ");
  if (!nombre) {
    console.log("  ⚠️  No ingresaste ningún nombre.");
    return;
  }

  console.log(`  🔍 Buscando "${nombre}"...`);
  const ciudad = await buscarCiudad(nombre);

  if (!ciudad) {
    console.log(`  ❌ No se encontró la ciudad "${nombre}".`);
    return;
  }

  const agregada = agregarCiudad(datos, ciudad);
  if (agregada) {
    console.log(amarillo(`  ✅ Ciudad "${ciudad.nombre}" agregada correctamente.`));
    if (datos.config.ciudadDefault === ciudad.nombre) {
      console.log(amarillo("     Establecida como ciudad default."));
    }
  } else {
    console.log(amarillo(`  ℹ️  La ciudad "${ciudad.nombre}" ya está en tu lista.`));
  }
}

async function opcionEliminar(datos: Almacenamiento): Promise<void> {
  if (datos.ciudades.length === 0) {
    console.log("  ⚠️  No hay ciudades para eliminar.");
    return;
  }

  console.log("  Ciudades registradas:");
  datos.ciudades.forEach((c, i) => {
    console.log(`    ${i + 1}. ${c.nombre}`);
  });

  const entrada = await leerEntrada("  Número de la ciudad a eliminar: ");
  if (!entrada) {
    console.log("  ⚠️  No ingresaste ningún número.");
    return;
  }

  const numero = Number(entrada);
  const indice = numero - 1;
  const ciudad = (numero >= 1 && numero <= datos.ciudades.length)
    ? datos.ciudades[indice]
    : undefined;

  if (!ciudad) {
    console.log(rojo(`  ❌ No se encontró la ciudad número "${entrada}".`));
    return;
  }

  const eliminada = eliminarCiudad(datos, ciudad.nombre);
  if (eliminada) {
    console.log(amarillo(`  ✅ Ciudad "${ciudad.nombre}" eliminada.`));
  } else {
    console.log(rojo(`  ❌ No se encontró la ciudad "${ciudad.nombre}".`));
  }
}

async function opcionEstablecerDefault(datos: Almacenamiento): Promise<void> {
  if (datos.ciudades.length === 0) {
    console.log("  ⚠️  No hay ciudades registradas.");
    return;
  }

  console.log("  Ciudades registradas:");
  datos.ciudades.forEach((c, i) => {
    const esDefault = c.nombre === datos.config.ciudadDefault ? " ← default" : "";
    console.log(`    ${i + 1}. ${c.nombre}${esDefault}`);
  });

  const entrada = await leerEntrada("  Número de la ciudad default: ");
  if (!entrada) {
    console.log("  ⚠️  No ingresaste ningún número.");
    return;
  }

  const numero = Number(entrada);
  const indice = numero - 1;
  const ciudad = (numero >= 1 && numero <= datos.ciudades.length)
    ? datos.ciudades[indice]
    : undefined;

  if (!ciudad) {
    console.log(rojo(`  ❌ No se encontró la ciudad número "${entrada}".`));
    return;
  }

  datos.config.ciudadDefault = ciudad.nombre;
  guardarDatos(datos);
  console.log(amarillo(`  ✅ "${ciudad.nombre}" establecida como ciudad default.`));
}

async function opcionAjustes(datos: Almacenamiento): Promise<void> {
  console.log(`  Unidad actual: °${datos.config.unidad}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");

  const opcion = await leerEntrada("  Selecciona una opción: ");
  if (opcion === "1") {
    datos.config.unidad = "C";
  } else if (opcion === "2") {
    datos.config.unidad = "F";
  } else {
    console.log(rojo("  ⚠️  Opción no válida."));
    return;
  }

  guardarDatos(datos);
  console.log(amarillo(`  ✅ Unidad cambiada a °${datos.config.unidad}.`));
}

function describirClima(codigo: number): string {
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

async function opcionPronostico7Dias(datos: Almacenamiento): Promise<void> {
  const nombre = datos.config.ciudadDefault;
  if (!nombre) {
    console.log("  ⚠️  No hay ciudad default establecida.");
    console.log("     Usa la opción 3 para agregar una ciudad.");
    return;
  }

  const ciudad = datos.ciudades.find(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
  );
  if (!ciudad) {
    console.log("  ⚠️  La ciudad default ya no existe en tu lista.");
    return;
  }

  try {
    const pronostico = await obtenerPronostico7Dias(ciudad.lat, ciudad.lon);
    console.log(amarillo(`  Pronóstico para ${ciudad.nombre} — próximos 7 días:`));
    console.log();
    console.log(`  ${"Fecha".padEnd(12)} ${"Mín".padStart(6)} ${"Máx".padStart(6)}  Clima`);
    console.log(`  ${"─".repeat(12)} ${"─".repeat(6)} ${"─".repeat(6)}  ${"─".repeat(20)}`);
    for (const dia of pronostico) {
      const tempMin = convertirTemp(dia.tempMin, datos.config.unidad).toFixed(1);
      const tempMax = convertirTemp(dia.tempMax, datos.config.unidad).toFixed(1);
      console.log(`  ${dia.fecha.padEnd(12)} ${tempMin.padStart(5)}°${datos.config.unidad} ${tempMax.padStart(5)}°${datos.config.unidad}  ${describirClima(dia.codigoClima)}`);
    }
  } catch (error) {
    console.error(rojo(`  ❌ Error al obtener el pronóstico: ${error instanceof Error ? error.message : error}`));
  }
}

// ─── Loop principal ────────────────────────────────────────────────

async function main(): Promise<void> {
  const datos = cargarDatos();

  while (true) {
    mostrarMenu(datos);
    const opcion = await leerEntrada("  Selecciona una opción: ");
    limpiarPantalla();

    switch (opcion) {
      case "1":
        await opcionClimaDefault(datos);
        break;
      case "2":
        await opcionClimaTodas(datos);
        break;
      case "3":
        await opcionBuscarYAgregar(datos);
        break;
      case "4":
        await opcionEliminar(datos);
        break;
      case "5":
        await opcionEstablecerDefault(datos);
        break;
      case "7":
        await opcionPronostico7Dias(datos);
        break;
      case "8":
        await opcionAjustes(datos);
        break;
      case "9":
        console.log(amarillo("  👋 ¡Hasta luego!"));
        process.exit(0);
      default:
        console.log(rojo("  ⚠️  Opción no válida. Intenta de nuevo."));
    }

    console.log(); // línea en blanco entre iteraciones
  }
}

main();
