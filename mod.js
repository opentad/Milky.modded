/* Милки-соцсеть: комната модераторов и жалобы */
(function(){
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const col=n=>PAL[hs(n||'?')%PAL.length];
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t);return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()+' '+p2(d.getHours())+':'+p2(d.getMinutes())};
const tm=t=>{const d=new Date(t);return p2(d.getHours())+':'+p2(d.getMinutes())};
const nz=s=>String(s||'').trim().toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ');
const IC={
 ok:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM8 12.3l2.8 2.8 5.2-5.6',
 ban:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM6 6l12 12',
 dots:'M12 5.5h.01M12 12h.01M12 18.5h.01',
 trash:'M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.5h9.2L17.5 7',
 search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
 flag:'M6 21V4M6 4h11l-2 4 2 4H6',
 key:'M15 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM11.5 13.5L4 21M7 18l2.5 2.5'};
const ic=(k,w)=>`<svg viewBox="0 0 24 24" style="width:${w||18}px;height:${w||18}px;flex:none"><path d="${IC[k]}"${k==='dots'?' style="stroke-width:3.2"':''}/></svg>`;
const SB_=()=>window.SB||null;
function note(t){let d=document.getElementById('md-note');if(!d){d=document.createElement('div');d.id='md-note';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:200;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}
function modal(h){const d=document.createElement('div');d.className='md-bg';d.innerHTML='<div class="md-box">'+h+'</div>';d.addEventListener('click',e=>{if(e.target===d)d.remove()});document.body.appendChild(d);return d}

const css=document.createElement('style');
css.textContent=`
#v-mod{padding-bottom:70px}
.md-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-top:6px}
.md-h h1{font-size:30px;font-weight:800;color:var(--tx)}
.md-h p{color:var(--mu);margin:4px 0 16px}
.md-back{color:var(--bt);font-weight:700;margin-bottom:6px}
.md-rel{position:relative;flex:none}
.md-ib{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;color:#8a929b;background:#fff}
.md-pop{position:absolute;right:0;top:46px;z-index:20;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.18);padding:6px;min-width:210px}
.md-pop button{display:flex;gap:10px;align-items:center;width:100%;height:42px;padding:0 14px;border-radius:12px;font-weight:600;font-size:13.5px;color:#34404e;text-align:left}
.md-pop button:hover{background:var(--pl)}
.md-pop .rd{color:#e5314a}
.md-tabs{display:flex;gap:6px;background:#eef3f8;border-radius:16px;padding:5px;margin-bottom:12px}
.md-tabs button{flex:1;height:40px;border-radius:12px;font-weight:600;font-size:13px;color:#8a929b}
.md-tabs button.on{background:#fff;color:var(--bt);box-shadow:0 2px 10px rgba(0,0,0,.05)}
.md-s{display:flex;gap:10px;align-items:center;height:46px;padding:0 16px;border:1px solid #e3e8ee;border-radius:16px;background:#fff;color:#9aa5b0;margin-bottom:14px}
.md-s input{flex:1;min-width:0;border:0;outline:0;background:none;font:inherit;color:var(--tx)}
.md-row{display:flex;gap:12px;align-items:center;background:#fff;border-radius:18px;padding:10px 14px;margin-bottom:8px;box-shadow:0 4px 18px rgba(0,0,0,.04)}
.md-a{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:15px;background-size:cover;background-position:center}
.md-i{flex:1;min-width:0}
.md-i b{display:block;font-size:14.5px}
.md-i small{color:var(--mu);font-size:12px}
.md-i em{color:#e5314a;font-style:normal;font-weight:600}
.md-e{text-align:center;color:var(--mu);padding:30px 0}
.md-card{background:#fff;border-radius:20px;padding:16px;margin-bottom:12px;box-shadow:0 4px 18px rgba(0,0,0,.04)}
.md-ct{display:flex;justify-content:space-between}
.md-sn{background:#f4f6f8;border-radius:12px;padding:10px 12px;margin:8px 0;overflow-wrap:anywhere;white-space:pre-wrap}
.md-bt{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:10px}
.md-bt button{height:40px;padding:0 18px;border-radius:14px;font-weight:700;background:#eef3f8}
.md-bt .ok{background:var(--cy);color:#fff}
.md-bt .rd,.md-bt .rd2{background:#e5314a;color:#fff}
.md-code{font-size:28px;font-weight:800;letter-spacing:5px;color:var(--bt);margin:6px 0}
.md-w{color:#d97706;font-weight:600;font-size:12.5px;margin-top:8px}
.md-bg{position:fixed;inset:0;z-index:150;background:rgba(15,25,35,.45);display:grid;place-items:center;padding:20px}
.md-box{background:#fff;border-radius:22px;padding:22px;width:min(420px,100%);max-height:90vh;overflow:auto}
.md-box h3{font-size:18px;font-weight:800;margin-bottom:8px}
.md-p{color:#566170;line-height:1.5;margin-bottom:10px}
.md-box textarea,.md-box select{width:100%;border:1px solid #e3e8ee;border-radius:14px;padding:12px;font:inherit;outline:0;margin-bottom:8px}
.md-box textarea{height:84px;resize:none}
.md-er{color:#d97706;font-weight:600;font-size:12.5px;min-height:16px}
.md-red{width:100%;height:42px;border-radius:14px;background:#e5314a;color:#fff;font-weight:700}`;
document.head.appendChild(css);

let isMod=false,P=[],PM={},B={},R=[],W=[],tab='f',q='',view='list',menu=null;
const sec=document.createElement('section');sec.id='v-mod';sec.hidden=true;
document.querySelector('.main').appendChild(sec);

/* пункт в боковом меню: только для модераторов */
function syncMenu(){
  const d=document.getElementById('drawer');if(!d)return;
  let b=d.querySelector('[data-modroom]');
  if(!isMod){if(b)b.remove();return}
  if(b)return;
  const pr=[...d.querySelectorAll('.mi')].find(x=>x.textContent.trim()==='Профиль');if(!pr)return;
  b=document.createElement('button');b.className='mi';b.dataset.modroom='1';
  b.innerHTML=ic('ok',17)+'Комната модераторов';
  b.addEventListener('click',e=>{e.stopPropagation();document.body.classList.remove('menu');MS.show('mod')});
  pr.before(b);
}
async function init(){
  const sb=SB_();if(!sb)return;
  const u=(await sb.auth.getUser()).data.user;
  if(!u){isMod=false;window.IS_MOD=false;syncMenu();return}
  const r=await sb.from('moderators').select('user_id').eq('user_id',u.id).maybeSingle();
  isMod=!!r.data;window.IS_MOD=isMod;syncMenu();
}
document.addEventListener('sb',()=>{init();const sb=SB_();if(sb)sb.auth.onAuthStateChange(()=>setTimeout(init,0))});
if(SB_())init();

async function load(){
  const sb=SB_();
  if(!sb||!isMod){sec.innerHTML='<div class="md-e">Нет доступа</div>';return}
  sec.innerHTML='<div class="md-e">Загружаем…</div>';
  const [p,b,r,w]=await Promise.all([
    sb.from('profiles').select('id,name,fio,gender,avatar_url,last_seen').order('fio',{nullsFirst:false}),
    sb.from('bans').select('user_id,reason,until_at'),
    sb.from('reports').select('id,kind,target,target_user,reporter,note,snap,created_at').eq('status','open').order('id',{ascending:false}),
    sb.rpc('mod_pw_list')]);
  if(p.error){sec.innerHTML='<div class="md-e">Ошибка: '+esc(p.error.message)+'. Проверь, что SQL выполнен.</div>';return}
  P=p.data||[];PM=Object.fromEntries(P.map(x=>[x.id,x]));
  const now=Date.now();
  B=Object.fromEntries((b.data||[]).filter(x=>!x.until_at||Date.parse(x.until_at)>now).map(x=>[x.user_id,x]));
  R=r.data||[];
  W=w.error?[]:(w.data||[]);if(w.error)note('Заявки: '+w.error.message);
  draw();
}
function draw(){
  const sub=view!=='list';
  const T=view==='rep'?['Жалобы','Открытые жалобы пользователей']:view==='pw'?['Заявки на вход','Забыли пароль: свяжись с учеником и уточни, подавал ли он заявку в это время']:['Комната модераторов','Ученики по полу, жалобы и блокировки'];
  const wn=W.filter(x=>x.status==='pending').length;
  sec.innerHTML=`<div class="md-h"><div>${sub?'<button class="md-back" data-back>‹ Назад</button>':''}<h1>${T[0]}</h1><p>${T[1]}</p></div>${sub?'':`<div class="md-rel"><button class="md-ib" data-hm aria-label="Ещё">${ic('dots')}</button>${menu==='h'?`<div class="md-pop"><button data-reps>${ic('flag')}Жалобы${R.length?' ('+R.length+')':''}</button><button data-pws>${ic('key')}Заявки на вход${wn?' ('+wn+')':''}</button></div>`:''}</div>`}</div>`+
  (sub?'<div id="md-l"></div>':'<div class="md-tabs" id="md-tb"></div><label class="md-s">'+ic('search')+'<input id="md-q" placeholder="Поиск по ФИО или имени" autocomplete="off" value="'+esc(q)+'"></label><div id="md-l"></div>');
  if(view==='rep')reps();else if(view==='pw')pws();else{tabs();list()}
}
function tabs(){
  const n=k=>P.filter(x=>k==='n'?!x.gender:x.gender===k).length;
  document.getElementById('md-tb').innerHTML=[['f','Девушки'],['m','Парни'],['n','Без пола']].map(([k,l])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${l} · ${n(k)}</button>`).join('');
}
function list(){
  const ql=q.trim().toLowerCase();
  const L=P.filter(x=>(tab==='n'?!x.gender:x.gender===tab)&&(!ql||((x.fio||'')+' '+(x.name||'')).toLowerCase().includes(ql)));
  document.getElementById('md-l').innerHTML=L.map(x=>{
    const b=B[x.id],nm=x.fio||x.name||'Без имени';
    return `<div class="md-row"><span class="md-a" style="background-color:${col(x.name)};${x.avatar_url?`background-image:url('${esc(x.avatar_url)}')`:''}">${x.avatar_url?'':esc(ini(x.name))}</span><div class="md-i"><b>${esc(nm)}</b><small>${esc(x.name||'')}${b?` · <em>Бан ${b.until_at?'до '+dt(b.until_at):'навсегда'}: ${esc(b.reason||'')}</em>`:''}</small></div><div class="md-rel"><button class="md-ib" data-rm="${x.id}" aria-label="Ещё">${ic('dots')}</button>${menu===x.id?`<div class="md-pop"><button data-op="${x.id}">Открыть профиль</button>${b?`<button data-unban="${x.id}">${ic('ban')}Снять бан</button>`:`<button data-ban="${x.id}">${ic('ban')}Бан</button>`}<button class="rd" data-del="${x.id}">${ic('trash')}Удалить аккаунт</button></div>`:''}</div></div>`}).join('')||'<div class="md-e">Никого не найдено</div>';
}
function reps(){
  const K={post:'Пост',comment:'Комментарий',profile:'Профиль'};
  const nm=id=>{const x=PM[id];return x?(x.fio||x.name):'Пользователь'};
  document.getElementById('md-l').innerHTML=R.map(r=>`<div class="md-card"><div class="md-ct"><b>${K[r.kind]||r.kind}</b><small>${dt(r.created_at)}</small></div><small>От: ${esc(nm(r.reporter))} · На: ${esc(nm(r.target_user))}</small>${r.snap?`<p class="md-sn">${esc(r.snap)}</p>`:''}${r.note?`<p><b>Жалоба:</b> ${esc(r.note)}</p>`:''}<div class="md-bt">${r.kind!=='profile'?`<button class="rd" data-rdel="${r.id}">Удалить ${r.kind==='post'?'пост':'комментарий'}</button>`:''}<button data-rban="${r.id}">Бан автора</button><button data-rok="${r.id}">Отклонить</button></div></div>`).join('')||'<div class="md-e">Жалоб нет</div>';
}
function pws(){
  const now=Date.now();
  document.getElementById('md-l').innerHTML=W.map(w=>{
    const head=`<div class="md-ct"><b>${esc(w.fio)}</b><small>${dt(w.created_at)}</small></div>`;
    if(w.status==='approved'){
      const u=PM[w.user_id],live=Date.parse(w.expires_at)>now;
      return `<div class="md-card">${head}${live?`<small>Профиль: ${esc(u?(u.fio||u.name||''):'')}${u&&u.name?' ('+esc(u.name)+')':''}</small><div class="md-code">${esc(w.code)}</div><small>Назови код ученику лично. Действует до ${tm(w.expires_at)}</small>`:'<p class="md-w">Код истёк. Если ученику всё ещё нужно, он может подать заявку заново.</p>'}<div class="md-bt"><button data-pwno="${w.id}">${live?'Отозвать':'Убрать'}</button></div></div>`;
    }
    const M=P.filter(x=>nz(x.fio)===nz(w.fio));
    return `<div class="md-card">${head}${M.length?`<small>Подходящих профилей: ${M.length}</small>`:'<p class="md-w">Профиль с таким ФИО не найден</p>'}<div class="md-bt">${M.map(x=>`<button class="ok" data-pwok="${w.id}|${x.id}">Одобрить${M.length>1?': '+esc(x.name||'?'):''}</button>`).join('')}<button class="rd" data-pwno="${w.id}">Отклонить</button></div></div>`;
  }).join('')||'<div class="md-e">Заявок нет</div>';
}

sec.addEventListener('click',async e=>{
  const t=e.target,b=k=>t.closest(k);let x;
  if(menu&&!b('.md-pop')&&!b('[data-rm],[data-hm]')){menu=null;draw()}
  if((x=b('[data-tab]'))){tab=x.dataset.tab;tabs();list()}
  else if(b('[data-hm]')){menu=menu==='h'?null:'h';draw()}
  else if(b('[data-reps]')){view='rep';menu=null;draw()}
  else if(b('[data-pws]')){view='pw';menu=null;draw()}
  else if(b('[data-back]')){view='list';draw()}
  else if((x=b('[data-rm]'))){menu=menu===x.dataset.rm?null:x.dataset.rm;list()}
  else if((x=b('[data-op]'))){menu=null;list();MS.show('prof');if(window.PF)PF.open(x.dataset.op)}
  else if((x=b('[data-ban]'))){menu=null;list();banModal(x.dataset.ban)}
  else if((x=b('[data-unban]'))){menu=null;list();unban(x.dataset.unban)}
  else if((x=b('[data-del]'))){menu=null;list();delModal(x.dataset.del)}
  else if((x=b('[data-rdel]'))){const r=R.find(z=>z.id==x.dataset.rdel);if(r)repDel(r)}
  else if((x=b('[data-rban]'))){const r=R.find(z=>z.id==x.dataset.rban);if(r)banModal(r.target_user,r.id)}
  else if((x=b('[data-rok]'))){
    const r=await SB_().rpc('mod_resolve',{p_id:+x.dataset.rok,p_text:'Отклонено'});
    if(r.error)return note(r.error.message);
    R=R.filter(z=>z.id!=x.dataset.rok);reps();
  }
  else if((x=b('[data-pwok]'))){
    const a=x.dataset.pwok.split('|');x.disabled=true;
    const r=await SB_().rpc('mod_pw_approve',{p_id:+a[0],p_user:a[1]});
    if(r.error){x.disabled=false;return note(r.error.message)}
    note('Код выдан');load();
  }
  else if((x=b('[data-pwno]'))){
    x.disabled=true;
    const r=await SB_().rpc('mod_pw_reject',{p_id:+x.dataset.pwno});
    if(r.error){x.disabled=false;return note(r.error.message)}
    load();
  }
});
sec.addEventListener('input',e=>{if(e.target.id==='md-q'){q=e.target.value;list()}});

function banModal(uid,rid){
  const x=PM[uid]||{};
  const d=modal(`<h3>Бан: ${esc(x.fio||x.name||'пользователь')}</h3><p class="md-p">Забаненный не сможет писать посты, комментарии, сообщения и пользоваться маркетом.</p><textarea id="md-b" maxlength="300" placeholder="За что бан? (обязательно)"></textarea><select id="md-d"><option value="1">1 день</option><option value="3">3 дня</option><option value="7" selected>7 дней</option><option value="30">30 дней</option><option value="">Навсегда</option></select><div class="md-er" id="md-er"></div><div class="md-bt"><button data-c>Отмена</button><button class="rd2" data-ok>Забанить</button></div>`);
  d.addEventListener('click',async e=>{
    const bt=e.target.closest('button');if(!bt)return;
    if(bt.hasAttribute('data-c'))d.remove();
    else if(bt.hasAttribute('data-ok')){
      const reason=d.querySelector('#md-b').value.trim(),dv=d.querySelector('#md-d').value;
      if(reason.length<3){d.querySelector('#md-er').textContent='Напиши причину';return}
      bt.disabled=true;
      const r=await SB_().rpc('mod_ban',{p_user:uid,p_reason:reason,p_days:dv?+dv:null});
      if(r.error){d.querySelector('#md-er').textContent=r.error.message;bt.disabled=false;return}
      if(rid)await SB_().rpc('mod_resolve',{p_id:rid,p_text:'Бан: '+reason});
      d.remove();note('Бан выдан');load();
    }
  });
}
async function unban(uid){
  if(!confirm('Снять бан?'))return;
  const r=await SB_().rpc('mod_unban',{p_user:uid});
  if(r.error)return note(r.error.message);
  note('Бан снят');load();
}
function delModal(uid){
  const x=PM[uid]||{};
  const d=modal(`<h3 style="color:#e5314a">Удалить аккаунт?</h3><p class="md-p"><b>${esc(x.fio||x.name||'')}</b><br>Будут удалены аккаунт, посты и сообщения. Это нельзя отменить.</p><div class="md-er" id="md-er"></div><div class="md-bt"><button data-c>Отмена</button><button class="rd2" data-ok>Удалить навсегда</button></div>`);
  d.addEventListener('click',async e=>{
    const bt=e.target.closest('button');if(!bt)return;
    if(bt.hasAttribute('data-c'))d.remove();
    else if(bt.hasAttribute('data-ok')){
      bt.disabled=true;
      const r=await SB_().rpc('mod_del_user',{p_user:uid});
      if(r.error){d.querySelector('#md-er').textContent=r.error.message;bt.disabled=false;return}
      d.remove();note('Аккаунт удалён');load();
    }
  });
}
function repDel(r){
  const post=r.kind==='post';
  const d=modal(`<h3>Удалить ${post?'пост':'комментарий'}</h3><textarea id="md-r" maxlength="300" placeholder="Причина удаления (обязательно)"></textarea><div class="md-er" id="md-er"></div><div class="md-bt"><button data-c>Отмена</button><button class="rd2" data-ok>Удалить</button></div>`);
  d.addEventListener('click',async e=>{
    const bt=e.target.closest('button');if(!bt)return;
    if(bt.hasAttribute('data-c'))d.remove();
    else if(bt.hasAttribute('data-ok')){
      const n=d.querySelector('#md-r').value.trim();
      if(n.length<3){d.querySelector('#md-er').textContent='Напиши причину';return}
      bt.disabled=true;
      const x=await SB_().rpc(post?'mod_del_post':'mod_del_comment',{p_id:+r.target,p_reason:n});
      if(x.error){d.querySelector('#md-er').textContent=x.error.message;bt.disabled=false;return}
      R=R.filter(z=>!(z.kind===r.kind&&z.target===r.target));
      d.remove();note('Удалено');reps();
    }
  });
}

/* общая кнопка «Пожаловаться» (и «Удалить» для модераторов) для постов, комментариев и профилей */
window.MOD={menu(kind,id,uid,done){
  const T={post:'пост',comment:'комментарий',profile:'профиль'}[kind];
  const d=modal(`<h3>Пожаловаться на ${T}</h3><p class="md-p">Опиши, что не так. Жалоба уйдёт модераторам.</p><textarea id="md-n" maxlength="500" placeholder="Что не так?"></textarea><div class="md-er" id="md-er"></div><div class="md-bt"><button data-c>Отмена</button><button class="ok" data-s>Отправить</button></div>${isMod&&kind!=='profile'?`<hr style="margin:14px 0;border:0;border-top:1px solid #eee"><h3 style="color:#e5314a">Удалить (модератор)</h3><textarea id="md-r" maxlength="300" placeholder="Причина удаления (обязательно)"></textarea><div class="md-er" id="md-er2"></div><button class="md-red" data-d>Удалить ${T}</button>`:''}`);
  d.addEventListener('click',async e=>{
    const bt=e.target.closest('button');if(!bt)return;
    if(bt.hasAttribute('data-c'))d.remove();
    else if(bt.hasAttribute('data-s')){
      const n=d.querySelector('#md-n').value.trim();
      if(n.length<3){d.querySelector('#md-er').textContent='Напиши, что не так';return}
      bt.disabled=true;
      const r=await SB_().rpc('send_report',{p_kind:kind,p_target:String(id),p_note:n});
      if(r.error){d.querySelector('#md-er').textContent=r.error.message;bt.disabled=false;return}
      d.remove();note('Жалоба отправлена модераторам');
    }else if(bt.hasAttribute('data-d')){
      const n=d.querySelector('#md-r').value.trim();
      if(n.length<3){d.querySelector('#md-er2').textContent='Напиши причину';return}
      bt.disabled=true;
      const r=await SB_().rpc(kind==='post'?'mod_del_post':'mod_del_comment',{p_id:+id,p_reason:n});
      if(r.error){d.querySelector('#md-er2').textContent=r.error.message;bt.disabled=false;return}
      d.remove();note('Удалено');if(done)done();
    }
  });
}};

(window.RV=window.RV||{}).mod=()=>{view='list';menu=null;load()};
})();
