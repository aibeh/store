[![codecov](https://codecov.io/gh/goncy/commercency/branch/main/graph/badge.svg?token=XiTcCI2c18)](https://codecov.io/gh/goncy/commercency)

---

# Commercency
Ecommerce, simple.

## Desarrollo

Requiere Node.js 20.19 o superior. `pnpm exec tsc` usa TypeScript 7, instalado como
`@typescript/native`. El alias `typescript` conserva la API de TypeScript 6 que
necesitan Jest y ESLint, siguiendo la [guía de compatibilidad de TypeScript](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0).

## Lint

`pnpm lint` revisa el código y `pnpm lint:fix` aplica las correcciones automáticas.
La configuración está en `eslint.config.mjs`: usa los presets mantenidos de
TypeScript, React, React Hooks, accesibilidad, Next.js y Cypress, junto con las
reglas propias del proyecto. El análisis con tipos se limita a TypeScript;
Jest, Cypress y los archivos de configuración tienen sus propios ámbitos.

ESLint queda en 9.39.5 y el plugin de Cypress en 6.4.4, las últimas versiones
compatibles con este conjunto de plugins. Los plugins de
[React](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/package.json),
[accesibilidad](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/package.json)
e [imports](https://github.com/import-js/eslint-plugin-import/blob/main/package.json)
todavía no declaran soporte para ESLint 10. Se reemplazó el
[style guide archivado de Vercel](https://github.com/vercel/style-guide)
y la regla de espaciado obsoleta por `@stylistic/padding-line-between-statements`.
`@typescript-eslint/no-loop-func` también se reemplazó por la regla base `no-loop-func`.
Prettier conserva el formato del proyecto y ordena las clases de Tailwind.

## Como la uso?
1. Crea una copia de [esta planilla de calculo](https://docs.google.com/spreadsheets/d/1Q_mDN1w88zE1vDasru-f3D6kxZAynUC1s253yLmjE7M/edit?usp=sharing).
2. Una vez copiada, toca en `Archivo > Publicar en la web`, selecciona `Valores separados por comas (.csv)` del desplegable y clickea en `publicar`.
3. Asegurate que en vez de `Pagina web` diga `Valores separados por comas (.csv)` y copia el enlace.
4. Llena [este archivo](./.env.example) y completa los datos de tu tienda y renombralo a `.env.local`.
5. Publica el sitio en [algun hosting que soporte NextJS](https://vercel.com)

## Estilos

El proyecto usa Tailwind CSS 4 con `@tailwindcss/postcss`. Los colores, fuentes,
radios, animaciones y el contenedor se configuran en `src/app/globals.css`.
La paleta `brand` usa los tonos `teal` de Tailwind. Para cambiarla, editá las
variables `--color-brand-*` en ese CSS; la variable de entorno `COLOR` ya no se usa.
Las animaciones de los diálogos usan `tw-animate-css`.

# TODO
* Revisar si deberia traer los fields como un Record<string, string> o como un array.
* Revisar si CartDrawer deberia ser un solo componente o dividirlo mas
* Si no tengo fields, el componente de Details debería mostrarme el botón de completar pedido
* Datos de tienda vía hoja de sheet
* Búsqueda
* Secciones por categoría
