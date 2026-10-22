/* Милки — Мессенджер (только дизайн, демо-данные, без Supabase). */
(function(){
const $=(s,r=document)=>r.querySelector(s);
let ME='Милколенок';const MAXM=20,MAXF=5*1024*1024;
const PA={
 search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
 send:'M21 3L10 14M21 3l-7 18-4-7-7-4z',
 clip:'M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7',
 full:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
 exit:'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
 close:'M6 6l12 12M18 6L6 18',
 adduser:'M10 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM3.5 20c.4-3.3 3.1-5 6.5-5s6.1 1.7 6.5 5M19 8v6M16 11h6',
 smile:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM8.5 14a4 4 0 0 0 7 0M9 10h.01M15 10h.01',
 up:'M6 15l6-6 6 6',
 down:'M6 9l6 6 6-6',
 back:'M15 6l-6 6 6 6',
 bell:'M12 3.8a5.2 5.2 0 0 0-5.2 5.2v3.1l-1.6 2.7c-.5.8.1 1.7 1 1.7h11.6c.9 0 1.5-.9 1-1.7l-1.6-2.7V9A5.2 5.2 0 0 0 12 3.8zM10 19a2.2 2.2 0 0 0 4 0'
};
const ic=k=>'<svg viewBox="0 0 24 24"><path d="'+PA[k]+'"/></svg>';
 Object.assign(PA,{dots:'M12 5.5h.01M12 12h.01M12 18.5h.01',poll:'M5 20V11M12 20V4M19 20v-6',trash:'M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.5h9.2L17.5 7M10 11v5M14 11v5',pin:'M9 4h6l-.8 5.5L17 13H7l2.8-3.5zM12 13v7'});
const esc=t=>String(t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const hl=(t,q)=>{
  if(!q)return esc(t);
  const re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
  return t.split(re).map((p,i)=>i%2?'<mark>'+esc(p)+'</mark>':esc(p)).join('');
};
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const col=n=>PAL[hs(n)%PAL.length];
const ini=n=>n.split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const MO=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const p2=n=>String(n).padStart(2,'0');
const hm=t=>{const d=new Date(t);return p2(d.getHours())+':'+p2(d.getMinutes())};
const dm=t=>{const d=new Date(t);return d.getDate()+' '+MO[d.getMonth()]};
const lt=t=>new Date(t).toDateString()===new Date().toDateString()?hm(t):dm(t);
const pl=n=>n%10===1&&n%100!==11?'участник':([2,3,4].includes(n%10)&&![12,13,14].includes(n%100)?'участника':'участников');
const fsz=b=>b<1048576?Math.max(1,Math.round(b/1024))+' КБ':(b/1048576).toFixed(1).replace('.',',')+' МБ';
const EM=['😀','😂','😍','😊','😎','🤔','😢','😡','👍','🙏','❤️','🔥','🎉','👌'];
const RE=['Ок!','Поняла)','Хорошо 👍','Сейчас гляну','Договорились'];

/* ---------- демо-данные ---------- */
const N=Date.now(),mn=60000,H=36e5,D=24*H;
const CT=['Айша К.','Милана Р.','Зара Т.','Лейла Ш.','Амина Д.'];
let uid=1;
const C=[
 {id:'sys',sys:1,m:[ME],title:'Уведомления',un:1,msgs:[
  {w:'Система',x:'Расписание на октябрь утверждено. Изменить его можно будет с 1 ноября.',t:N-2*D}]},
 {id:'c1',m:[ME,'Айша К.'],un:2,msgs:[
  {w:'Айша К.',x:'Привет! Ты уже сделала ДЗ по алгебре?',t:N-3*D},
  {w:ME,x:'Привет, да, осталась последняя задача',t:N-3*D+6*mn},
  {w:'Айша К.',x:'Скинь потом, как решала третью)',t:N-D-2*H},
  {w:'Айша К.',x:'И ещё: завтра сидим вместе на геометрии?',t:N-D-2*H+mn}]},
 {id:'c2',m:[ME,'Милана Р.'],un:0,msgs:[
  {w:'Милана Р.',x:'Ты видела новую симуляцию по физике?',t:N-5*D},
  {w:ME,x:'Да! Автобус с окном прям как настоящий',t:N-5*D+3*mn},
  {w:'Милана Р.',x:'Ладно, ждём выходных',t:N-4*D}]},
 {id:'c3',m:[ME,'Зара Т.','Лейла Ш.'],title:'Проект по биологии',un:0,msgs:[
  {w:'sys',x:'Группа создана',t:N-6*D},
  {w:'Зара Т.',x:'Я сделаю про гидру, кто берёт медуз?',t:N-6*D+2*mn},
  {w:'Лейла Ш.',x:'Медуз беру я',t:N-6*D+5*mn},
  {w:ME,x:'Тогда я оформляю презентацию',t:N-6*D+9*mn},
  {w:'Лейла Ш.',x:'',f:{n:'медузы.pdf',s:'1,2 МБ'},t:N-2*D-H},
  {w:'Зара Т.',x:'Классно получилось, медузы красивые',t:N-2*D}]}
];

/* ---------- состояние ---------- */
let sel=null,q='',cq='',sOpen=0,aOpen=0,eOpen=0,tab='c',fs=0,pf=null,ns=new Set(),nt='',mi=-1,err='',dr='';
const cur=()=>C.find(c=>c.id===sel);
const nm=c=>c.m.length>2?(c.title||c.m.filter(x=>x!==ME).join(', ')):(c.m.filter(x=>x!==ME).join(', ')||c.title||'Новый чат');
const last=c=>c.msgs[c.msgs.length-1];
const tx=m=>m.x||(m.f?'📎 '+m.f.n:'');
const hits=c=>{const ql=cq.toLowerCase(),r=[];if(sOpen&&ql)c.msgs.forEach((m,i)=>{if((m.x||'').toLowerCase().includes(ql))r.push(i)});return r};
 const RD=JSON.parse(localStorage.getItem('mgr')||'{}');
let LIVE=0;
 let mOpen=0,menuOpen=0,pinI=-1,ma='',VT={},LS={},FI={};
const unread=c=>LIVE?c.msgs.filter(m=>m.w!=='sys'&&m.w!==ME&&m.t>(RD[c.id]||0)).length:0;
function markRead(c){RD[c.id]=Math.max(Date.now(),last(c).t);localStorage.setItem('mgr',JSON.stringify(RD))}

 function badge(){
  const n=C.reduce((s,c)=>s+(c.un||0),0),t=n>99?'99+':n;
  const b=document.querySelector('.mgbd');
  if(b){b.textContent=t;b.hidden=!n}
  const r=document.querySelectorAll('#rail .ri')[1];
  if(r){
    let d=r.querySelector('.bd2');
    if(!d){r.style.position='relative';d=document.createElement('span');d.className='bd2';d.style.cssText='right:6px;top:6px;bottom:auto';r.appendChild(d)}
    d.textContent=t;d.hidden=!n;
  }
  console.log('badge',n,'LIVE',LIVE);
}

/* ---------- каркас ---------- */
const sec=document.createElement('section');
sec.id='v-msg';sec.className='mg';sec.hidden=true;
document.querySelector('.main').appendChild(sec);
sec.innerHTML='<div class="mg-cr"><a id="mg-home" style="cursor:pointer">Главная</a> &nbsp;|&nbsp; Мессенджер</div>'+
 '<h1 class="mg-h1">Мессенджер</h1>'+
 '<div class="mg-box" id="mgb"><aside class="mg-l">'+
 '<div class="mg-lh"><h2>Сообщения</h2><p>Одноклассники и друзья своего пола</p></div>'+
 '<label class="mg-s">'+ic('search')+'<input id="mgq" placeholder="Поиск по сообщениям" autocomplete="off"></label>'+
 '<div class="mg-tabs" id="mgtb"></div><div class="mg-list" id="mgl"></div></aside>'+
 '<section class="mg-r"><header class="mg-hd" id="mgh"></header><div class="mg-mp" id="mgmem"></div><div id="mgpin"></div><div id="mgsr"></div><div id="mgap"></div>'+
 '<div class="mg-m" id="mgm"></div><footer class="mg-ft" id="mgf"></footer></section></div>';

const st=document.createElement('style');
st.textContent=`
.mg{padding-bottom:30px}
.mg-cr{font-size:12px;color:#a5a8ac;margin-top:4px}
.mg .mg-h1{font-size:34px;margin:4px 0 22px}
.mg-box{display:grid;grid-template-columns:minmax(300px,400px) 1fr;gap:24px;height:calc(100vh - 190px);min-height:520px}
.mg-l,.mg-r{background:#fff;border-radius:25px;box-shadow:0 6px 30px rgba(0,0,0,.04);display:flex;flex-direction:column;min-height:0;overflow:hidden}
.mg-lh{padding:22px 22px 0}
.mg-lh h2{font-size:22px;font-weight:800;color:#34404e}
.mg-lh p{font-size:12.5px;color:var(--mu);margin-top:4px}
.mg-s{display:flex;gap:10px;align-items:center;margin:16px 22px 0;height:46px;padding:0 16px;border:1px solid #e3e8ee;border-radius:16px;color:#9aa5b0;background:#fff}
.mg-s svg{width:18px;height:18px;flex:none}
.mg-s input{flex:1;min-width:0;border:0;outline:0;font:inherit;font-size:13.5px;color:var(--tx);background:none}
.mg-tabs{display:flex;gap:4px;margin:14px 22px 8px;padding:5px;background:#eef3f8;border-radius:16px}
.mg-tabs button{flex:1;height:38px;border-radius:12px;font-weight:600;font-size:13px;color:#8a929b}
.mg-tabs button.on{background:#fff;color:var(--bt);box-shadow:0 2px 10px rgba(0,0,0,.05)}
.mg-list{flex:1;overflow-y:auto;padding:4px 12px 12px}
.mg-c{display:flex;gap:12px;align-items:center;width:100%;padding:10px;border-radius:18px;text-align:left}
.mg-c.on{background:#e6f6fd}
.mg-a{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:15px;overflow:hidden}
.mg-a svg{width:20px;height:20px}
.mg-a img{width:100%;height:100%;object-fit:cover}
.mg-a.s{width:30px;height:30px;font-size:11px}
.mg-ci{flex:1;min-width:0}
.mg-ci b{display:block;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mg-ci small{display:block;margin-top:3px;font-size:12.5px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mg-ct{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:5px;font-size:11px;color:var(--mu)}
.mg-ct i{font-style:normal;min-width:20px;height:20px;border-radius:10px;background:var(--cy);color:#fff;font-weight:600;font-size:11px;display:grid;place-items:center;padding:0 6px}
.mg-hd{display:flex;gap:12px;align-items:center;padding:16px 20px;border-bottom:1px solid var(--ln)}
.mg-hi{flex:1;min-width:0}
.mg-hi b{display:block;font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mg-hi small{display:block;font-size:12.5px;color:var(--mu);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mg-ib{flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;color:#8a929b;cursor:pointer}
.mg-ib svg{width:20px;height:20px}
.mg-ib.on{background:var(--pl);color:var(--bt)}
.mg-ib.x{background:#fff0f0;color:#e5314a}
.mg-ib.off{opacity:.4;pointer-events:none}
.mg-bk{display:none}
.mg-sr{display:flex;gap:8px;align-items:center;padding:10px 20px;border-bottom:1px solid var(--ln)}
.mg-sr input{flex:1;min-width:0;height:38px;border:1px solid #e3e8ee;border-radius:12px;padding:0 14px;font:inherit;font-size:13px;outline:0}
.mg-sr span{font-size:12px;color:var(--mu);min-width:34px;text-align:center}
.mg-sr button{width:34px;height:34px;border-radius:10px;background:var(--pl);color:var(--bt);display:grid;place-items:center}
.mg-sr button svg{width:16px;height:16px}
.mg-ap{padding:10px 20px;border-bottom:1px solid var(--ln);background:#f8fcfe}
.mg-ap small{display:block;font-size:12px;color:var(--mu);margin-bottom:8px}
.mg-ch{display:flex;gap:8px;flex-wrap:wrap;font-size:12.5px;color:var(--mu)}
.mg-ch button{border-radius:16px;padding:7px 14px;background:#fff;border:1px solid #cfe9f3;color:var(--bt);font-weight:600;font-size:12.5px}
.mg-m{position:relative;flex:1;overflow-y:auto;padding:18px 20px;display:flex;flex-direction:column;gap:12px}
.mg-d{text-align:center}
.mg-d span{display:inline-block;background:#eef1f4;color:#7a838c;border-radius:12px;padding:3px 12px;font-size:11.5px;font-weight:500}
.mg-n{text-align:center;font-size:12px;color:var(--mu)}
.mg-r1{display:flex;gap:10px;align-items:flex-end}
.mg-r1.me{justify-content:flex-end}
.mg-b{max-width:min(620px,78%);padding:11px 16px;border-radius:20px;background:#fff;border:1px solid var(--ln);font-size:14px;line-height:1.45}
.mg-b p{white-space:pre-wrap;word-break:break-word}
.mg-b small{display:block;margin-top:5px;font-size:10.5px;opacity:.65}
.mg-b em{display:block;font-style:normal;font-weight:600;font-size:12px;margin-bottom:3px}
.me .mg-b{background:linear-gradient(135deg,#1ac9f5,#0ab0e8);border:0;color:#fff}
.mg-b.cur{outline:2px solid #f5b81c}
.mg-b mark{background:#ffe27a;color:#34404e;border-radius:4px;padding:0 2px}
.mg-f{display:flex;gap:8px;align-items:center;background:rgba(0,0,0,.07);border-radius:12px;padding:8px 10px;margin-top:4px;font-size:13px}
.mg-f svg{width:16px;height:16px;flex:none}
.mg-f small{margin:0}
.mg-em{margin:auto;text-align:center;color:var(--mu);font-size:14px}
.mg-ft{border-top:1px solid var(--ln);padding:12px 20px}
.mg-fr{display:flex;gap:10px;align-items:center}
.mg-fr input#mgi{flex:1;min-width:0;height:48px;border:1px solid var(--ln);background:#f9fafc;border-radius:16px;padding:0 18px;font:inherit;font-size:14px;outline:0;color:var(--tx)}
.mg-sm{flex:none;width:42px;height:42px;display:grid;place-items:center;color:#f5b81c}
.mg-sm svg{width:24px;height:24px}
.mg-snd{flex:none;width:52px;height:48px;border-radius:16px;background:var(--cy);color:#fff;display:grid;place-items:center}
.mg-snd svg{width:22px;height:22px}
.mg-snd:disabled{background:#e9eef2;color:#a9b2bb}
.mg-em2{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
.mg-em2 button{font-size:22px;width:38px;height:38px;border-radius:10px}
.mg-pf{display:flex;gap:8px;align-items:center;font-size:12.5px;color:#566170;background:var(--pl);border-radius:12px;padding:6px 10px;margin-bottom:8px}
.mg-pf svg{width:15px;height:15px;flex:none}
.mg-pf button{margin-left:auto;color:#9aa5b0}
.mg-er{font-size:12.5px;color:#d97706;margin-bottom:8px;font-weight:600}
.mg-nf{padding:6px 10px}
.mg-nf p{font-size:12.5px;color:var(--mu);margin:6px 0 10px;line-height:1.4}
.mg-nf input{width:100%;height:42px;border:1px solid #e3e8ee;border-radius:14px;padding:0 14px;font:inherit;font-size:13px;outline:0;margin-bottom:8px}
.mg-p{display:flex;gap:10px;align-items:center;width:100%;padding:8px 10px;border-radius:14px;font-size:13.5px;font-weight:500;text-align:left}
.mg-p.on{background:#e6f6fd}
.mg-p em{margin-left:auto;font-style:normal;color:var(--ok);font-weight:700}
.mg-p .mg-a{width:34px;height:34px;font-size:12px}
.mg-go{display:block;width:100%;height:44px;border-radius:14px;background:var(--cy);color:#fff;font-weight:700;margin-top:10px}
.mg-go:disabled{background:#e9eef2;color:#a9b2bb}

/* режим «во весь экран»: как в Telegram */
.mg.fs{position:fixed;inset:0;z-index:40;background:#181818;color:#e8e8e8;padding:0;overflow:hidden}
.mg.fs .mg-cr,.mg.fs .mg-h1,.mg.fs .mg-lh{display:none}
.mg.fs .mg-box{height:100vh;min-height:0;gap:0;grid-template-columns:minmax(300px,420px) 1fr}
.mg.fs .mg-l,.mg.fs .mg-r{border-radius:0;box-shadow:none}
.mg.fs .mg-l{background:#212121;border-right:1px solid #0f0f0f}
.mg.fs .mg-r{background:#181818}
.mg.fs .mg-s{margin:10px 12px 0;height:42px;background:#2c2c2c;border-color:transparent;border-radius:21px;color:#8e8e8e}
.mg.fs .mg-s input{color:#fff}
.mg.fs .mg-tabs{background:#2c2c2c;margin:10px 12px 4px}
.mg.fs .mg-tabs button{color:#9a9a9a}
.mg.fs .mg-tabs button.on{background:#3a3a3a;color:#fff;box-shadow:none}
.mg.fs .mg-list{padding:4px 8px 8px}
.mg.fs .mg-c{border-radius:10px;padding:8px 10px}
.mg.fs .mg-c.on{background:#8774e1}
.mg.fs .mg-ci b{color:#fff}
.mg.fs .mg-ci small,.mg.fs .mg-ct{color:#8e8e8e}
.mg.fs .mg-c.on small,.mg.fs .mg-c.on .mg-ct{color:rgba(255,255,255,.85)}
.mg.fs .mg-ct i{background:#8774e1}
.mg.fs .mg-c.on .mg-ct i{background:#fff;color:#8774e1}
.mg.fs .mg-hd{background:#212121;border-bottom:1px solid #0f0f0f;padding:10px 16px}
.mg.fs .mg-hi b{color:#fff;font-size:15px}
.mg.fs .mg-hi small{color:#8774e1}
.mg.fs .mg-ib{color:#9a9a9a}
.mg.fs .mg-ib.on{background:#2c2c2c;color:#fff}
.mg.fs .mg-ib.x{background:none;color:#9a9a9a}
.mg.fs .mg-sr,.mg.fs .mg-ap{background:#212121;border-color:#0f0f0f}
.mg.fs .mg-sr input{background:#2c2c2c;border-color:transparent;color:#fff}
.mg.fs .mg-sr button{background:#2c2c2c;color:#fff}
.mg.fs .mg-ap small,.mg.fs .mg-ch{color:#8e8e8e}
.mg.fs .mg-ch button{background:#2c2c2c;border-color:transparent;color:#fff}
.mg.fs .mg-m{background:#181818;padding:16px 8%}
.mg.fs .mg-d span{background:rgba(0,0,0,.45);color:#ddd}
.mg.fs .mg-n{color:#8e8e8e}
.mg.fs .mg-b{background:#212121;border:0;color:#fff;border-radius:14px;padding:8px 12px}
.mg.fs .me .mg-b{background:#766ac8}
.mg.fs .me .mg-a{display:none}
.mg.fs .mg-f{background:rgba(255,255,255,.1)}
.mg.fs .mg-ft{background:#212121;border-top:1px solid #0f0f0f}
.mg.fs .mg-fr input#mgi{background:none;border:0;color:#fff}
.mg.fs .mg-fl{order:-1}
.mg.fs .mg-sm{order:2;color:#9a9a9a}
.mg.fs .mg-snd{order:3;background:none;color:#8774e1;width:42px}
.mg.fs .mg-pf{background:#2c2c2c;color:#ddd}
.mg.fs .mg-p{color:#fff}
.mg.fs .mg-p.on{background:#2c2c2c}
.mg.fs .mg-nf input{background:#2c2c2c;border:0;color:#fff}
.mg.fs .mg-em2 button{background:none}

@media(max-width:820px){
 .mg-box{grid-template-columns:1fr;height:calc(100vh - 150px)}
 .mg-box:not(.has) .mg-r{display:none}
 .mg-box.has .mg-l{display:none}
 .mg-bk{display:grid}
 .mg.fs .mg-box{grid-template-columns:1fr;height:100vh}
 .mg.fs .mg-m{padding:16px 12px}
}`;
document.head.appendChild(st);

/* ---------- отрисовка кусками ---------- */
function rTabs(){
  $('#mgtb').innerHTML='<button data-tab="c" class="'+(tab==='c'?'on':'')+'">Чаты</button><button data-tab="n" class="'+(tab==='n'?'on':'')+'">Новый диалог</button>';
}
function rList(){
 C.forEach(c=>c.un=unread(c));badge();
  const box=$('#mgl');
  if(tab==='n'){box.innerHTML=newTab();return}
  if(false){
    box.innerHTML='<div class="mg-nf"><p>Выбери одного человека — получится личный чат. Выбери нескольких — получится группа. Новые участники потом видят всю историю.</p>'+
      (ns.size>1?'<input id="mgnt" placeholder="Название группы (необязательно)" value="'+esc(nt)+'" autocomplete="off">':'')+
      CT.map(n=>'<button class="mg-p'+(ns.has(n)?' on':'')+'" data-p="'+esc(n)+'"><span class="mg-a" style="background:'+col(n)+'">'+ini(n)+'</span>'+esc(n)+'<em>'+(ns.has(n)?'✓':'')+'</em></button>').join('')+
      '<button class="mg-go" id="mgcr"'+(ns.size?'':' disabled')+'>Создать '+(ns.size>1?'группу':'чат')+'</button></div>';
    return;
  }
  const ql=q.toLowerCase();
  const L=C.filter(c=>!ql||nm(c).toLowerCase().includes(ql)||c.msgs.some(m=>(m.x||'').toLowerCase().includes(ql)))
    .sort((a,b)=>last(b).t-last(a).t);
  box.innerHTML=L.map(c=>{
    const lm=last(c);
    let line;
    const hit=ql&&[...c.msgs].reverse().find(m=>(m.x||'').toLowerCase().includes(ql));
    if(hit)line=hl(hit.x,q);
    else line=esc((lm.w===ME?'Вы: ':(c.m.length>2&&lm.w!=='sys'?lm.w.split(' ')[0]+': ':''))+tx(lm));
    return '<button class="mg-c'+(c.id===sel?' on':'')+'" data-c="'+c.id+'"><span class="mg-a" style="background:'+col(nm(c))+'">'+(c.sys?ic('bell'):ini(nm(c)))+'</span>'+
      '<span class="mg-ci"><b>'+hl(nm(c),q)+'</b><small>'+line+'</small></span>'+
      '<span class="mg-ct">'+lt(lm.t)+(c.un?'<i>'+c.un+'</i>':'')+'</span></button>';
  }).join('')||'<div class="mg-em" style="padding:30px 10px">Ничего не найдено</div>';
}
function rHead(){
  const c=cur(),h=$('#mgh');
  const fsb='<button class="mg-ib" id="mgfs" title="'+(fs?'Свернуть':'Во весь экран')+'">'+ic(fs?'exit':'full')+'</button>';
  if(!c){h.innerHTML='<div class="mg-hi"><b>Выбери чат</b><small>или создай новый</small></div>'+fsb;return}
  const n=c.m.length;
  const sub=c.sys?'Сообщения от системы':(n>2?n+' '+pl(n)+': '+c.m.join(', '):(n<2?'Пока только ты. Пригласи по ссылке':'Личный чат'));
  h.innerHTML='<button class="mg-ib mg-bk" id="mgbk">'+ic('back')+'</button>'+
    '<span class="mg-a" style="background:'+col(nm(c))+'">'+(c.sys?ic('bell'):ini(nm(c)))+'</span>'+
    '<div class="mg-hi"><b>'+esc(nm(c))+'</b><small>'+esc(sub)+'</small></div>'+
    (c.sys?'':'<button class="mg-ib'+(sOpen?' on':'')+'" id="mgsb" title="Поиск в чате">'+ic('search')+'</button>'+
      '<button class="mg-ib'+(aOpen?' on':'')+'" id="mgad" title="Добавить участника">'+ic('adduser')+'</button>')+
    (c.sys?'':dots())+fsb+'<button class="mg-ib x" id="mgx" title="Закрыть чат">'+ic('close')+'</button>';
}
function rBar(){
  const c=cur(),b=$('#mgsr');
  if(!c||!sOpen){b.innerHTML='';return}
  b.innerHTML='<div class="mg-sr"><input id="mgcq" placeholder="Поиск по этому чату" autocomplete="off" value="'+esc(cq)+'"><span id="mgcn"></span>'+
    '<button id="mgup" title="Раньше">'+ic('up')+'</button><button id="mgdn" title="Позже">'+ic('down')+'</button></div>';
}
function rAdd(){return rInv();
  const c=cur(),a=$('#mgap');
  if(!c||!aOpen||c.sys){a.innerHTML='';return}
  const av=CT.filter(n=>!c.m.includes(n));
  a.innerHTML='<div class="mg-ap"><small>Добавить в чат. Новый участник увидит всю переписку с самого начала.'+(c.m.length===2?' Личный чат станет групповым.':'')+'</small><div class="mg-ch">'+
    (c.m.length>=MAXM?'Достигнут лимит участников':(av.map(n=>'<button data-add="'+esc(n)+'">+ '+esc(n)+'</button>').join('')||'Все уже в чате'))+'</div></div>';
}
function rMsgs(keep){
  const c=cur(),b=$('#mgm'),s0=b.scrollTop;
  if(!c){b.innerHTML='<div class="mg-em">Выбери чат слева<br>или создай новый диалог</div>';return}
  const hit=hits(c);
  if(mi<0||mi>=hit.length)mi=hit.length-1;
  const hq=sOpen?cq:'';
  let day='',h='';
  c.msgs.forEach((m,i)=>{
    const d=new Date(m.t).toDateString();
    if(d!==day){day=d;h+='<div class="mg-d"><span>'+dm(m.t)+'</span></div>'}
    if(m.w==='sys'){h+='<div class="mg-n">'+esc(m.x)+'</div>';return}
    const me=m.w===ME;
    h+='<div class="mg-r1'+(me?' me':'')+'">'+
      (me?'':'<span class="mg-a s" style="background:'+col(m.w)+'">'+ini(m.w)+'</span>')+
      '<div class="mg-b'+(hit[mi]===i?' cur':'')+'"'+(m.id?' data-mid="'+m.id+'"':'')+'>'+
      (!me&&c.m.length>2?'<em style="color:'+col(m.w)+'">'+esc(m.w)+'</em>'+(FI[m.uid]?'<span class="fio">'+esc(FI[m.uid])+'</span>':''):'')+
      (m.poll?pollHTML(m):(m.x?'<p>'+hl(m.x,hq)+'</p>':''))+
      (m.f?'<div class="mg-f"'+(m.f.p?' data-fp="'+esc(m.f.p)+'" style="cursor:pointer"':'')+'>'+ic('clip')+'<span>'+esc(m.f.n)+'</span><small>'+m.f.s+'</small></div>':'')+
      '<small>'+(m.pin?'📌 ':'')+dm(m.t)+' в '+hm(m.t)+'</small>'+(m.id&&ma===String(m.id)?actHTML(m,me):'')+'</div>'+
      (me?'<span class="mg-a s"><img src="ava.jpg" alt=""></span>':'')+'</div>';
  });
  b.innerHTML=h;
  const cn=$('#mgcn');if(cn)cn.textContent=hit.length?(mi+1)+'/'+hit.length:'0';
  const cu=$('.mg-b.cur',b);
  if(cu)b.scrollTop=cu.offsetTop-b.clientHeight/2+cu.offsetHeight/2;else if(keep)b.scrollTop=s0;else b.scrollTop=b.scrollHeight;
}
function rFoot(){
  const c=cur(),f=$('#mgf');
  if(!c){f.innerHTML='';f.hidden=true;return}
  f.hidden=false;
  const dis=c.sys?' disabled':'';
  f.innerHTML=(eOpen?'<div class="mg-em2">'+EM.map(e=>'<button data-e="'+e+'">'+e+'</button>').join('')+'</div>':'')+
    (pf?'<div class="mg-pf">'+ic('clip')+esc(pf.n)+' · '+pf.s+'<button id="mgpx">'+ic('close')+'</button></div>':'')+
    (err?'<div class="mg-er">'+err+'</div>':'')+
    '<div class="mg-fr"><button class="mg-sm" id="mgem"'+dis+'>'+ic('smile')+'</button>'+
    '<textarea id="mgi" rows="1" name="msg" enterkeyhint="send" data-lpignore="true" data-1p-ignore autocomplete="off" placeholder="'+(c.sys?'Только чтение':'Напишите сообщение…')+'"'+dis+'>'+esc(dr)+'</textarea>'+
    '<label class="mg-ib mg-fl'+(c.sys?' off':'')+'" title="Прикрепить файл (до 5 МБ)">'+ic('clip')+'<input type="file" id="mgfl" hidden'+dis+'></label>'+
    '<button class="mg-snd" id="mgsd"'+dis+'>'+ic('send')+'</button></div>';
 const ti=$('#mgi');if(ti)grow(ti);
}

 function grow(t){t.style.height='48px';t.style.height=Math.min(t.scrollHeight+2,140)+'px'}
 
function renderAll(){
  const c=cur();if(c&&!sec.hidden)markRead(c);
  $('#mgb').classList.toggle('has',!!c);
  rTabs();rList();rHead();rMem();rPins();rBar();rAdd();rMsgs();rFoot();
}

/* ---------- действия ---------- */
function open(id){
  sel=id;aOpen=0;eOpen=0;pf=null;err='';dr='';mi=-1;mOpen=0;menuOpen=0;ma='';pinI=-1;
  sOpen=q?1:0;cq=q;
  renderAll();
  if(sOpen){const i=$('#mgcq');if(i)i.blur()}
}
function closeChat(){sel=null;sOpen=0;cq='';aOpen=0;mOpen=0;menuOpen=0;ma='';renderAll()}
function setFs(v){
  fs=v?1:0;sec.classList.toggle('fs',!!fs);
  try{
    if(fs&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});
    else if(!fs&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  }catch(err2){}
  rHead();
}
function nav(d){
  const c=cur();if(!c)return;
  const h=hits(c);if(!h.length)return;
  mi=(mi+d+h.length)%h.length;rMsgs();
}
 function sendOld(){
  const c=cur();if(!c||c.sys)return;
  const x=dr.trim();if(!x&&!pf)return;
  c.msgs.push({w:ME,x:x,f:pf,t:Date.now()});
  dr='';pf=null;err='';eOpen=0;
  rFoot();rMsgs();rList();
  const i=$('#mgi');if(i)i.focus();
  const o=c.m.filter(n=>n!==ME);
  if(o.length)setTimeout(()=>{
    if(!C.includes(c))return;
    c.msgs.push({w:o[Math.floor(Math.random()*o.length)],x:RE[Math.floor(Math.random()*RE.length)],t:Date.now()});
    if(sel===c.id)rMsgs();else c.un++;
    rList();
  },1500);
}
function addMember(n){
  const c=cur();if(!c||c.m.includes(n)||c.m.length>=MAXM)return;
  c.m.push(n);
  c.msgs.push({w:'sys',x:'В чат добавлен(а): '+n+'. Вся история переписки доступна.',t:Date.now()});
  rHead();rAdd();rMsgs();rList();
}
function createOld(){
  const p=[...ns];if(!p.length)return;
  let c=p.length===1?C.find(z=>!z.sys&&z.m.length===2&&z.m.includes(p[0])):null;
  if(!c){
    c={id:'n'+(uid++),m:[ME,...p],title:p.length>1?nt.trim():'',un:0,msgs:[{w:'sys',x:p.length>1?'Группа создана':'Личный чат создан',t:Date.now()}]};
    C.push(c);
  }
  ns.clear();nt='';tab='c';q='';$('#mgq').value='';
  open(c.id);
}

sec.addEventListener('click',e=>{
  const t=e.target,b=k=>t.closest(k);let x;
 enablePush();
 if(menuOpen&&!b('#mgdots')&&!b('#mgpoll')){menuOpen=0;rHead()}
  if(b('#mg-home'))MS.show('home');
  else if(b('#mgfs'))setFs(!fs);
  else if(b('#mgx')||b('#mgbk'))closeChat();
  else if((x=b('[data-c]')))open(x.dataset.c);
  else if((x=b('[data-tab]'))){tab=x.dataset.tab;rTabs();rList()}
  else if((x=b('[data-p]'))){const n=x.dataset.p;ns.has(n)?ns.delete(n):ns.add(n);rList()}
  else if(b('#mgcr'))create();
  else if(b('#mgsb')){sOpen=sOpen?0:1;if(!sOpen)cq='';mi=-1;rHead();rBar();rMsgs();if(sOpen){const i=$('#mgcq');if(i)i.focus()}}
  else if(b('#mgad')){aOpen=aOpen?0:1;rHead();rAdd()}
  else if((x=b('[data-add]')))addMember(x.dataset.add);
  else if(b('#mgup'))nav(-1);
  else if(b('#mgdn'))nav(1);
  else if(b('#mgem')){eOpen=eOpen?0:1;rFoot()}
  else if((x=b('[data-e]'))){dr+=x.dataset.e;rFoot();const i=$('#mgi');if(i)i.focus()}
  else if((x=b('[data-fp]')))openFile(x.dataset.fp);
  else if(b('[data-inv]')){const c=cur();if(c)copy(link(c))}
  else if(b('#mgjn'))join($('#mgjc').value);
  else if(b('#mgout'))sb.auth.signOut();
   else if(b('#mgdots')){menuOpen=menuOpen?0:1;rHead()}
  else if(b('#mgpoll')){menuOpen=0;rHead();pollModal()}
  else if(b('.mg-hd>.mg-a')||b('.mg-hi')){const c=cur();if(c&&!c.sys){mOpen=mOpen?0:1;rMem();refreshSeen().then(rMem)}}
  else if((x=b('[data-vote]')))vote(x.dataset.vote,+x.dataset.o);
  else if((x=b('[data-pin]')))pinMsg(x.dataset.pin);
  else if((x=b('[data-del]')))delMsg(x.dataset.del);
  else if((x=b('[data-unpin]')))pinMsg(x.dataset.unpin);
  else if((x=b('[data-jump]')))pinJump(x.dataset.jump);
  else if((x=b('.mg-b[data-mid]'))&&!b('.mg-f')&&!b('.mg-po')&&!b('.mg-act')){ma=ma===x.dataset.mid?'':x.dataset.mid;rMsgs(1)}
   else if(b('[data-code]')){const c=cur();if(c){navigator.clipboard&&navigator.clipboard.writeText(c.code);toast('Код скопирован: '+c.code)}}
    else if(b('#mgdel'))delAccModal();
  else if(b('#mgsd'))send();
  else if(b('#mgpx')){pf=null;rFoot()}
});
sec.addEventListener('input',e=>{
  const id=e.target.id;
  if(id==='mgq'){q=e.target.value;if(tab!=='c'){tab='c';rTabs()}rList()}
  else if(id==='mgi'){dr=e.target.value;grow(e.target)}
  else if(id==='mgcq'){cq=e.target.value;mi=-1;rMsgs()}
  else if(id==='mgnt')nt=e.target.value;
});
sec.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(e.target.id==='mgi'){if(!e.shiftKey){e.preventDefault();send()}}
  else if(e.target.id==='mgcq'){e.preventDefault();nav(-1)}
});
sec.addEventListener('change',e=>{
  if(e.target.id!=='mgfl'||1)return;
  const f=e.target.files[0];if(!f)return;
  if(f.size>MAXF){err='Файл больше 5 МБ — выбери поменьше';pf=null}
  else{err='';pf={n:f.name,s:fsz(f.size)}}
  rFoot();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fs&&!sec.hidden)setFs(false)});
