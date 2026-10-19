// ─── Punto de entrada principal de la app CLI ───────────────────────

// Desactivar verificación de certificados SSL/TLS (necesario en Windows con proxies/firewalls)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { cargarDatos } from "./storage/settingsStorage.ts";
import { mostrarMenu } from "./presentation/menu.ts";
import { leerEntrada } from "./presentation/input.ts";
import { limpiarPantalla, mostrarAdvertencia } from "./presentation/output.ts";
import { amarillo } from "./utils/colors.ts";
import { climaCiudadDefault, climaTodasLasCiudades } from "./actions/getWeather.ts";
import { pronostico7Dias } from "./actions/getForecast.ts";
import { buscarYAgregarCiudad } from "./actions/addCity.ts";
import { eliminarCiudadAction } from "./actions/removeCity.ts";
import { establecerDefault } from "./actions/setDefaultCity.ts";
import { ajustes } from "./actions/settings.ts";
import { proximamente } from "./actions/placeholder.ts";

async function main(): Promise<void> {
  const datos = cargarDatos();

  while (true) {
    mostrarMenu(datos);
    const opcion = await leerEntrada("  Selecciona una opción: ");
    limpiarPantalla();

    switch (opcion) {
      case "1":
        await climaCiudadDefault(datos);
        break;
      case "2":
        await climaTodasLasCiudades(datos);
        break;
      case "3":
        await buscarYAgregarCiudad(datos);
        break;
      case "4":
        await eliminarCiudadAction(datos);
        break;
      case "5":
        await establecerDefault(datos);
        break;
      case "6":
        await pronostico7Dias(datos);
        break;
      case "7":
        proximamente();
        break;
      case "8":
        await ajustes(datos);
        break;
      case "9":
        console.log(amarillo("  👋 ¡Hasta luego!"));
        process.exit(0);
      default:
        mostrarAdvertencia("Opción no válida. Intenta de nuevo.");
    }

    console.log();
  }
}

main();
