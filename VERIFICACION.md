# Verificación de publicación

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