document.addEventListener('fullscreenchange',()=>{if(fs&&!document.fullscreenElement){fs=0;sec.classList.remove('fs');rHead()}});

/* первый чат открыт сразу, как на макете (на узком экране — список) */
if(window.matchMedia('(min-width:821px)').matches){
  const f=[...C].sort((a,b)=>last(b).t-last(a).t).find(c=>!c.sys);
  if(f)sel=f.id;
}
renderAll();
/* ===== SUPABASE ===== */
const SB_URL='https://sjwvrljmqpbopbxqkhkl.supabase.co',SB_KEY='sb_publishable_mWqrZq0Vw65Ahk7ZIbtlNQ_owreCtcj';
let sb=null,me=null,ch=null,am='in';const nmap={};
const J=new URLSearchParams(location.search).get('join');if(J)sessionStorage.setItem('mj',J);
const st2=document.createElement('style');st2.textContent=`
.mg-ac{max-width:420px;margin:30px auto;background:#fff;border-radius:25px;padding:30px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.mg-ac h2{font-size:24px;font-weight:800;margin-bottom:14px}
.mg-ac input{width:100%;height:46px;border:1px solid #e3e8ee;border-radius:14px;padding:0 16px;font:inherit;font-size:14px;outline:0;margin-bottom:10px}
.mg-warn{background:#fff0f0;color:#d61f3a;border:1.5px solid #f5b5bd;border-radius:14px;padding:12px 14px;font-weight:800;font-size:13px;text-align:center;margin:6px 0 10px}
.mg-ai{font-size:12.5px;color:var(--mu);line-height:1.45;margin-bottom:14px}`;
document.head.appendChild(st2);
 const st3=document.createElement('style');st3.textContent=`
.mg-hd{position:relative}
.mg-hd>.mg-a,.mg-hi{cursor:pointer}
#mgdots svg{stroke-width:3.2}
.mg-dd{position:absolute;right:100px;top:62px;z-index:8;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.18);padding:6px;min-width:200px;animation:mgd .15s}
.mg-dd button{display:flex;gap:10px;align-items:center;width:100%;height:42px;padding:0 14px;border-radius:12px;font-weight:600;font-size:13.5px;color:#34404e}
.mg-dd button:hover{background:var(--pl)}
.mg-dd svg{width:18px;height:18px;color:var(--bt)}
@keyframes mgd{from{opacity:0;transform:translateY(-6px)}}
.mg-mp{max-height:0;overflow:hidden;transition:max-height .35s ease;background:#f8fcfe}
.mg-mp.open{max-height:340px;overflow-y:auto;border-bottom:1px solid var(--ln)}
.mg-mi{padding:14px 20px}
.mg-mi>b{display:block;font-size:13px;color:var(--mu);margin-bottom:8px}
.mg-mr{display:flex;gap:12px;align-items:center;padding:7px 0}
.mg-mr b{display:block;font-size:14px;font-weight:600}
.mg-mr small{font-size:12px;color:var(--mu)}
.mg-mr small.on{color:var(--ok);font-weight:600}
.mg-mr .mg-a{width:40px;height:40px;font-size:14px}
.mg-w{position:relative;flex:none}
.mg-w u{position:absolute;right:-1px;bottom:-1px;width:12px;height:12px;border-radius:50%;background:#3bc25b;border:2px solid #fff}
.mg-pn{display:flex;gap:12px;align-items:center;padding:8px 20px;border-bottom:1px solid var(--ln);cursor:pointer;background:#fff}
.mg-pn .pbar{flex:none;width:3px;align-self:stretch;border-radius:2px;background:var(--cy)}
.mg-pn div{flex:1;min-width:0}
.mg-pn b{display:block;font-size:12.5px;color:var(--bt)}
.mg-pn small{display:block;font-size:13px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mg-pn button{flex:none;width:32px;height:32px;border-radius:10px;color:#9aa5b0;display:grid;place-items:center}
.mg-pn button svg{width:16px;height:16px}
.mg-b[data-mid]{cursor:pointer}
.mg-b.flash{outline:2px solid #f5b81c}
.mg-act{display:flex;gap:6px;margin-top:8px;animation:mgd .15s}
.mg-act button{display:flex;gap:6px;align-items:center;height:30px;padding:0 12px;border-radius:10px;background:#fff;color:#34404e;font-weight:600;font-size:12px;box-shadow:0 1px 6px rgba(0,0,0,.12)}
.mg-act button.rd{color:#e5314a}
.mg-act svg{width:15px;height:15px}
.mg-po{min-width:240px}
.mg-pv{position:relative;display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;height:38px;padding:0 12px;margin-top:6px;border-radius:12px;background:rgba(0,0,0,.06);overflow:hidden;text-align:left;font-size:13px}
.mg-pv .fill{position:absolute;left:0;top:0;bottom:0;background:rgba(10,209,248,.28);transition:width .3s}
.mg-pv .t,.mg-pv .n{position:relative}
.mg-pv.on{font-weight:700}
.me .mg-pv{background:rgba(255,255,255,.18)}
.me .mg-pv .fill{background:rgba(255,255,255,.35)}
.mg-pm{background:#fff;color:#34404e;border-radius:22px;padding:24px;width:min(420px,100%);max-height:90vh;overflow:auto}
.mg-pm h3{font-size:19px;font-weight:800;margin-bottom:12px}
.mg-pm input[type=text],.mg-pm input:not([type]){width:100%;height:44px;border:1px solid #e3e8ee;border-radius:14px;padding:0 14px;font:inherit;font-size:14px;outline:0;margin-bottom:8px}
.mg-pm .pa{color:var(--bt);font-weight:600;margin:4px 0 10px}
.mg-pm .pc{display:flex;gap:8px;align-items:center;font-size:13px;margin-bottom:8px}
.mg-pm .pe{color:#d97706;font-size:12.5px;font-weight:600;min-height:16px}
.mg-pm .pb{display:flex;gap:10px;justify-content:flex-end;margin-top:10px}
.mg-pm .pb button{height:40px;padding:0 20px;border-radius:14px;font-weight:700;background:#eef3f8}
.mg-pm .pb .ok{background:var(--cy);color:#fff}
.mg-pm .pb .ok:disabled{opacity:.5}
.mg.fs .mg-mp{background:#212121}
.mg.fs .mg-mp.open{border-color:#0f0f0f}
.mg.fs .mg-pn{background:#212121;border-color:#0f0f0f}
.mg.fs .mg-pv{background:rgba(255,255,255,.08)}
.mg.fs .me .mg-pv{background:rgba(255,255,255,.18)}`;
document.head.appendChild(st3);
 const st4=document.createElement('style');st4.textContent='.fio{display:block;font-size:9px;font-weight:400;opacity:.4;margin:-1px 0 3px;color:inherit}.mg-mr .fio{margin:0}';document.head.appendChild(st4);
