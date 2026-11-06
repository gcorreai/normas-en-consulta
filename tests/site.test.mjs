import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('portada ofrece historial navegable con metadatos y fecha límite desconocida', () => {
  assert.ok(existsSync('site/index.html'), 'falta la portada');
  const html = readFileSync('site/index.html','utf8');
  for (const text of ['Identificación de depositantes','CMF','2026-10','Fecha límite no identificada','consultas/2026-10-cmf-depositantes/index.html','type="search"','aria-live="polite"']) assert.ok(html.includes(text), text);
  const detail = readFileSync('site/consultas/2026-10-cmf-depositantes/index.html','utf8');
  for(const text of ['resumen.html','../../index.html','no confirma','no existe norma definitiva publicada']) assert.ok(detail.includes(text), text);
  assert.ok(!html.includes('comparaciones/2026-10-cmf-depositantes.html'));
  assert.ok(!detail.includes('texto efectivamente enviado'));
  assert.equal(createHash('sha256').update(readFileSync('site/consultas/2026-10-cmf-depositantes/resumen.html')).digest('hex'),'95c45455d5a1fa9cb5a638545b052546fbb8f5f42a532463d6e3aa5da2d881a0');
});
