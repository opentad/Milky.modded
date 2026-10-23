/* Милки-соцсеть: лента. Секция #v-feed, Supabase через window.SB (из messenger.js). */
(function(){
const sec=document.createElement('section');sec.id='v-feed';sec.hidden=true;
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
const av=(p,c,id)=>`<button class="${c}" data-u="${id}" aria-label="Открыть профиль" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}</button>`;
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t),n=new Date(),hm=p2(d.getHours())+':'+p2(d.getMinutes());return d.toDateString()===n.toDateString()?'Сегодня в '+hm:p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()+' '+hm};
const seen=t=>{const d=Date.now()-Date.parse(t);if(!t||isNaN(d))return'';if(d<75000)return'В сети';const m=Math.floor(d/60000);if(m<60)return'Была '+m+' мин назад';const h=Math.floor(m/60);return h<24?'Была '+h+' ч назад':'Была '+Math.floor(h/24)+' дн назад'};
const cn=x=>x&&x[0]?x[0].count:0;
const I={heart:'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z',cmt:'M5 5h14v10H10l-5 4z',send:'M4 12l16-8-6 16-3-7z',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${I[k]}"/></svg>`;
function note(t){let d=document.getElementById('fd-note');if(!d){d=document.createElement('div');d.id='fd-note';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:80;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}

const css=document.createElement('style');
css.textContent=`
#v-feed{--pk:#f45b97;--c2:#f2f4f8;--cy2:#0ea5d6;--cybg:#e6f8fd;--sh:0 6px 30px rgba(0,0,0,.05);padding-bottom:70px}
.fd-h{font-size:34px;font-weight:800;color:var(--tx);line-height:1.1;margin-top:6px}
.fd-sub{color:var(--mu);margin:6px 0 20px}
.fd-bar{background:#fff;border-radius:22px;padding:18px;box-shadow:var(--sh)}
.fd-s{display:flex;gap:12px;align-items:center;height:52px;padding:0 18px;border:1px solid var(--ln);border-radius:18px;color:var(--mu)}
.fd-s svg{width:20px;height:20px;flex:none}
.fd-s input{flex:1;min-width:0;border:0;outline:0;background:none;font:inherit;color:var(--tx)}
.fd-ch{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:14px}
.fd-ch div{display:flex;gap:8px;flex-wrap:wrap}
.fd-ch button{height:40px;padding:0 18px;border-radius:14px;background:var(--c2);color:#566170;font-weight:700}
.fd-ch button.on{background:var(--cybg);color:var(--cy2)}
.fd-g{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:22px;margin-top:24px;align-items:start}
.fd-p,.fd-w,.fd-e{background:#fff;border-radius:24px;box-shadow:var(--sh)}
.fd-p{margin-bottom:20px;overflow:hidden}
.fd-ph{display:flex;gap:14px;align-items:center;padding:18px 24px 12px}
.fd-ph b{display:block;font-size:16px;cursor:pointer}.fd-ph small{color:var(--mu)}
.fd-a{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:16px;background-size:cover;background-position:center;flex:none}
.fd-bd{padding:0 24px 16px}.fd-bd p{line-height:1.65;font-size:15.5px;white-space:pre-wrap;overflow-wrap:anywhere}
.fd-ac{display:flex;gap:10px;padding:12px 24px;border-top:1px solid var(--ln)}
.fd-ac button{display:flex;gap:8px;align-items:center;height:42px;padding:0 16px;border-radius:14px;background:var(--c2);color:#566170;font-weight:700}
.fd-ac button.on{color:var(--pk)}
.fd-ac svg{width:18px;height:18px}
.fd-cm{padding:0 24px}
.fd-c{padding:9px 0;border-top:1px solid var(--ln);overflow-wrap:anywhere}.fd-c b{margin-right:6px}.fd-ct{color:var(--mu);font-size:11.5px}
.fd-f{display:flex;gap:10px;padding:12px 24px 18px;border-top:1px solid var(--ln)}
.fd-f input{flex:1;min-width:0;height:48px;border:1px solid var(--ln);border-radius:16px;padding:0 16px;font:inherit;outline:0;color:var(--tx)}
.fd-f button{width:58px;height:48px;border-radius:16px;background:var(--cy2);color:#fff;display:grid;place-items:center}
.fd-f svg{width:20px;height:20px}
.fd-off{padding:12px 24px 18px;color:var(--mu);border-top:1px solid var(--ln);font-size:13px}
.fd-w{padding:20px}
.fd-w small.k{display:block;color:var(--cy2);font-weight:700}
.fd-w h2{font-size:21px;font-weight:800;margin-bottom:12px;color:var(--tx)}
.fd-w .fd-s{height:46px;margin-bottom:6px}
.fd-r{display:flex;gap:12px;align-items:center;padding:10px 0}
.fd-r .fd-a{width:54px;height:54px}
.fd-r div{flex:1;min-width:0}.fd-r b{display:block;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.fd-r small{color:var(--mu)}
.fd-r .f{height:40px;padding:0 14px;border-radius:13px;background:var(--cybg);color:var(--cy2);font-weight:700;flex:none}
.fd-r .f.on{background:var(--c2);color:var(--mu)}
.fd-e{padding:26px;color:var(--mu);text-align:center}
@media(max-width:1000px){.fd-g{grid-template-columns:1fr}}
@media(max-width:640px){.fd-h{font-size:28px}.fd-ph,.fd-bd,.fd-ac,.fd-cm,.fd-f,.fd-off{padding-left:16px;padding-right:16px}}`;
document.head.appendChild(css);

sec.innerHTML=`<h1 class="fd-h">Лента</h1><p class="fd-sub">Публикации учеников в одном месте.</p>
<div class="fd-bar"><label class="fd-s">${ic('search')}<input id="fd-q" placeholder="Найти публикацию или автора" autocomplete="off"></label>
<div class="fd-ch"><div id="fd-fl"></div><div id="fd-so"></div></div></div>
<div class="fd-g"><div id="fd-l"></div><aside class="fd-w"><small class="k">Люди рядом</small><h2>Кого читать</h2><label class="fd-s"><input id="fd-pq" placeholder="Найти ученика" autocomplete="off"></label><div id="fd-p"></div></aside></div>`;

const FL=[['all','Всё'],['mine','Моя лента']],SO=[['pop','Популярное'],['new','Новое'],['disc','Обсуждаемое']];
const st={f:'all',s:'new',q:'',pq:'',posts:[],people:[],me:null,fol:new Set(),liked:new Set(),cm:{},nm:{}};
let tok=0;
function chips(){
  $('#fd-fl').innerHTML=FL.map(([k,l])=>`<button data-f="${k}" class="${st.f===k?'on':''}">${l}</button>`).join('');
  $('#fd-so').innerHTML=SO.map(([k,l])=>`<button data-s="${k}" class="${st.s===k?'on':''}">${l}</button>`).join('');
}
const who=id=>st.nm[id]||{name:'Участник'};
function posts(){
  let a=st.posts.filter(p=>(st.f==='all'||st.fol.has(p.user_id)||p.user_id===st.me.id)&&(!st.q||(p.body+' '+who(p.user_id).name).toLowerCase().includes(st.q)));
  if(st.s==='pop')a=[...a].sort((x,y)=>cn(y.post_likes)-cn(x.post_likes));
  if(st.s==='disc')a=[...a].sort((x,y)=>(st.cm[y.id]||[]).length-(st.cm[x.id]||[]).length);
  $('#fd-l').innerHTML=a.map(p=>{
    const w=who(p.user_id),cs=st.cm[p.id]||[];
    return `<article class="fd-p" data-id="${p.id}"><div class="fd-ph">${av(w,'fd-a',p.user_id)}<div><b data-u="${p.user_id}">${esc(w.name)}</b><small>${dt(p.created_at)}${w.last_seen?' · '+seen(w.last_seen):''}</small></div></div>
    <div class="fd-bd"><p>${esc(p.body)}</p></div>
    <div class="fd-ac"><button data-like class="${st.liked.has(p.id)?'on':''}">${ic('heart')}${cn(p.post_likes)}</button><button disabled>${ic('cmt')}${cs.length}</button></div>
    ${cs.length?`<div class="fd-cm">${cs.map(c=>`<div class="fd-c"><b>${esc(who(c.user_id).name)}</b><small class="fd-ct">${dt(c.created_at)}</small><div>${esc(c.body)}</div></div>`).join('')}</div>`:''}
    ${w.comments_off?'<div class="fd-off">Автор отключил комментарии</div>':`<form class="fd-f"><input placeholder="Написать комментарий…" aria-label="Комментарий" maxlength="500"><button aria-label="Отправить">${ic('send')}</button></form>`}</article>`}).join('')
    ||'<div class="fd-e">Здесь пока пусто. '+(st.f==='mine'?'Подпишись на кого-нибудь справа.':'Опубликуй первый пост в своём профиле.')+'</div>';
}
function people(){
  const a=st.people.filter(p=>!st.fol.has(p.id)&&(!st.pq||p.name.toLowerCase().includes(st.pq))).slice(0,8);
  $('#fd-p').innerHTML=a.map(p=>`<div class="fd-r">${av(p,'fd-a',p.id)}<div><b data-u="${p.id}">${esc(p.name)}</b><small>${seen(p.last_seen)||'Ученик'}</small></div><button class="f" data-fw="${p.id}">Подписаться</button></div>`).join('')||'<small style="color:var(--mu)">Некого предложить</small>';
}
async function load(){
  const tk=++tok;
  $('#fd-l').innerHTML='<div class="fd-e">Загружаем…</div>';
  const SB=await getSB();if(tk!==tok)return;
  if(!SB){$('#fd-l').innerHTML='<div class="fd-e">Нет связи с сервером. Проверь интернет и обнови страницу.</div>';return}
  const me=(await SB.auth.getUser()).data.user;if(tk!==tok)return;
  if(!me){$('#fd-l').innerHTML='<div class="fd-e">Чтобы увидеть ленту, войди в аккаунт.<br><button data-go="1" style="margin:14px auto 0;display:block;height:44px;padding:0 24px;border-radius:14px;background:var(--pk);color:#fff;font-weight:700">Войти</button></div>';$('#fd-p').innerHTML='';return}
  const [ps,fo,pp]=await Promise.all([
    SB.from('posts').select('id,user_id,body,created_at,post_likes(count)').order('created_at',{ascending:false}).limit(60),
    SB.from('follows').select('followee').eq('follower',me.id),
    SB.from('profiles').select('id,name,avatar_url,last_seen').neq('id',me.id).limit(40)]);
  if(tk!==tok)return;
  if(ps.error){$('#fd-l').innerHTML='<div class="fd-e">Не удалось загрузить: '+esc(ps.error.message)+'. Проверь, что SQL выполнен.</div>';return}
  const ids=ps.data.map(x=>x.id);
  const [lk,cm]=await Promise.all([
    ids.length?SB.from('post_likes').select('post_id').eq('user_id',me.id).in('post_id',ids):null,
    ids.length?SB.from('post_comments').select('id,post_id,user_id,body,created_at').in('post_id',ids).order('created_at').limit(400):null]);
  const cms=(cm&&cm.data)||[],uids=[...new Set([...ps.data.map(x=>x.user_id),...cms.map(x=>x.user_id)])];
  const nm=uids.length?await SB.from('profiles').select('id,name,avatar_url,comments_off,last_seen').in('id',uids):null;
  if(tk!==tok)return;
  st.me=me;st.posts=ps.data;st.people=pp.data||[];st.fol=new Set((fo.data||[]).map(x=>x.followee));
  st.liked=new Set(((lk&&lk.data)||[]).map(x=>x.post_id));
  st.cm={};cms.forEach(c=>(st.cm[c.post_id]||(st.cm[c.post_id]=[])).push(c));
  st.nm=Object.fromEntries(((nm&&nm.data)||[]).map(x=>[x.id,x]));
  chips();posts();people();
}
const pid=el=>+el.closest('.fd-p').dataset.id;
sec.addEventListener('click',async e=>{
  const t=e.target,b=k=>t.closest(k),SB=db();let x;
  if(b('[data-go]'))MS.show('msg');
  else if((x=b('[data-f]'))){st.f=x.dataset.f;chips();posts()}
  else if((x=b('[data-s]'))){st.s=x.dataset.s;chips();posts()}
  else if((x=b('[data-u]'))){MS.show('prof');if(window.PF)PF.open(x.dataset.u)}
  else if(b('[data-like]')){
    const p=st.posts.find(z=>z.id===pid(t)),on=st.liked.has(p.id);
    p.post_likes=[{count:cn(p.post_likes)+(on?-1:1)}];on?st.liked.delete(p.id):st.liked.add(p.id);posts();
    const r=on?await SB.from('post_likes').delete().match({post_id:p.id,user_id:st.me.id}):await SB.from('post_likes').insert({post_id:p.id});
    if(r.error)note('Не получилось: '+r.error.message);
  }
  else if((x=b('[data-fw]'))){
    const id=x.dataset.fw;st.fol.add(id);people();
    const r=await SB.from('follows').insert({followee:id});
    if(r.error){st.fol.delete(id);people();note('Не получилось: '+r.error.message)}
  }
});
sec.addEventListener('submit',async e=>{
  e.preventDefault();
  const inp=e.target.querySelector('input'),body=inp.value.trim();if(!body)return;
  const id=pid(e.target),r=await db().from('post_comments').insert({post_id:id,body}).select('id,post_id,user_id,body,created_at').single();
  if(r.error){note('Не отправилось: '+r.error.message);return}
  (st.cm[id]||(st.cm[id]=[])).push(r.data);
  if(!st.nm[st.me.id])st.nm[st.me.id]={name:'Вы'};
  posts();
});
$('#fd-q').addEventListener('input',e=>{st.q=e.target.value.trim().toLowerCase();if(st.me)posts()});
$('#fd-pq').addEventListener('input',e=>{st.pq=e.target.value.trim().toLowerCase();if(st.me)people()});
chips();
(window.RV=window.RV||{}).feed=load;
document.addEventListener('sb',()=>{if(!sec.hidden)load()});
})();