const st5=document.createElement('style');st5.textContent='.mg-fr{align-items:flex-end}.mg-fr textarea#mgi{flex:1;min-width:0;height:48px;max-height:140px;border:1px solid var(--ln);background:#f9fafc;border-radius:16px;padding:13px 18px;font:inherit;font-size:14px;line-height:1.4;outline:0;color:var(--tx);resize:none;overflow-y:auto}.mg.fs .mg-fr textarea#mgi{background:none;border:0;color:#fff}';document.head.appendChild(st5);
const au=document.createElement('div');au.id='mgau';au.hidden=true;sec.appendChild(au);
const tr=m=>/Invalid login/i.test(m)?'Неверная почта или пароль':/already/i.test(m)?'Такая почта уже зарегистрирована':/rate limit/i.test(m)?'Слишком много попыток, подожди минуту':m;
function toast(t){let d=$('#mgtoast');if(!d){d=document.createElement('div');d.id='mgtoast';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:60;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}
const setName=(id,n)=>{n=n||'Участник';let k=n,i=2;while(Object.entries(nmap).some(([u,v])=>v===k&&u!==id))k=n+' '+i++;nmap[id]=k};
const toM=r=>{const s=(r.body||'').startsWith('§sys§');return{id:r.id,uid:r.user_id,cid:r.chat_id,pin:!!r.pinned,poll:r.poll||null,w:s?'sys':(nmap[r.user_id]||'Участник'),x:s?r.body.slice(5):(r.body||''),f:r.file_path?{n:r.file_name||'файл',s:'',p:r.file_path}:null,t:Date.parse(r.created_at)}};
async function loadAll(){
  const since=new Date(Date.now()-30*864e5).toISOString();
  const [a,b,d]=await Promise.all([
    sb.from('chats').select('id,title,invite_code,created_at'),
    sb.from('chat_members').select('chat_id,user_id'),
    sb.from('messages').select('id,chat_id,user_id,body,file_path,file_name,created_at,pinned,poll').gte('created_at',since).order('created_at',{ascending:false}).limit(1000)]);
  if(a.error||b.error||d.error){toast('Ошибка загрузки: '+(a.error||b.error||d.error).message);return}
  const ms=d.data.reverse(),ids=new Set([me.id]);
  b.data.forEach(x=>ids.add(x.user_id));ms.forEach(x=>ids.add(x.user_id));
  ((await sb.from('profiles').select('id,name,last_seen,fio').in('id',[...ids])).data||[]).forEach(r=>{LS[r.id]=Date.parse(r.last_seen);FI[r.id]=r.fio||'';if(!nmap[r.id])setName(r.id,r.name)});
await loadVotes();
  ME=nmap[me.id]||'Я';
  const un=Object.fromEntries(C.map(c=>[c.id,c.un||0]));
  C.splice(0,C.length,...a.data.map(c=>{
    const u=b.data.filter(x=>x.chat_id===c.id).map(x=>x.user_id),m=ms.filter(x=>x.chat_id===c.id).map(toM);
    if(!m.length)m.push({w:'sys',x:'Чат создан',t:Date.parse(c.created_at)});
    return{id:c.id,code:c.invite_code,uids:u,title:c.title||'',un:un[c.id]||0,m:u.map(x=>nmap[x]||'Участник'),msgs:m}}));
}
const link=c=>location.origin+location.pathname+'?join='+c.code;
function copy(t){const ok=()=>toast('Ссылка скопирована. Отправь её тому, кого хочешь пригласить');if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,()=>prompt('Скопируй ссылку',t));else prompt('Скопируй ссылку',t)}
function newTab(){return'<div class="mg-nf"><p>Создай чат и отправь ссылку-приглашение. Пока в чате двое, он выглядит как личный, с трёх участников становится групповым.</p><input id="mgnt" placeholder="Название чата (необязательно)" value="'+esc(nt)+'" autocomplete="off"><button class="mg-go" id="mgcr">Создать чат</button><p style="margin-top:22px">Есть ссылка или код приглашения?</p><input id="mgjc" placeholder="Вставь ссылку или код" autocomplete="off"><button class="mg-go" id="mgjn" style="background:#eaf8fd;color:var(--bt)">Войти в чат</button><button class="mg-go" id="mgout" style="background:none;color:var(--mu);font-weight:600">Выйти из аккаунта ('+esc(ME)+')</button><button class="mg-go" id="mgdel" style="background:none;color:#e5314a;font-weight:600">Удалить аккаунт</button></div>'}
function rInv(){
  const c=cur(),a=$('#mgap');
  if(!c||!aOpen){a.innerHTML='';return}
  a.innerHTML='<div class="mg-ap"><small>Отправь ссылку тому, кого хочешь добавить. Он зарегистрируется или войдёт и сразу увидит переписку за последние 30 дней.'+(c.m.length===2?' С третьим участником чат станет групповым.':'')+'</small><div class="mg-ch"><button data-inv="1">Скопировать ссылку</button><button data-code="1">Код: '+esc(c.code)+'</button></div></div>';
}
function authView(msg){
  $('#mgb').hidden=true;au.hidden=false;
  au.innerHTML='<div class="mg-ac"><h2>'+(am==='in'?'Вход':'Регистрация')+'</h2>'+(sessionStorage.getItem('mj')?'<p class="mg-ai">Тебя пригласили в чат. Войди или зарегистрируйся, и мы сразу тебя добавим.</p>':'')+
  '<div class="mg-warn">НЕ ВВОДИТЬ ПАРОЛЬ ОТ НАСТОЯЩЕГО АККАУНТА MILKY SCHOOL</div><p class="mg-ai">Почта и пароль нужны только для идентификации и сохранения истории переписки.</p>'+
  (am==='up'?'<input id="mgan" placeholder="Имя в чате" autocomplete="off"><input id="mgfio" placeholder="ФИО полностью: Иванова Мария Ивановна" autocomplete="off"><p class="mg-ai">ФИО нужно, чтобы понять, что ты из школы. Оно показывается мелким бледным текстом под именем.</p>':'')+
  '<input id="mgae" type="email" placeholder="Почта" autocomplete="off"><input id="mgpw" type="password" placeholder="Пароль (от 6 символов)" autocomplete="off">'+
  '<div class="mg-er" id="mgaer">'+(msg||'')+'</div><button class="mg-go" id="mgag">'+(am==='in'?'Войти':'Зарегистрироваться')+'</button><button class="mg-go" id="mgsw" style="background:none;color:var(--bt);margin-top:4px">'+(am==='in'?'Нет аккаунта? Регистрация':'Уже есть аккаунт? Войти')+'</button></div>';
}
 function checkFio(s){
  const PAT=/(ович|евич|ьич|ич|овна|евна|ьевна|ична|инична|ыч|оглы|кызы|кизи|улы|угли)$/i;
  const SUR=/(ов|ова|ёв|ёва|ев|ева|ин|ина|ын|ына|ский|ская|цкий|цкая|ой|ый|ий|ая|ко|енко|ук|юк|ян|дзе|ли|ых|их|ан|ец|ик)$/i;
  const w=(s||'').trim().replace(/\s+/g,' ').split(' ');
  if(w.length!==3)return{err:'Введи ФИО полностью: фамилия, имя и отчество (три слова)'};
  if(w.some(x=>x.length<2||!/^[А-ЯЁа-яё]+(-[А-ЯЁа-яё]+)?$/.test(x)))return{err:'ФИО пишется русскими буквами, без цифр и символов'};
  if(w.some(x=>/(.)\1\1/i.test(x))||new Set(w.map(x=>x.toLowerCase())).size<3)return{err:'Проверь ФИО: похоже на опечатку'};
  if(!SUR.test(w[0]))return{err:'Проверь фамилию: она должна оканчиваться, например, на «-ов», «-ова», «-ин», «-ская»'};
  if(!PAT.test(w[2]))return{err:'Проверь отчество: оно должно оканчиваться, например, на «-ович», «-евич», «-овна», «-евна»'};
  return{v:w.map(x=>x.toLowerCase().replace(/(^|-)./g,m=>m.toUpperCase())).join(' ')};
}
au.addEventListener('click',async e=>{
  if(e.target.closest('#mgsw')){am=am==='in'?'up':'in';authView();return}
  if(!e.target.closest('#mgag'))return;
  const em=$('#mgae').value.trim(),pw=$('#mgpw').value,nn=am==='up'?$('#mgan').value.trim():'',bad=t=>{$('#mgaer').textContent=t};
  if(!em||pw.length<6)return bad('Введи почту и пароль (от 6 символов)');
 let fio='';
  if(am==='up'){
    if(nn.length<2)return bad('Введи имя в чате');
    const f=checkFio($('#mgfio').value);if(f.err)return bad(f.err);fio=f.v;
  }
  const r=am==='in'?await sb.auth.signInWithPassword({email:em,password:pw}):await sb.auth.signUp({email:em,password:pw,options:{data:{name:nn,fio}}});
  if(r.error)return bad(tr(r.error.message));
  if(!r.data.session)bad('Подтверди почту по письму или выключи «Confirm email» в Supabase');
});
au.addEventListener('keydown',e=>{if(e.key==='Enter'){const b=$('#mgag');if(b)b.click()}});

 function notify(c,m){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  if(m.w==='sys'||(!document.hidden&&sel===c.id))return;
  const n=new Notification(nm(c),{body:m.w+': '+tx(m),tag:c.id});
  n.onclick=()=>{window.focus();MS.show('msg');open(c.id);n.close()};
}

 const mw=n=>n%10===1&&n%100!==11?'минуту':([2,3,4].includes(n%10)&&![12,13,14].includes(n%100)?'минуты':'минут');
