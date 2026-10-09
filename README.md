# 🐱 ¿Hacemos deploy de una cita? — Cita con Gatitos

> _Una invitación interactiva para pedir una cita de forma original: fecha y hora, un banco de 100 preguntas de programador, gatitos pixel que te acompañan, PDF de la cita confirmada, evento para el calendario y aviso por correo._

**Hecho por [Ángel Said](https://github.com/Eofjsdev)** 💜 

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-instalable-7c3aed?style=flat-square)](#-instalable-pwa)

---

## 📖 Descripción

**¿Hacemos deploy de una cita?** es una aplicación web móvil-first que convierte una invitación a salir en una pequeña experiencia con humor La persona invitada recorre un flujo guiado: acepta la propuesta (aunque el botón **"No"** se escapa cuando intenta tocarlo 😹), elige **fecha y hora**, responde preguntas de programador (lenguaje favorito, editor, tabs vs spaces, bugs, deploy y muchas más) y al final confirma la cita.

Todo el tiempo la acompañan unos **gatitos pixel** que reaccionan a cada respuesta, la animan en los momentos clave y llenan la pantalla de gatitos al confirmar. Al terminar se genera un **PDF con folio**, un **evento para el calendario** y quien invitó recibe las respuestas por **correo**.

Es una app 100 % estática: no necesita servidor ni base de datos y se publica gratis en GitHub Pages o Vercel.

---

## ✨ Características

### 🎮 Experiencia de usuario
- **Botón "No" escapista:** se mueve solo cuando intentas presionarlo, se va haciendo más chico y el botón "Sí" crece con cada intento (hasta 5 niveles).
- **Banco de 100 preguntas** de programador, en **orden aleatorio** en cada cita. Se puede limitar cuántas salen con `QUESTIONS_PER_DATE`.
- **Validación en cada paso:** hay que responder antes de avanzar.
- **Reacción del gatito** después de cada respuesta ("¡Miau! Esa me gustó 😻", "Anotado en mi base de datos 🐾"…).
- **Mascota con mensajes de ánimo:** al empezar, en el 25 %, 50 %, 75 % y 90 % del camino, en la última pregunta y cada cierto número de preguntas.
- **Gatitos pixel animados** en un canvas, con una estación de trabajo con código y terminal.
- **Lluvia de gatitos** al responder (más grande cada cierto número de preguntas) y una lluvia final al confirmar.
- **Selector propio de fecha y hora:** calendario mensual que bloquea días pasados y selector de hora y minutos con atajos "Tarde" y "Noche".
- **Interfaz móvil-first** con animaciones, LED parpadeante y respeto a `prefers-reduced-motion`.

### 📄 PDF de la cita
- Se genera en el navegador con **html2canvas + jsPDF**.
- Incluye logo, **folio** (`Cita #0001`, un contador por dispositivo), fecha de emisión, **resumen de todas las respuestas** y fila de gatitos.
- La página se ajusta a la altura del contenido para que nada se corte.

### 📅 Calendario
- Al descargar el PDF se descarga también un archivo **`cita-confirmada.ics`** con la fecha y hora elegidas (duración de 2 horas).
- Incluye **dos alarmas**: 1 día antes y 1 hora antes.
- Botón **"📅 Google Calendar"** que abre el evento ya llenado, listo para guardar.
- El evento usa hora local "flotante": se queda a la hora que se eligió, sin importar la zona horaria del dispositivo.
- El evento se guarda en el calendario de **quien hace la cita**, al abrir el `.ics` o tocar "Guardar" en Google Calendar.

### 📧 Aviso por correo
- Al confirmar, las respuestas llegan a tu correo mediante **[FormSubmit](https://formsubmit.co)** (sin backend).
- El correo viene en formato de tabla con folio, fecha de emisión, fecha y hora de la cita, todas las respuestas y la respuesta final.
- La primera vez hay que confirmar el correo de activación que envía FormSubmit.

### 📲 Instalable (PWA)
- Manifiesto, íconos (incluido maskable) y service worker: se puede instalar desde el navegador y abrir como app.

### 📊 Analítica
- Integra **Vercel Analytics** para ver visitas y uso.

---

## 🔄 Flujo de la app

| Paso | Qué pasa |
|------|----------|
| **0 · Invitación** | Presentación con el gatito y la propuesta de cita |
| **1 · Aceptar** | Botón "Sí" que crece y botón "No" que se escapa y se encoge |
| **2 · Fecha y hora** | Selector de día (sin fechas pasadas) y de hora |
| **3 … N · Preguntas** | Preguntas de programador en orden aleatorio, con reacción del gatito y mensajes de la mascota |
| **Resumen** | Lista de todas las respuestas y botón de confirmar |
| **Final** | Lluvia de gatitos, correo enviado, descarga de PDF + `.ics` y botón de Google Calendar |

---

## ⚙️ Configuración rápida

Estas constantes están al inicio de `app/page.tsx`:

| Constante | Para qué sirve |
|-----------|----------------|
| `NOTIFY_EMAIL` | Correo que recibe las respuestas (vía FormSubmit) |
| `QUESTIONS_PER_DATE` | Cuántas preguntas salen en cada cita (el banco tiene 100) |
| `LOGO_SRC` | Logo que aparece en el PDF |

Para cambiar o agregar preguntas, edita el arreglo `QUESTION_BANK`. Cada una tiene `key`, `icon`, `tag`, `text` y `options`.

> 🔒 Como la app es estática, `NOTIFY_EMAIL` queda visible en el código del sitio. FormSubmit permite usar un alias aleatorio en lugar de tu correo real; revisa su documentación.

---

## 🌐 Publicarla sin instalar nada (GitHub Pages)

1. Sube el proyecto a un repo público de GitHub.
2. En **Settings → Pages**, elige **Source → GitHub Actions**.
3. El despliegue se hace solo en cada cambio (`.github/workflows/deploy.yml`).
4. Queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

También se puede publicar en **Vercel** (el proyecto incluye `vercel.json`).

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

Para actualizar las librerías:

```bash
npm outdated    # muestra cuáles tienen versión nueva
npm update      # las actualiza sin romper compatibilidad
npm run build   # comprueba que todo sigue compilando
```

Si `git pull` marca un conflicto, lo más sencillo es borrar la carpeta y volver a descargar con `git clone`.

---

## 📁 Estructura del proyecto

```
├── .github/workflows/
│   ├── deploy.yml               # Publicación automática en GitHub Pages
│   └── pwa.yml                  # Workflow manual "Instalar PWA"
├── app/
│   ├── layout.tsx               # Layout raíz, metadatos y PWA
│   ├── page.tsx                 # Componente principal (flujo, PDF, correo, calendario)
│   └── globals.css              # Estilos y animaciones
├── public/
│   ├── memes/                   # Imágenes de gatitos
│   ├── icons/                   # Íconos de la app instalable
│   ├── manifest.json            # Manifiesto PWA
│   └── sw.js                    # Service worker
├── next.config.mjs              # Exportación estática y basePath
├── vercel.json
├── package.json
└── README.md
```

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|-----------|-----------|
| Next.js 15 | Framework React con exportación estática |
| React 18 | Interfaz |
| TypeScript | Tipado estático |
| jsPDF + html2canvas | PDF de la cita |
| FormSubmit | Envío de respuestas por correo |
| iCalendar (`.ics`) + Google Calendar | Evento para el calendario |
| Vercel Analytics | Estadísticas de uso |
| PWA (manifest + service worker) | Instalación como app |

---

## 💡 Ideas para seguir creciendo

- Nombre personalizado por link (`?nombre=Ana`)
- Retomar donde se quedó si cierra la página
- Respuesta automática por correo a quien confirmó
- Elegir el plan de la cita (cena, cine, café)
- Compartir el resumen como imagen
- Modo creador para que otras personas hagan su propia invitación

---

## 📄 Licencia

Libre para usar y modificar. Si lo usas, ¡dale crédito a [Ángel Said](https://github.com/Eofjsdev)! 💜

---

**Hecho con ❤️ por Ángel Said** ✨
