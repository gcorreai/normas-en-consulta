import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {resolve, extname, join} from 'node:path';

test('Chromium: filtro real, contador, sin resultados y restablecimiento bajo subruta Pages', async () => {
  const root = resolve('site');
  const server = createServer(async(req,res) => {
    try {
      const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(!path.startsWith('/normas/')) throw Error('outside site');
      const file = resolve(root, '.' + path.slice('/normas'.length) + (path.endsWith('/')?'index.html':''));
      if(!file.startsWith(root+'/')) throw Error('outside site');
      const content = await readFile(file);
      res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'})[extname(file)] || 'application/octet-stream');
      res.end(content);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const profile = await mkdtemp(join(tmpdir(),'normas-browser-'));
  const browser = spawn('chromium',['--headless','--no-sandbox','--disable-gpu','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank']);
  let ws;
  try {
    const endpoint = await new Promise((resolve,reject)=>{
      let output='';
      const timer=setTimeout(()=>reject(Error('Chromium timeout: '+output)),20000);
      browser.stderr.on('data',chunk=>{ output+=chunk; const m=output.match(/DevTools listening on (ws:\/\/\S+)/); if(m){clearTimeout(timer);resolve(m[1]);}});
      browser.on('error',reject);
    });
    ws = new WebSocket(endpoint);
    await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
    let id=0; const pending=new Map(); const errors=[];
    ws.onmessage=({data})=>{const m=JSON.parse(data); if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);} if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
    const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params,sessionId}));});
    const {targetId}=await send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
    const call=(m,p)=>send(m,p,sessionId);
    await call('Runtime.enable'); await call('Page.enable');
    const evaluate=async(expression)=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
    const base=process.env.NORMAS_BASE_URL || `http://127.0.0.1:${server.address().port}/normas/`;
    const navigate=async(path)=>{await call('Page.navigate',{url:base+path});for(let i=0;i<100;i++){if(await evaluate(`document.readyState==='complete' && location.href===${JSON.stringify(base+path)}`))return;await new Promise(r=>setTimeout(r,50));}throw Error('navigation timeout');};
    await navigate('index.html');
    for(const [query,count] of [['CMF',1],['identificacion',1],['lavado activos',1],['pensiones',0],['cmf pensiones',0],['',1]]){
      const state=await evaluate(`(()=>{const input=document.querySelector('#search');input.value=${JSON.stringify(query)};input.dispatchEvent(new Event('input',{bubbles:true}));return {count:document.querySelectorAll('.entry:not([hidden])').length,empty:document.querySelector('#empty').hidden,status:document.querySelector('#results').textContent};})()`);
      assert.equal(state.count,count,query); assert.equal(state.empty,count!==0,query); assert.match(state.status,new RegExp(String(count)),query);
    }
    assert.deepEqual(errors,[],'sin errores JavaScript');
    console.log('Filtro DOM real y estados accesibles: OK');
    // Layout checks run after the filtering assertions, at mobile and desktop widths.
    for(const width of [360,390,1280]){
      await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
      for(const page of ['index.html','consultas/2026-10-cmf-depositantes/index.html','consultas/2026-10-cmf-depositantes/resumen.html','plantillas/comparacion.html']){
        await navigate(page);
        assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true,`${page} overflow at ${width}`);
        assert.ok(await evaluate('Boolean(document.querySelector("h1"))'),`${page} h1`);
      }
    }
    await navigate('consultas/2026-10-cmf-depositantes/resumen.html');
    assert.equal(await evaluate(`(()=>{document.querySelectorAll('button')[0].click();return [...document.querySelectorAll('details')].every(d=>d.open)})()`),true);
    assert.equal(await evaluate(`(()=>{document.querySelectorAll('button')[1].click();return [...document.querySelectorAll('details')].every(d=>!d.open)})()`),true);
    assert.deepEqual(errors,[]);
    console.log('12 comprobaciones de layout + controles originales: OK');
  } finally {
    if(ws)ws.close(); browser.kill(); await new Promise(r=>browser.exitCode!==null?r():browser.once('exit',r));
    await new Promise(r=>server.close(r)); await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});
  }
});
