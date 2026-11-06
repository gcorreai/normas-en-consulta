import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matches} from '../site/assets/search.js';

const slug = '2026-08-cmf-metodologias-internas';

test('resumen separa propuesta de vigencia y cita fuentes con límite de extracción', () => {
  const path = `site/consultas/${slug}/resumen.html`;
  let html = '';
  try { html = readFileSync(path, 'utf8'); } catch {}
  assert.ok(html.includes('Capítulo 21-9'), 'falta resumen con nuevo capítulo propuesto');
  for (const text of ['B-1', '21-1', '21-6', 'fundacional', 'avanzada', '20%', 'dos años', 'pp. 14–16', 'propuesta normativa', 'plazo publicado vencido', 'texto definitivo no confirmados', 'extracción omite segmentos', 'lectura íntegra del PDF', 'no asesoría legal', 'normativa_tramite.php', 'normativa_tramite_cerrada.php', 'id=2026080375&amp;seq=1']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('../../comparaciones/'));
});

test('metodologías internas: tarjeta indexada, orden cronológico y ficha con plazo vencido', () => {
  const home = readFileSync('site/index.html', 'utf8');
  const cards = [...home.matchAll(/<article class="entry"[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(cards.length, 3);
  assert.match(home, /3 consultas en el historial/);
  assert.match(cards[0], /2026-10/);
  assert.ok(cards[1].includes(`consultas/${slug}/index.html`));
  assert.match(cards[2], /2026-07/);
  const search = cards[1].match(/data-search="([^"]+)"/)[1];
  for (const query of ['CMF', 'metodologias internas', 'APRC', 'riesgo de credito', 'provisiones', 'Capítulo 21-9']) assert.ok(matches(search, query), query);
  const ficha = readFileSync(`site/consultas/${slug}/index.html`, 'utf8');
  for (const text of ['2026-08-03', '2026-10-26', '2026-11-06', 'plazo publicado vencido', 'estado administrativo actual y texto definitivo no confirmados en las fuentes consultadas', 'resumen.html', 'normativa_tramite.php', 'normativa_tramite_cerrada.php', 'id=2026080375&amp;seq=1']) assert.ok(ficha.includes(text), text);
  assert.ok(!ficha.includes('../../comparaciones/'));
});
