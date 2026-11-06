import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

test('búsqueda combina palabras de título organismo y tema sin tildes ni mayúsculas', async () => {
  assert.ok(existsSync('site/assets/search.js'),'falta el buscador');
  const {matches} = await import('../site/assets/search.js');
  const text = 'Identificación de depositantes CMF depósitos efectivo lavado de activos';
  for(const q of ['', '  ', 'identificacion','cMf','DEPÓSITOS','cmf efectivo','lavado activos']) assert.equal(matches(text,q),true,q);
  for(const q of ['pensiones','cmf pensiones','<script>']) assert.equal(matches(text,q),false,q);
});
