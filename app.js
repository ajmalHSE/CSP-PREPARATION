(function(){
'use strict';
const $=id=>document.getElementById(id),key='ajmal-csp-v3-clean';
const names=['Advanced Safety Principles','Program Management','Risk Management','Emergency Management','Environmental Management','Occupational Health & Applied Science','Training'];
let saved=null,storage=true;try{saved=JSON.parse(localStorage.getItem(key));}catch(e){storage=false;}
if(!globalThis.CSP_DATA||!globalThis.CSP_ENGINE){$('question').textContent='The question files could not load. Please check that all app files were uploaded together.';$('status').textContent='Reload after checking your upload.';return;}
const data=CSP_DATA,engine=new CSP_ENGINE.Engine(data.questions,saved);let installPrompt=null;
function save(){try{localStorage.setItem(key,JSON.stringify(engine.s));}catch(e){storage=false;}if(!storage)$('storageMessage').textContent='Browser storage is unavailable; this session will not be saved.';}
function render(){const q=engine.current,s=engine.s;if(!q)return;
$('answered').textContent=s.answered;$('accuracy').textContent=s.answered?Math.round(s.correct/s.answered*100)+'%':'—';$('streak').textContent=s.streak;$('best').textContent=s.best;
$('domainTag').textContent='DOMAIN '+q.domain;$('kindTag').textContent=q.kind==='study'?'Study material':'Question bank';$('qcount').textContent='QUESTION '+String(s.answered+s.skipped+(s.selected===null?1:0)).padStart(2,'0');$('domainName').textContent=names[q.domain-1];$('question').textContent=q.question;
$('choices').replaceChildren();q.options.forEach((option,i)=>{const b=document.createElement('button');b.className='choice';b.type='button';b.disabled=s.selected!==null;
const letter=document.createElement('span');letter.className='letter';letter.textContent=(q.kind==='study'?String.fromCharCode(97+i):String(i+1));const copy=document.createElement('span');copy.className='choice-copy';copy.textContent=option;b.append(letter,copy);
if(s.selected!==null&&(i===q.answer||i===s.selected)){b.classList.add(i===q.answer?'correct':'incorrect');const outcome=document.createElement('span');outcome.className='outcome';outcome.textContent=i===q.answer?'✓ Correct':'× Yours';b.append(outcome);}
b.addEventListener('click',()=>{engine.answer(i);save();render();$('result').scrollIntoView({block:'nearest',behavior:'smooth'});});$('choices').append(b);});
$('feedback').hidden=s.selected===null;$('feedback').classList.toggle('wrong',s.selected!==null&&s.selected!==q.answer);$('result').textContent=s.selected===q.answer?'Correct. Keep going!':'A useful one to remember.';
$('correctAnswer').textContent='Source answer: '+q.sourceAnswer+' — '+q.options[q.answer];$('explanation').textContent=q.explanation;
$('next').disabled=s.selected===null;$('skip').disabled=s.selected!==null;
$('sourceText').textContent=q.source+' · PDF page '+q.page+' · Question '+q.number;
$('sourceLink').href='./'+q.sourcePath+'#page='+q.page;
$('status').textContent=data.meta.total.toLocaleString()+' questions · Progress '+(storage?'saved on this device':'available for this session');
$('counts').replaceChildren();for(const c of data.meta.counts){const tr=document.createElement('tr');for(const t of ['D'+c.domain+' · '+names[c.domain-1],c.study,c.bank,s.domains[c.domain-1].answered]){const td=document.createElement('td');td.textContent=t;tr.append(td);}$('counts').append(tr);}
}
$('next').addEventListener('click',()=>{if(engine.s.selected===null)return;engine.next();save();render();$('domainTag').scrollIntoView({block:'start',behavior:'smooth'});});
$('skip').addEventListener('click',()=>{if(engine.s.selected!==null)return;engine.skip();save();render();});
$('reset').addEventListener('click',()=>{if(!confirm('Reset your score, streaks and question history on this device?'))return;try{localStorage.removeItem(key);}catch(e){}location.reload();});
window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['1','2','3','4'].includes(e.key)&&engine.s.selected===null){const i=Number(e.key)-1;if(i<engine.current.options.length){engine.answer(i);save();render();}}else if(e.key==='Enter'&&engine.s.selected!==null&&e.target===document.body)$('next').click();});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false;});$('install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;$('install').hidden=true;});
window.addEventListener('appinstalled',()=>{$('install').hidden=true;});
if(!engine.current)engine.next();save();render();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').then(reg=>{if(reg.waiting)reg.waiting.postMessage('SKIP_WAITING');}).catch(()=>{});
})();
