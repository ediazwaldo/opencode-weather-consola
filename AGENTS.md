# AGENTS.md

## Proyecto
CLI de clima (aplicación de consola con menú) construido con **Bun + TypeScript**, según la especificación en `README.md`. Los datos provienen de las APIs de OpenMeteo (geocoding → pronóstico). Objetivo final: generar un binario ejecutable.

## Runtime: Bun, no Node
- Usa `bun` / `bunx` para todo; nunca `npm` / `node` / `npx`.
- Ejecutar la app: `bun run index.ts`
- Instalar dependencias: `bun install`

## Verificación
- `bun run typecheck` (envuelve `bun check`) es la única verificación — **no hay test runner** ni script de test. El flujo es ejecución manual + typecheck.

## Compilar el binario
```bash
bun build --compile index.ts
```
Esto genera un ejecutable independiente — el entregable final indicado en el README.

## Flujo de APIs (según README)
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=1&language=es&format=json`
2. Pronóstico: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

## Notas de TypeScript
- `strict` + `noUncheckedIndexedAccess` están activos: el acceso por índice de array devuelve `T | undefined` — manejalo explícitamente.
- La especificación está en español; manten los strings de la UI y la documentación en español para coincidir con el `README.md`.
