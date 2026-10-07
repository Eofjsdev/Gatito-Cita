# 🐱 ¿Hacemos deploy de una cita? — Cita con Gatitos

> _Una aplicación interactiva para pedir una cita de forma creativa, con preguntas de programador y memes de gatitos._

**Hecho por [Ángel Said](https://github.com/Eofjsdev)** 💜 — CEO y fundador de Michihub

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 Descripción

Una aplicación web interactiva y lúdica para solicitar una cita de forma original y divertida. Guía a la persona por un flujo de 13 pasos:

- 🗓️ Fecha y hora de la cita
- 💻 10 preguntas de programador (lenguaje favorito, editor, tabs vs spaces, bugs, deploy y más)
- 📋 Resumen de todas las respuestas y PDF de la cita confirmada
- 📧 Las respuestas te llegan por correo al terminar

---

## ✨ Características

- ✅ Interfaz móvil-first con animaciones
- ✅ Botón "No" escapista: se mueve solo cuando intentas presionarlo 😄
- ✅ Validación: hay que responder cada paso
- ✅ Resumen visual y **PDF descargable**
- ✅ **Envío de respuestas por correo** (FormSubmit)
- ✅ Lluvia de gatitos al confirmar 🐱
- ✅ Instalable como app desde el navegador (PWA)

---

## 🌐 Publicarla sin instalar nada (GitHub Pages)

1. Sube el proyecto a un repo público de GitHub.
2. En **Settings → Pages**, elige **Source → GitHub Actions**.
3. El despliegue se hace solo en cada cambio (`.github/workflows/deploy.yml`).
4. Queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Para recibir las respuestas en tu correo, cambia `NOTIFY_EMAIL` al inicio de `app/page.tsx` y confirma el correo de activación de FormSubmit la primera vez.

---

## 🚀 Quick Start (para desarrollar en tu computadora)

Requisitos: Node.js 18.17 o superior.

```bash
git clone https://github.com/Eofjsdev/Gatito-Cita.git
cd Gatito-Cita
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
npm run build   # Compila el sitio estático en la carpeta out/
npm run lint    # Ejecuta ESLint
```

---

## 🔄 Actualizar el proyecto

Si ya lo tienes descargado y hubo cambios en GitHub, dentro de la carpeta del proyecto ejecuta:

```bash
git pull
npm install
```

- `git pull` baja los cambios nuevos.
- `npm install` solo hace falta si cambió `package.json`, pero no hace daño correrlo.

Para actualizar las librerías a sus versiones nuevas:

```bash
npm outdated    # muestra cuáles tienen versión nueva
npm update      # las actualiza sin romper compatibilidad
npm run build   # comprueba que todo sigue compilando
```

Si `git pull` marca un conflicto, lo más sencillo es borrar la carpeta y volver a descargar con `git clone`.

---

## 📁 Estructura del Proyecto

```
├── .github/workflows/deploy.yml   # Publicación automática en GitHub Pages
├── app/
│   ├── layout.tsx                 # Layout raíz, metadatos y PWA
│   ├── page.tsx                   # Componente principal
│   └── globals.css                # Estilos y animaciones
├── public/
│   ├── memes/                     # Imágenes de gatitos
│   ├── icons/                     # Íconos de la app instalable
│   ├── manifest.json              # Manifiesto PWA
│   └── sw.js                      # Service worker
├── package.json
├── next.config.mjs
└── README.md
```

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|-----------|-----------|
| Next.js 15 | Framework React (exportación estática) |
| React 18 | Interfaz |
| TypeScript | Tipado estático |
| jsPDF + html2canvas | PDF de la cita |
| FormSubmit | Envío de respuestas por correo |

---

## 📄 Licencia

Libre para usar y modificar. Si lo usas, ¡dale crédito a [Ángel Said](https://github.com/Eofjsdev)! 💜

---

**Hecho con ❤️ por Ángel Said** ✨
