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
 '<section class="mg-r"><header class="mg-hd" id="mgh"></header><div id="mgsr"></div><div id="mgap"></div>'+
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
    fsb+'<button class="mg-ib x" id="mgx" title="Закрыть чат">'+ic('close')+'</button>';
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
function rMsgs(){
  const c=cur(),b=$('#mgm');
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
      '<div class="mg-b'+(hit[mi]===i?' cur':'')+'">'+
      (!me&&c.m.length>2?'<em style="color:'+col(m.w)+'">'+esc(m.w)+'</em>':'')+
      (m.x?'<p>'+hl(m.x,hq)+'</p>':'')+
      (m.f?'<div class="mg-f"'+(m.f.p?' data-fp="'+esc(m.f.p)+'" style="cursor:pointer"':'')+'>'+ic('clip')+'<span>'+esc(m.f.n)+'</span><small>'+m.f.s+'</small></div>':'')+
      '<small>'+dm(m.t)+' в '+hm(m.t)+'</small></div>'+
      (me?'<span class="mg-a s"><img src="ava.jpg" alt=""></span>':'')+'</div>';
  });
  b.innerHTML=h;
  const cn=$('#mgcn');if(cn)cn.textContent=hit.length?(mi+1)+'/'+hit.length:'0';
  const cu=$('.mg-b.cur',b);
  if(cu)b.scrollTop=cu.offsetTop-b.clientHeight/2+cu.offsetHeight/2;else b.scrollTop=b.scrollHeight;
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
    '<input id="mgi" autocomplete="off" placeholder="'+(c.sys?'Только чтение':'Напишите сообщение…')+'" value="'+esc(dr)+'"'+dis+'>'+
    '<label class="mg-ib mg-fl'+(c.sys?' off':'')+'" title="Прикрепить файл (до 5 МБ)">'+ic('clip')+'<input type="file" id="mgfl" hidden'+dis+'></label>'+
    '<button class="mg-snd" id="mgsd"'+dis+'>'+ic('send')+'</button></div>';
}
function renderAll(){
  const c=cur();if(c)c.un=0;
  $('#mgb').classList.toggle('has',!!c);
  rTabs();rList();rHead();rBar();rAdd();rMsgs();rFoot();
}

