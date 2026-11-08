# Portafolio — Paula Lara

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build). Funciona sin internet.

## Estructura

```
portafolio-web/
├── index.html          Inicio, Sobre mí, Proyectos (carpetas) y Contacto
├── caso-palcafe.html   Caso de estudio · Pal Café
├── caso-pandra.html    Caso de estudio · Pandra
├── caso-jazz.html      Caso de estudio · Festival Jazz
├── caso-04.html        Caso de estudio · Yuki Ice Cream
├── styles.css          Todos los estilos (paleta en :root, temas de casos al final)
├── main.js             Menú móvil, foto que cambia, acordeón, carpetas, animaciones
└── assets/
    ├── fonts/          Anton, Inter e IBM Plex Mono (woff2, autoalojadas)
    ├── *.webp          Imágenes optimizadas
    └── favicon.svg
```

## Cómo probarlo antes de publicar

**Opción 1 — doble clic.** Abre `index.html` en Chrome, Edge o Firefox. Funciona todo.

**Opción 2 — servidor local (recomendada, se comporta como en internet).**
1. Abre una terminal dentro de la carpeta `portafolio-web`.
2. Ejecuta `python3 -m http.server 8000` (en Windows: `python -m http.server 8000`).
3. Abre http://localhost:8000
   (Con VS Code también sirve la extensión *Live Server*: clic derecho en `index.html` → *Open with Live Server*.)

**Qué revisar**
- [ ] Menú superior: el punto rosa sigue a la sección; en celular se abre con "MENÚ".
- [ ] Portada: clic en la foto la cambia (1 → 4); hover pone el efecto azul.
- [ ] Sobre mí: en celular, cada experiencia se abre y se cierra.
- [ ] Proyectos: clic en una carpeta la abre sin moverla; "CERRAR" o `Esc` la cierra; "VER PROYECTO" abre su caso.
- [ ] Casos: "VOLVER A PROYECTOS" y "SIGUIENTE" funcionan (Pal Café → Pandra → Jazz → Yuki → Pal Café).
- [ ] Contacto: el correo abre tu cliente de correo; Behance y LinkedIn abren en pestaña nueva.
- [ ] Prueba el ancho: en el navegador abre las herramientas de desarrollo (F12) y activa la vista de dispositivos; revisa ~1440 px, ~820 px (tablet) y ~390 px (celular).

## Cómo cambiar imágenes

- **Fotos de la portada:** guarda `foto-1.webp` … `foto-4.webp` (o `.jpg`) en `assets/`. La foto 1 usa por ahora tu selfie; mientras no existan 2–4 se ven cuadros negros.
- **Cuadros de las carpetas:** `assets/proy-palcafe.webp`, `proy-pandra.webp`, `proy-jazz.webp` (cuadradas, ~880 px). Hoy son recortes provisionales de cada tablero. Yuki Ice Cream aún no tiene imagen: agrega `assets/proy-yuki.webp` y cámbiala por el bloque `.sq` de la carpeta 4 en `index.html` (copia el de la carpeta 3).
- **Tableros de los casos:** `assets/palcafe.webp`, `pandra.webp`, `jazz.webp`. Para Yuki, reemplaza el bloque `.board-ph` de `caso-04.html` por `<img src="assets/yuki.webp" alt="..." loading="lazy">`.
- **Optimizar:** convierte a WebP con https://squoosh.app (calidad 75–80, ancho máximo 1400 px para tableros y 1000 px para fotos).

## Publicar (gratis)

- **Netlify:** entra a https://app.netlify.com/drop y arrastra la carpeta `portafolio-web`.
- **GitHub Pages:** sube la carpeta a un repositorio → *Settings → Pages → Deploy from a branch → main / root*.
- **Vercel:** `vercel` dentro de la carpeta, o importa el repositorio.

Después de publicar, revisa que los enlaces entre páginas funcionen en la URL real y comparte el enlace con tu correo y celular para probar.

## Accesibilidad y rendimiento incluidos
- Fuentes autoalojadas con `font-display: swap` y precarga de la tipografía del título.
- Imágenes WebP con `width/height` y carga diferida (`loading="lazy"`) fuera de la primera pantalla.
- Respeta `prefers-reduced-motion` (sin animaciones si el sistema lo pide).
- Navegación con teclado y foco visible; `Esc` cierra menú y carpetas.

## Cambios de corrección (GitHub Pages)
- Proyectos: cuatro tarjetas independientes (Pal Café, Pandra, Festival Jazz, Yuki Ice Cream), cada una con su color, imagen, descripción y enlace a su caso. Ya no son franjas apiladas.
- `assets/originales/` conserva los archivos originales (selfie, flores, Pal Café, Pandra, Festival Jazz). Los `.webp` son copias optimizadas que usa la web.
- `.nojekyll` incluido; todas las rutas son relativas y respetan mayúsculas/minúsculas.
- Pendiente de tu parte: `assets/foto-2.webp`, `foto-3.webp`, `foto-4.webp` (fotos del cambio del Inicio) y la imagen de Yuki Ice Cream. Sin esos archivos el navegador muestra 404 en consola, pero la página funciona.

## Segunda corrección (fidelidad a Figma)
- Proyectos vuelve a ser la pila de carpetas del diseño, con las imágenes reales de cada carpeta (`assets/carpeta-*.webp`), incluida la de Yuki Ice Cream.
- Inicio: fotos 2, 3 y 4 (`assets/foto-2/3/4.webp`) y el botón "Ver proyectos" ya no queda tapado por la cinta de disciplinas.
- Logo original (`assets/logo.png`) en todas las páginas.
- Sobre mí: imagen de la mascota (`assets/chocy.webp`, es una imagen estática; para el GIF animado reemplaza ese archivo por `chocy.gif` y cambia el nombre en `index.html`), onda azul junto al título y sin flechas en las disciplinas.
- Casos: se quitó el bloque "PORTADA DEL PROYECTO — REEMPLAZAR". Yuki muestra su tablero (`assets/yuki.webp`).

## Páginas separadas
- `index.html` (Inicio), `sobre-mi.html` (Sobre mí + Herramientas), `proyectos.html` (carpetas) y `contacto.html`.
- Los casos (`caso-palcafe.html`, `caso-pandra.html`, `caso-jazz.html`, `caso-04.html`) siguen aparte; "Volver a proyectos" lleva a `proyectos.html`.
- El menú marca la página actual en todas.

## Tercera corrección
- Inicio: texto "BIENVENIDOS", sin el texto "FOTO n / 4", flor y onda como en Figma, botón junto al texto, tilde de la Ñ sin recortar.
- Sobre mí: imagen de la mascota con cuadrícula y título en su posición, onda de tu Figma junto al título, sección Herramientas del ancho completo y sin el espacio sobrante.
- Proyectos: cabecera con las dos flores que colocaste y la carpeta abierta ya no se sale de pantalla.
- GIF animado: copia tu GIF como `assets/chocy.gif`. La página lo usa automáticamente; mientras no exista, muestra `assets/chocy.webp` (imagen fija).
