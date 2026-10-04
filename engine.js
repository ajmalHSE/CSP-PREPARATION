(function(root){
  'use strict';
  const QUOTAS=[5,5,2,2,2,2,2];
  function shuffle(xs,rng=Math.random){const out=xs.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
  function round(last=0,rng=Math.random){
    const remaining=QUOTAS.slice(),out=[];
    function solve(prev){if(out.length===20)return true;
      const choices=shuffle(remaining.map((n,i)=>i+1).filter(d=>remaining[d-1]>0&&d!==prev),rng);
      for(const d of choices){remaining[d-1]--;out.push(d);if(solve(d))return true;out.pop();remaining[d-1]++;}return false;}
    if(!solve(last))throw new Error('Unable to mix domains');return out;
  }
  class Engine{
    constructor(questions,state,rng=Math.random){this.questions=questions;this.rng=rng;this.byId=new Map(questions.map(q=>[q.id,q]));this.pools=Array.from({length:7},(_,i)=>questions.filter(q=>q.domain===i+1));
      this.s=state&&state.version==='3.0-clean'?state:{version:'3.0-clean',schedule:[],last:0,seen:{},current:null,selected:null,answered:0,correct:0,skipped:0,streak:0,best:0,domains:Array.from({length:7},()=>({answered:0,correct:0})),sourceTurns:{}};
      if(this.s.current&&!this.byId.has(this.s.current)){this.s.current=null;this.s.selected=null;}
    }
    get current(){return this.byId.get(this.s.current);}
    next(){if(!this.s.schedule.length)this.s.schedule=round(this.s.last,this.rng);const d=this.s.schedule.shift();this.s.last=d;
      let seen=new Set(this.s.seen[d]||[]),available=this.pools[d-1].filter(q=>!seen.has(q.id));
      if(!available.length){seen=new Set();available=this.pools[d-1];}
      const study=available.filter(q=>q.kind==='study'),bank=available.filter(q=>q.kind==='bank');
      const turn=this.s.sourceTurns[d]||0;const preferred=turn%4===3?bank:study;const pool=preferred.length?preferred:available;
      const q=pool[Math.floor(this.rng()*pool.length)];if(!q)throw new Error('No questions for domain '+d);
      seen.add(q.id);this.s.seen[d]=Array.from(seen);this.s.sourceTurns[d]=turn+1;this.s.current=q.id;this.s.selected=null;return q;
    }
    answer(index){const q=this.current;if(!q||this.s.selected!==null)return false;if(!Number.isInteger(index)||index<0||index>=q.options.length)return false;
      this.s.selected=index;const correct=index===q.answer;this.s.answered++;this.s.correct+=Number(correct);this.s.domains[q.domain-1].answered++;this.s.domains[q.domain-1].correct+=Number(correct);this.s.streak=correct?this.s.streak+1:0;this.s.best=Math.max(this.s.best,this.s.streak);return correct;}
    skip(){if(this.s.selected===null){this.s.skipped++;this.s.streak=0;}return this.next();}
  }
  const api={QUOTAS,shuffle,round,Engine};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CSP_ENGINE=api;
})(globalThis);
