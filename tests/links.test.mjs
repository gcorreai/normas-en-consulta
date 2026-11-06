import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';

test('cada enlace local, recurso y ancla resuelve dentro del sitio bajo subruta',()=>{
  const root=resolve('site');
  const htmlFiles=readdirSync(root,{recursive:true}).filter(p=>p.endsWith('.html'));
  let checked=0;
  for(const page of htmlFiles){
    const html=readFileSync(resolve(root,page),'utf8');
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      const link=match[1];
      if(/^(https?:|mailto:|data:)/.test(link))continue;
      assert.ok(!link.startsWith('/'),`${page}: ruta absoluta ${link}`);
      const [path,fragment]=link.split('#');
      const file=path?resolve(dirname(resolve(root,page)),path):resolve(root,page);
      assert.ok(file.startsWith(root+'/'),`${page}: fuera del sitio ${link}`);
      assert.ok(existsSync(file),`${page}: falta ${link}`);
      if(fragment)assert.ok(readFileSync(file,'utf8').includes(`id="${fragment}"`),`${page}: ancla ${link}`);
      checked++;
    }
  }
  console.log(`${htmlFiles.length} páginas; ${checked} enlaces/recursos/anclas locales válidos`);
});

test('publicación preparada con pruebas previas y carga únicamente de site',()=>{
  assert.ok(existsSync('examples/pages-actions.yml'),'falta ejemplo opcional de Actions');
  const workflow=readFileSync('examples/pages-actions.yml','utf8');
  for(const text of ['node --test','path: site','actions/deploy-pages@','pages: write','workflow_dispatch'])assert.ok(workflow.includes(text),text);
  const readme=readFileSync('README.md','utf8');
  for(const text of ['data-search','plantillas/comparacion.html','confidenciales','https://github.com/gcorreai/normas-en-consulta','GitHub Actions'])assert.ok(readme.includes(text),text);
});