/* ---------- действия ---------- */
function open(id){
  sel=id;aOpen=0;eOpen=0;pf=null;err='';dr='';mi=-1;
  sOpen=q?1:0;cq=q;
  renderAll();
  if(sOpen){const i=$('#mgcq');if(i)i.blur()}
}
function closeChat(){sel=null;sOpen=0;cq='';aOpen=0;renderAll()}
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
  else if(b('#mgsd'))send();
  else if(b('#mgpx')){pf=null;rFoot()}
});
sec.addEventListener('input',e=>{
  const id=e.target.id;
  if(id==='mgq'){q=e.target.value;if(tab!=='c'){tab='c';rTabs()}rList()}
  else if(id==='mgi')dr=e.target.value;
  else if(id==='mgcq'){cq=e.target.value;mi=-1;rMsgs()}
  else if(id==='mgnt')nt=e.target.value;
});
sec.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(e.target.id==='mgi'){e.preventDefault();send()}
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
const au=document.createElement('div');au.id='mgau';au.hidden=true;sec.appendChild(au);
const tr=m=>/Invalid login/i.test(m)?'Неверная почта или пароль':/already/i.test(m)?'Такая почта уже зарегистрирована':/rate limit/i.test(m)?'Слишком много попыток, подожди минуту':m;
function toast(t){let d=$('#mgtoast');if(!d){d=document.createElement('div');d.id='mgtoast';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:60;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}
const setName=(id,n)=>{n=n||'Участник';let k=n,i=2;while(Object.entries(nmap).some(([u,v])=>v===k&&u!==id))k=n+' '+i++;nmap[id]=k};
const toM=r=>{const s=(r.body||'').startsWith('§sys§');return{id:r.id,w:s?'sys':(nmap[r.user_id]||'Участник'),x:s?r.body.slice(5):(r.body||''),f:r.file_path?{n:r.file_name||'файл',s:'',p:r.file_path}:null,t:Date.parse(r.created_at)}};
async function loadAll(){
  const since=new Date(Date.now()-30*864e5).toISOString();
  const [a,b,d]=await Promise.all([
    sb.from('chats').select('id,title,invite_code,created_at'),
    sb.from('chat_members').select('chat_id,user_id'),
    sb.from('messages').select('id,chat_id,user_id,body,file_path,file_name,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(1000)]);
  if(a.error||b.error||d.error){toast('Ошибка загрузки: '+(a.error||b.error||d.error).message);return}
  const ms=d.data.reverse(),ids=new Set([me.id]);
  b.data.forEach(x=>ids.add(x.user_id));ms.forEach(x=>ids.add(x.user_id));
  const need=[...ids].filter(u=>!nmap[u]);
  if(need.length)((await sb.from('profiles').select('id,name').in('id',need)).data||[]).forEach(r=>setName(r.id,r.name));
  ME=nmap[me.id]||'Я';
  const un=Object.fromEntries(C.map(c=>[c.id,c.un||0]));
  C.splice(0,C.length,...a.data.map(c=>{
    const u=b.data.filter(x=>x.chat_id===c.id).map(x=>x.user_id),m=ms.filter(x=>x.chat_id===c.id).map(toM);
    if(!m.length)m.push({w:'sys',x:'Чат создан',t:Date.parse(c.created_at)});
    return{id:c.id,code:c.invite_code,title:c.title||'',un:un[c.id]||0,m:u.map(x=>nmap[x]||'Участник'),msgs:m}}));
}
const link=c=>location.origin+location.pathname+'?join='+c.code;
function copy(t){const ok=()=>toast('Ссылка скопирована. Отправь её тому, кого хочешь пригласить');if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,()=>prompt('Скопируй ссылку',t));else prompt('Скопируй ссылку',t)}
function newTab(){return'<div class="mg-nf"><p>Создай чат и отправь ссылку-приглашение. Пока в чате двое, он выглядит как личный, с трёх участников становится групповым.</p><input id="mgnt" placeholder="Название чата (необязательно)" value="'+esc(nt)+'" autocomplete="off"><button class="mg-go" id="mgcr">Создать чат</button><p style="margin-top:22px">Есть ссылка или код приглашения?</p><input id="mgjc" placeholder="Вставь ссылку или код" autocomplete="off"><button class="mg-go" id="mgjn" style="background:#eaf8fd;color:var(--bt)">Войти в чат</button><button class="mg-go" id="mgout" style="background:none;color:var(--mu);font-weight:600">Выйти из аккаунта ('+esc(ME)+')</button></div>'}
function rInv(){
  const c=cur(),a=$('#mgap');
  if(!c||!aOpen){a.innerHTML='';return}
  a.innerHTML='<div class="mg-ap"><small>Отправь ссылку тому, кого хочешь добавить. Он зарегистрируется или войдёт и сразу увидит переписку за последние 30 дней.'+(c.m.length===2?' С третьим участником чат станет групповым.':'')+'</small><div class="mg-ch"><button data-inv="1">Скопировать ссылку</button></div></div>';
}
function authView(msg){
  $('#mgb').hidden=true;au.hidden=false;
  au.innerHTML='<div class="mg-ac"><h2>'+(am==='in'?'Вход':'Регистрация')+'</h2>'+(sessionStorage.getItem('mj')?'<p class="mg-ai">Тебя пригласили в чат. Войди или зарегистрируйся, и мы сразу тебя добавим.</p>':'')+
  '<div class="mg-warn">НЕ ВВОДИТЬ ПАРОЛЬ ОТ НАСТОЯЩЕГО АККАУНТА MILKY SCHOOL</div><p class="mg-ai">Почта и пароль нужны только для идентификации и сохранения истории переписки.</p>'+
  (am==='up'?'<input id="mgan" placeholder="Имя в чате" autocomplete="off">':'')+
  '<input id="mgae" type="email" placeholder="Почта" autocomplete="off"><input id="mgpw" type="password" placeholder="Пароль (от 6 символов)" autocomplete="off">'+
  '<div class="mg-er" id="mgaer">'+(msg||'')+'</div><button class="mg-go" id="mgag">'+(am==='in'?'Войти':'Зарегистрироваться')+'</button><button class="mg-go" id="mgsw" style="background:none;color:var(--bt);margin-top:4px">'+(am==='in'?'Нет аккаунта? Регистрация':'Уже есть аккаунт? Войти')+'</button></div>';
}
au.addEventListener('click',async e=>{
  if(e.target.closest('#mgsw')){am=am==='in'?'up':'in';authView();return}
  if(!e.target.closest('#mgag'))return;
  const em=$('#mgae').value.trim(),pw=$('#mgpw').value,nn=am==='up'?$('#mgan').value.trim():'',bad=t=>{$('#mgaer').textContent=t};
  if(!em||pw.length<6)return bad('Введи почту и пароль (от 6 символов)');
  const r=am==='in'?await sb.auth.signInWithPassword({email:em,password:pw}):await sb.auth.signUp({email:em,password:pw,options:{data:{name:nn}}});
  if(r.error)return bad(tr(r.error.message));
  if(!r.data.session)bad('Подтверди почту по письму или выключи «Confirm email» в Supabase');
});
au.addEventListener('keydown',e=>{if(e.key==='Enter'){const b=$('#mgag');if(b)b.click()}});
function push(r){
  const c=C.find(z=>z.id===r.chat_id);
  if(!c){loadAll().then(rList);return}
  if(c.msgs.some(m=>m.id===r.id))return;
  c.msgs.push(toM(r));
  if(r.user_id!==me.id&&sel!==c.id)c.un++;
  if(sel===c.id)rMsgs();
  rList();
}
function live(){
  if(ch)sb.removeChannel(ch);
  ch=sb.channel('mg').on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},p=>push(p.new))
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_members'},async()=>{await loadAll();rList();rHead();rMsgs()}).subscribe();
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
  if(!me){if(ch){sb.removeChannel(ch);ch=null}C.splice(0);sel=null;authView();return}
  au.hidden=true;$('#mgb').hidden=true;
  await loadAll();
  if(!C.some(z=>z.id===sel))sel=null;
  $('#mgb').hidden=false;
  const code=sessionStorage.getItem('mj');
  if(code){sessionStorage.removeItem('mj');history.replaceState(null,'',location.pathname);await join(code)}
  else if(!sel&&matchMedia('(min-width:821px)').matches&&C.length)sel=[...C].sort((a,b)=>last(b).t-last(a).t)[0].id;
  renderAll();live();
}
const lib=document.createElement('script');lib.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
lib.onload=async()=>{
  sb=window.supabase.createClient(SB_URL,SB_KEY);
  const s=await sb.auth.getSession();me=s.data.session?s.data.session.user:null;
  sb.auth.onAuthStateChange((ev,ss)=>{const u=ss?ss.user:null;if((u&&u.id)!==(me&&me.id)){me=u;if(!sec.hidden)setTimeout(boot,0)}});
  if(J)MS.show('msg');else if(!sec.hidden)boot();
};
lib.onerror=()=>{$('#mgb').hidden=true;au.hidden=false;au.textContent='Не удалось загрузить Supabase. Проверь интернет и обнови страницу.'};
document.head.appendChild(lib);
window.rMsg=()=>{if(sb)boot();else{$('#mgb').hidden=true;au.hidden=false;au.textContent='Загрузка…'}};
})();
