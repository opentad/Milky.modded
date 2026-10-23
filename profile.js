/* Милки-соцсеть: профиль. Секция #v-prof, Supabase через window.SB (из messenger.js). */
(function(){
const sec=document.createElement('section');sec.id='v-prof';sec.hidden=true;
document.querySelector('.main').appendChild(sec);
const $=s=>sec.querySelector(s);
const db=()=>window.SB;
const SBU='https://sjwvrljmqpbopbxqkhkl.supabase.co',SBK='sb_publishable_mWqrZq0Vw65Ahk7ZIbtlNQ_owreCtcj';
function getSB(){return new Promise(res=>{let n=0;const t=setInterval(()=>{
  if(!window.SB&&window.supabase)window.SB=window.supabase.createClient(SBU,SBK);
  if(window.SB){clearInterval(t);res(window.SB)}else if(++n>60){clearInterval(t);res(null)}},100)})}
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const col=n=>PAL[hs(n||'?')%PAL.length];
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const av=(p,c)=>`<span class="${c}" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}</span>`;
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t);return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()+' '+p2(d.getHours())+':'+p2(d.getMinutes())};
const seen=t=>{const d=Date.now()-Date.parse(t);if(!t||isNaN(d))return'';if(d<75000)return'В сети';const m=Math.floor(d/60000);if(m<60)return'Была '+m+' мин назад';const h=Math.floor(m/60);return h<24?'Была '+h+' ч назад':'Была '+Math.floor(h/24)+' дн назад'};
const cn=x=>x&&x[0]?x[0].count:0;
const IC={pen:'M4 20l4-1L19 8l-3-3L5 16z',heart:'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z',cmt:'M5 5h14v10H10l-5 4z',trash:'M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.5h9.2L17.5 7',dots:'M5 12h.01M12 12h.01M19 12h.01'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;
function note(t){let d=document.getElementById('pf-note');if(!d){d=document.createElement('div');d.id='pf-note';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:80;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}

const css=document.createElement('style');
css.textContent=`
#v-prof{--pk:#f45b97;--pkbg:#ffeaf2;--pkt:#d6407f;--c2:#f2f4f8;--sh:0 6px 30px rgba(0,0,0,.05);padding-bottom:70px}
.pf-cv{height:210px;border-radius:26px 26px 0 0;background:linear-gradient(120deg,#c8628f,#6b4fa8) center/cover}
.pf-hd{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;background:#fff;border-radius:0 0 26px 26px;padding:0 26px 24px;box-shadow:var(--sh)}
.pf-big{width:130px;height:130px;border-radius:50%;margin-top:-50px;border:6px solid #fff;display:grid;place-items:center;color:#fff;font-size:42px;font-weight:700;background-size:cover;background-position:center;flex:none}
.pf-big.o{border-radius:32px}
.pf-w{flex:1;min-width:230px;padding-top:14px}
.pf-w h2{font-size:24px;font-weight:800;line-height:1.2;color:var(--tx)}
.pf-fio{font-size:12px;color:var(--mu);margin-top:2px}
.pf-bd{display:inline-block;background:var(--pkbg);color:var(--pkt);border-radius:10px;padding:2px 10px;font-size:12px;font-weight:600;margin-top:8px}
.pf-st{margin:10px 0;color:var(--tx)}
.pf-tg{display:flex;flex-wrap:wrap;gap:8px}
.pf-tg span{background:var(--pkbg);color:var(--pkt);border-radius:14px;padding:5px 13px;font-size:12.5px;font-weight:600}
.pf-sd{display:flex;gap:22px;align-items:center;padding-top:20px;flex-wrap:wrap}
.pf-ss{display:flex;gap:24px;text-align:center}
.pf-ss b{display:block;font-size:21px;font-weight:800}
.pf-ss small{color:var(--mu);font-size:11.5px}
.pf-b{height:46px;padding:0 22px;border-radius:15px;background:var(--pk);color:#fff;font-weight:700;display:inline-flex;gap:8px;align-items:center;justify-content:center}
.pf-b.g{background:var(--c2);color:var(--tx)}
.pf-b svg{width:18px;height:18px}
.pf-bs{display:flex;gap:10px}
.pf-g{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:22px;margin-top:22px;align-items:start}
.pf-x{background:#fff;border-radius:22px;padding:18px;box-shadow:var(--sh);margin-bottom:18px}
.pf-comp textarea{width:100%;height:84px;resize:none;background:var(--c2);border:0;border-radius:16px;padding:14px;font:inherit;outline:0;color:var(--tx)}
.pf-comp .r{display:flex;justify-content:flex-end;margin-top:10px}
.pf-ph{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.pf-ph b{display:block}.pf-ph small{color:var(--mu);font-size:12px}
.pf-a{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:14px;background-size:cover;background-position:center;flex:none}
.pf-p p{line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.pf-ac{display:flex;gap:10px;margin-top:12px}
.pf-ac button{display:flex;gap:7px;align-items:center;height:38px;padding:0 14px;border-radius:12px;background:var(--c2);color:var(--mu);font-weight:700}
.pf-ac button.on{color:var(--pk)}
.pf-ac svg{width:18px;height:18px}
.pf-sh{display:flex;justify-content:space-between;margin-bottom:10px}
.pf-sh h3{font-size:16px;font-weight:800}.pf-sh small{color:var(--mu)}
.pf-pp{display:flex;gap:12px;align-items:center;width:100%;padding:7px 0;text-align:left;font-weight:600}
.pf-mu{color:var(--mu)}
.pf-em{color:var(--mu);text-align:center;padding:24px 0}
.pf-ov{position:fixed;inset:0;z-index:70;background:rgba(15,25,35,.4);display:grid;place-items:center;padding:20px}
.pf-md{background:#fff;border-radius:26px;padding:26px;width:min(700px,100%);max-height:92vh;overflow:auto}
.pf-mh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.pf-mh h3{font-size:22px;font-weight:800}.pf-mh small{color:var(--mu)}
.pf-f{display:grid;grid-template-columns:160px 1fr auto;gap:14px;align-items:center;padding:16px 0;border-top:1px solid var(--ln)}
.pf-f label b{display:block}.pf-f label small{color:var(--mu);font-size:12px}
.pf-f input{width:100%;background:var(--c2);border:1px solid var(--ln);border-radius:14px;padding:13px 15px;font:inherit;outline:0;color:var(--tx)}
.pf-m{font-size:12px;margin-top:4px;color:#2fa876}.pf-m.e{color:#d6407f}
.pf-sw{width:54px;height:30px;border-radius:15px;background:#cfd5df;position:relative}
.pf-sw i{position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .15s}
.pf-sw.on{background:var(--pk)}.pf-sw.on i{transform:translateX(24px)}
@media(max-width:1000px){.pf-g{grid-template-columns:1fr}.pf-f{grid-template-columns:1fr}}
@media(max-width:640px){.pf-big{width:104px;height:104px;margin-top:-38px}}`;
document.head.appendChild(css);

let tok=0,S=null;
async function render(u){
  const tk=++tok;
  sec.innerHTML='<div class="pf-x pf-em">Загружаем…</div>';
  const SB=await getSB();if(tk!==tok)return;
  if(!SB){sec.innerHTML='<div class="pf-x pf-em">Нет связи с сервером. Проверь интернет и обнови страницу.</div>';return}
  const me=(await SB.auth.getUser()).data.user;if(tk!==tok)return;
  if(!me){sec.innerHTML='<div class="pf-x pf-em">Чтобы открыть профиль, войди в аккаунт.<br><button class="pf-b" data-go="1" style="margin:14px auto 0">Войти</button></div>';return}
  const id=u||me.id,mine=id===me.id;
  const [pr,np,nf,ng,fw,ps,fo,su]=await Promise.all([
    SB.from('profiles').select('id,name,fio,last_seen,status,tags,avatar_url,cover_url,comments_off').eq('id',id).maybeSingle(),
    SB.from('posts').select('id',{count:'exact',head:true}).eq('user_id',id),
    SB.from('follows').select('follower',{count:'exact',head:true}).eq('followee',id),
    SB.from('follows').select('followee',{count:'exact',head:true}).eq('follower',id),
    mine?null:SB.from('follows').select('follower').match({follower:me.id,followee:id}).maybeSingle(),
    SB.from('posts').select('id,body,created_at,post_likes(count),post_comments(count)').eq('user_id',id).order('created_at',{ascending:false}).limit(50),
    SB.from('follows').select('follower').eq('followee',id).limit(6),
    SB.from('follows').select('followee').eq('follower',id).limit(6)]);
  if(tk!==tok)return;
  const bad=pr.error||ps.error;
  if(bad||!pr.data){sec.innerHTML='<div class="pf-x pf-em">'+(bad?'Не удалось загрузить: '+esc(bad.message)+'. Проверь, что SQL выполнен.':'Профиль не найден.')+'</div>';return}
  const ids=ps.data.map(x=>x.id),fol=(fo.data||[]).map(x=>x.follower),sub=(su.data||[]).map(x=>x.followee),all=[...new Set([...fol,...sub])];
  const [lk,nm]=await Promise.all([
    ids.length?SB.from('post_likes').select('post_id').eq('user_id',me.id).in('post_id',ids):null,
    all.length?SB.from('profiles').select('id,name,avatar_url').in('id',all):null]);
  if(tk!==tok)return;
  const M=Object.fromEntries(((nm&&nm.data)||[]).map(x=>[x.id,x]));
  S={me,id,mine,p:pr.data,np:np.count||0,nf:nf.count||0,ng:ng.count||0,fw:!!(fw&&fw.data),posts:ps.data,
     liked:new Set(((lk&&lk.data)||[]).map(x=>x.post_id)),fol:fol.map(i=>M[i]).filter(Boolean),sub:sub.map(i=>M[i]).filter(Boolean)};
  draw();
}
const ppl=(t,a,n)=>`<div class="pf-x"><div class="pf-sh"><h3>${t}</h3><small>${n}</small></div>${a.map(u=>`<button class="pf-pp" data-open="${u.id}">${av(u,'pf-a')}<span>${esc(u.name)}</span></button>`).join('')||'<small class="pf-mu">Пока никого</small>'}</div>`;
function draw(){
  const {p,mine}=S,tags=(p.tags||[]).filter(Boolean),sn=mine?'':seen(p.last_seen);
  const btns=mine?`<button class="pf-b" data-edit>${ic('pen')}Редактировать профиль</button>`:
    `<button class="pf-b${S.fw?' g':''}" data-follow>${S.fw?'Вы подписаны':'Подписаться'}</button><button class="pf-b g" data-dm>${ic('cmt')}Написать</button>`;
  sec.innerHTML=`<div class="pf-cv"${p.cover_url?` style="background-image:url('${esc(p.cover_url)}')"`:''}></div>
  <div class="pf-hd"><span class="pf-big${mine?'':' o'}" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}</span>
   <div class="pf-w"><h2>${esc(p.name)}</h2>${p.fio?`<div class="pf-fio">${esc(p.fio)}</div>`:''}${sn?`<span class="pf-bd">${sn}</span>`:''}
    ${p.status?`<div class="pf-st">${esc(p.status)}</div>`:'<div class="pf-st"></div>'}${tags.length?`<div class="pf-tg">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div>
   <div class="pf-sd"><div class="pf-ss"><div><b>${S.np}</b><small>публикаций</small></div><div><b>${S.nf}</b><small>подписчиков</small></div><div><b>${S.ng}</b><small>подписок</small></div></div><div class="pf-bs">${btns}</div></div></div>
  <div class="pf-g"><div>
   ${mine?`<div class="pf-x pf-comp"><textarea id="pf-t" maxlength="2000" placeholder="Что нового?"></textarea><div class="r"><button class="pf-b" data-pub>Опубликовать</button></div></div>`:''}
   ${S.posts.map(x=>`<article class="pf-x pf-p"><div class="pf-ph">${av(p,'pf-a')}<div><b>${esc(p.name)}</b><small>${dt(x.created_at)}</small></div></div><p>${esc(x.body)}</p>
     <div class="pf-ac"><button data-like="${x.id}" class="${S.liked.has(x.id)?'on':''}">${ic('heart')}${cn(x.post_likes)}</button><button disabled>${ic('cmt')}${cn(x.post_comments)}</button>${mine?`<button data-del="${x.id}" aria-label="Удалить">${ic('trash')}</button>`:''}</div></article>`).join('')||`<div class="pf-x pf-em">${mine?'Публикаций пока нет. Напиши первую выше.':'Публикаций пока нет.'}</div>`}
  </div><aside>${ppl('Подписчики',S.fol,S.nf)}${ppl('Подписки',S.sub,S.ng)}</aside></div>`;
}

async function act(e){
  const t=e.target,b=k=>t.closest(k),SB=db();let x;
  if(b('[data-go]'))MS.show('msg');
  else if((x=b('[data-open]')))render(x.dataset.open);
  else if(b('[data-edit]'))edit();
  else if(b('[data-dm]')){if(window.MG)MG.dm(S.id);else note('Личные сообщения скоро появятся')}
  else if(b('[data-follow]')){
    const on=S.fw;S.fw=!on;S.nf+=on?-1:1;draw();
    const r=on?await SB.from('follows').delete().match({follower:S.me.id,followee:S.id}):await SB.from('follows').insert({followee:S.id});
    if(r.error){S.fw=on;S.nf+=on?1:-1;draw();note('Не получилось: '+r.error.message)}
  }
  else if(b('[data-pub]')){
    const ta=$('#pf-t'),body=ta.value.trim();if(!body)return;
    const r=await SB.from('posts').insert({body}).select('id,body,created_at').single();
    if(r.error){note('Не опубликовалось: '+r.error.message);return}
    S.posts.unshift({...r.data,post_likes:[{count:0}],post_comments:[{count:0}]});S.np++;draw();
  }
  else if((x=b('[data-like]'))){
    const p=S.posts.find(z=>z.id==x.dataset.like),on=S.liked.has(p.id);
    p.post_likes=[{count:cn(p.post_likes)+(on?-1:1)}];on?S.liked.delete(p.id):S.liked.add(p.id);draw();
    const r=on?await SB.from('post_likes').delete().match({post_id:p.id,user_id:S.me.id}):await SB.from('post_likes').insert({post_id:p.id});
    if(r.error)note('Не получилось: '+r.error.message);
  }
  else if((x=b('[data-del]'))){
    if(!confirm('Удалить публикацию?'))return;
    const id=+x.dataset.del,r=await SB.from('posts').delete().eq('id',id);
    if(r.error){note('Не удалось удалить');return}
    S.posts=S.posts.filter(z=>z.id!==id);S.np--;draw();
  }
}
sec.addEventListener('click',act);

function edit(){
  const p=S.p,d=document.createElement('div');d.className='pf-ov';
  const F=[['name','Имя в чате','От 2 до 30 символов',p.name||'',30],['status','Строка статуса','Показывается рядом с именем',p.status||'',120],['tags','Интересы','Разделяйте запятыми',(p.tags||[]).join(', '),0]];
  d.innerHTML='<div class="pf-md" role="dialog" aria-modal="true"><div class="pf-mh"><div><h3>Редактировать профиль</h3><small>Каждый параметр сохраняется отдельно</small></div><button class="pf-b g" data-x aria-label="Закрыть">✕</button></div>'+
   F.map(f=>`<div class="pf-f"><label><b>${f[1]}</b><small>${f[2]}</small></label><div><input data-k="${f[0]}" value="${esc(f[3])}"${f[4]?` maxlength="${f[4]}"`:''}><div class="pf-m" data-m="${f[0]}"></div></div><button class="pf-b" data-s="${f[0]}">Сохранить</button></div>`).join('')+
   `<div class="pf-f"><label><b>Комментарии</b><small>Можно запретить комментарии под своими публикациями</small></label><span></span><button class="pf-sw${p.comments_off?' on':''}" data-sw role="switch" aria-checked="${!!p.comments_off}" aria-label="Запретить комментарии"><i></i></button></div></div>`;
  document.body.appendChild(d);
  const close=()=>{d.remove();document.removeEventListener('keydown',esc2)},esc2=e=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',esc2);
  d.addEventListener('click',async e=>{
    const b=e.target.closest('[data-s]'),SB=db();
    if(e.target===d||e.target.closest('[data-x]'))return close();
    if(e.target.closest('[data-sw]')){
      const sw=e.target.closest('[data-sw]'),on=!sw.classList.contains('on');
      const r=await SB.rpc('update_profile',{p_comments_off:on});
      if(r.error){note('Не получилось: '+r.error.message);return}
      sw.classList.toggle('on',on);sw.setAttribute('aria-checked',on);S.p.comments_off=on;return;
    }
    if(!b)return;
    const k=b.dataset.s,v=d.querySelector(`[data-k="${k}"]`).value.trim(),m=d.querySelector(`[data-m="${k}"]`);let arg;
    if(k==='name'){if(v.length<2||v.length>30){m.className='pf-m e';m.textContent='От 2 до 30 символов';return}arg={p_name:v}}
    else if(k==='status')arg={p_status:v};
    else arg={p_tags:v.split(',').map(s=>s.trim()).filter(Boolean).slice(0,10)};
    const r=await SB.rpc('update_profile',arg);
    if(r.error){m.className='pf-m e';m.textContent='Не получилось: '+r.error.message;return}
    if(k==='name')S.p.name=v;else if(k==='status')S.p.status=v;else S.p.tags=arg.p_tags;
    m.className='pf-m';m.textContent='Сохранено';draw();
  });
}

let want=null;
window.PF={open:u=>{want=u||null;render(want)}};
(window.RV=window.RV||{}).prof=()=>{want=null;render(null)};
document.addEventListener('sb',()=>{if(!sec.hidden)render(want)});
})();
