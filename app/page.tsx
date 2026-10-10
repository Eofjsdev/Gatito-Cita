'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Colores de la lucecita LED: cambia de color en cada parpadeo, sin repetir ninguno en el ciclo
// Logotipo Eofjs.dev (incrustado) para el PDF
const LOGO_SRC =
  'data:image/png;base64,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';

// Gatito mascota de la esquina: comenta el avance
const MASCOT_CHEERS = ['¡Sigue así, dev! 🐾', 'Buen ritmo ⚡', 'Yo creo en ti 💜', 'Una pregunta menos, un bug menos 🐛', '¡Qué buen equipo hacemos! 🐱'];

function mascotMessage(q: number, total: number): string | null {
  if (q === 1) return '¡Empezamos, dev! Yo te acompaño 🐱';
  if (q === total) return '¡Última pregunta! 🏁';
  if (q === Math.ceil(total * 0.25)) return '¡Primer cuarto listo! 💪';
  if (q === Math.ceil(total * 0.5)) return '¡Vas por la mitad, dev! 💪';
  if (q === Math.ceil(total * 0.75)) return '¡Ya solo falta un cuarto! 🔥';
  if (q === Math.round(total * 0.9)) return 'Ya casi, no te rindas 🐱';
  if (q % 7 === 0) return MASCOT_CHEERS[Math.floor(q / 7) % MASCOT_CHEERS.length];
  return null;
}

// Reacciones del gatito después de cada respuesta
const CAT_REACTIONS = [
  '¡Buena elección! 🐱',
  '¡Miau! Esa me gustó 😻',
  'Anotado en mi base de datos 🐾',
  '¡Compilando... y sin errores! ✅',
  'Hmm, interesante... 🤔🐱',
  '¡Eso es de nivel senior! 😎',
  'Mi gatito aprueba esta respuesta 👍',
  '¡Commit aceptado! 💜',
  'Tienes buen gusto, programador 🐾',
  '¡Wow! No me lo esperaba 🙀',
  'Esa va directo a producción 🚀',
  'Purrfecto 😸',
  '¡Sin bugs a la vista! 🐛❌',
  'Me caes cada vez mejor 💜',
  '¡Ronroneo de aprobación! 😽',
  'Pull request aprobado ✨',
];
// Lluvia de gatitos al responder: pocos cada vez, y una lluvia grande cada cierto número de preguntas
const CATS_PER_ANSWER = 4;
const BIG_RAIN_EVERY = 10;
const BIG_RAIN_CATS = 14;

