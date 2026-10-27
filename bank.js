/* MilkBank — раздел «MilkBank». Подключается в index.html после library.js */
(function(){
const $=s=>document.querySelector(s);
const KEY='milkbank_v1';

/* ===== ДАННЫЕ (Supabase: profiles.coins, transfers, purchases, функция send_coins) ===== */
let ME=null,BAL=null,USERS=[],OPS=[],FREQ={};
const syncCn=()=>document.querySelectorAll('.cn').forEach(e=>{if(BAL!==null)e.textContent=BAL});
const users=()=>USERS;

/* ===== помощники ===== */
const esc=t=>String(t).replace(/[<>&"]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[m]));
const fmt=n=>Number(n).toLocaleString('ru-RU');
const ic=k=>window.MS?MS.ic(k):'';
const COL=['#17b3e6','#e8793a','#3b8f2f','#9b59d0','#e5517a','#2d6a9f'];
const ava=u=>{let h=0;for(const c of u.n)h=(h*31+c.charCodeAt(0))>>>0;return u.av?`<i style="background:url('${esc(u.av)}') center/cover"></i>`:`<i style="background:${COL[h%COL.length]}">${esc(u.n.trim()[0]||'?')}</i>`};
const sg=o=>(o.t==='in'||o.t==='sale')?1:-1;
const ttl=o=>({in:'Перевод от '+o.who,out:'Перевод для '+o.who,sale:'Продажа'+(o.title?': '+o.title:''),buy:'Покупка'+(o.title?': '+o.title:'')})[o.t]||'Операция';
const oic=o=>o.t==='in'?'<span style="display:block;transform:rotate(180deg)">'+ic('arrow')+'</span>':o.t==='out'?ic('arrow'):ic('shop');
const when=ts=>{const d=new Date(ts);return d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})+', '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const monthOps=()=>OPS.slice().sort((a,b)=>b.ts-a.ts);
const top3=()=>users().filter(u=>FREQ[u.id]>0).sort((a,b)=>FREQ[b.id]-FREQ[a.id]).slice(0,3);

/* ===== стили ===== */
const css=document.createElement('style');
css.textContent=`
#v-bank{padding-bottom:60px}
.bk{max-width:860px}
.bk-hero{position:relative;overflow:hidden;border-radius:25px;padding:26px 28px 24px;color:#fff;margin-top:6px;background:linear-gradient(135deg,#0b63d1 0%,#1798e0 55%,#4fd3f3 100%);box-shadow:0 10px 34px rgba(18,140,220,.28)}
.bk-w{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;stroke:none}
.bk-hero>*:not(.bk-w){position:relative}
.bk-l{font-size:14px;font-weight:500;opacity:.92}
.bk-n{display:flex;align-items:center;font-size:46px;font-weight:800;line-height:1.1;margin:6px 0 20px}
.bk-n .coin{width:38px;height:38px;margin:0 0 0 12px;vertical-align:0}
.bk-r{display:flex;gap:10px;flex-wrap:wrap}
.bk-b{display:flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:22px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.4);color:#fff;font-weight:600;font-size:14px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.bk-b svg{width:17px;height:17px}
.bk-b em{font-style:normal;font-size:10px;background:rgba(255,255,255,.28);border-radius:8px;padding:2px 7px}
.bk-b:disabled{opacity:.8;cursor:default}
.bk-ok{margin-top:14px;font-size:13px;font-weight:600}
.bk .card{margin-top:18px}
.bk-t{display:flex;gap:8px;margin-bottom:12px}
.bk-t button{height:32px;padding:0 16px;border-radius:16px;background:var(--pl);color:var(--bt);font-weight:600;font-size:12.5px}
.bk-t button.on{background:var(--cy);color:#fff}
.bk-q,.bk-in{width:100%;height:44px;border:1px solid #dfe5ea;border-radius:14px;padding:0 14px;font:inherit;outline:0}
.bk-in{margin-top:10px}
.bk-list{max-height:300px;overflow:auto;margin-top:8px}
.bk-p{display:flex;align-items:center;gap:12px;width:100%;padding:9px 6px;border-radius:14px;text-align:left}
.bk-p:active{background:var(--pl)}
.bk-p i{flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-weight:700;font-size:15px}
.bk-p b{display:block;font-size:14px;font-weight:600}
.bk-p small{color:var(--mu);font-size:11px}
.bk-mu{color:#b3b9bf;font-size:12.5px;padding:6px 2px}
.bk-act{display:flex;gap:10px;margin-top:14px}
.bk-act button{flex:1;height:42px;border-radius:21px;font-weight:700;font-size:14px}
.bk-go{background:var(--cy);color:#fff}
.bk-x{background:#eef1f4;color:#6b7580}
.bk-fb{font-size:12.5px;font-weight:600;min-height:18px;margin-top:8px}
.bk-sel{display:flex;align-items:center;justify-content:space-between;gap:10px}
.bk-sel .bk-p{width:auto;flex:1;cursor:default}
.bk-ch{font-size:12px;font-weight:600;color:var(--bt);padding:6px 10px}
.bk-st{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 8px;padding:14px 16px;border-radius:18px;border:1px solid rgba(255,255,255,.28);background:linear-gradient(135deg,#124f94,#1796cf);color:#fff}
.bk-st small{display:block;font-size:11px;opacity:.78;margin-bottom:3px}
.bk-st b{font-size:20px;font-weight:800}
.bk-st .g{color:#5be37d}
.bk-st .r{color:#ff7a88}
.bk-o{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--ln)}
.bk-o:last-child{border-bottom:0}
.bk-s{flex:none;min-width:68px;font-size:15px;font-weight:700}
.bk-s.p{color:var(--ok)}
.bk-s.m{color:#e5314a}
.bk-oi{flex:none;width:36px;height:36px;border-radius:50%;background:var(--sq);color:var(--cy);display:grid;place-items:center}
.bk-oi svg{width:16px;height:16px}
.bk-o strong{display:block;font-size:13.5px;font-weight:600}
.bk-o small{color:var(--mu);font-size:11px}
.bk-hero,.bk .card{position:relative;overflow:hidden;color:#fff;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300' preserveAspectRatio='none'%3E%3Cpath d='M0 190C150 130 300 250 450 190S700 120 800 180V300H0Z' fill='white' fill-opacity='.12'/%3E%3Cpath d='M0 235C160 185 320 285 480 235S720 195 800 245V300H0Z' fill='white' fill-opacity='.1'/%3E%3C/svg%3E") center/100% 100% no-repeat,linear-gradient(135deg,#0b63d1 0%,#1798e0 55%,#4fd3f3 100%);box-shadow:0 10px 34px rgba(18,140,220,.22)}
.bk .card .hd h2{color:#fff}
.bk .card .bk-mu{color:rgba(255,255,255,.65)}
.bk .card .bk-p small,.bk .card .bk-o small{color:rgba(255,255,255,.7)}
.bk .card .bk-p:active{background:rgba(255,255,255,.14)}
.bk .card .bk-t button{background:rgba(255,255,255,.16);color:#fff}
.bk .card .bk-t button.on{background:#fff;color:#1798e0}
.bk .card .bk-q,.bk .card .bk-in{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.4);color:#fff}
.bk .card input::placeholder{color:rgba(255,255,255,.7)}
.bk .card .bk-ch{color:#fff}
.bk .card .bk-go{background:#fff;color:#1176cf}
.bk .card .bk-x{background:rgba(255,255,255,.18);color:#fff}
.bk .bk-st{background:none;border:1px solid rgba(255,255,255,.4)}
.bk .bk-s.p{color:#5be37d}
.bk .bk-s.m{color:#ff7a88}
.bk .bk-o{border-bottom-color:rgba(255,255,255,.2)}
.bk .bk-oi{background:rgba(255,255,255,.18);color:#fff}
@media(max-width:520px){.bk-hero
@media(max-width:520px){.bk-hero{padding:22px 18px}.bk-n{font-size:38px}.bk-st b{font-size:17px}}`;
document.head.appendChild(css);

/* ===== страница ===== */
const sec=document.createElement('section');sec.id='v-bank';sec.hidden=true;$('.main').appendChild(sec);
let open=false,pick=null,tab='all',q='',note='';

function render(){
  const b=BAL,ops=monthOps(),inc=ops.filter(o=>sg(o)>0).reduce((s,o)=>s+o.amt,0),exp=ops.filter(o=>sg(o)<0).reduce((s,o)=>s+o.amt,0);
  const mon=new Date().toLocaleDateString('ru-RU',{month:'long'});
  const fq=top3();
  let panel='';
  if(open&&!pick){
    panel=`<section class="card" id="bk-tr"><div class="hd"><h2>Кому перевести</h2></div><div class="bk-t" id="bk-tabs"></div><input class="bk-q" id="bk-q" placeholder="Поиск по имени или нику" value="${esc(q)}" autocomplete="off"><div class="bk-list" id="bk-list"></div></section>`;
  }else if(open&&pick){
    panel=`<section class="card" id="bk-tr"><div class="hd"><h2>Перевод</h2></div><div class="bk-sel"><div class="bk-p">${ava(pick)}<span><b>${esc(pick.n)}</b><small>@${esc(pick.nick||'')}</small></span></div><button class="bk-ch" data-a="back">Сменить</button></div><input class="bk-in" id="bk-a" inputmode="numeric" placeholder="Сумма (у тебя ${b===null?'…':fmt(b)})" autocomplete="off"><input class="bk-in" id="bk-c" maxlength="100" placeholder="Комментарий (необязательно)" autocomplete="off"><div class="bk-fb" id="bk-fb"></div><div class="bk-act"><button class="bk-go" data-a="send">Перевести</button><button class="bk-x" data-a="cancel">Отмена</button></div></section>`;
  }
  sec.innerHTML=`<div class="bk">
  <div class="bk-hero"><svg class="bk-w" viewBox="0 0 800 300" preserveAspectRatio="none"><path d="M0 190 C150 130 300 250 450 190 S700 120 800 180 V300 H0Z" fill="rgba(255,255,255,.12)"/><path d="M0 235 C160 185 320 285 480 235 S720 195 800 245 V300 H0Z" fill="rgba(255,255,255,.1)"/><circle cx="710" cy="55" r="95" fill="rgba(255,255,255,.08)"/></svg>
   <div class="bk-l">На личном счету:</div><div class="bk-n">${b===null?'…':fmt(b)}<span class="coin"></span></div>
   <div class="bk-r"><button class="bk-b" data-a="tr">${ic('arrow')}Перевести</button><button class="bk-b" disabled>Открыть накопительный счет <em>скоро</em></button></div>
   ${note?`<div class="bk-ok">${esc(note)}</div>`:''}</div>
  ${panel}
  <section class="card"><div class="hd"><h2>Частые операции</h2></div>${fq.length?fq.map(u=>`<button class="bk-p" data-pick="${u.id}">${ava(u)}<span><b>${esc(u.n)}</b><small>переводов: ${FREQ[u.id]}</small></span></button>`).join(''):'<div class="bk-mu">Пока не было операций</div>'}</section>
  <section class="card"><div class="hd"><h2>Операции за ${mon}</h2></div>
   <div class="bk-st"><div><small>Доходы</small><b class="g">+${fmt(inc)}</b></div><div><small>Расходы</small><b class="r">−${fmt(exp)}</b></div><div><small>Всего операций</small><b>${ops.length}</b></div></div>
   ${ops.length?ops.map(o=>{const p=sg(o)>0;return `<div class="bk-o"><b class="bk-s ${p?'p':'m'}">${p?'+':'−'}${fmt(o.amt)}</b><span class="bk-oi">${oic(o)}</span><div><strong>${esc(ttl(o))}</strong><small>${when(o.ts)}${o.cm?' · '+esc(o.cm):''}</small></div></div>`}).join(''):'<div class="bk-mu">В этом месяце операций нет</div>'}
  </section></div>`;
  if(open&&!pick)lst();
}

function lst(){
  const all=users(),ql=q.trim().toLowerCase(),t=ql?'all':tab;
  const base=t==='freq'?top3():all;
  const L=base.filter(u=>!ql||u.n.toLowerCase().includes(ql)||(u.nick||'').toLowerCase().includes(ql));
  $('#bk-tabs').innerHTML=`<button class="${t==='freq'?'on':''}" data-tab="freq">Частые</button><button class="${t==='all'?'on':''}" data-tab="all">Все</button>`;
  $('#bk-list').innerHTML=L.length?L.map(u=>`<button class="bk-p" data-pick="${u.id}">${ava(u)}<span><b>${esc(u.n)}</b><small>@${esc(u.nick||'')}</small></span></button>`).join(''):`<div class="bk-mu">${t==='freq'?'Пока не было операций':'Никого не найдено'}</div>`;
}

async function send(){
  const a=parseInt($('#bk-a').value,10),c=$('#bk-c').value.trim(),f=$('#bk-fb'),btn=$('[data-a="send"]');
  const bad=m=>{f.textContent=m;f.style.color='#ffd27a'};
  if(!(a>0))return bad('Введи сумму больше нуля');
  if(BAL!==null&&a>BAL)return bad('Не хватает монет: на счету '+fmt(BAL));
  btn.disabled=true;f.style.color='#fff';f.textContent='Отправляю…';
  let r;try{r=await window.SB.rpc('send_coins',{to_user:pick.id,amt:a,cmt:c})}catch(e){r={error:{message:''}}}
  if(r.error){btn.disabled=false;const m=r.error.message||'';return bad(m.includes('no_money')?'Не хватает монет':m.includes('self')?'Нельзя переводить самому себе':m.includes('bad_amount')?'Некорректная сумма':'Не получилось перевести. Попробуй ещё раз')}
  note='Переведено '+fmt(a)+' → '+pick.n;open=false;pick=null;q='';
  await load();
}
async function load(){
  const sb=window.SB;if(!sb)return;
  try{
    const u=(await sb.auth.getUser()).data.user;if(!u)return;ME=u.id;
    const d=new Date(),ms=new Date(d.getFullYear(),d.getMonth(),1),msN=ms.getTime(),msI=ms.toISOString();
    const [pr,co,tr,pu]=await Promise.all([
      sb.from('profiles').select('id,name,nick,avatar_url'),
      sb.from('profiles').select('coins').eq('id',ME).maybeSingle(),
      sb.from('transfers').select('*').order('created_at',{ascending:false}).limit(300),
      sb.from('purchases').select('*').or('buyer.eq.'+ME+',seller.eq.'+ME).gte('created_at',msI).order('created_at',{ascending:false}).limit(200)]);
    const nm={};USERS=[];
    (pr.data||[]).forEach(p=>{nm[p.id]=p.name||p.nick||'Пользователь';if(p.id!==ME&&p.name)USERS.push({id:p.id,n:p.name,nick:p.nick||'',av:p.avatar_url||''})});
    BAL=co.data&&co.data.coins!=null?co.data.coins:0;syncCn();
    FREQ={};OPS=[];
    (tr.data||[]).forEach(t=>{const out=t.from_id===ME,ts=Date.parse(t.created_at);if(out)FREQ[t.to_id]=(FREQ[t.to_id]||0)+1;
      if(ts>=msN)OPS.push({t:out?'out':'in',amt:t.amount,who:nm[out?t.to_id:t.from_id]||'Пользователь',cm:t.comment||'',ts})});
    (pu.data||[]).forEach(p=>{const ts=Date.parse(p.created_at);
      if(p.buyer===ME)OPS.push({t:'buy',amt:p.price,title:p.title||'',ts});
      else if(p.seller===ME)OPS.push({t:'sale',amt:p.seller_gain!=null?p.seller_gain:p.price,title:p.title||'',ts})});
  }catch(e){}
  render();
}

sec.addEventListener('click',e=>{
  const b=e.target.closest('[data-a],[data-pick],[data-tab]');if(!b)return;
  if(b.dataset.tab){tab=b.dataset.tab;q='';const i=$('#bk-q');if(i)i.value='';lst();return}
  if(b.dataset.pick){pick=users().find(u=>u.id===b.dataset.pick)||null;if(!pick)return;open=true;q='';note='';render();const p=$('#bk-tr');if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'start'});return}
  const a=b.dataset.a;
  if(a==='tr'){open=!open;pick=null;q='';note='';tab=top3().length?'freq':'all';render()}
  else if(a==='back'){pick=null;q='';render()}
  else if(a==='cancel'){open=false;pick=null;q='';render()}
  else if(a==='send')send();
});
sec.addEventListener('input',e=>{if(e.target.id==='bk-q'){q=e.target.value;lst()}});

(window.RV=window.RV||{}).bank=()=>{render();load()};
})();