function seen(u){
  if(u===me.id)return'В сети';
  const t=LS[u];if(!t)return'давно не был(а) в сети';
  const d=Date.now()-t;if(d<75000)return'В сети';
  const m=Math.floor(d/60000),a=new Date(t),n=new Date();
  if(m<60)return'был(а) '+m+' '+mw(m)+' назад';
  if(a.toDateString()===n.toDateString())return'был(а) в '+hm(t);
  if(a.toDateString()===new Date(n-864e5).toDateString())return'был(а) вчера';
  return'был(а) '+dm(t);
}
async function refreshSeen(){const c=cur();if(!c||!c.uids)return;((await sb.from('profiles').select('id,last_seen').in('id',c.uids)).data||[]).forEach(r=>LS[r.id]=Date.parse(r.last_seen))}
const touch=()=>{if(sb&&me&&!document.hidden){LS[me.id]=Date.now();sb.rpc('touch_seen')}};
async function loadVotes(){const r=await sb.from('poll_votes').select('message_id,user_id,opt');VT={};(r.data||[]).forEach(v=>(VT[v.message_id]||(VT[v.message_id]=[])).push(v))}
function findMsg(id){for(const c of C){const m=c.msgs.find(x=>String(x.id)===String(id));if(m)return m}}
function dropMsg(id){for(const c of C){const n=c.msgs.length;c.msgs=c.msgs.filter(m=>String(m.id)!==String(id));if(c.msgs.length!==n){if(!c.msgs.length)c.msgs.push({w:'sys',x:'Сообщений нет',t:Date.now()});if(sel===c.id){rMsgs(1);rPins()}rList()}}}
function dots(){return'<button class="mg-ib'+(menuOpen?' on':'')+'" id="mgdots" title="Ещё">'+ic('dots')+'</button>'+(menuOpen?'<div class="mg-dd"><button id="mgpoll">'+ic('poll')+'Создать опрос</button></div>':'')}
function rMem(){
  const c=cur(),b=$('#mgmem');
  if(!c||c.sys){b.className='mg-mp';b.innerHTML='';return}
  b.innerHTML='<div class="mg-mi"><b>'+c.m.length+' '+pl(c.m.length)+'</b>'+(c.uids||[]).map(u=>{const n=nmap[u]||'Участник',s=seen(u),on=s==='В сети';return'<div class="mg-mr"><span class="mg-w"><span class="mg-a" style="background:'+col(n)+'">'+ini(n)+'</span>'+(on?'<u></u>':'')+'</span><div><b>'+esc(n)+(u===me.id?' (ты)':'')+'</b>'+(FI[u]?'<span class="fio">'+esc(FI[u])+'</span>':'')+'<small class="'+(on?'on':'')+'">'+s+'</small></div></div>'}).join('')+'</div>';
  b.classList.toggle('open',!!mOpen);
}
function rPins(){
  const c=cur(),b=$('#mgpin'),P=c?c.msgs.filter(m=>m.pin):[];
  if(!P.length){b.innerHTML='';return}
  if(pinI<0||pinI>=P.length)pinI=P.length-1;
  const m=P[pinI];
  b.innerHTML='<div class="mg-pn" data-jump="'+m.id+'"><span class="pbar"></span><div><b>Закреплённое сообщение'+(P.length>1?' #'+(pinI+1):'')+'</b><small>'+esc(m.w+': '+tx(m))+'</small></div><button data-unpin="'+m.id+'" title="Открепить">'+ic('close')+'</button></div>';
}
function jump(id){const e=$('.mg-b[data-mid="'+id+'"]');if(!e)return;const b=$('#mgm');b.scrollTop=e.offsetTop-b.clientHeight/2+e.offsetHeight/2;e.classList.add('flash');setTimeout(()=>e.classList.remove('flash'),1500)}
function pinJump(id){jump(id);const c=cur(),P=c.msgs.filter(m=>m.pin);pinI=(pinI-1+P.length)%P.length;rPins()}
function actHTML(m,mine){return'<div class="mg-act">'+(mine?'<button class="rd" data-del="'+m.id+'">'+ic('trash')+'Удалить</button>':'')+'<button data-pin="'+m.id+'">'+ic('pin')+(m.pin?'Открепить':'Закрепить')+'</button></div>'}
function pollHTML(m){
  const V=VT[m.id]||[],tot=new Set(V.map(v=>v.user_id)).size,mine=V.filter(v=>v.user_id===me.id).map(v=>v.opt);
  return'<div class="mg-po"><b>📊 '+esc(m.poll.q)+'</b><small>'+(m.poll.multi?'Можно выбрать несколько':'Один ответ')+'</small>'+
    m.poll.opts.map((o,i)=>{const n=V.filter(v=>v.opt===i).length,p=tot?Math.round(n/tot*100):0,on=mine.includes(i);
      return'<button class="mg-pv'+(on?' on':'')+'" data-vote="'+m.id+'" data-o="'+i+'"><span class="fill" style="width:'+p+'%"></span><span class="t">'+(on?'✓ ':'')+esc(o)+'</span><span class="n">'+n+' · '+p+'%</span></button>'}).join('')+
    '<small>Проголосовало: '+tot+'</small></div>';
}
async function vote(id,o){
  const m=findMsg(id);if(!m||!m.poll)return;const k=m.id,V=VT[k]||[],has=V.some(v=>v.user_id===me.id&&v.opt===o);
  let N=V;
  if(has)N=V.filter(v=>!(v.user_id===me.id&&v.opt===o));
  else{if(!m.poll.multi)N=V.filter(v=>v.user_id!==me.id);N=[...N,{message_id:k,user_id:me.id,opt:o}]}
  VT[k]=N;rMsgs(1);
  if(has)await sb.from('poll_votes').delete().match({message_id:k,user_id:me.id,opt:o});
  else{
    if(!m.poll.multi)await sb.from('poll_votes').delete().match({message_id:k,user_id:me.id});
    const r=await sb.from('poll_votes').insert({message_id:k,opt:o});
    if(r.error){toast('Не получилось: '+r.error.message);await loadVotes();rMsgs(1)}
  }
}
async function pinMsg(id){
  const m=findMsg(id);if(!m)return;const v=!m.pin;
  const r=await sb.rpc('pin_message',{p_id:m.id,p_val:v});
  if(r.error){toast('Не получилось: '+r.error.message);return}
  m.pin=v;ma='';if(v)pinI=-1;rMsgs(1);rPins();
}
async function delMsg(id){
  const m=findMsg(id);if(!m||!confirm('Удалить сообщение?'))return;
  const r=await sb.from('messages').delete().eq('id',m.id).select();
  if(r.error||!r.data.length){toast('Не удалось удалить');return}
  if(m.f&&m.f.p)sb.storage.from('chat-files').remove([m.f.p]);
  ma='';dropMsg(m.id);
}
function pollModal(){
  const c=cur();if(!c)return;
  const d=document.createElement('div');
  d.style.cssText='position:fixed;inset:0;z-index:70;background:rgba(15,25,35,.45);display:grid;place-items:center;padding:20px';
  d.innerHTML='<div class="mg-pm"><h3>Создать опрос</h3><input id="pq" placeholder="Вопрос" maxlength="200"><div id="po"></div><button class="pa" id="pad">+ Добавить вариант</button><label class="pc"><input type="checkbox" id="pmu"> Можно выбрать несколько ответов</label><div class="pe" id="pe"></div><div class="pb"><button id="pcn">Отмена</button><button class="ok" id="pok">Создать</button></div></div>';
  document.body.appendChild(d);
  const po=d.querySelector('#po'),add=()=>{if(po.children.length>=10)return;const i=document.createElement('input');i.placeholder='Вариант '+(po.children.length+1);i.maxLength=100;po.appendChild(i)};
  add();add();
  d.addEventListener('click',async e=>{
    const id=e.target.id;
    if(e.target===d||id==='pcn')d.remove();
    else if(id==='pad')add();
    else if(id==='pok'){
      const q=d.querySelector('#pq').value.trim(),o=[...po.children].map(i=>i.value.trim()).filter(Boolean),er=d.querySelector('#pe');
      if(!q){er.textContent='Напиши вопрос';return}
      if(o.length<2){er.textContent='Нужно минимум два варианта';return}
      e.target.disabled=true;
      const r=await sb.from('messages').insert({chat_id:c.id,body:'📊 '+q,poll:{q,opts:o,multi:d.querySelector('#pmu').checked}}).select().single();
      if(r.error){er.textContent='Не получилось: '+r.error.message;e.target.disabled=false;return}
      d.remove();push(r.data);
    }
  });
  d.querySelector('#pq').focus();
}
sec.addEventListener('contextmenu',e=>{const x=e.target.closest('.mg-b[data-mid]');if(x&&!e.target.closest('.mg-f')){e.preventDefault();ma=x.dataset.mid;rMsgs(1)}});

 function delAccModal(){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;inset:0;z-index:70;background:rgba(15,25,35,.45);display:grid;place-items:center;padding:20px';
  d.innerHTML='<div class="mg-pm"><h3 style="color:#e5314a">Удалить аккаунт?</h3><p style="font-size:14px;line-height:1.5;margin-bottom:14px">Это действие <b>невозвратно</b>. Будут удалены твой аккаунт, все твои сообщения и участие во всех чатах. Восстановить их будет нельзя.</p><div class="pe" id="de"></div><div class="pb"><button id="dcn">Отмена</button><button class="ok" id="dok" style="background:#e5314a">Удалить навсегда</button></div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',async e=>{
    const id=e.target.id;
    if(e.target===d||id==='dcn')d.remove();
    else if(id==='dok'){
      e.target.disabled=true;
      const r=await sb.rpc('delete_account');
      if(r.error){d.querySelector('#de').textContent='Не получилось: '+r.error.message;e.target.disabled=false;return}
      d.remove();await sb.auth.signOut({scope:'local'});toast('Аккаунт удалён');
    }
  });
}

 const VAPID='BAOfbFU4uplaxZ4OZTlNsHUVipnCzQm5i-_jOLrl0YWDuhKQXDqDGFxR1FeISQGgOpnwijoJsBrY15GrcIsksJo';