// Segundos que dura cada parpadeo (más alto = más lento)
const LED_BLINK_SECONDS = 2.5;
const LED_COLORS = ['#ff2d55', '#ff9500', '#ffd60a', '#30d158', '#00e5ff', '#0a84ff', '#bf5af2', '#ff6bd6'];

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${BASE_PATH}${path}`;

type Question = { id: number; key: string; icon: string; tag: string; text: string; options: string[] };

// Cuántas preguntas salen en cada cita (hay 100 en total, en orden al azar). Pon un número menor si quieres menos.
const QUESTIONS_PER_DATE = 100;

const QUESTION_BANK: Question[] = [
  {"id": 3, "key": "lenguaje", "icon": "💻", "tag": "// módulo: lenguaje_favorito.ts", "text": "💻 ¿Con qué lenguaje de programación compilamos esta cita?", "options": ["🐍 Python — simple, legible y sin llaves", "🟨 JavaScript — funciona... hasta que no 🤡", "⚙️ C++ — poder total, memory leaks incluidos", "☕ Java — verboso pero de confianza"]},
  {"id": 4, "key": "entorno", "icon": "📍", "tag": "// módulo: entorno_de_desarrollo.config", "text": "📍 Primera cita — ¿en qué entorno hacemos deploy?", "options": ["☕ Café + laptops — pair programming romántico", "🎮 Hackathon de dos — ganar o hacer merge conflict", "🔭 Meetup tech — networking... pero de corazones", "📚 Librería + helado — leyendo \"Clean Code\" juntos"]},
  {"id": 5, "key": "stack_food", "icon": "🍽", "tag": "// módulo: stack_gastronomico.json", "text": "🍽 Escoge el stack gastronómico de la noche", "options": ["🍕 Pizza — el commit más sólido de la historia", "🍣 Sushi — raw data sin procesar", "🍔 Burger — arquitectura en capas (frontend, backend, queso)", "🌮 Tacos — open source y altamente customizable"]},
  {"id": 6, "key": "next_steps", "icon": "💫", "tag": "// módulo: next_steps.sh", "text": "✨ Después de la cita... ¿qué ejecutamos? (hypothetically 👀)", "options": ["🌙 Paseo nocturno debatiendo tabs vs spaces", "🎵 Playlist lo-fi para programar en bucle infinito", "🎲 Maratón de side projects — ganador elige el próximo repo", "🌠 Ver las estrellas — sin errores 404"]},
  {"id": 7, "key": "editor", "icon": "⌨️", "tag": "// módulo: editor_de_codigo.exe", "text": "⌨️ ¿Cuál es tu editor de código del alma?", "options": ["🟦 VS Code — lo usa medio planeta", "🐧 Vim — todavía no sé cómo salir", "🧠 IntelliJ / PyCharm — IDE completo, RAM incluida", "📝 Bloc de notas — soy un valiente sin autocompletado"]},
  {"id": 8, "key": "tema", "icon": "🌗", "tag": "// módulo: theme.config", "text": "🌗 ¿Modo oscuro o modo claro?", "options": ["🌙 Modo oscuro — mis ojos lo agradecen", "☀️ Modo claro — vivo al límite", "🤖 Automático — que decida el sistema", "🕐 Depende de la hora del bug"]},
  {"id": 9, "key": "indentacion", "icon": "↹", "tag": "// módulo: indentacion.lint", "text": "↹ El debate eterno: ¿tabs o spaces?", "options": ["➡️ Tabs — un carácter, mil posibilidades", "2️⃣ 2 espacios — compacto y elegante", "4️⃣ 4 espacios — el estándar de siempre", "✨ Que Prettier decida por nosotros"]},
  {"id": 10, "key": "bug", "icon": "🐛", "tag": "// módulo: debugging.log", "text": "🐛 Si la cita tiene un bug, ¿qué hacemos?", "options": ["🔍 Debuggear juntos con console.log por todos lados", "⏪ git revert — volvemos al último commit bueno", "🤷 \"En mi máquina funciona\" — y ya", "📚 Buscar en Stack Overflow, copiar y rezar"]},
  {"id": 11, "key": "combustible", "icon": "🥤", "tag": "// módulo: combustible_dev.env", "text": "🥤 ¿Con qué combustible compilamos la noche?", "options": ["☕ Café — dependencia oficial del desarrollador", "⚡ Bebida energética — modo hackathon", "🧋 Boba — dulce y con dependencias", "💧 Agua — hidratación, un buen hábito"]},
  {"id": 12, "key": "deploy", "icon": "🚀", "tag": "// módulo: deploy_segunda_cita.yml", "text": "🚀 ¿Cómo hacemos deploy de la segunda cita?", "options": ["▲ Vercel — push y listo, sin complicaciones", "🔥 Hotfix directo en producción — sin miedo", "🔁 Pipeline CI/CD semanal — con tests y todo", "😈 git push --force — que sea lo que sea"]},
  {"id": 13, "key": "sistema_operativo", "icon": "🐧", "tag": "// módulo: sistema_operativo.exe", "text": "¿En qué sistema operativo vivimos esta cita?", "options": ["🐧 Linux — controlo hasta el último proceso", "🪟 Windows — compatible con todo", "🍎 macOS — todo funciona (si pagas)", "📱 Android — programo desde el celular"]},
  {"id": 14, "key": "git_ramas", "icon": "🔀", "tag": "// módulo: git_ramas.exe", "text": "Tu forma de usar las ramas de git es...", "options": ["🌳 Una rama por feature, ordenadito", "🔥 Todo directo a main, sin miedo", "🌲 Cien ramas y no sé cuál es cuál", "🧹 Las borro apenas hago merge"]},
  {"id": 15, "key": "commits", "icon": "💬", "tag": "// módulo: commits.exe", "text": "Tus mensajes de commit suelen ser...", "options": ["📝 Claros y descriptivos", "🤷 \"fix\" y \"arreglos varios\"", "😭 \"por favor funciona\"", "🎭 En spanglish según el día"]},
  {"id": 16, "key": "hora_codigo", "icon": "☕", "tag": "// módulo: hora_codigo.exe", "text": "¿A qué hora programas mejor?", "options": ["🌅 Madrugada, con el café recién hecho", "☀️ En la mañana, con la mente fresca", "🌆 En la tarde, entre reuniones", "🌙 De noche, cuando todo está en silencio"]},
  {"id": 17, "key": "musica_codear", "icon": "🎧", "tag": "// módulo: musica_codear.exe", "text": "¿Qué música escuchas mientras programas?", "options": ["🎵 Lo-fi para concentrarme", "🎸 Rock o metal para el flow", "🎹 Música clásica o instrumental", "🔇 Silencio total, no me hables"]},
  {"id": 18, "key": "mascota_dev", "icon": "🐱", "tag": "// módulo: mascota_dev.exe", "text": "Tu compañero ideal de programación sería...", "options": ["🐱 Un gato sobre el teclado", "🐶 Un perro durmiendo a mis pies", "🦆 Un patito de goma para depurar", "🌵 Un cactus, bajo mantenimiento"]},
  {"id": 19, "key": "debug_patito", "icon": "🦆", "tag": "// módulo: debug_patito.exe", "text": "Cuando no encuentras un bug, ¿qué haces?", "options": ["🦆 Se lo explico al patito de goma", "🚶 Doy una vuelta y vuelvo", "🔍 Pongo console.log en todo", "💤 Lo dejo para mañana"]},
  {"id": 20, "key": "ia_codigo", "icon": "🤖", "tag": "// módulo: ia_codigo.exe", "text": "¿Cómo usas la IA al programar?", "options": ["🤝 Como copiloto, reviso todo", "📋 Copio y pego sin mirar", "💡 Solo para dudas y explicaciones", "🚫 Prefiero hacerlo a la antigua"]},
  {"id": 21, "key": "teclado", "icon": "⌨️", "tag": "// módulo: teclado.exe", "text": "¿Cuál es tu teclado ideal?", "options": ["🔊 Mecánico, que se oiga en todo el piso", "🤫 Silencioso, para no molestar", "💻 El de la laptop y ya", "🎮 Gamer con luces RGB"]},
  {"id": 22, "key": "monitores", "icon": "🖥️", "tag": "// módulo: monitores.exe", "text": "¿Cuántos monitores tienes en tu setup?", "options": ["1️⃣ Uno, y me alcanza", "2️⃣ Dos, un clásico", "3️⃣ Tres o más, soy la NASA", "📱 Solo la laptop y mi paciencia"]},
  {"id": 23, "key": "raton", "icon": "🖱️", "tag": "// módulo: raton.exe", "text": "¿Mouse o solo atajos de teclado?", "options": ["⌨️ Solo teclado, mouse es para débiles", "🖱️ Mouse, soy más visual", "🤝 Un poco de cada uno", "🖲️ Trackpad y a rezar"]},
  {"id": 24, "key": "comida_noche", "icon": "🍕", "tag": "// módulo: comida_noche.exe", "text": "Es de madrugada y hay deploy pendiente. ¿Qué cenas?", "options": ["🍕 Pizza fría de hace dos días", "🍜 Fideos instantáneos", "🥜 Snacks directo del escritorio", "🍳 Algo casero, hay que cuidarse"]},
  {"id": 25, "key": "bebida_dev", "icon": "🥤", "tag": "// módulo: bebida_dev.exe", "text": "La bebida oficial de este desarrollador es...", "options": ["☕ Café, siempre café", "⚡ Energética, versión turbo", "🧋 Té o boba", "💧 Agua, soy de los raros"]},
  {"id": 26, "key": "trabajo_remoto", "icon": "🏠", "tag": "// módulo: trabajo_remoto.exe", "text": "¿Dónde prefieres trabajar?", "options": ["🏠 Desde casa en pijama", "🏢 En la oficina, con gente", "☕ En una cafetería con wifi", "🌴 Desde cualquier lugar con internet"]},
  {"id": 27, "key": "modo_vim", "icon": "🌓", "tag": "// módulo: modo_vim.exe", "text": "¿Qué opinas de Vim?", "options": ["😍 Lo amo, no uso otra cosa", "😵 Entré y todavía no sé salir", "🤨 Prefiero un editor normal", "🛠️ Lo uso solo en servidores"]},
  {"id": 28, "key": "js_opinion", "icon": "🟨", "tag": "// módulo: js_opinion.exe", "text": "¿Qué piensas de JavaScript?", "options": ["❤️ Lo amo, a pesar de todo", "😅 Funciona... a veces", "🤡 [] + {} es más misterioso que el amor", "😤 Prefiero cualquier otro lenguaje"]},
  {"id": 29, "key": "python_opinion", "icon": "🐍", "tag": "// módulo: python_opinion.exe", "text": "Python para ti es...", "options": ["😌 Elegante y fácil de leer", "🐢 Lento pero muy práctico", "🧪 Ideal para datos e IA", "📦 Un entorno virtual por cada cosa"]},
  {"id": 30, "key": "lenguaje_nuevo", "icon": "🦀", "tag": "// módulo: lenguaje_nuevo.exe", "text": "¿Qué lenguaje te gustaría aprender?", "options": ["🦀 Rust, por la seguridad", "🐹 Go, por lo simple", "🔷 TypeScript, ya que estoy", "🧩 Haskell, por puro masoquismo"]},
  {"id": 31, "key": "framework_web", "icon": "⚛️", "tag": "// módulo: framework_web.exe", "text": "Tu framework web favorito es...", "options": ["⚛️ React, ¿cuál otro?", "💚 Vue, por lo amigable", "🅰️ Angular, soy de la vieja guardia", "⚡ Next.js o Svelte, lo más nuevo"]},
  {"id": 32, "key": "base_datos", "icon": "🗄️", "tag": "// módulo: base_datos.exe", "text": "¿Qué base de datos prefieres?", "options": ["🐘 PostgreSQL, la confiable", "🐬 MySQL, la de siempre", "🍃 MongoDB, sin esquemas", "📄 Un archivo JSON y ya"]},
  {"id": 33, "key": "contrasenas", "icon": "🔐", "tag": "// módulo: contrasenas.exe", "text": "Tus contraseñas son...", "options": ["🔑 Con gestor y todo único", "📝 Una sola para todo (shhh)", "🧠 Las memorizo, sé mis cosas", "📒 Escritas en un post-it"]},
  {"id": 34, "key": "navegador", "icon": "🌐", "tag": "// módulo: navegador.exe", "text": "¿Qué navegador usas?", "options": ["🟢 Chrome, el clásico", "🦊 Firefox, por principios", "🧭 Safari o Edge, sin drama", "🛡️ Brave o alguno privado"]},
  {"id": 35, "key": "carpetas", "icon": "🗂️", "tag": "// módulo: carpetas.exe", "text": "Tu carpeta de descargas está...", "options": ["✨ Ordenadita y organizada", "🌪️ Un caos con 4000 archivos", "🧹 Vacía, la limpio cada semana", "🤷 No sé ni dónde queda"]},
  {"id": 36, "key": "nombres_variables", "icon": "📛", "tag": "// módulo: nombres_variables.exe", "text": "Cuando nombras variables, usas...", "options": ["🧐 Nombres claros y largos", "🔤 Letras sueltas como x, y, z", "🎲 temp, temp2, temp_final_final", "🐱 Nombres de gatitos, obvio"]},
  {"id": 37, "key": "comentarios", "icon": "💭", "tag": "// módulo: comentarios.exe", "text": "Sobre comentar el código opinas que...", "options": ["✅ Se debe comentar todo", "🙅 El buen código no los necesita", "🕳️ Los hago... a veces", "📜 Comentarios con chistes internos"]},
  {"id": 38, "key": "documentacion", "icon": "📚", "tag": "// módulo: documentacion.exe", "text": "¿Lees la documentación antes de empezar?", "options": ["📖 Siempre, soy ordenado", "👀 Solo si algo falla", "🧑‍💻 Voy directo al ejemplo", "🙈 Cuál documentación"]},
  {"id": 39, "key": "pruebas", "icon": "🧪", "tag": "// módulo: pruebas.exe", "text": "Las pruebas (tests) para ti son...", "options": ["🧪 Sagradas, cubro todo", "⏳ Las hago después, lo juro", "🤞 El mejor test es producción", "🔥 Los escribo cuando algo explota"]},
  {"id": 40, "key": "refactor", "icon": "🔁", "tag": "// módulo: refactor.exe", "text": "Cuando ves código feo ajeno, tú...", "options": ["🧼 Lo refactorizo con cariño", "🙈 Mejor no toco nada", "📩 Dejo un comentario educado", "😤 Lo reescribo entero"]},
  {"id": 41, "key": "arquitectura", "icon": "🏗️", "tag": "// módulo: arquitectura.exe", "text": "Tu estilo al armar un proyecto es...", "options": ["📐 Planifico todo primero", "🏃 Empiezo a programar y veo", "🧱 Pequeños pasos, bien probados", "🎲 Improviso y rezo"]},
  {"id": 42, "key": "plazos", "icon": "⏱️", "tag": "// módulo: plazos.exe", "text": "Ante una fecha de entrega, tú...", "options": ["🗓️ Termino con tiempo de sobra", "⏰ Todo en la última noche", "📈 Divido en tareas y avanzo", "😅 Pido más tiempo, siempre"]},
  {"id": 43, "key": "bug_favorito", "icon": "🐛", "tag": "// módulo: bug_favorito.exe", "text": "Tu tipo de bug favorito (para odiar) es...", "options": ["🔤 Un punto y coma olvidado", "🌀 Uno que solo pasa en producción", "🧟 Uno que desaparece al depurar", "📅 Uno por culpa de las zonas horarias"]},
  {"id": 44, "key": "error_famoso", "icon": "😱", "tag": "// módulo: error_famoso.exe", "text": "¿Qué error te da más miedo ver?", "options": ["💥 Segmentation fault", "❓ undefined is not a function", "🔴 Error 500 sin más información", "🧱 Merge conflict gigante"]},
  {"id": 45, "key": "stack_overflow", "icon": "🔍", "tag": "// módulo: stack_overflow.exe", "text": "Stack Overflow es para ti...", "options": ["🙏 Una biblia", "📋 Fuente de todo mi código", "🤫 Lo uso, pero no lo cuento", "🤖 Ya no, ahora le pregunto a la IA"]},
  {"id": 46, "key": "respaldos", "icon": "💾", "tag": "// módulo: respaldos.exe", "text": "¿Haces copias de seguridad?", "options": ["☁️ Automáticas, en la nube", "💽 A mano, cada tanto", "🤞 No, confío en la suerte", "😰 Solo después de perder algo"]},
  {"id": 47, "key": "dispositivo_extra", "icon": "🔌", "tag": "// módulo: dispositivo_extra.exe", "text": "¿Qué gadget no puede faltar?", "options": ["🎧 Audífonos con cancelación", "🖱️ Un buen mouse", "🔋 Un cargador, siempre", "📱 Mi celular de respaldo"]},
  {"id": 48, "key": "bateria", "icon": "🔋", "tag": "// módulo: bateria.exe", "text": "La batería de tu laptop casi siempre está...", "options": ["🟢 Llena, cargo a diario", "🟡 A la mitad", "🔴 Al uno por ciento", "🔌 Conectada, nunca la desenchufo"]},
  {"id": 49, "key": "libro_dev", "icon": "📖", "tag": "// módulo: libro_dev.exe", "text": "¿Qué libro de programación recomiendas?", "options": ["📘 Clean Code", "🧠 El programador pragmático", "🏛️ Patrones de diseño", "📕 Ninguno, leo otra cosa"]},
  {"id": 50, "key": "aprendizaje", "icon": "🎓", "tag": "// módulo: aprendizaje.exe", "text": "Para aprender algo nuevo, prefieres...", "options": ["🎥 Videos y tutoriales", "📚 Documentación y libros", "🛠️ Hacer proyectos reales", "👥 Preguntarle a alguien que sepa"]},
  {"id": 51, "key": "trabajo_ideal", "icon": "🧑‍🚀", "tag": "// módulo: trabajo_ideal.exe", "text": "Tu trabajo soñado sería...", "options": ["🎮 En una empresa de videojuegos", "🚀 En una startup", "🔒 En ciberseguridad", "🎓 Enseñando a programar"]},
  {"id": 52, "key": "estres", "icon": "🧯", "tag": "// módulo: estres.exe", "text": "Cuando algo explota en producción, tú...", "options": ["🧘 Mantengo la calma", "🏃 Corro al teclado", "📞 Llamo a medio equipo", "🙈 Finjo que no vi nada"]},
  {"id": 53, "key": "meme_dev", "icon": "😂", "tag": "// módulo: meme_dev.exe", "text": "¿Qué meme de programadores te representa?", "options": ["🔥 Esto está bien (todo se quema)", "🤷 En mi máquina funciona", "🌀 Programando a las 3 AM", "🦆 El patito de goma"]},
  {"id": 54, "key": "podcast", "icon": "🎤", "tag": "// módulo: podcast.exe", "text": "¿Qué prefieres escuchar de tecnología?", "options": ["🎙️ Podcasts", "📺 Videos de YouTube", "📰 Blogs y noticias", "📚 Libros"]},
  {"id": 55, "key": "compras", "icon": "🛒", "tag": "// módulo: compras.exe", "text": "Tu compra tech favorita siempre es...", "options": ["⌨️ Periféricos", "🎧 Audio", "💻 Una laptop nueva", "🔌 Cables y adaptadores que nunca sobran"]},
  {"id": 56, "key": "proyecto_lado", "icon": "🛠️", "tag": "// módulo: proyecto_lado.exe", "text": "Un proyecto personal que te gustaría crear es...", "options": ["🎮 Un videojuego", "🌐 Una app útil", "🤖 Un bot o una IA", "📱 Algo para mi pareja"]},
  {"id": 57, "key": "logro", "icon": "🏆", "tag": "// módulo: logro.exe", "text": "Tu mayor orgullo programando fue...", "options": ["🚀 Publicar mi primer proyecto", "🐛 Resolver un bug imposible", "🎓 Aprender sin ayuda", "🤝 Ayudar a alguien a aprender"]},
  {"id": 58, "key": "pasion", "icon": "🔥", "tag": "// módulo: pasion.exe", "text": "Lo que más te apasiona del código es...", "options": ["🎨 Crear cosas desde cero", "🧩 Resolver problemas", "⚙️ Automatizar todo", "🌍 Que lo use mucha gente"]},
  {"id": 59, "key": "docker", "icon": "🐳", "tag": "// módulo: docker.exe", "text": "¿Qué opinas de Docker?", "options": ["🐳 Lo uso para todo, un contenedor por cosa", "📦 Sé lo básico y me alcanza", "😵 Mi imagen pesa más que mi laptop", "🙅 Prefiero instalar directo"]},
  {"id": 60, "key": "apis", "icon": "🔌", "tag": "// módulo: apis.exe", "text": "Cuando consumes una API, lo primero que haces es...", "options": ["📖 Leer la documentación completa", "🧪 Probar con Postman a ver qué sale", "🙏 Copiar el ejemplo y rezar", "🔍 Ver qué manda el navegador"]},
  {"id": 61, "key": "algoritmos", "icon": "🧮", "tag": "// módulo: algoritmos.exe", "text": "Los algoritmos para ti son...", "options": ["❤️ Mi parte favorita de programar", "😅 Los sufrí en la universidad", "🧠 Solo los que necesito", "🚫 Que los resuelva la librería"]},
  {"id": 62, "key": "leetcode", "icon": "🏆", "tag": "// módulo: leetcode.exe", "text": "¿Practicas problemas tipo LeetCode?", "options": ["🏆 Todos los días, soy de ranking", "📅 De vez en cuando, antes de entrevistas", "😴 Intenté una vez y me dormí", "🙈 Eso es para otros"]},
  {"id": 63, "key": "recursion", "icon": "🔁", "tag": "// módulo: recursion.exe", "text": "Para explicar la recursión, tú dirías...", "options": ["🔁 Ver «recursión»", "🪞 Dos espejos frente a frente", "🧅 Una cebolla de funciones", "💥 Hasta que se acaba la pila"]},
  {"id": 64, "key": "big_o", "icon": "⏳", "tag": "// módulo: big_o.exe", "text": "Si tu relación fuera un algoritmo, sería...", "options": ["⚡ O(1), instantánea", "📈 O(n), crece contigo", "🐢 O(n²), con calma", "♾️ Un bucle infinito (de cariño)"]},
  {"id": 65, "key": "sql_joins", "icon": "🗃️", "tag": "// módulo: sql_joins.exe", "text": "En SQL, el JOIN que más usas es...", "options": ["🤝 INNER JOIN, solo lo que coincide", "⬅️ LEFT JOIN, para no perder nada", "🔀 FULL JOIN, todos incluidos", "🙊 SELECT * y ya, no pregunten"]},
  {"id": 66, "key": "regex", "icon": "🧵", "tag": "// módulo: regex.exe", "text": "Las expresiones regulares te parecen...", "options": ["🧙 Magia pura, las domino", "😵 Un conjuro que olvido siempre", "🔍 Las busco cada vez", "🚫 Las evito a toda costa"]},
  {"id": 67, "key": "centrar_div", "icon": "🎯", "tag": "// módulo: centrar_div.exe", "text": "Centrar un div es...", "options": ["😎 Flexbox y listo", "🧩 Grid, soy moderno", "😭 Todavía me cuesta", "🪄 margin: auto, a la antigua"]},
  {"id": 68, "key": "front_back", "icon": "🎨", "tag": "// módulo: front_back.exe", "text": "Entre frontend y backend, prefieres...", "options": ["🎨 Frontend, me gusta lo visual", "⚙️ Backend, la lógica es lo mío", "🔄 Full stack, de todo un poco", "🗄️ Bases de datos y nada más"]},
  {"id": 69, "key": "cicd", "icon": "🚦", "tag": "// módulo: cicd.exe", "text": "El pipeline de CI/CD de tu proyecto es...", "options": ["✅ Automático y con todos los tests", "🔧 Medio armado, lo arreglo luego", "🚀 Subo y que Dios diga", "📭 No tengo, subo a mano"]},
  {"id": 70, "key": "nube", "icon": "☁️", "tag": "// módulo: nube.exe", "text": "Para alojar tus proyectos usas...", "options": ["☁️ AWS, Google Cloud o Azure", "▲ Vercel o Netlify, lo fácil", "🏠 Mi propio servidor en casa", "🆓 GitHub Pages, que sea gratis"]},
  {"id": 71, "key": "monolito", "icon": "🧱", "tag": "// módulo: monolito.exe", "text": "Entre monolito y microservicios, tú eres...", "options": ["🏛️ Monolito, todo junto y simple", "🧩 Microservicios, cada cosa aparte", "⚖️ Un monolito modular, el término medio", "🤷 El que no se meta en eso"]},
  {"id": 72, "key": "open_source", "icon": "🌍", "tag": "// módulo: open_source.exe", "text": "El código abierto para ti es...", "options": ["❤️ Lo mejor de la comunidad", "🤝 Contribuyo cuando puedo", "👀 Lo uso, pero no aporto", "📜 Me importa mucho la licencia"]},
  {"id": 73, "key": "code_review", "icon": "👀", "tag": "// módulo: code_review.exe", "text": "Cuando te hacen code review, tú...", "options": ["🙏 Agradezco cada comentario", "😤 Me defiendo hasta el final", "😰 Me da un poquito de miedo", "✅ Aprendo y lo aplico"]},
  {"id": 74, "key": "pair_programming", "icon": "👯", "tag": "// módulo: pair_programming.exe", "text": "Programar en pareja, ¿cómo lo ves?", "options": ["💞 Genial, aprendo muchísimo", "😅 Me pongo nervioso, me ven", "🧑‍🏫 Prefiero explicar yo", "🎧 Mejor cada quien en lo suyo"]},
  {"id": 75, "key": "agile", "icon": "📋", "tag": "// módulo: agile.exe", "text": "En las reuniones tipo stand-up, tú...", "options": ["⏱️ Resumo en un minuto", "🗣️ Hablo de más", "😴 Espero que termine pronto", "📝 Llevo todo anotado"]},
  {"id": 76, "key": "deuda_tecnica", "icon": "🏚️", "tag": "// módulo: deuda_tecnica.exe", "text": "La deuda técnica de tus proyectos es...", "options": ["💎 Casi nula, todo limpio", "📉 Manejable, la pago poco a poco", "🌋 Un volcán a punto de explotar", "🙈 Prefiero no mirarla"]},
  {"id": 77, "key": "spaghetti", "icon": "🍝", "tag": "// módulo: spaghetti.exe", "text": "Ante el código spaghetti heredado, tú...", "options": ["🧹 Lo limpio con paciencia", "🔥 Lo reescribo desde cero", "😵 Lo dejo como está y me alejo", "📜 Agrego un TODO y sigo"]},
  {"id": 78, "key": "versionado", "icon": "🏷️", "tag": "// módulo: versionado.exe", "text": "Para numerar tus versiones usas...", "options": ["🔢 Versionado semántico, bien ordenado", "🎲 v1, v2, v_final, v_final_ahora_si", "📅 La fecha de hoy", "🙃 No versiono, solo guardo"]},
  {"id": 79, "key": "terminal", "icon": "🖥️", "tag": "// módulo: terminal.exe", "text": "Tu relación con la terminal es...", "options": ["⌨️ Vivo ahí, uso todo con comandos", "🪟 Solo lo básico, lo demás con ratón", "😬 Me da respeto escribir comandos", "🎨 La tengo con un tema precioso"]},
  {"id": 80, "key": "alias", "icon": "📟", "tag": "// módulo: alias.exe", "text": "Tus alias y atajos en la terminal son...", "options": ["⚡ Un montón, ahorro cada tecla", "📝 Uno o dos útiles", "🙅 Ninguno, escribo todo", "🤖 Los dejé a mi script"]},
  {"id": 81, "key": "tema_editor", "icon": "🌈", "tag": "// módulo: tema_editor.exe", "text": "¿Qué tema de color usas en tu editor?", "options": ["🧛 Dracula, el rey", "🌑 Algún oscuro minimalista", "☀️ Uno claro, soy rebelde", "🎨 El que traiga por defecto"]},
  {"id": 82, "key": "fuente", "icon": "🔤", "tag": "// módulo: fuente.exe", "text": "¿Qué fuente usas para programar?", "options": ["🔤 Fira Code, con sus ligaduras", "🧱 JetBrains Mono", "📟 La que venga, no me importa", "✨ Alguna rara que nadie conoce"]},
  {"id": 83, "key": "ssh", "icon": "🔑", "tag": "// módulo: ssh.exe", "text": "Las llaves SSH para ti son...", "options": ["🗝️ Las tengo ordenadas y con respaldo", "🤷 Las generé una vez y se perdieron", "😰 Me da miedo tocarlas", "📋 Copio la misma a todo"]},
  {"id": 84, "key": "seguridad", "icon": "🛡️", "tag": "// módulo: seguridad.exe", "text": "En ciberseguridad, tú eres...", "options": ["🕵️ Curioso, me gusta romper cosas (éticamente)", "🔐 Cuido mucho mis datos", "🙈 Prefiero no pensar en eso", "📚 Estoy aprendiendo"]},
  {"id": 85, "key": "blockchain", "icon": "⛓️", "tag": "// módulo: blockchain.exe", "text": "El blockchain y las criptomonedas te parecen...", "options": ["🚀 El futuro", "🤔 Interesante, pero con cuidado", "📉 Demasiado ruido", "🙅 Cero interés"]},
  {"id": 86, "key": "machine_learning", "icon": "🧠", "tag": "// módulo: machine_learning.exe", "text": "El aprendizaje automático (ML) para ti es...", "options": ["🤩 Mi tema favorito", "📚 Algo que quiero aprender", "🧪 Lo uso si hace falta", "😵 Mucha matemática para mí"]},
  {"id": 87, "key": "prompts", "icon": "💬", "tag": "// módulo: prompts.exe", "text": "Tus prompts para la IA suelen ser...", "options": ["📝 Largos y bien detallados", "⚡ Cortos y directos", "🎲 Los voy ajustando hasta que sirve", "🤝 Una conversación, como con un amigo"]},
  {"id": 88, "key": "bots", "icon": "🤖", "tag": "// módulo: bots.exe", "text": "Un bot que te gustaría crear sería...", "options": ["💬 Uno de chat con personalidad", "📅 Uno que me organice la vida", "🎮 Uno para jugar", "💌 Uno que mande piropos de programador"]},
  {"id": 89, "key": "game_jam", "icon": "🎮", "tag": "// módulo: game_jam.exe", "text": "Si hacemos un videojuego en una game jam, tú harías...", "options": ["🎨 El arte y los gráficos", "⚙️ La lógica y el código", "🎵 La música y los sonidos", "📝 La historia y las ideas"]},
  {"id": 90, "key": "advent_code", "icon": "🎄", "tag": "// módulo: advent_code.exe", "text": "Un reto como Advent of Code, ¿lo harías juntos?", "options": ["🎄 Sí, cada día un problema", "🏆 Sí, pero compitiendo", "😅 Sí, hasta que se ponga difícil", "💤 Mejor solo mirar"]},
  {"id": 91, "key": "github_stars", "icon": "⭐", "tag": "// módulo: github_stars.exe", "text": "Las estrellas de GitHub para ti son...", "options": ["⭐ Muy importantes, las colecciono", "👀 Un buen indicador de calidad", "🙃 Solo números", "🤫 Doy estrellas en silencio"]},
  {"id": 92, "key": "readme", "icon": "📄", "tag": "// módulo: readme.exe", "text": "Tu README suele estar...", "options": ["✨ Completo, con capturas y todo", "📝 Con lo mínimo necesario", "🕳️ Vacío o con una sola línea", "💜 Con muchos emojis y cariño"]},
  {"id": 93, "key": "issues", "icon": "🐙", "tag": "// módulo: issues.exe", "text": "Si te abren un issue en tu repo, tú...", "options": ["⚡ Respondo al instante", "📅 Lo reviso cuando puedo", "😱 Entro en pánico", "🙈 Lo cierro y ya"]},
  {"id": 94, "key": "modo_noche", "icon": "🌙", "tag": "// módulo: modo_noche.exe", "text": "Programar de madrugada es...", "options": ["🌙 Cuando mejor me sale", "😵 Solo cuando hay urgencia", "☕ Posible con mucho café", "🛌 Prefiero dormir y programar luego"]},
  {"id": 95, "key": "entorno_casa", "icon": "🏠", "tag": "// módulo: entorno_casa.exe", "text": "Tu escritorio de programador está...", "options": ["✨ Ordenado, con plantas y luces", "🥤 Con vasos, cables y papeles", "📚 Con libros de programación", "🐱 Con un gato encima del teclado"]},
  {"id": 96, "key": "notificaciones", "icon": "🔔", "tag": "// módulo: notificaciones.exe", "text": "Las notificaciones mientras programas...", "options": ["🔕 Todas apagadas, necesito foco", "🔔 Solo las importantes", "📱 Contesto todo al instante", "🙃 Ni sé dónde están"]},
  {"id": 97, "key": "wifi_dev", "icon": "📡", "tag": "// módulo: wifi_dev.exe", "text": "Si se cae internet mientras programas, tú...", "options": ["📱 Comparto datos del celular", "🛠️ Sigo trabajando sin conexión", "😅 Aprovecho para descansar", "📞 Llamo al proveedor, ¡ya!"]},
  {"id": 98, "key": "hackathon", "icon": "🎒", "tag": "// módulo: hackathon.exe", "text": "En un hackathon, tu rol sería...", "options": ["🧠 El que arma la idea", "⌨️ El que programa sin parar", "🎨 El que diseña la interfaz", "🎤 El que presenta al final"]},
  {"id": 99, "key": "commit_cita", "icon": "💜", "tag": "// módulo: commit_cita.exe", "text": "¿Qué mensaje de commit le pondrías a nuestra cita?", "options": ["✨ feat: primera cita exitosa", "🐛 fix: nervios resueltos", "🚀 deploy: empezamos algo bonito", "💜 refactor: mejorando el futuro juntos"]},
  {"id": 100, "key": "pull_request", "icon": "🔥", "tag": "// módulo: pull_request.exe", "text": "Si nuestra relación fuera un pull request, estaría...", "options": ["✅ Aprobada y lista para merge", "💬 Con comentarios por resolver", "🔄 En revisión, con ganas", "🚀 Ya en producción"]},
  {"id": 101, "key": "metricas", "icon": "📊", "tag": "// módulo: metricas.exe", "text": "Para medir cómo salió la cita, usaríamos...", "options": ["📈 Una gráfica de felicidad", "⭐ Una calificación de 1 a 5", "💬 Un feedback detallado", "🧪 Una prueba A/B"]},
  {"id": 102, "key": "stack_favorito", "icon": "🛠️", "tag": "// módulo: stack_favorito.exe", "text": "Para empezar un proyecto juntos, ¿qué stack elegimos?", "options": ["⚛️ React y Next.js", "🐍 Python y FastAPI", "🟢 Node y Express", "🦀 Rust, por diversión"]},
];

const withIds = (list: Question[]): Question[] => list.map((q, i) => ({ ...q, id: 3 + i }));

function pickRandom(list: Question[], n: number): Question[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

const headerImages = [
  asset('/memes/gatito3.png'),
  asset('/memes/gatito4.png'),
  asset('/memes/gatito5.png'),
  asset('/memes/gatito6.png'),
  asset('/memes/gatito7.png'),
];
const catHeaderImg = asset('/memes/gatito7.png');
const catImagesStep1 = [asset('/memes/1.png'), asset('/memes/2.png'), asset('/memes/5.png')];
const catImagesStep2 = [asset('/memes/3.jpg'), asset('/memes/4.png')];

const floatCatSrcs = [
  asset('/memes/1.png'),
  asset('/memes/2.png'),
  asset('/memes/3.jpg'),
  asset('/memes/4.png'),
  asset('/memes/5.png'),
];

const NOTIFY_EMAIL = 'cruzangelsaid34@gmail.com';

const initialAns: Record<number, string> = {};

// ===== Gatitos pixelados que caminan por la parte de abajo (como las mascotas de VS Code) =====
// El gatito blanco lleva gorrito, y el celeste es el programador: va a su escritorio con monitores y VS Code.
const PET_FRAMES: Record<string, Record<string, string>> = {
  blanco: {
    walk1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtUlEQVR42mNgIBH8hwIYn5EUzdMkdP57ScozMDAwMGx7/pAh68UVRpI0o4NpEjr/iTYhJrnq/2JjA4bYsxcYGBgYGODsmOSq/8Qa8OvXHxQck1z1n4mBgYHh168//0kJCxUVIzibBdkGYg24c+cc3BuMyJrnTW/CqSkps450P2LzM7o+FnSBJy8+YbVARoIPqzgjOWGwZG4b9uiHORPdubjEGRgYGJgYKASM6AGJzam4xAcHAACwl5wxUb178gAAAABJRU5ErkJggg==',
    walk2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAr0lEQVR42mNgIBH8hwIYn5EUzdMkdP57ScozMDAwMGx7/pAh68UVRpI0o4NpEjr/iTYhJrnq/2JjA4bYsxcYGBgYGODsmOSq/8Qa8OvXHxQck1z1n4mBgYHh168//0kJCxUVIzibBdkGYg24c+cc3BuMyJrnTW/CqSkps450P2LzM7o+FnSBJy8+YbVARoIPqzgLSc4kBsCciotGV89EqYWM2AITn4Ylc9sYGQYVAAB2S5V9v0mahQAAAABJRU5ErkJggg==',
    stand: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAs0lEQVR42mNgIBH8hwIYn5EUzdMkdP57ScozMDAwMGx7/pAh68UVRpI0o4NpEjr/iTYhJrnq/2JjA4bYsxcYGBgYGODsmOSq/8Qa8OvXHxQck1z1n4mBgYHh168//0kJCxUVIzibBdkGYg24c+cc3BuMyJrnTW/CqSkps450P2LzM7o+FnSBJy8+YbVARoIPqzgjOWGwZG4b7uiHORXZydjEYICJgULAiC0w0Z2LTYxh0AAAb1+cMQ3iq4oAAAAASUVORK5CYII=',
    sit: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0klEQVR42mNgoBAwElIwTULnv5ekPAMDAwPDtucPGbJeXGEk2vRpEjr/0cE0CZ3/yGpY8BlwzNuPIXP6aobYsxcYGBgYGBYbGzAc8/ZjYJh7hTgDGBgYGH6nBDHMSwmCsBkYGBighsEAE7HeUVExwipOtAF37pyDe4PoMGBgYGBIyqwjLRpjkqv+41K8ZG4bhnqsLpg3vYlolzBRmhJZcDn/yYtPRBnAhKwZmx+JBjHJVf9jkqv+//r15/+vX3/+33v0Do5hYtgCmJHYGMAXExQBAGxUY+mEgSAIAAAAAElFTkSuQmCC',
    lie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAApklEQVR42mNgGAUkg/9QAOMzkqJ5moTOfy9JeQYGBgaGbc8fMmS9uMJIkmZ0ME1C5z/RJsQkV/1fbGzAEHv2AgMDAwMDjM2CrICQIb9TghjmpQRB2AwMDAzIBjAwMDDMm96EU3NSZh2craJixHDnzjkGBgYGBiZibEYHMM2LjQ1QXcDAwMDw5MUnolyBEo3EugLmxaTMOoYlc9sYSUoH6JbADBh4AAAfCE2FKzLApwAAAABJRU5ErkJggg==',
  },
  celeste: {
    walk1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxklEQVR42mNgGGjASKxCk5hp/5kfbEIR+6vgx8BCrAHMDzYxnIhKYjA99oaBgYGB4bSVCIPpsTcMjCYx0/6fWZKF1yXmNh7/GRgYGOI7lqGIz5uxgoGJgYGBYdqRd//xGeDo4onCr4vyg7NZkP2Iy4D9e1D93rRsE9wbjMiakzIicLpi3owV+GPBJGbaf3wGwAxBDy+MWLBQ4sGq+cS9L4RdQGyU4oy1aUfe/TeJmfYfRhMSZ2BggEQj1ZIyuukwp+ISHxwAALCXU7b2lOEDAAAAAElFTkSuQmCC',
    walk2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAx0lEQVR42mNgGGjASKxCk5hp/5kfbEIR+6vgx8BCrAHMDzYxnIhKYjA99oaBgYGB4bSVCIPpsTcMjCYx0/6fWZKF1yXmNh7/GRgYGOI7lqGIz5uxgoGJgYGBYdqRd//xGeDo4onCr4vyg7NZkP2Iy4D9e1D93rRsE9wbjMiakzIicLpi3owV+GPBJGbaf3wGwAxBDy+MWLBQ4sGq+cS9L1jFWdBtmEdiQmKCMc4syWI8sySLEeYNXDROA6iWlPFFJ8ylDIMKAAA29EDFBzCN7AAAAABJRU5ErkJggg==',
    stand: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxklEQVR42mNgGGjASKxCk5hp/5kfbEIR+6vgx8BCrAHMDzYxnIhKYjA99oaBgYGB4bSVCIPpsTcMjCYx0/6fWZKF1yXmNh7/GRgYGOI7lqGIz5uxgoGJgYGBYdqRd//xGeDo4onCr4vyg7NZkP2Iy4D9e1D93rRsE9wbjMiakzIicLpi3owV+GPBJGbaf3wGwAxBDy+MWLBQ4sGq+cS9L4RdQGyU4o21aUfe/TeJmfYfRuMSgwEmqidldBvOLMlixCbGMGgAAHU3U7ZSVcKeAAAAAElFTkSuQmCC',
    sit: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuUlEQVR42mNgGGjAiE/SJGbaf+YHm1DE/ir4MZxZkgXXx4LPAOYHmxhORCUxmB57w8DAwMBw2koEziZogLmNx38GBgaG6XouDEl6ELHpDAwMDMdWoKhjwmWAo4snCr8uyg+rOpwG7N+zHYXftGwT3BskBSI2ceRAZCRWE7pGvIGYlBGBITZvxgrSwoBYwILL+RZKPKguwGEAE7JmbH4kBJjQXYDN/yfufWFIyojAGsCMxMYAvpigCAAANzg64UdIKJoAAAAASUVORK5CYII=',
    lie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAp0lEQVR42mNgGAUDDxiJVWgSM+0/84NNKGJ/FfwYWIg1gPnBJoYTUUkMpsfeMDAwMDCcthJhMD32BuECk5hp//FpZmBgYIjvWIYiPm/GClQXJGVEYDXg0Z7fDPv3bIfz66L8GJqWQQxlwmczDCBrZmBggGs+bSWCGQYWSjwYBlis2sSQVjaHYd6MFahegMUCMa5A9uK8GSsYzizJYiQ5GpH5MAMGHgAArOE1gpNb/1sAAAAASUVORK5CYII=',
  },
  naranja: {
    walk1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArElEQVR42mNgGGjASKzCdg+R/wwMDAyVO94wIvOZSLGtwqqJod1D5H+7h8j/CqsmBgYGBgaWdg+R/zBTCYGvCocZchVcIWyGwwwMx6Au+LIo8j8pLjEp2whns6D7kRhwpssf7iWUAMmNcsWpafKy3fhjod1D5D8+A2CGoIcXC7oibpNA7AF4Zj1hFxAbBjhj7cuiyP/tHiL/YTQhcZITEsGkjG46erIl6IUBAQBM7Ux0GkXLtgAAAABJRU5ErkJggg==',
    walk2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAr0lEQVR42mNgGGjASKzCdg+R/wwMDAyVO94wIvOZSLGtwqqJod1D5H+7h8j/CqsmBgYGBgaWdg+R/zBTCYGvCocZchVcIWyGwwwMx6Au+LIo8j8pLjEp2whns6D7kRhwpssf7iWUAMmNcsWpafKy3fhjod1D5D8+A2CGoIcXC7oibpNA7AF4Zj1WcRYMZ+JwKi4ATweVO94wVu54wwjzBi4apwFUS8qEopPYREc/AAAaOzz6K2x7UwAAAABJRU5ErkJggg==',
    stand: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAr0lEQVR42mNgGGjASKzCdg+R/wwMDAyVO94wIvOZSLGtwqqJod1D5H+7h8j/CqsmBgYGBgaWdg+R/zBTCYGvCocZchVcIWyGwwwMx6Au+LIo8j8pLjEp2whns6D7kRhwpssf7iWUAMmNcsWpafKy3fhjod1D5D8+A2CGoIcXC7oibpNA7AF4Zj1hFxAbBnhj7cuiyP/tHiL/YTQuMRhgonpSRrehcscbRmxiDIMGAAAWbUx0lBIzJwAAAABJRU5ErkJggg==',
    sit: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmUlEQVR42mNgGNSg3UPkf7uHyH9cfAYGBgYmQoZUWDXBNVZYNWHIsxAy4KvCYYZcBVcIm+EwA8MxVHkmYr1jUrYRqzjRBpzp8od7iSQvTF62G00Elc+ILeRxGVa54w0jUYGYG+VKhEtIDANcgAWX87lNAlFVEnJBu4fIf2x+JASY0F2Azf9fz6xnyI1yxRrAjMTGAL6YoAgAAMJ3NP3DmU8MAAAAAElFTkSuQmCC',
    lie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmUlEQVR42mNgGAUDDxiJVdjuIfKfgYGBoXLHG0ZkPhMptlVYNTG0e4j8b/cQ+V9h1cTAwMDAwIJuAz7wVeEwQ66CK4TNcJiB4RiSAQwMDAy5Ua44NU9ethvONinbyHCmy5+BgYGBgYkYm9EBTHOFVROqCxgYGBi4TQKx61q2G8UVELCbgZFY/yN7cfKy3fDYIDkaYQBmwMADAGXKLYfgVlEOAAAAAElFTkSuQmCC',
  },
};
const PET_COLORS = ['blanco', 'celeste', 'naranja'];
const PET_SIZE = 48; // sprite de 16 px ampliado x3

// Escritorio del gatito programador (se dibuja en un canvas de 64x34 px, ampliado x2)
const STATION_X = 6;
const STATION_W = 128;
const STATION_H = 68;
const DESK_SEAT_X = STATION_X + STATION_W - 2; // donde se sienta el gatito programador

const CODE_COLORS = ['#c586c0', '#dcdcaa', '#ce9178', '#4ec9b0', '#6a9955', '#9cdcfe', '#569cd6'];
const TERM_COLORS = ['#30d158', '#d4d4d4', '#9cdcfe', '#dcdcaa'];
type CodeLine = { indent: number; segs: { len: number; color: string }[] };
type TermLine = { len: number; color: string; prompt: boolean };

const randInt = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
const newCodeLine = (): CodeLine => ({
  indent: randInt(0, 3),
  segs: Array.from({ length: randInt(1, 3) }, () => ({ len: randInt(2, 6), color: CODE_COLORS[randInt(0, CODE_COLORS.length - 1)] })),
});
const newTermLine = (): TermLine => ({ len: randInt(3, 14), color: TERM_COLORS[randInt(0, TERM_COLORS.length - 1)], prompt: Math.random() < 0.4 });

function drawStation(ctx: CanvasRenderingContext2D, now: number, code: CodeLine[], term: TermLine[]) {
  const r = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  ctx.clearRect(0, 0, 64, 34);
  // escritorio
  r(0, 26, 64, 2, '#8b5a2b'); r(0, 28, 64, 1, '#6b4423'); r(2, 29, 2, 5, '#6b4423'); r(60, 29, 2, 5, '#6b4423');
  // torre de la computadora
  r(55, 5, 8, 21, '#3a3f4b'); r(56, 7, 6, 1, '#1f232b'); r(56, 9, 6, 1, '#1f232b'); r(56, 11, 6, 2, '#2b303b');
  r(58, 22, 2, 1, Math.floor(now / 400) % 2 ? '#30d158' : '#1d5c33');
  // monitor 1: Visual Studio Code con líneas de código
  r(2, 7, 25, 18, '#2b2f3a'); r(3, 8, 23, 14, '#1e1e1e'); r(12, 25, 5, 1, '#444444');
  r(3, 8, 23, 1, '#3c3c3c');
  r(3, 9, 2, 12, '#333333');
  [10, 13, 16].forEach((y) => r(3, y, 2, 2, '#858585'));
  r(3, 21, 23, 1, '#007acc');
  code.forEach((ln, i) => {
    let x = 6 + ln.indent * 2;
    const y = 10 + i * 2;
    ln.segs.forEach((sg) => {
      const w = Math.min(sg.len, 25 - x);
      if (w > 0) r(x, y, w, 1, sg.color);
      x += sg.len + 1;
    });
  });
  const last = code[code.length - 1];
  if (last && Math.floor(now / 450) % 2 === 0) {
    let x = 6 + last.indent * 2;
    last.segs.forEach((sg) => { x += sg.len + 1; });
    if (x < 25) r(x, 10 + (code.length - 1) * 2, 1, 1, '#ffffff');
  }
  // monitor 2: terminal
  r(29, 7, 25, 18, '#2b2f3a'); r(30, 8, 23, 14, '#0c0c0c'); r(39, 25, 5, 1, '#444444');
  r(30, 8, 23, 1, '#3c3c3c');
  term.forEach((t, i) => {
    const y = 10 + i * 2;
    if (t.prompt) r(31, y, 1, 1, '#bd93f9');
    r(33, y, Math.min(t.len, 18), 1, t.color);
  });
  // teclado
  r(18, 24, 20, 1, '#94a3b8'); r(18, 25, 20, 1, '#cbd5e1');
}

type PetMode = 'walk' | 'sit' | 'lie' | 'climb' | 'goDesk' | 'code';
type Pet = { x: number; y: number; dir: 1 | -1; mode: PetMode; until: number; wall: 'l' | 'r' | null; climbDir: 1 | -1; codeAt: number };

function PixelPets({ message, msgKey }: { message: string | null; msgKey: string }) {
  const petEls = useRef<(HTMLImageElement | null)[]>([]);
  const ballEl = useRef<HTMLDivElement | null>(null);
  const bubbleEl = useRef<HTMLDivElement | null>(null);
  const stationEl = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = window.innerWidth;
    const onResize = () => { W = window.innerWidth; };
    window.addEventListener('resize', onResize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const t0 = performance.now();
    const pets: Pet[] = PET_COLORS.map((_, i) => ({
      x: rand(10, Math.max(20, W - PET_SIZE - 10)) * (0.3 + i * 0.3),
      y: 0,
      dir: Math.random() < 0.5 ? 1 : -1,
      mode: 'walk',
      until: t0 + rand(1500, 4000),
      wall: null,
      climbDir: 1,
      codeAt: t0 + rand(4000, 8000),
    }));
    const ball = { on: false, x: 0, y: 0, vx: 0, vy: 0, until: 0, nextAt: t0 + 6000 };

    const ctx = stationEl.current ? stationEl.current.getContext('2d') : null;
    const code: CodeLine[] = Array.from({ length: 5 }, newCodeLine);
    const term: TermLine[] = Array.from({ length: 5 }, newTermLine);
    let lastLine = t0;

    const draw = (i: number, frame: string, color: string) => {
      const el = petEls.current[i];
      if (!el) return;
      const p = pets[i];
      const src = PET_FRAMES[color][frame];
      if (el.dataset.f !== frame) { el.src = src; el.dataset.f = frame; }
      let tf = `translate(${p.x}px, ${-p.y}px)`;
      if (p.mode === 'climb') {
        if (p.wall === 'l') tf += p.climbDir === 1 ? ' rotate(90deg) scaleX(-1)' : ' rotate(90deg)';
        else tf += p.climbDir === 1 ? ' rotate(-90deg)' : ' rotate(-90deg) scaleX(-1)';
      } else if (p.dir === -1) tf += ' scaleX(-1)';
      el.style.transform = tf;
    };

    if (reduce) {
      pets.forEach((p, i) => { p.mode = 'sit'; p.x = 20 + i * 70; draw(i, 'sit', PET_COLORS[i]); });
      pets[1].x = DESK_SEAT_X; pets[1].dir = -1; draw(1, 'sit', PET_COLORS[1]);
      if (ctx) drawStation(ctx, 0, code, term);
      return () => window.removeEventListener('resize', onResize);
    }

    let raf = 0;
    let last = t0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Pelotita (como la del video): aparece, rebota y los gatitos la persiguen
      if (!ball.on && now > ball.nextAt) {
        ball.on = true;
        ball.x = rand(W * 0.2, W * 0.8);
        ball.y = 0;
        ball.vx = rand(-140, 140);
        ball.vy = rand(380, 520);
        ball.until = now + 7000;
      }
      if (ball.on) {
        ball.vy -= 900 * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.y <= 0) { ball.y = 0; ball.vy = Math.abs(ball.vy) * 0.62; if (ball.vy < 40) ball.vy = 0; ball.vx *= 0.8; }
        if (ball.x < 6 || ball.x > W - 18) { ball.vx *= -1; ball.x = Math.min(Math.max(ball.x, 6), W - 18); }
        if (now > ball.until) { ball.on = false; ball.nextAt = now + rand(9000, 16000); }
      }
      if (ballEl.current) {
        ballEl.current.style.display = ball.on ? 'block' : 'none';
        ballEl.current.style.transform = `translate(${ball.x}px, ${-ball.y}px)`;
      }

      pets.forEach((p, i) => {
        const color = PET_COLORS[i];
        const speed = 38 + i * 8;
        if (p.mode === 'climb') {
          p.y += p.climbDir * 42 * dt;
          if (p.climbDir === 1 && now > p.until) p.climbDir = -1;
          if (p.climbDir === -1 && p.y <= 0) {
            p.y = 0; p.mode = 'walk'; p.dir = p.wall === 'l' ? 1 : -1;
            p.x = p.wall === 'l' ? 2 : W - PET_SIZE - 2;
            p.wall = null; p.until = now + rand(2000, 5000);
          }
          draw(i, Math.floor(now / 220) % 2 ? 'walk1' : 'walk2', color);
          return;
        }
        // El gatito celeste (programador) va a su escritorio a programar de vez en cuando
        if (i === 1) {
          if (p.mode === 'code') {
            p.dir = -1;
            p.x = DESK_SEAT_X;
            p.y = Math.floor(now / 170) % 2; // tecleando
            if (now > p.until) { p.mode = 'walk'; p.y = 0; p.dir = 1; p.codeAt = now + rand(14000, 26000); p.until = now + rand(1500, 3000); }
            draw(i, 'sit', color);
            return;
          }
          if (p.mode === 'goDesk') {
            p.dir = DESK_SEAT_X < p.x ? -1 : 1;
            p.x += p.dir * (speed + 20) * dt;
            if (Math.abs(p.x - DESK_SEAT_X) < 3) { p.mode = 'code'; p.until = now + rand(8000, 14000); }
            draw(i, Math.floor(now / 140) % 2 ? 'walk1' : 'walk2', color);
            return;
          }
          if (now > p.codeAt) {
            p.mode = 'goDesk';
            draw(i, 'stand', color);
            return;
          }
        }
        if (ball.on && ball.y < 70 && p.mode !== 'goDesk') {
          // persigue la pelotita
          const target = ball.x - PET_SIZE / 2;
          if (Math.abs(target - p.x) > 8) {
            p.mode = 'walk';
            p.dir = target > p.x ? 1 : -1;
            p.x += p.dir * (speed + 30) * dt;
            draw(i, Math.floor(now / 140) % 2 ? 'walk1' : 'walk2', color);
          } else {
            p.mode = 'walk';
            draw(i, 'stand', color);
          }
        } else if (p.mode === 'walk') {
          p.x += p.dir * speed * dt;
          const maxX = W - PET_SIZE;
          if (p.x <= 0 || p.x >= maxX) {
            p.x = p.x <= 0 ? 0 : maxX;
            if (Math.random() < 0.35) {
              p.mode = 'climb'; p.wall = p.x <= 0 ? 'l' : 'r'; p.climbDir = 1; p.until = now + rand(1500, 3200);
            } else {
              p.dir = p.dir === 1 ? -1 : 1;
            }
          }
          if (now > p.until && p.mode === 'walk') {
            const r = Math.random();
            p.mode = r < 0.55 ? 'walk' : r < 0.8 ? 'sit' : 'lie';
            p.until = now + rand(2200, 6000);
            if (p.mode === 'walk' && Math.random() < 0.5) p.dir = p.dir === 1 ? -1 : 1;
          }
          draw(i, Math.floor(now / 180) % 2 ? 'walk1' : 'walk2', color);
        } else {
          if (now > p.until) { p.mode = 'walk'; p.until = now + rand(2500, 6000); }
          draw(i, p.mode === 'walk' ? 'stand' : p.mode, color);
        }
      });

      // escritorio: las líneas de código avanzan más rápido cuando el gatito programa
      if (ctx) {
        const working = pets[1].mode === 'code';
        if (now - lastLine > (working ? 380 : 1800)) {
          code.shift(); code.push(newCodeLine());
          term.shift(); term.push(newTermLine());
          lastLine = now;
        }
        drawStation(ctx, now, code, term);
      }

      // el globito sigue al primer gatito
      if (bubbleEl.current) {
        const p = pets[0];
        const w = bubbleEl.current.offsetWidth;
        const left = Math.min(Math.max(p.x + PET_SIZE / 2 - w / 2, 6), W - w - 6);
        bubbleEl.current.style.left = `${left}px`;
        bubbleEl.current.style.bottom = `${PET_SIZE + Math.max(p.y, 0) + 8}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="pets" aria-hidden="true">
      <canvas ref={stationEl} className="pet-station" width={64} height={34} />
      {PET_COLORS.map((color, i) => (
        <img
          key={color}
          ref={(el) => { petEls.current[i] = el; }}
          className="pet"
          src={PET_FRAMES[color].stand}
          alt=""
        />
      ))}
      <div ref={ballEl} className="pet-ball" />
      {message && (
        <div ref={bubbleEl} className="mascot-bubble pet-bubble" key={msgKey + message}>
          {message}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() => withIds(QUESTION_BANK.slice(0, QUESTIONS_PER_DATE)));
  const SUMMARY_STEP = 3 + questions.length;
  const [answers, setAnswers] = useState<Record<number, string>>(initialAns);
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const [folio, setFolio] = useState('0001');
  const [mascotMsg, setMascotMsg] = useState<string | null>(null);
  const [issuedAt, setIssuedAt] = useState('');
  const [noAttempts, setNoAttempts] = useState(0);
  const [showNoMsg, setShowNoMsg] = useState(false);
  const [pickError, setPickError] = useState<Record<number, boolean>>({});
  const [showFinale, setShowFinale] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ left: string; top: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempHour, setTempHour] = useState<number>(20);
  const [tempMinute, setTempMinute] = useState<number>(0);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const noMsgRef = useRef<HTMLParagraphElement | null>(null);
  const floatCatsContainer = useRef<HTMLDivElement | null>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const summaryItems = useMemo(() => {
    const items = questions.map((question) => ({
      key: question.key,
      icon: question.icon,
      value: answers[question.id] ?? '—',
    }));
    items.splice(2, 0, { key: 'cita', icon: '📅', value: answers[2] ?? '—' });
    return items;
  }, [answers, questions]);

  useEffect(() => {
    const total = questions.length;
    let msg: string | null = null;
    if (currentStep >= 3 && currentStep < 3 + total) msg = mascotMessage(currentStep - 2, total);
    else if (currentStep === 3 + total) msg = '¡Último paso, dev! Solo falta aceptar 💜';
    setMascotMsg(msg);
    if (!msg) return;
    const t = setTimeout(() => setMascotMsg(null), 5000);
    return () => clearTimeout(t);
  }, [currentStep, questions.length]);

  useEffect(() => {
    setQuestions(withIds(pickRandom(QUESTION_BANK, QUESTIONS_PER_DATE)));
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` })
        .catch((error) => console.error('Error registrando el service worker:', error));
    }
  }, []);

  useEffect(() => {
    if (showFinale) {
      spawnCats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFinale]);

  function go(from: number, to: number) {
    if (from >= 3 && !answers[from]) {
      setPickError((prev) => ({ ...prev, [from]: true }));
      return;
    }
    setPickError((prev) => ({ ...prev, [from]: false }));
    setCurrentStep(to);
  }

  function rainCats(count: number) {
    for (let i = 0; i < count; i += 1) {
      setTimeout(() => {
        const img = document.createElement('img');
        img.className = 'float-cat';
        img.src = floatCatSrcs[Math.floor(Math.random() * floatCatSrcs.length)];
        img.style.left = `${Math.random() * 95}%`;
        img.style.animationDuration = `${2.5 + Math.random() * 3}s`;
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 7000);
      }, i * 150);
    }
  }

  function pick(step: number, idx: number, val: string) {
    setAnswers((prev) => ({ ...prev, [step]: val }));
    setPickError((prev) => ({ ...prev, [step]: false }));
    setReactions((prev) => ({ ...prev, [step]: CAT_REACTIONS[Math.floor(Math.random() * CAT_REACTIONS.length)] }));
    const questionNumber = step - 2;
    rainCats(questionNumber % BIG_RAIN_EVERY === 0 ? BIG_RAIN_CATS : CATS_PER_ANSWER);
  }

  function escapeNo() {
    setNoAttempts((prev) => Math.min(prev + 1, 5));
    setShowNoMsg(true);
    const btnNo = noButtonRef.current;
    const btnSi = yesButtonRef.current;
    const parent = btnNo?.parentElement;
    if (!btnNo || !btnSi || !parent) return;

    const newSize = 18 + (noAttempts + 1) * 4;
    const newPad = 16 + (noAttempts + 1) * 4;
    btnSi.style.fontSize = Math.min(newSize, 42) + 'px';
    btnSi.style.padding = Math.min(newPad, 32) + 'px ' + Math.min(newPad + 24, 64) + 'px';

    const maxX = parent.offsetWidth - btnNo.offsetWidth - 20;
    const maxY = 100;
    const left = Math.random() * Math.max(maxX, 50);
    const top = Math.random() * maxY - 20;
    setSelectedPosition({ left: `${left}px`, top: `${top}px` });
  }

  function pickDate() {
    if (!selectedDate || !selectedTime) {
      setPickError((prev) => ({ ...prev, 2: true }));
      return;
    }
    setPickError((prev) => ({ ...prev, 2: false }));
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    setAnswers((prev) => ({ ...prev, 2: `${day}/${month}/${year} a las ${selectedTime}` }));
    setCurrentStep(3);
  }

  async function sendByEmail(folioValue: string, issued: string) {
    try {
      await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '💻 ¡Respondieron tu cita de programador! 🐱',
          _template: 'table',
          _captcha: 'false',
          folio: `Cita #${folioValue}`,
          emitida: issued,
          fecha_y_hora: answers[2] ?? '—',
          ...Object.fromEntries(questions.map((q) => [q.key, answers[q.id] ?? '—'])),
          respuesta_final: 'SÍ, ACEPTO LOS TÉRMINOS Y CONDICIONES ✅',
        }),
      });
    } catch (error) {
      console.error('Error enviando respuestas por correo:', error);
    }
  }

  function celebrate() {
    // Folio: contador de este dispositivo (0001, 0002...) y fecha de emisión
    let n = 1;
    try {
      n = (parseInt(localStorage.getItem('cita_folio') ?? '0', 10) || 0) + 1;
      localStorage.setItem('cita_folio', String(n));
    } catch {
      // si el navegador no deja guardar, se queda en 0001
    }
    const folioValue = String(n).padStart(4, '0');
    const now = new Date();
    const two = (v: number) => String(v).padStart(2, '0');
    const issued = `${two(now.getDate())}/${two(now.getMonth() + 1)}/${now.getFullYear()} a las ${two(now.getHours())}:${two(now.getMinutes())}`;
    setFolio(folioValue);
    setIssuedAt(issued);
    setShowFinale(true);
    void sendByEmail(folioValue, issued);
  }

  async function downloadPDF() {
    const element = document.getElementById('pdf-confirmation');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 148;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      // La página se ajusta a la altura del contenido para que no se corte
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidth, Math.max(imgHeight, 210)],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('cita-confirmada.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  function spawnCats() {
    if (!floatCatsContainer.current) return;
    for (let i = 0; i < 16; i += 1) {
      setTimeout(() => {
        const img = document.createElement('img');
        img.className = 'float-cat';
        img.src = floatCatSrcs[Math.floor(Math.random() * floatCatSrcs.length)];
        img.style.left = `${Math.random() * 95}%`;
        img.style.animationDuration = `${3 + Math.random() * 4}s`;
        if (floatCatsContainer.current) {
          floatCatsContainer.current.appendChild(img);
          setTimeout(() => img.remove(), 8000);
        }
      }, i * 200);
    }
  }

  const noButtonStyles = useMemo(() => {
    if (noAttempts === 0) return {};
    const size = Math.max(14 - noAttempts, 8);
    const pad = Math.max(12 - noAttempts * 2, 4);
    return {
      position: 'absolute' as const,
      left: selectedPosition?.left ?? 'auto',
      top: selectedPosition?.top ?? 'auto',
      fontSize: `${size}px`,
      padding: `${pad}px ${Math.max(24 - noAttempts * 3, 8)}px`,
    };
  }, [noAttempts, selectedPosition]);

  const yesButtonStyles = useMemo(() => {
    if (noAttempts === 0) return {};
    const size = Math.min(18 + noAttempts * 4, 42);
    const pad = Math.min(16 + noAttempts * 4, 32);
    return {
      fontSize: `${size}px`,
      padding: `${pad}px ${Math.min(pad + 24, 64)}px`,
    };
  }, [noAttempts]);

  return (
    <main className="app" style={{ width: '100%', maxWidth: 560, margin: '0 auto', minHeight: '100vh', padding: '16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes ledBlink {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes ledColors {
          ${LED_COLORS.map((c, i) => `${((i / LED_COLORS.length) * 100).toFixed(2)}% { background: ${c}; box-shadow: 0 0 10px 3px ${c}; }`).join('\n          ')}
          100% { background: ${LED_COLORS[0]}; box-shadow: 0 0 10px 3px ${LED_COLORS[0]}; }
        }
        @keyframes reactionPop {
          0% { opacity: 0; transform: translateY(8px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cat-reaction { margin-top: 10px; padding: 9px 12px; background: var(--primary-light); border: 2px solid rgba(124,58,237,0.2); border-radius: var(--radius-sm); color: var(--primary-dark); font-weight: 800; font-size: 13px; text-align: center; animation: reactionPop 0.3s ease; }
        @keyframes mascotBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes bubbleOut { to { opacity: 0; transform: translateY(6px); } }
        .pets { position: fixed; left: 0; bottom: calc(env(safe-area-inset-bottom, 0px) + 2px); width: 100%; height: 0; z-index: 9000; pointer-events: none; }
        .pet { position: absolute; left: 0; bottom: 0; width: 48px; height: 48px; image-rendering: pixelated; will-change: transform; }
        .site-footer { margin: 28px 0 0; padding: 18px 0 84px; text-align: center; border-top: 1px dashed rgba(124, 58, 237, 0.3); }
        .site-footer-icons { display: flex; justify-content: center; align-items: center; gap: 14px; margin-bottom: 8px; }
        .site-footer-icons a, .site-footer-icons span { display: inline-flex; opacity: 0.9; }
        .site-footer-icons a:active { transform: scale(0.92); }
        .site-footer-code { font-family: 'Fira Code', monospace; font-size: 9px; color: var(--text-muted); }
        .pet-station { position: absolute; left: 6px; bottom: 0; width: 128px; height: 68px; image-rendering: pixelated; }
        .pet-ball { position: absolute; left: 0; bottom: 0; width: 12px; height: 12px; border-radius: 50%; background: #00e5ff; box-shadow: 0 0 8px 2px rgba(0, 229, 255, 0.7); display: none; will-change: transform; }
        .pet-bubble { position: absolute; }
        .mascot-bubble { max-width: 210px; padding: 8px 12px; background: #fff; border: 2px solid var(--primary); border-radius: 14px 14px 4px 14px; color: var(--primary-dark); font-weight: 800; font-size: 12px; line-height: 1.35; box-shadow: var(--shadow); animation: reactionPop 0.3s ease, bubbleOut 0.4s ease 4.6s forwards; }
        .release-notes { margin: 12px 0 4px; padding: 10px 12px; background: var(--card); border: 1px dashed rgba(124, 58, 237, 0.4); border-radius: var(--radius-sm); font-family: 'Fira Code', monospace; font-size: 10px; color: var(--text-muted); line-height: 1.7; }
        .release-notes b { color: var(--primary); }
        .led { position: fixed; top: calc(env(safe-area-inset-top, 0px) + 12px); left: 14px; width: 11px; height: 11px; border-radius: 50%; z-index: 10000; pointer-events: none;
          animation: ledBlink ${LED_BLINK_SECONDS}s ease-in-out infinite, ledColors ${(LED_COLORS.length * LED_BLINK_SECONDS).toFixed(1)}s step-end infinite; }
        @media (prefers-reduced-motion: reduce) { .led { animation: ledColors ${(LED_COLORS.length * LED_BLINK_SECONDS).toFixed(1)}s step-end infinite; } }
      `}</style>
      <span className="led" aria-hidden="true" />
      <PixelPets message={mascotMsg} msgKey={String(currentStep)} />
      <div style={{ width: '100%' }}>
        <div className="header" style={{ textAlign: 'center', marginBottom: 20, animation: 'fadeDown 0.6s ease' }}>
          <img src={asset('/memes/gatito1.png')} alt="gatito1" style={{ width: 100, height: 'auto', borderRadius: 16, display: 'block', margin: '0 auto 12px', filter: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.5))' }} />
          <h1 style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
            ¿Hacemos deploy de una cita?
          </h1>
           <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
             // ejecutando: cita.deploy()
           </p>
        </div>

        <div className={`step ${currentStep === 0 ? 'active' : ''}`} style={{ display: currentStep === 0 ? 'block' : 'none', animation: 'slideUp 0.4s cubic-bezier(.34,1.56,.64,1)' }} id="s0">
          <div className="plea-card" style={{ background: 'var(--primary-light)', border: '2px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <span className="plea-emoji" style={{ flexShrink: 0 }}>
              <img src={asset('/memes/gatito2.png')} alt="Emoji gato" style={{ width: 56, height: 56, borderRadius: 12 }} />
            </span>
            <div className="plea-text" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1.4 }}>
              Antes de responder... ¡responde esto primero! 🥺
              <small style={{ display: 'block', fontSize: 11, fontFamily: 'Fira Code, monospace', color: 'var(--primary)', opacity: 0.8, fontWeight: 400, marginTop: 4 }}>
                /* se requiere una respuesta para continuar */
              </small>
            </div>
          </div>
          <div className="release-notes">
            <div>// notas de versión</div>
            <div><b>v2.1:</b> más gatitos, menos bugs 🐱</div>
            <div><b>v2.0:</b> 100 preguntas de programación</div>
            <div><b>v1.0:</b> primera cita desplegada 🚀</div>
          </div>
          <button className="btn-next" style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '14px 20px', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }} onClick={() => go(0, 1)}>
            [ INICIAR PROTOCOLO → ]
          </button>
        </div>

        <div className="step" style={{ display: currentStep === 1 ? 'block' : 'none' }} id="s1">
          <div className="q-card" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 16, marginBottom: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
              {catImagesStep1.map((src, index) => (
                <img key={index} src={src} alt={`Imagen ${index + 1}`} style={{ width: '30%', maxWidth: 90, height: 'auto', borderRadius: 12, animation: 'float 3s ease-in-out infinite', animationDelay: `${index * 0.5}s` }} />
              ))}
            </div>
            <div className="q-text" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, marginBottom: 16 }}>
              git commit -m «¿Quieres tener una cita conmigo?» 🥺💕
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              minHeight: 70,
              position: 'relative',
              padding: '8px 0',
            }}>
              <button
                ref={yesButtonRef}
                className="btn-next"
                style={{
                  fontSize: 16,
                  padding: '12px 32px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(124,58,237,0.24)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, all 0.2s ease',
                  ...yesButtonStyles,
                }}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, 1: '¡Sí! 💜' }));
                  go(1, 2);
                }}
              >
                Sí 💜
              </button>
              {noAttempts < 5 && (
                <button
                  ref={noButtonRef}
                  className="btn-next"
                  style={{
                    fontSize: 12,
                    padding: '10px 20px',
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, #ffd5d5, #ff9292)',
                    borderColor: '#f57373',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    boxShadow: '0 8px 16px rgba(75,85,99,0.18)',
                    transition: 'transform 0.2s ease, all 0.2s ease',
                    position: noAttempts === 0 ? 'relative' : 'absolute',
                    left: noAttempts === 0 ? undefined : selectedPosition?.left,
                    top: noAttempts === 0 ? undefined : selectedPosition?.top,
                    ...noButtonStyles,
                  }}
                  onMouseOver={escapeNo}
                  onTouchStart={escapeNo}
                >
                  No
                </button>
              )}
            </div>
            <p ref={noMsgRef} id="no-msg" style={{ display: showNoMsg ? 'block' : 'none', marginTop: 10, fontFamily: 'Fira Code, monospace', fontSize: 10, color: 'var(--accent)' }}>
              {noAttempts >= 5
                ? '// el "No" ya no existe en el sistema 😼💜'
                : '// error: opción no válida 😼'}
            </p>
          </div>
        </div>

        <div className="step" style={{ display: currentStep === 2 ? 'block' : 'none' }} id="s2">
          <div className="q-card" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 16, marginBottom: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
              <img src={catImagesStep2[0]} alt="Corgi" style={{ marginTop: 10, height: 80, width: 'auto', borderRadius: 12, animation: 'pulse 2s ease-in-out infinite' }} />
              <img src={catImagesStep2[1]} alt="Gatito emocionado" style={{ marginTop: -10, height: 120, width: 90, borderRadius: 12, animation: 'pulse 2s ease-in-out infinite', animationDelay: '0.5s' }} />
            </div>
            <span className="q-tag" style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 8px', borderRadius: 100, display: 'inline-block', marginBottom: 10, fontWeight: 500 }}>
              // módulo: cron_job.schedule
            </span>
            <div className="q-text" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, marginTop: 8, marginBottom: 16 }}>
              ¿Cuándo programamos el deploy de la cita? 📅
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', textAlign: 'left' }}>Fecha:</label>
                <button
                  onClick={() => { setShowPicker('date'); setTempDate(selectedDate || new Date()); }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: selectedDate ? 'linear-gradient(135deg, var(--primary-light), #fff)' : 'var(--bg)',
                    border: `2px solid ${selectedDate ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: selectedDate ? 'var(--primary-dark)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: selectedDate ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : 'Selecciona una fecha'}</span>
                  <span style={{ fontSize: 18 }}>📅</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'Fira Code, monospace', fontSize: 11, color: 'var(--text-muted)', textAlign: 'left' }}>Hora:</label>
                <button
                  onClick={() => { setShowPicker('time'); }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: selectedTime ? 'linear-gradient(135deg, var(--primary-light), #fff)' : 'var(--bg)',
                    border: `2px solid ${selectedTime ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: selectedTime ? 'var(--primary-dark)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: selectedTime ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{selectedTime || 'Selecciona una hora'}</span>
                  <span style={{ fontSize: 18 }}>⏰</span>
                </button>
              </div>
            </div>

            {showPicker === 'date' && (
              <div style={{ marginTop: 16, background: 'var(--card)', border: '2px solid var(--primary)', borderRadius: 'var(--radius)', padding: 16, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <button onClick={() => { const d = new Date(tempDate); d.setMonth(d.getMonth() - 1); setTempDate(d); }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
                  <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--primary-dark)' }}>{tempDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => { const d = new Date(tempDate); d.setMonth(d.getMonth() + 1); setTempDate(d); }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                  {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d) => <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {(() => {
                    const firstDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1).getDay();
                    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
                    const cells = [];
                    for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />);
                    for (let i = 1; i <= daysInMonth; i++) {
                      const date = new Date(tempDate.getFullYear(), tempDate.getMonth(), i);
                      const isSelected = selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === tempDate.getMonth() && selectedDate.getFullYear() === tempDate.getFullYear();
                      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                      cells.push(
                        <button
                          key={i}
                          onClick={() => { if (!isPast) { setSelectedDate(date); setShowPicker(null); } }}
                          disabled={isPast}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            border: 'none',
                            background: isSelected ? 'var(--primary)' : isPast ? 'var(--bg)' : 'transparent',
                            color: isSelected ? 'white' : isPast ? 'var(--text-muted)' : 'var(--text)',
                            fontSize: 12,
                            fontWeight: isSelected ? 800 : 600,
                            cursor: isPast ? 'not-allowed' : 'pointer',
                            opacity: isPast ? 0.4 : 1,
                          }}
                        >
                          {i}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>
                <button onClick={() => setShowPicker(null)} style={{ marginTop: 12, width: '100%', padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Listo ✓</button>
              </div>
            )}

            {showPicker === 'time' && (
              <div style={{ marginTop: 16, background: 'var(--card)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <button onClick={() => setTempHour((h) => (h - 1 + 24) % 24)} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', border: 'none', fontSize: 18, cursor: 'pointer' }}>-</button>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--primary-dark)' }}>{tempHour.toString().padStart(2, '0')}</span>
                    <span style={{ fontSize: 24, color: 'var(--accent)' }}>:</span>
                    <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--primary-dark)' }}>{tempMinute.toString().padStart(2, '0')}</span>
                  </div>
                  <button onClick={() => setTempHour((h) => (h + 1) % 24)} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', border: 'none', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                  {[0, 15, 30, 45].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTempMinute(m)}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${tempMinute === m ? 'var(--accent)' : 'var(--border)'}`,
                        background: tempMinute === m ? 'var(--accent-light)' : 'transparent',
                        color: tempMinute === m ? 'var(--accent)' : 'var(--text)',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      :{m.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setTempHour(20); setTempMinute(0); }} style={{ flex: 1, padding: '10px', background: 'var(--primary-light)', color: 'var(--primary-dark)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}>Tarde</button>
                  <button onClick={() => { setTempHour(21); setTempMinute(0); }} style={{ flex: 1, padding: '10px', background: 'var(--primary-light)', color: 'var(--primary-dark)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}>Noche</button>
                </div>
                <button onClick={() => { setSelectedTime(`${tempHour.toString().padStart(2, '0')}:${tempMinute.toString().padStart(2, '0')}`); setShowPicker(null); }} style={{ marginTop: 12, width: '100%', padding: '10px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Listo ✓</button>
              </div>
            )}

            <div className="err-msg" style={{ display: pickError[2] ? 'block' : 'none', fontFamily: 'Fira Code, monospace', fontSize: 10, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '6px 10px', marginTop: 8 }}>
              // error: selecciona fecha y hora para continuar 🗓️
            </div>
            <button className="btn-next" style={{ marginTop: 16, width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '12px 20px', fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }} onClick={pickDate}>
              [ CONFIRMAR FECHA → ]
            </button>
          </div>
        </div>

        {questions.map((question, index) => {
          const stepIndex = question.id;
          const progress = `${Math.round(((index + 1) / questions.length) * 100)}%`;
          const label = `pregunta ${index + 1} / ${questions.length}`;
          const active = currentStep === stepIndex;
          return (
            <div key={stepIndex} className="step" style={{ display: active ? 'block' : 'none' }} id={`s${stepIndex}`}>
              <span className="progress-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                {label}
              </span>
              <div className="progress-wrap" style={{ background: 'var(--border)', borderRadius: 100, height: 5, marginBottom: 16, overflow: 'hidden' }}>
                <div className="progress-fill" style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 100, transition: 'width 0.5s cubic-bezier(.34,1.56,.64,1)', width: progress }} />
              </div>
              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <img src={headerImages[index % headerImages.length]} alt="Decoración" style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: 200, height: 'auto' }} />
              </div>
              <div className="q-card" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 16, marginBottom: 12, border: '1px solid var(--border)' }}>
                <span className="q-tag" style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 8px', borderRadius: 100, display: 'inline-block', marginBottom: 8, fontWeight: 500 }}>
                  {question.tag}
                </span>
                <div className="q-text" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4 }}>
                  {question.text}
                </div>
              </div>
              <div className="options" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {question.options.map((option, optionIndex) => {
                  const selected = answers[stepIndex] === option;
                  return (
                    <button key={optionIndex} className={`opt ${selected ? 'selected' : ''}`} style={{
                      background: 'var(--bg)',
                      border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      color: selected ? 'var(--primary-dark)' : 'var(--text)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      transition: 'all 0.2s ease',
                      lineHeight: 1.3,
                      boxShadow: selected ? '0 0 0 2px rgba(124,58,237,0.15)' : undefined,
                    }}
                      onClick={() => pick(stepIndex, optionIndex, option)}>
                      <span className="opt-key" style={{ width: 22, height: 22, background: selected ? 'var(--primary)' : 'var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fira Code, monospace', fontSize: 10, fontWeight: 600, color: selected ? 'white' : 'var(--text)', flexShrink: 0 }}>
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span style={{ flex: 1, wordBreak: 'break-word' }}>{option}</span>
                    </button>
                  );
                })}
              </div>
              {reactions[stepIndex] && (
                <div key={reactions[stepIndex] + (answers[stepIndex] ?? '')} className="cat-reaction" role="status">
                  {reactions[stepIndex]}
                </div>
              )}
              <p className="err-msg" style={{ display: pickError[stepIndex] ? 'block' : 'none', fontFamily: 'Fira Code, monospace', fontSize: 10, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '6px 10px', marginTop: 8 }}>
                ⚠ ¡Elige algo porfa! el algoritmo espera 🙏
              </p>
              <button className="btn-next" style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '12px 20px', fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)', marginTop: 12 }} onClick={() => go(stepIndex, stepIndex + 1)}>
                [ SIGUIENTE PARÁMETRO → ]
              </button>
            </div>
          );
        })}

        <div className="step" style={{ display: currentStep === SUMMARY_STEP ? 'block' : 'none' }} id={`s${SUMMARY_STEP}`}>
          <div className="summary-header" style={{ textAlign: 'center', marginBottom: 16 }}>
            <span className="big-cat" style={{ display: 'block', animation: 'pulse 2s ease-in-out infinite', marginBottom: 10 }}>
              <img src={catHeaderImg} alt="Gato grande" style={{ display: 'block', margin: '0 auto', width: 120, height: 120, objectFit: 'contain' }} />
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Resumen de compatibilidad
            </h2>
            <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              // análisis completado · match_score: calculando... 💜
            </p>
          </div>
          <div className="summary-table" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 12, fontSize: 11 }}>
            {summaryItems.map((item, i) => (
              <div key={item.key} className="summary-row" style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', gap: 8, borderBottom: i < summaryItems.length - 1 ? '1px solid var(--border)' : undefined, background: i % 2 === 1 ? 'var(--bg)' : undefined }}>
                <span className="s-icon" style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: 'center' }}>{item.icon}</span>
                <span className="s-label" style={{ fontFamily: 'Fira Code, monospace', fontSize: 9, color: 'var(--text-muted)', flexShrink: 0 }}>
                  {item.key}://
                </span>
                <span className="s-value" style={{ fontWeight: 700, fontSize: 11, color: 'var(--text)', flex: 1, wordBreak: 'break-word' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="q-card" style={{ border: '2px solid var(--accent)', textAlign: 'center', padding: 16, borderRadius: 'var(--radius)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <span style={{ display: 'block', marginBottom: 8 }}>
              <img src={asset('/memes/gatito0.png')} alt="Pregunta final" style={{ display: 'block', margin: '0 auto', width: 80, height: 80, objectFit: 'contain' }} />
            </span>
            <div className="q-text" style={{ fontSize: 18, lineHeight: 1.4, fontWeight: 800, color: 'var(--text)' }}>
              Entonces... ¿saldrías conmigo?
            </div>
            <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 9, color: 'var(--text-muted)', marginTop: 6 }}>
              // advertencia: respuesta_incorrecta no existe
            </p>
          </div>

          <button className="btn-next btn-confirm" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent), #db2777)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '14px 20px', fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.5, boxShadow: '0 4px 12px rgba(236,72,153,0.3)', marginTop: 12, display: showFinale ? 'none' : 'block' }} onClick={celebrate}>
            ✨ [ SÍ, ACEPTO LOS TÉRMINOS Y CONDICIONES ] ✨
          </button>

          <div className="finale" id="fmsg" style={{ display: showFinale ? 'block' : 'none', textAlign: 'center', padding: 16, background: 'var(--green-light)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius)', animation: 'pop 0.5s cubic-bezier(.34,1.56,.64,1)', marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <img src={asset('/memes/gatito0.png')} alt="gatito0" style={{ display: 'block', width: 50, height: 50, objectFit: 'contain' }} />
              <img src={asset('/memes/gatito1.png')} alt="gatito1" style={{ display: 'block', width: 80, height: 80, objectFit: 'contain' }} />
              <img src={asset('/memes/gatito0.png')} alt="gatito0" style={{ display: 'block', width: 50, height: 50, objectFit: 'contain' }} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)', marginBottom: 6 }}>
              ¡Match confirmado!
            </h3>
            <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, color: '#065f46', lineHeight: 1.5 }}>
              // status: ÉXITO<br />
              // romance.exe iniciado<br />
              // nos vemos pronto 💜
            </p>
          </div>

          <div style={{ display: showFinale ? 'flex' : 'none', gap: 8, marginTop: 12 }}>
            <button onClick={downloadPDF} style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
              📄 Descargar PDF
            </button>
          </div>

          <div ref={floatCatsContainer} />

          <div id="pdf-confirmation" ref={pdfContentRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '148mm', background: 'white', fontFamily: 'Nunito, sans-serif' }}>
            {/* Franja superior: logo a la izquierda, sin tapar nada */}
            <div style={{ padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img src={LOGO_SRC} alt="Eofjs.dev" style={{ height: 22, width: 'auto' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed' }}>Cita #{folio}</span>
            </div>
            <div style={{ padding: '12px 20px 8px', textAlign: 'center' }}>
              <img src={asset('/memes/gatito1.png')} alt="gatito" style={{ width: 80, height: 'auto', margin: '0 auto 14px' }} />
              <h1 style={{ fontSize: 20, color: '#7c3aed', marginBottom: 4 }}>💜 ¡Cita Confirmada! 💜</h1>
              <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>// romance.exe iniciado correctamente</p>
              <p style={{ fontSize: 9, color: '#9ca3af', marginBottom: 14 }}>Emitida el {issuedAt}</p>
            </div>
            <div style={{ padding: '0 20px 14px' }}>
              <div style={{ border: '2px solid #ede9fe', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ background: '#f3e8ff', padding: '10px 14px', fontWeight: 800, fontSize: 11, color: '#7c3aed' }}>📋 Resumen de tu cita</div>
                {summaryItems.map((item, i) => (
                  <div key={item.key} style={{ padding: '10px 14px', borderBottom: i < summaryItems.length - 1 ? '1px solid #e5e7eb' : undefined, background: i % 2 === 1 ? '#f9fafb' : undefined }}>
                    <span style={{ fontSize: 9, color: '#6b7280' }}>{item.icon} {item.key}:// </span>
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
              {/* Fila de gatitos debajo del resumen, en su propio espacio */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 14, margin: '6px 0 14px' }}>
                {['/memes/gatito0.png', '/memes/gatito4.png', '/memes/gatito7.png', '/memes/gatito6.png'].map((src) => (
                  <img key={src} src={asset(src)} alt="gatito" style={{ height: 52, width: 'auto' }} />
                ))}
              </div>
              <p style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', lineHeight: 1.6 }}>
                Nos vemos pronto, mi nerd favorit@ 💜<br />
                <span style={{ fontSize: 8 }}>// generado por cita.deploy()</span>
              </p>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <img src={LOGO_SRC} alt="Eofjs.dev" style={{ height: 18, width: 'auto', opacity: 0.9 }} />
              </div>
            </div>
          </div>
          <footer className="site-footer">
            <div className="site-footer-icons">
              <a href="https://github.com/Eofjsdev" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Eofjsdev" title="GitHub">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#1e1b4b" d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" /></svg>
              </a>
              <span title="Next.js">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#000" /><path d="M8 7v10M8 7l8 10M16 7v6" stroke="#fff" strokeWidth="1.6" fill="none" /></svg>
              </span>
              <span title="React">
                <svg viewBox="-12 -12 24 24" width="22" height="22" aria-hidden="true"><circle r="2" fill="#61dafb" /><g stroke="#61dafb" fill="none" strokeWidth="1"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /></g></svg>
              </span>
              <span title="TypeScript">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect width="24" height="24" rx="3" fill="#3178c6" /><text x="12" y="19" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="sans-serif">TS</text></svg>
              </span>
            </div>
            <p className="site-footer-code">// © 2026 Eofjs.dev · cita.deploy()</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
