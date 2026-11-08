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