const b64=s=>{const r=atob((s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...r].map(c=>c.charCodeAt(0)))};
let pushOn=0;
async function enablePush(){
  if(pushOn||!me||!('serviceWorker' in navigator)||!('PushManager' in window))return;
  pushOn=1;
  try{
    if(Notification.permission==='default')await Notification.requestPermission();
    if(Notification.permission!=='granted')return;
    const reg=await navigator.serviceWorker.register('sw.js');
    await navigator.serviceWorker.ready;
    let s=await reg.pushManager.getSubscription();
    if(!s)s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(VAPID)});
    const j=s.toJSON();
    await sb.from('push_subs').upsert({user_id:me.id,endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth});
  }catch(err){pushOn=0}
}
 
function push(r){
  const c=C.find(z=>z.id===r.chat_id);
  if(!c){loadAll().then(rList);return}
  if(c.msgs.some(m=>m.id===r.id))return;
  const m=toM(r);c.msgs.push(m);
if(r.user_id!==me.id)notify(c,m);
  if(sel===c.id&&!sec.hidden&&!document.hidden)markRead(c);
  if(sel===c.id)rMsgs();
  rList();
}
function live(){
  if(ch)sb.removeChannel(ch);
  ch=sb.channel('mg')
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},p=>push(p.new))
   .on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages'},p=>{const m=findMsg(p.new.id);if(m){m.pin=!!p.new.pinned;if(sel===m.cid){rMsgs(1);rPins()}}})
   .on('postgres_changes',{event:'DELETE',schema:'public',table:'messages'},p=>dropMsg(p.old.id))
   .on('postgres_changes',{event:'*',schema:'public',table:'poll_votes'},async()=>{await loadVotes();rMsgs(1)})
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_members'},async()=>{await loadAll();rList();rHead();rMem();rMsgs()}).subscribe();
}
async function send(){
  const c=cur();if(!c)return;const x=dr.trim();if(!x&&!pf)return;
  const f=pf;dr='';pf=null;err='';eOpen=0;rFoot();
  let p=null;
  if(f){const ex=(f.n.split('.').pop()||'').toLowerCase().replace(/[^a-z0-9]/g,'')||'bin';
    const u=await sb.storage.from('chat-files').upload(c.id+'/'+Date.now()+'_'+Math.random().toString(36).slice(2,7)+'.'+ex,f.b,{contentType:f.b.type||'application/octet-stream'});
    if(u.error){err='Файл не загрузился: '+u.error.message;rFoot();return}p=u.data.path}
  const r=await sb.from('messages').insert({chat_id:c.id,body:x||null,file_path:p,file_name:f?f.n:null}).select().single();
  if(r.error){err='Не отправилось: '+r.error.message;rFoot();return}
  push(r.data);const i=$('#mgi');if(i)i.focus();
}
async function create(){
  const r=await sb.rpc('create_chat',{p_title:nt.trim()||null});
  if(r.error){toast('Не получилось: '+r.error.message);return}
  nt='';await loadAll();tab='c';q='';$('#mgq').value='';
  open(r.data.id);aOpen=1;rHead();rAdd();
}
async function join(code){
  code=(code||'').trim();const m=code.match(/join=([\w-]+)/);if(m)code=m[1];if(!code)return;
  const r=await sb.rpc('join_chat',{p_code:code});
  if(r.error){toast('Чат не найден. Проверь ссылку');return}
  if(!C.some(z=>z.id===r.data))await sb.from('messages').insert({chat_id:r.data,body:'§sys§'+ME+' присоединился(ась) к чату'});
  await loadAll();tab='c';q='';$('#mgq').value='';open(r.data);
}
async function openFile(p){
  const w=window.open('','_blank'),r=await sb.storage.from('chat-files').createSignedUrl(p,3600);
  if(r.error){if(w)w.close();toast('Не удалось открыть файл');return}
  if(w)w.location=r.data.signedUrl;else location.href=r.data.signedUrl;
}
const shrink=f=>new Promise(res=>{const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>{URL.revokeObjectURL(u);res(b||f)},'image/jpeg',.8)};im.onerror=()=>res(f);im.src=u});
sec.addEventListener('change',async e=>{
  if(e.target.id!=='mgfl')return;
  let f=e.target.files[0];if(!f)return;let n=f.name;
  if(/^image\/(jpe?g|png|webp)/.test(f.type)){const b=await shrink(f);if(b!==f){f=b;n=n.replace(/\.\w+$/,'')+'.jpg'}}
  if(f.size>MAXF){err='Файл больше 5 МБ. Учебники лучше отправлять ссылкой на Облако Mail.ru';pf=null}
  else{err='';pf={n:n,s:fsz(f.size),b:f}}
  rFoot();
});
async function boot(){
  if(!sb)return;
  if(!me){if(ch){sb.removeChannel(ch);ch=null}C.splice(0);sel=null;LIVE=0;badge();authView();return}
  au.hidden=true;au.innerHTML='';$('#mgb').hidden=true;
  await loadAll();LIVE=1;touch();if(me.user_metadata&&me.user_metadata.fio)sb.rpc('set_fio',{p_fio:me.user_metadata.fio});
  if(!C.some(z=>z.id===sel))sel=null;
  $('#mgb').hidden=false;
  const code=sessionStorage.getItem('mj');
  if(code){sessionStorage.removeItem('mj');history.replaceState(null,'',location.pathname);await join(code)}
  else if(!sel&&matchMedia('(min-width:821px)').matches&&C.length)sel=[...C].sort((a,b)=>last(b).t-last(a).t)[0].id;
  renderAll();live();
}
 setInterval(touch,30000);
document.addEventListener('visibilitychange',touch);
setInterval(()=>{if(mOpen&&!document.hidden)refreshSeen().then(rMem)},30000);
 document.addEventListener('visibilitychange',()=>{const c=cur();if(!document.hidden&&c&&!sec.hidden){markRead(c);rList()}});
const lib=document.createElement('script');lib.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
lib.onload=async()=>{
  sb=window.supabase.createClient(SB_URL,SB_KEY);
  const s=await sb.auth.getSession();me=s.data.session?s.data.session.user:null;
  sb.auth.onAuthStateChange((ev,ss)=>{const u=ss?ss.user:null;if((u&&u.id)!==(me&&me.id)){me=u;setTimeout(boot,0)}});
  if(J)MS.show('msg');else boot();
};
lib.onerror=()=>{$('#mgb').hidden=true;au.hidden=false;au.textContent='Не удалось загрузить Supabase. Проверь интернет и обнови страницу.'};
document.head.appendChild(lib);
window.rMsg=()=>{if(sb)boot();else{$('#mgb').hidden=true;au.hidden=false;au.textContent='Загрузка…'}};
})();
