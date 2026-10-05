'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${BASE_PATH}${path}`;

type Question = { id: number; key: string; icon: string; tag: string; text: string; options: string[] };

// Cuántas preguntas salen en cada cita (hay 100 en total y salen al azar). Pon 100 para que salgan todas.
const QUESTIONS_PER_DATE = 20;

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

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() => withIds(QUESTION_BANK.slice(0, QUESTIONS_PER_DATE)));
  const SUMMARY_STEP = 3 + questions.length;
  const [answers, setAnswers] = useState<Record<number, string>>(initialAns);
  const [noAttempts, setNoAttempts] = useState(0);
  const [showNoMsg, setShowNoMsg] = useState(false);
  const [pickError, setPickError] = useState<Record<number, boolean>>({});
  const [showFinale, setShowFinale] = useState(false);
  const [userEmail, setUserEmail] = useState('');
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

  function pick(step: number, idx: number, val: string) {
    setAnswers((prev) => ({ ...prev, [step]: val }));
    setPickError((prev) => ({ ...prev, [step]: false }));
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

  async function sendByEmail() {
    try {
      await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '💻 ¡Respondieron tu cita de programador! 🐱',
          _template: 'table',
          _captcha: 'false',
          fecha_y_hora: answers[2] ?? '—',
          ...Object.fromEntries(questions.map((q) => [q.key, answers[q.id] ?? '—'])),
          respuesta_final: 'SÍ, ACEPTO LOS TÉRMINOS Y CONDICIONES ✅',
          // Si la persona dejó su correo, FormSubmit le manda un agradecimiento
          ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())
            ? {
                email: userEmail.trim(),
                _autoresponse:
                  '¡Gracias por responder mi cita de programador! 💜🐱 Tus respuestas ya me llegaron y pronto te escribo. — Ángel Said',
              }
            : {}),
        }),
      });
    } catch (error) {
      console.error('Error enviando respuestas por correo:', error);
    }
  }

  function celebrate() {
    setShowFinale(true);
    void sendByEmail();
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
      <div style={{ width: '100%' }}>
        <div className="header" style={{ textAlign: 'center', marginBottom: 20, animation: 'fadeDown 0.6s ease' }}>
          <img src={asset('/memes/gatito1.png')} alt="gatito1" style={{ width: 100, height: 'auto', borderRadius: 16, display: 'block', margin: '0 auto 12px', filter: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.5))' }} />
          <h1 style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
            ¿Saldrías conmigo?
          </h1>
           <p style={{ fontFamily: 'Fira Code, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
             // ejecutando: peticion_romantica_v2.0.cat
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

          <div style={{ marginTop: 12, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12, textAlign: 'left' }}>
            <label htmlFor="user-email" style={{ display: 'block', fontFamily: 'Fira Code, monospace', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>
              // tu_correo (opcional): te mando un agradecimiento 💌
            </label>
            <input
              id="user-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{ width: '100%', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 14, padding: 12, border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', background: '#fff' }}
            />
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
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <img src={asset('/memes/gatito1.png')} alt="gatito" style={{ width: 80, height: 'auto', margin: '0 auto 16px' }} />
              <h1 style={{ fontSize: 20, color: '#7c3aed', marginBottom: 4 }}>💜 ¡Cita Confirmada! 💜</h1>
              <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 20 }}>// romance.exe iniciado correctamente</p>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ border: '2px solid #ede9fe', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ background: '#f3e8ff', padding: '10px 14px', fontWeight: 800, fontSize: 11, color: '#7c3aed' }}>📋 Resumen de tu cita</div>
                {summaryItems.map((item, i) => (
                  <div key={item.key} style={{ padding: '10px 14px', borderBottom: i < summaryItems.length - 1 ? '1px solid #e5e7eb' : undefined, background: i % 2 === 1 ? '#f9fafb' : undefined }}>
                    <span style={{ fontSize: 9, color: '#6b7280' }}>{item.icon} {item.key}:// </span>
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', lineHeight: 1.6 }}>
                Nos vemos pronto, mi nerd favorit@ 💜<br />
                <span style={{ fontSize: 8 }}>// generado por peticion_romantica_v2.0.cat</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
