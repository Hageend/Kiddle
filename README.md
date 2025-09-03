# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# 🚀 Cómo correr el proyecto

Este proyecto usa Docker para simplificar el entorno de desarrollo.

## Levantar el entorno con Docker

### Ejecuta en la raíz del proyecto (donde está el compose.yaml):

``` sh
docker compose up --build
```


Esto hará:

- Construir la imagen con Bun y las dependencias.

- Exponer el puerto de desarrollo de Vite.

### Abrir la aplicación

Cuando termine de iniciar, abre en tu navegador:

👉 http://localhost:5173

## Levantar el entorno con Bun

### Ejecuta en la raíz del proyecto
```sh
bun install

bun run dev
```