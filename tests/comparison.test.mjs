import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

test('plantilla contrasta únicamente propuesta y norma definitiva sin solicitar comentarios privados',()=>{
  const html=readFileSync('site/plantillas/comparacion.html','utf8');
  for(const phrase of ['Propuesta original','Norma definitiva','Pendiente de evidencia','versión final publicada','no permite concluir','../index.html','Diferencias por materia']) assert.ok(html.includes(phrase),phrase);
  for(const phrase of ['Comentarios enviados','texto efectivamente enviado','comprobante de envío','3. Norma']) assert.ok(!html.includes(phrase),`fuera de alcance: ${phrase}`);
  assert.ok(!existsSync('site/comparaciones/2026-10-cmf-depositantes.html'),'CMF solo tiene resumen por ahora');
});
