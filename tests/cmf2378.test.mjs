import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';

const folder = 'site/consultas/2026-07-cmf-riesgo-mercado/';
const comparison = 'site/comparaciones/2026-07-cmf-riesgo-mercado.html';

test('superficie publicada no incorpora adjuntos, rutas privadas ni marcadores de comentarios de participantes', () => {
  const files = readdirSync('site', {recursive:true, withFileTypes:true}).filter(f => f.isFile());
  for (const file of files) assert.match(file.name, /\.(html|css|js)$/, file.name);
  for (const file of files.map(f => `${f.parentPath}/${f.name}`)) {
    const html = readFileSync(file, 'utf8');
    for (const pattern of [/\/home\//i, /\.hermes\//i, /(?:ghp_|github_pat_)/i,
      /comentario\s*(?:n[.º°]*\s*)?\d+\s*:/i, /respuesta\s*(?:de la cmf|al comentario)\s*:/i,
      /texto efectivamente enviado/i, /comprobante de envío/i]) assert.doesNotMatch(html, pattern, file);
  }
});

test('evolución muestra tres etapas y procedencia separada por materia sin elevar interpretaciones a mandatos', () => {
  assert.ok(existsSync(comparison), 'falta evolución comparada');
  const html = readFileSync(comparison, 'utf8');
  for (const topic of ['ajuste-vertical', 'compensacion', 'duracion', 'requisitos', 'r07', 'transitorios', 'impacto']) {
    const section = html.match(new RegExp(`<section[^>]+id="${topic}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
    assert.ok(section, topic);
    for (const phrase of ['Inicial', 'Nueva propuesta', 'Circular final', 'Informe,', 'Circular,', 'física', '→']) {
      assert.ok(section.includes(phrase), `${topic}: ${phrase}`);
    }
  }
  for (const phrase of ['7%', '10%', '5%', 'no incorpora el registro 11', 'pronunciamiento previo',
    'comunicación', 'sin umbrales numéricos', 'no obligaciones', 'fechas de inicio y cierre no constan',
    '2026-03-05', '2026-04-08', '2026-07', '2026-09-11', '2026-10-01',
    'fecha de publicación', 'URL oficial', 'extracción', '../consultas/2026-07-cmf-riesgo-mercado/resumen.html',
    'sección III, página física 10', 'Anexo 1, páginas físicas 4–5']) assert.ok(html.includes(phrase), phrase);
  assert.ok(!/https?:\/\//.test(html), 'no inventar enlaces oficiales');
});

test('historial incorpora riesgo de mercado buscable y enlaza sus dos lecturas con conteo correcto', async () => {
  const html = readFileSync('site/index.html', 'utf8');
  const entries = [...html.matchAll(/<article class="entry"[^>]*>[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(entries.length, 3, 'tres consultas en historial');
  assert.match(html, /id="results"[^>]*>3 consultas en el historial/);
  assert.ok(html.indexOf('2026-10') < html.indexOf('2026-07'), 'orden histórico descendente');
  const entry = entries.find(s => s.includes('2026-07-cmf-riesgo-mercado'));
  assert.ok(entry, 'tarjeta de nueva consulta');
  for (const text of ['Circular CMF N.º 2.378', 'Norma final publicada',
    'consultas/2026-07-cmf-riesgo-mercado/index.html', 'consultas/2026-07-cmf-riesgo-mercado/resumen.html',
    'comparaciones/2026-07-cmf-riesgo-mercado.html']) assert.ok(entry.includes(text), text);
  const {matches} = await import('../site/assets/search.js');
  const index = entry.match(/data-search="([^"]+)"/)[1];
  for (const q of ['Circular 2.378', 'CMF', 'riesgo mercado', 'APRM', 'Capítulo 21-7', 'metodo duracion', 'derivados']) {
    assert.equal(matches(index, q), true, q);
  }
  assert.equal(matches(index, 'depositantes'), false);
});

test('ficha y resumen de riesgo de mercado identifican nueva propuesta, norma final y límites documentales', () => {
  for (const file of ['index.html', 'resumen.html']) {
    assert.ok(existsSync(folder + file), `falta ${file} de riesgo de mercado`);
    const html = readFileSync(folder + file, 'utf8');
    for (const phrase of ['Circular CMF N.º 2.378', '2026-07', '2026-09-11', '2026-10-01',
      'Segunda consulta', 'fechas de inicio y cierre no constan', 'fecha de publicación',
      'URL oficial', 'no asesoría legal', 'Informe Normativo', 'páginas físicas',
      '../../comparaciones/2026-07-cmf-riesgo-mercado.html', '../../index.html']) {
      assert.ok(html.includes(phrase), `${file}: ${phrase}`);
    }
  }
  const summary = readFileSync(folder + 'resumen.html', 'utf8');
  for (const phrase of ['10%', '5%', 'comunicación', 'Anexo 1', 'registro 10', 'registro 11',
    'estimaciones', 'no obligaciones', '3.1.2', 'sección III']) {
    assert.ok(summary.includes(phrase), phrase);
  }
});
