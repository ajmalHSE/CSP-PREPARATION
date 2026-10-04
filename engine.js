(function(root){
'use strict';
function shuffle(xs,rng=Math.random){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function mixedOrder(questions,rng=Math.random){const bins=Array.from({length:7},(_,i)=>shuffle(questions.filter(q=>q.domain===i+1),rng));const left=bins.map(x=>x.length),order=[];
 function solve(last){if(order.length===questions.length)return true;let choices=shuffle(left.flatMap((n,i)=>Array(n).fill(i)),rng);choices=[...new Set(choices)].filter(d=>d!==last);
 for(const d of choices){left[d]--;const total=left.reduce((a,b)=>a+b,0);const possible=left.every((n,i)=>n<=total-n+(i===d?0:1));if(possible){order.push(d);if(solve(d))return true;order.pop();}left[d]++;}return false;}
 // A single-domain practice session intentionally stays in that domain.
 if(bins.filter(b=>b.length).length===1)return shuffle(questions,rng);
 if(!solve(-1))return shuffle(questions,rng);return order.map(d=>bins[d].pop());}
function preferStudy(pool,count,rng){const study=shuffle(pool.filter(q=>q.kind==='study'),rng),bank=shuffle(pool.filter(q=>q.kind==='bank'),rng);const target=Math.min(study.length,Math.ceil(count*.75));let selected=study.slice(0,target);selected.push(...bank.slice(0,count-selected.length));if(selected.length<count)selected.push(...study.slice(target,target+count-selected.length));if(selected.length<count)throw new Error('Not enough unique questions');return selected;}
class Engine{
 constructor(questions,state,rng=Math.random){this.rng=rng;this.questions=questions.filter(q=>q.eligible&&!q.is_math&&q.answer!==null);this.byId=new Map(this.questions.map(q=>[q.id,q]));this.s={version:'4.0-rounds',bookmarks:[],wrong:[],completed:0,game:null};
 if(state&&state.version===this.s.version){this.s.bookmarks=Array.isArray(state.bookmarks)?state.bookmarks.filter(id=>this.byId.has(id)):[];this.s.wrong=Array.isArray(state.wrong)?state.wrong.filter(id=>this.byId.has(id)):[];this.s.completed=Number.isInteger(state.completed)?state.completed:0;const g=state.game;if(g&&Array.isArray(g.ids)&&g.ids.length>0&&g.ids.every(id=>this.byId.has(id))&&new Set(g.ids).size===g.ids.length&&g.answers&&typeof g.answers==='object'&&Number.isInteger(g.pos)&&g.pos>=0&&g.pos<g.ids.length){const ok=Object.entries(g.answers).every(([id,i])=>g.ids.includes(id)&&Number.isInteger(i)&&i>=0&&i<this.byId.get(id).options.length);if(ok)this.s.game=g;}}
 }
 start(mode='normal',domain){let selected=[];let quotas=null;
 if(mode==='normal'){const flip=this.rng()<.5;quotas=[flip?13:12,flip?12:13,5,5,5,5,5];for(let d=1;d<=7;d++)selected.push(...preferStudy(this.questions.filter(q=>q.domain===d),quotas[d-1],this.rng));selected=mixedOrder(selected,this.rng);}
 else if(mode==='domain'){const pool=this.questions.filter(q=>q.domain===Number(domain));selected=shuffle(preferStudy(pool,Math.min(50,pool.length),this.rng),this.rng);}
 else if(mode==='wrong'||mode==='bookmarks'){const ids=new Set(mode==='wrong'?this.s.wrong:this.s.bookmarks);selected=mixedOrder(shuffle(this.questions.filter(q=>ids.has(q.id)),this.rng).slice(0,50),this.rng);}
 else throw new Error('Unknown practice mode');
 if(!selected.length)throw new Error(mode==='wrong'?'No wrong answers yet. Finish a game to build your revision list.':'No bookmarked questions yet. Bookmark a question after answering it.');
 this.s.game={mode,domain:mode==='domain'?Number(domain):null,ids:selected.map(q=>q.id),answers:{},pos:0,complete:false,quotas};return this.current;
 }
 get current(){return this.s.game?this.byId.get(this.s.game.ids[this.s.game.pos]):null;}
 get selected(){const g=this.s.game;return g&&Object.hasOwn(g.answers,this.current.id)?g.answers[this.current.id]:null;}
 answer(index){const g=this.s.game,q=this.current;if(!g||g.complete||this.selected!==null||!Number.isInteger(index)||index<0||index>=q.options.length)return false;g.answers[q.id]=index;const wrong=new Set(this.s.wrong);if(index===q.answer)wrong.delete(q.id);else wrong.add(q.id);this.s.wrong=[...wrong];return index===q.answer;}
 next(){const g=this.s.game;if(!g||g.complete||this.selected===null)return false;if(g.pos===g.ids.length-1){g.complete=true;this.s.completed++;return 'complete';}g.pos++;return 'next';}
 bookmark(id){if(!this.byId.has(id))return false;const b=new Set(this.s.bookmarks);if(b.has(id))b.delete(id);else b.add(id);this.s.bookmarks=[...b];return b.has(id);}
 result(){const g=this.s.game;if(!g)return null;const domains=Array.from({length:7},(_,i)=>({domain:i+1,total:0,answered:0,correct:0,wrong:0}));const wrongIds=[];let answered=0,correct=0;for(const id of g.ids){const q=this.byId.get(id),d=domains[q.domain-1];d.total++;if(Object.hasOwn(g.answers,id)){answered++;d.answered++;if(g.answers[id]===q.answer){correct++;d.correct++;}else{wrongIds.push(id);d.wrong++;}}}return {total:g.ids.length,answered,correct,wrong:wrongIds.length,percentage:Math.round(correct/g.ids.length*100),domains,wrongIds};}
}
const api={shuffle,mixedOrder,preferStudy,Engine};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CSP_ENGINE=api;
})(globalThis);
