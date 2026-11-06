# Verificación de publicación

> El bloque inicial conserva la evidencia histórica de la primera publicación. El estado actual, con la Circular CMF N.º 2.378, se documenta en [Actualización: riesgo de mercado](#actualizacion-riesgo-de-mercado).

## Estado: publicado y verificado

- Repositorio público: https://github.com/gcorreai/normas-en-consulta
- Sitio HTTPS: https://gcorreai.github.io/normas-en-consulta/
- Fuente Pages leída de la API: `build_type: legacy`, rama `gh-pages`, ruta `/`, `https_enforced: true`, estado `built`.
- Commit del sitio publicado: `318025ff5db013515cf0b221939c0a2c11b0b980`.
- Ejecución interna Pages: https://github.com/gcorreai/normas-en-consulta/actions/runs/42224663276 — `completed`, `success`, mismo SHA.
- Cuenta comprobada con REST `/user`; listado completo de repositorios antes de crear, sin candidato apropiado.

## Alcance vigente

Comparaciones solo de propuesta original y norma definitiva pública. Los comentarios privados son confidenciales y no se solicitan, almacenan ni publican. El caso CMF actual tiene solo resumen histórico; no se inventó una comparación ni una fecha límite de consulta. La plantilla admite el caso anterior cuando se aporten ambas versiones públicas. No hay scraping ni seguimiento periódico.

## Archivos y mantenimiento

- `site/index.html`: historial con metadatos y buscador accesible.
- `site/assets/search.js`, `styles.css`: búsqueda y diseño responsive.
- `site/consultas/2026-10-cmf-depositantes/index.html`: ficha y navegación.
- `site/consultas/2026-10-cmf-depositantes/resumen.html`: copia exacta del resumen recibido.
- `site/plantillas/comparacion.html`: propuesta, definitiva, diferencias por materia y vacíos de evidencia.
- `README.md`: altas de consultas/comparaciones, pruebas y publicación por subtree.
- `tests/{site,search,comparison,links,browser}.test.mjs`: pruebas sin paquetes adicionales.
- `examples/pages-actions.yml`: alternativa opcional no activa.
- `.gitignore`: excluye herramientas operativas locales y paquetes; ningún secreto se guarda en el repositorio.

## Pruebas ejecutadas realmente

- `node --test tests/*.test.mjs`: **6 aprobadas, 0 fallidas** en la ejecución final.
- `NORMAS_BASE_URL=https://gcorreai.github.io/normas-en-consulta/ node --test tests/browser.test.mjs`: **1 aprobada, 0 fallidas**, Chromium real sobre HTTPS publicado.
- Ambas ejecuciones Chromium comprobaron filtro por título/organismo/tema, contador, ausencia de coincidencias y restablecimiento; cero excepciones JavaScript; cuatro páginas a 360/390/1280 px (**12 comprobaciones responsive por ejecución**); controles expandir/contraer del resumen original.
- Validación local de **4 páginas y 11 enlaces/recursos/anclas**: todos resuelven dentro del sitio.
- Lectura HTTPS de los **6 archivos públicos** (portada, ficha, resumen, plantilla, CSS y JS) más la URL raíz: **HTTP 200** y contenido idéntico a la copia local por SHA-256; raíz idéntica a `index.html`.
- SHA-256 del resumen origen, copia local y publicación: `95c45455d5a1fa9cb5a638545b052546fbb8f5f42a532463d6e3aa5da2d881a0`.
- `node --check site/assets/search.js`: salida 0.
- `git diff --cached --check` antes de publicar: salida 0.
- RED→GREEN observado al actualizar el contrato documental y cambiar la ubicación del ejemplo de workflow; el intento anterior registra los ciclos de implementación del sitio.

## Incidencias reales y límites

`gh` no está instalado. Se utilizó REST con el helper Git existente; la credencial solo se capturó en memoria, sin imprimirla ni copiarla a archivos. No se instalaron herramientas ni se alteró la autenticación.

El primer push fue rechazado porque la sesión OAuth no tiene permiso `workflow`. No se ampliaron permisos: se eligió el mecanismo nativo Pages por rama, manteniendo el workflow como ejemplo fuera de `.github/workflows`. Se enmendó únicamente el commit inicial propio todavía no publicado. No se reescribió historia remota ni trabajo ajeno.

El push de `gh-pages` habilitó Pages automáticamente. POST posterior devolvió 409; la lectura confirmó la configuración correcta. Durante el despliegue hubo HTTP 404; se esperó hasta `built` y conclusión `success`, y luego todas las lecturas y pruebas públicas pasaron. Una ejecución local intermedia de Chromium agotó el tiempo de arranque de 20 s; al repetir sin cambios pasó, al igual que las ejecuciones finales local y pública.

El build interno de Pages no ejecuta las pruebas personalizadas. Deben ejecutarse localmente antes de cada actualización siguiendo README; no se afirma CI de tests remota. Solo el subtree `site/` se sirve en Pages; fuentes, pruebas y documentación están en `main`.

La URL oficial y el informe CMF completo no se recibieron en este encargo: la ficha declara ese vacío; el resumen permanece intacto y no sustituye evidencia oficial ni constituye asesoría legal. La comparación definitiva depende de que se aporten las dos versiones públicas, nunca comentarios privados.

<a id="actualizacion-riesgo-de-mercado"></a>
## Actualización: riesgo de mercado — Circular CMF N.º 2.378

### Publicación actual verificada

- Commit de implementación en `main`: `17390945202bd6a5b789538750178bf8ee9b2abd`.
- Subtree publicado en `gh-pages`: `3e246b2365e2a6c6db7956bf380d6df82c999678`; ambos SHA comprobados mediante `git ls-remote` después del push normal, sin forzar ni reescribir historia.
- Build Pages leído por API: `built`, sin mensaje de error, commit exacto del subtree.
- Despliegue interno: https://github.com/gcorreai/normas-en-consulta/actions/runs/42237761084 — `completed` / `success`, mismo `head_sha`.
- Configuración leída sin modificar: `legacy`, `gh-pages`, `/`, HTTPS obligatorio; sin cambios a Settings, Actions, OAuth ni credenciales.
- Solo nueve archivos HTML/CSS/JS del subtree se sirven en Pages. No se publicaron PDF, herramientas locales ni archivos temporales.

### Páginas y contenido añadidos

- Ficha: https://gcorreai.github.io/normas-en-consulta/consultas/2026-07-cmf-riesgo-mercado/index.html
- Resumen: https://gcorreai.github.io/normas-en-consulta/consultas/2026-07-cmf-riesgo-mercado/resumen.html
- Evolución: https://gcorreai.github.io/normas-en-consulta/comparaciones/2026-07-cmf-riesgo-mercado.html
- Portada con dos entradas, búsqueda y enlaces relativos a ficha/resumen/evolución.
- Comparación temática de inicial → nueva propuesta → Circular: ajuste vertical, compensación, acceso a duración, requisitos/cálculo, R07/MSI, transitorios, estimaciones y otros ajustes. Referencias separadas a propuesta y Circular, por sección/numeral y página física.

### Pruebas ejecutadas para esta incorporación

- Baseline previo: `node --test tests/*.test.mjs`, 6/6 aprobadas.
- RED→GREEN observado para ficha/resumen inexistentes; evolución inexistente; y portada/búsqueda todavía con una sola consulta. No se cambió el algoritmo de búsqueda ni los estilos compartidos.
- Suite final local: `node --test tests/*.test.mjs`, **10 aprobadas, 0 fallidas**.
- Rutas locales: **7 páginas y 45 enlaces/recursos/anclas** válidos dentro del sitio.
- Chromium local bajo `/normas/` y público bajo `/normas-en-consulta/`: **21 comprobaciones responsive por ejecución**, en 360/390/1280 px. A 390 px se solicitaron por HTTP los enlaces, recursos y anclas de las siete páginas: sin roturas. Filtro por título, CMF y temas, contador, cero resultados, restablecimiento y controles originales: aprobados, sin excepciones JavaScript.
- Navegador público: `NORMAS_BASE_URL=https://gcorreai.github.io/normas-en-consulta/ node --test tests/browser.test.mjs`, **1 aprobada, 0 fallidas**.
- `python3 .runtime/verify_public.py`: **9 archivos más raíz con HTTP 200**, sin redirecciones y con SHA-256 idéntico a los archivos locales; raíz idéntica a portada.
- `node --check` sobre buscador y pruebas modificadas: salida 0. `git diff --cached --check`: salida 0.
- `git diff --exit-code f257c6b -- site/consultas/2026-10-cmf-depositantes`: salida 0. Ficha de depositantes intacta, SHA-256 `c5e712b33191aba723bc6b7d856b26bb2896264987e6edb1ffa2f663923bf2ba`; resumen conserva `95c45455d5a1fa9cb5a638545b052546fbb8f5f42a532463d6e3aa5da2d881a0`.
- Diff revisado y guardas de privacidad ejecutadas: sin rutas privadas, secretos ni reproducción concreta de comentarios. Las guardas por patrones son complementarias a la selección y revisión del contenido, no una prueba semántica exhaustiva.

### Límites actuales

El contenido se elaboró a partir del informe comparativo validado recibido para esta incorporación; no se recotejaron los PDF directamente en esta ejecución. Los títulos, referencias físicas y límites de ese handoff se preservan. No se recibió URL oficial pública ni fechas de inicio/cierre de segunda consulta: no se inventaron. Se distingue emisión de publicación y vigencia, y se conservan las diferencias documentales de comunicación/aprobación y registro 11 sin resolverlas jurídicamente. Las estimaciones no se presentan como mandatos; las fórmulas o tablas de extracción dudosa no se reconstruyen. No se incluyeron comentarios privados ni contenido concreto de comentarios de la industria.

No hubo revisión independiente en esta ejecución headless: se aplicó revisión propia del diff y pruebas reproducibles. `gh` sigue sin estar instalado; se reutilizó el cliente REST local y el helper Git existente sin mostrar secretos. El primer intento de commit falló por identidad Git ausente; se usó únicamente en la invocación de commit la identidad pública ya presente en la historia de este repositorio, sin cambiar configuración global. El build interno de Pages no ejecuta las pruebas personalizadas: estas se ejecutaron localmente antes de publicar.
