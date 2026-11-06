# Normas en consulta

Sitio estático en español, sin dependencias de producción, analytics, scraping ni seguimiento periódico. Solo `site/` se publica.

Repositorio público: https://github.com/gcorreai/normas-en-consulta

Sitio publicado y verificado: https://gcorreai.github.io/normas-en-consulta/

Publicación nativa de Pages desde la rama `gh-pages`. GitHub Actions queda como ejemplo opcional, sin ejecutarse: la sesión actual no tiene permiso `workflow`. Consultar `VERIFICACION.md` para el estado y la evidencia del despliegue.

## Alcance y privacidad

- Resúmenes de consultas y futuras comparaciones entre **propuesta original y norma definitiva publicada**, resaltando diferencias.
- Los comentarios privados del usuario son **confidenciales** y están completamente fuera del proyecto. No solicitarlos, almacenarlos ni exponerlos; tampoco como fixtures, adjuntos o commits.
- La consulta CMF de octubre de 2026 se incorpora solo como resumen: según la actualización del usuario aún no existe norma definitiva publicada para este caso. No se crea comparación ficticia.
- No hay fecha límite de comentarios identificada en el documento recibido. No inferir una.
- El HTML original se conserva sin cambios. Su fuente declarada es el informe CMF; no se recibió aquí su URL oficial ni copia del informe. No presentar el resumen como texto normativo ni como asesoría legal.

## Estructura

```text
site/index.html                         # historial; una tarjeta por consulta
site/assets/styles.css                  # estilos responsive compartidos
site/assets/search.js                   # búsqueda local por palabras, ignora tildes
site/consultas/2026-10-cmf-depositantes/ # ficha histórica + resumen.html original
site/plantillas/comparacion.html         # dos fuentes públicas + diferencias por materia
site/comparaciones/                     # crear páginas solo cuando haya ambas versiones
examples/pages-actions.yml             # ejemplo opcional; no es un workflow activo
tests/                                  # Node nativo y Chromium/CDP, sin npm install
```

## Probar localmente

Desde la raíz, con Node 24 o posterior y `chromium` en PATH:

```sh
node --test tests/*.test.mjs
# Repetir Chromium contra la publicación real cuando el build esté completo:
NORMAS_BASE_URL=https://gcorreai.github.io/normas-en-consulta/ node --test tests/browser.test.mjs
python3 -m http.server 8000 --directory site
```

Abrir `http://localhost:8000/`. El servidor se detiene con Ctrl+C. La prueba de navegador crea su propio servidor bajo `/normas/`, no usa la sesión del usuario y elimina su perfil temporal. Comprueba el filtro real, cero resultados, restablecimiento, ausencia de errores JS, cuatro páginas a 360/390/1280 px y los controles del resumen original. Ejecuta Chromium headless con `--no-sandbox` solo para estas páginas locales controladas. CI ejecuta las pruebas de contenido/rutas/búsqueda; la validación Chromium se ejecuta localmente.

## Añadir una consulta

1. Elegir slug estable `AAAA-MM-organismo-tema`; no reutilizar ni borrar entradas anteriores.
2. Crear `site/consultas/SLUG/index.html` tomando la ficha CMF y guardar el nuevo HTML en `resumen.html`. Revisar privacidad y referencias antes de incorporarlo.
3. Duplicar una tarjeta `.entry` en `site/index.html`. Completar título enlazado, organismo, fecha `<time datetime="AAAA-MM">`, estado y resumen breve. Incluir título, organismo y temas en `data-search`. La búsqueda usa todas las palabras escritas y no necesita un segundo índice ni recompilación.
4. Ordenar de más reciente a más antigua; actualizar el contador inicial `#results` y la etiqueta de años si corresponde. Mantener avisos de evidencia ausente, sin inventar fechas, aprobación ni vigencia.
5. Usar rutas relativas y ejecutar las pruebas; revisar móvil antes de publicar.

## Añadir una comparación de dos versiones

Esperar propuesta y texto definitivo públicos (el usuario aportará un caso anterior). Copiar `site/plantillas/comparacion.html` a `site/comparaciones/SLUG.html`. Completar ambas secciones con enlaces oficiales, fechas, número, artículos y citas; enlazar la ficha y el resumen histórico. Duplicar la ficha de diferencias por materia para resaltar **añadido / modificado / eliminado / sin cambio**, con referencias a ambos textos. Separar interpretación de evidencia y precisar vigencia/transitorios. Si falta una fuente, mantener el aviso y no marcar el contraste completo. Nunca incorporar comentarios privados. Añadir enlaces desde la ficha y la tarjeta solo cuando la comparación exista. Metis revisa antes de publicar.

## Publicar y verificar

El repositorio se creó tras comprobar la cuenta `gcorreai` y listar todos sus repositorios, sin encontrar uno apropiado. Se utilizó REST con la sesión existente y git con su helper: `gh` no es requisito. No instalar herramientas ni cambiar autenticación para mantener este sitio.

Para cada incorporación autorizada:

```sh
node --test tests/*.test.mjs
git diff --check
git add site README.md tests examples
git commit -m "Añadir resumen normativo revisado"
git push origin main
git subtree split --prefix=site -b gh-pages
git push origin gh-pages
```

Si `gh-pages` ya existe localmente, actualizarla de forma no destructiva con `git subtree split --prefix=site` y usar el SHA devuelto en `git push origin SHA:gh-pages`; no forzar el push. Pages usa **Deploy from a branch → gh-pages → /(root)** en Settings → Pages. La API Pages devuelve `build_type: legacy` para esta modalidad (GitHub puede mostrar su compilación interna como una ejecución `pages-build-deployment`). Antes de cada push se deben ejecutar las pruebas: no hay CI personalizada activa.

`examples/pages-actions.yml` conserva una alternativa para futura migración expresamente autorizada a GitHub Actions con permisos suficientes. No está en `.github/workflows`, no se ejecuta y no es necesaria para la publicación actual.

Antes de anunciar éxito, comprobar el commit exacto de `gh-pages` y la conclusión de su build/despliegue en Pages, leer la configuración Pages y abrir su URL HTTPS real. Verificar HTTP 200 de portada, ficha, resumen, plantilla y recursos, y la búsqueda bajo la subruta publicada. Si se dispone de `gh`, usar `gh api repos/gcorreai/normas-en-consulta/pages` y `gh api repos/gcorreai/normas-en-consulta/pages/builds/latest`; de lo contrario, usar REST autenticado con el helper autorizado, manteniendo el secreto solo en memoria. Un push exitoso no demuestra un despliegue correcto.
