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
const fmt=t=>esc(t).replace(/https?:\/\/[^\s<]+/g,u=>{const m=u.match(/[.,!?)]+$/),tail=m?m[0]:'',url=tail?u.slice(0,-tail.length):u;return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${tail}`});
const SF=window.SF||(f=>String(f||'').trim().split(/\s+/).slice(0,2).join(' '));
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const col=n=>PAL[hs(n||'?')%PAL.length];
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const av=(p,c,id)=>`<button class="${c}" data-u="${id}" aria-label="Открыть профиль" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}</button>`;
const okImg=u=>/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(u||'')?u:'';
const avB=(z,id)=>{const a=okImg(z.avatar_url);return `<button class="fd-a" data-biz="${id}" data-n="${esc(z.title)}" aria-label="Открыть страницу компании" style="background-color:${col(z.title)};${a?`background-image:url('${a}')`:''}">${a?'':esc(ini(z.title))}</button>`};
const KD={npd:'ИП на НПД',ip:'ИП',ooo:'ООО'};
const kindOf=z=>KD[String(z&&z.kind||'').toLowerCase()]||'Компания';
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t),n=new Date(),hm=p2(d.getHours())+':'+p2(d.getMinutes());return d.toDateString()===n.toDateString()?'Сегодня в '+hm:p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()+' '+hm};
const seen=t=>{const d=Date.now()-Date.parse(t);if(!t||isNaN(d))return'';if(d<75000)return'В сети';const m=Math.floor(d/60000);if(m<60)return'Была '+m+' мин назад';const h=Math.floor(m/60);return h<24?'Была '+h+' ч назад':'Была '+Math.floor(h/24)+' дн назад'};
const cn=x=>x&&x[0]?x[0].count:0;
const I={heart:'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z',cmt:'M5 5h14v10H10l-5 4z',send:'M4 12l16-8-6 16-3-7z',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',all:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',me:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-3.8 3.5-6 8-6s8 2.2 8 6z'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${I[k]}"/></svg>`;
function note(t){let d=document.getElementById('fd-note');if(!d){d=document.createElement('div');d.id='fd-note';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:1100;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}

const css=document.createElement('style');
css.textContent=`
#v-feed{--ac:#8b7bf0;--acbg:rgba(139,123,240,.18);--pk:#ff5c6a;--sf:color-mix(in srgb,var(--tx) 7%,transparent);--bd:color-mix(in srgb,var(--tx) 16%,transparent);padding-bottom:84px}
.fd-wrap{max-width:640px;margin:0 auto}
.fd-h{font-size:26px;font-weight:800;color:var(--tx);line-height:1.1;margin:6px 0 12px}
.fd-s{display:flex;gap:10px;align-items:center;height:44px;padding:0 16px;background:var(--sf);border:1px solid var(--bd);border-radius:22px;color:var(--mu)}
.fd-s svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.fd-s input{flex:1;min-width:0;border:0;outline:0;background:none;font:inherit;color:var(--tx)}
#fd-so{display:flex;gap:18px;margin:12px 2px 4px;overflow-x:auto;scrollbar-width:none}
#fd-so::-webkit-scrollbar{display:none}
#fd-so button{flex:none;padding:6px 0;font-weight:700;font-size:14px;color:var(--mu);background:none;border-bottom:2px solid transparent}
#fd-so button.on{color:var(--tx);border-bottom-color:var(--ac)}
.fd-pw{margin:14px 0 4px}
.fd-k{display:block;font-size:12px;font-weight:700;color:var(--mu);letter-spacing:.04em;text-transform:uppercase;margin-bottom:8px}
#fd-p{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
#fd-p::-webkit-scrollbar{display:none}
.fd-r{flex:none;width:116px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px;background:var(--sf);border:1px solid var(--bd);border-radius:16px;text-align:center}
.fd-r .fd-a{width:52px;height:52px}
.fd-r b{display:block;width:100%;font-size:13px;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.fd-r small{display:none}
.fd-r .f{height:32px;padding:0 12px;border-radius:16px;background:var(--ac);color:#fff;font-weight:700;font-size:12.5px}
#fd-l{margin-top:14px}
.fd-p{margin-bottom:14px;padding:16px;background:var(--sf);border:1px solid var(--bd);border-radius:18px;overflow:hidden}
.fd-e{padding:30px 10px;color:var(--mu);text-align:center}
.fd-ph{display:flex;gap:12px;align-items:center;padding:0 0 12px}
.fd-ph b{display:block;font-size:15.5px;line-height:1.25;color:var(--tx);cursor:pointer}
.fd-ph small{color:var(--mu);font-size:12.5px}
.fd-ph .fd-tm{font-size:12px;white-space:nowrap;align-self:flex-start;margin-top:3px}
.fd-fio{display:block;font-size:12px;font-weight:400;color:var(--mu);margin:1px 0 2px}
.fd-tg{display:inline-block;background:var(--acbg);color:var(--ac);border-radius:6px;padding:1px 8px;font-size:11px;font-weight:700}
.fd-a{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:14px;background-size:cover;background-position:center;flex:none}
.fd-bd{padding:0 0 10px}
.fd-bd p{line-height:1.65;font-size:16px;color:var(--tx);white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
.fd-bd p.cl{display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}
.fd-bd a{color:var(--ac);text-decoration:underline;word-break:break-all}
.fd-mo{display:block;margin-top:4px;padding:6px 0;color:var(--ac);font-weight:700;font-size:14.5px;background:none}
.fd-pimg{display:block;max-width:100%;max-height:560px;object-fit:contain;border-radius:12px;margin-top:10px}
.fd-ac{display:flex;gap:6px;padding:8px 0 0;border-top:1px solid var(--bd)}
.fd-ac button{display:flex;gap:6px;align-items:center;height:36px;padding:0 14px 0 0;background:none;color:var(--mu);font-weight:700;font-size:14px}
.fd-ac button.on{color:var(--pk)}
.fd-ac svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round}
.fd-ac button.on svg{fill:currentColor}
.fd-cm{padding:0;margin-top:8px;border-top:1px solid var(--bd)}
.fd-c{padding:10px 0;border-top:1px solid var(--bd);overflow-wrap:anywhere;line-height:1.55;font-size:14.5px;color:var(--tx)}.fd-c b{margin-right:6px}.fd-ct{color:var(--mu);font-size:11.5px}
.fd-f{display:flex;gap:10px;padding:10px 0 0;border-top:1px solid var(--bd)}
.fd-f input{flex:1;min-width:0;height:44px;border:1px solid var(--bd);border-radius:22px;padding:0 16px;font:inherit;outline:0;color:var(--tx);background:var(--sf)}
.fd-f button{width:54px;height:44px;border-radius:22px;background:var(--ac);color:#fff;display:grid;place-items:center}
.fd-f svg{width:20px;height:20px}
.fd-off{padding:10px 0 0;color:var(--mu);border-top:1px solid var(--bd);font-size:13px}
.fd-nv{position:fixed;left:0;right:0;bottom:0;height:56px;z-index:1000;display:flex;justify-content:center;background:#fff;border-top:1px solid #e3e8ee}
.fd-nv button{flex:1;max-width:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#566170;font-size:11px;font-weight:600;background:none}
.fd-nv svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round}
.fd-nv button.on{color:#6d5bd0}
.fd-nv button.on svg{fill:currentColor}
body.menu .fd-nv{display:none}
@media(max-width:640px){.fd-h{font-size:24px}.fd-bd p{font-size:15.5px}.fd-p{padding:14px}}`;
document.head.appendChild(css);

sec.innerHTML=`<div class="fd-wrap"><h1 class="fd-h">Лента</h1>
<label class="fd-s">${ic('search')}<input id="fd-q" placeholder="Найти публикацию или автора" autocomplete="off"></label>
<div id="fd-so"></div>
<div class="fd-pw"><small class="fd-k">Кого читать</small><div id="fd-p"></div></div>
<div id="fd-l"></div></div>
<nav class="fd-nv"><button data-f="all">${ic('all')}Все</button><button data-f="mine">${ic('me')}Моя лента</button></nav>`;

const SO=[['new','По времени'],['pop','Популярное'],['disc','Обсуждаемое']];
const st={f:'all',s:'new',q:'',posts:[],people:[],me:null,fol:new Set(),bf:new Set(),bz:{},liked:new Set(),cm:{},nm:{},open:new Set()};
let tok=0;
function chips(){
  $('#fd-so').innerHTML=SO.map(([k,l])=>`<button data-s="${k}" class="${st.s===k?'on':''}">${l}</button>`).join('');
  sec.querySelectorAll('.fd-nv button').forEach(b=>b.classList.toggle('on',b.dataset.f===st.f));
}
const who=id=>st.nm[id]||{name:'Участник'};
const bzOf=p=>p.biz_id?(st.bz[p.biz_id]||{title:'Компания'}):null;
const nameOf=p=>{const z=bzOf(p);return z?z.title:who(p.user_id).name};
function posts(){
  let a=st.posts.filter(p=>(st.f==='all'||(p.biz_id?st.bf.has(p.biz_id):st.fol.has(p.user_id))||p.user_id===st.me.id)&&(!st.q||(p.body+' '+nameOf(p)).toLowerCase().includes(st.q)));
  if(st.s==='pop')a=[...a].sort((x,y)=>cn(y.post_likes)-cn(x.post_likes));
  if(st.s==='disc')a=[...a].sort((x,y)=>CMT.n(y.id)-CMT.n(x.id));
  $('#fd-l').innerHTML=a.map(p=>{
    const z=bzOf(p),w=who(p.user_id);
    const head=z
      ?`${avB(z,p.biz_id)}<div style="flex:1;min-width:0"><b data-biz="${p.biz_id}" data-n="${esc(z.title)}">${esc(z.title)}</b><small><span class="fd-tg">${kindOf(z)}</span></small></div>`
      :`${av(w,'fd-a',p.user_id)}<div style="flex:1;min-width:0"><b data-u="${p.user_id}">${esc(w.name)}</b>${w.fio?`<span class="fd-fio">${esc(SF(w.fio))}</span>`:''}${w.last_seen?`<small>${seen(w.last_seen)}</small>`:''}</div>`;
    const long=p.body.length>380||(p.body.match(/\n/g)||[]).length>6,open=st.open.has(p.id);
    const text=p.body.trim()?`<p class="${long&&!open?'cl':''}">${fmt(p.body)}</p>${long?`<button class="fd-mo" data-more>${open?'Свернуть':'Читать полностью'}</button>`:''}`:'';
    return `<article class="fd-p" data-id="${p.id}"><div class="fd-ph">${head}<small class="fd-tm">${dt(p.created_at)}</small>${CMT.dots((p.user_id!==st.me.id?'<button data-rep>Пожаловаться</button>':'')+(CMT.mod()?'<button data-pdel data-danger>Удалить</button>':''))}</div>
    <div class="fd-bd">${text}${p.image_url?`<img class="fd-pimg" src="${esc(p.image_url)}" alt="" loading="lazy">`:''}</div>
    <div class="fd-ac"><button data-like class="${st.liked.has(p.id)?'on':''}">${ic('heart')}${cn(p.post_likes)}</button><button disabled>${ic('cmt')}${CMT.n(p.id)}</button></div>
    ${CMT.html(p.id,p.user_id,z?false:w.comments_off)}</article>`}).join('')
    ||'<div class="fd-e">Здесь пока пусто. '+(st.f==='mine'?'Подпишись на кого-нибудь в полосе сверху.':'Опубликуй первый пост в своём профиле.')+'</div>';
}
function people(){
  const a=st.people.filter(p=>!st.fol.has(p.id)).slice(0,10);
  $('#fd-p').innerHTML=a.map(p=>`<div class="fd-r">${av(p,'fd-a',p.id)}<b data-u="${p.id}">${esc(p.name)}</b><button class="f" data-fw="${p.id}">Подписаться</button></div>`).join('')||'<small style="color:var(--mu)">Некого предложить</small>';
}
async function load(){try{await load2()}catch(e){$('#fd-l').innerHTML='<div class="fd-e">Ошибка: '+esc(e.message)+'</div>'}}
async function load2(){
  const tk=++tok;
  $('#fd-l').innerHTML='<div class="fd-e">Загружаем…</div>';
  const SB=await getSB();if(tk!==tok)return;
  if(!SB){$('#fd-l').innerHTML='<div class="fd-e">Нет связи с сервером. Проверь интернет и обнови страницу.</div>';return}
  const me=(await SB.auth.getUser()).data.user;if(tk!==tok)return;
  if(!me){$('#fd-l').innerHTML='<div class="fd-e">Чтобы увидеть ленту, войди в аккаунт.<br><button data-go="1" style="margin:14px auto 0;display:block;height:44px;padding:0 24px;border-radius:22px;background:var(--ac);color:#fff;font-weight:700">Войти</button></div>';$('#fd-p').innerHTML='';chips();return}
  const [ps,fo,pp,bfo]=await Promise.all([
    SB.from('posts').select('id,user_id,biz_id,body,image_url,created_at,post_likes(count)').order('created_at',{ascending:false}).limit(60),
    SB.from('follows').select('followee').eq('follower',me.id),
    SB.from('profiles').select('id,name,avatar_url,last_seen').neq('id',me.id).limit(40),
    SB.from('biz_follows').select('biz_id').eq('user_id',me.id)]);
  if(tk!==tok)return;
  if(ps.error){$('#fd-l').innerHTML='<div class="fd-e">Не удалось загрузить: '+esc(ps.error.message)+'. Проверь, что SQL выполнен.</div>';return}
  const ids=ps.data.map(x=>x.id);
  const [lk]=await Promise.all([
    ids.length?SB.from('post_likes').select('post_id').eq('user_id',me.id).in('post_id',ids):null,
    CMT.load(SB,me,ids,()=>posts())]);
  const uids=[...new Set(ps.data.filter(x=>!x.biz_id).map(x=>x.user_id))];
  const nm=uids.length?await SB.from('profiles').select('id,name,fio,avatar_url,comments_off,last_seen').in('id',uids):null;
  const bids=[...new Set(ps.data.map(x=>x.biz_id).filter(Boolean))];
  let bz=null;
  if(bids.length){
    bz=await SB.from('biz_blogs').select('biz_id,title,avatar_url,kind').in('biz_id',bids);
    if(bz.error)bz=await SB.from('biz_blogs').select('biz_id,title,avatar_url').in('biz_id',bids);
    if(bz.error)bz=await SB.from('biz_blogs').select('biz_id,title').in('biz_id',bids);
  }
  if(tk!==tok)return;
  st.me=me;st.posts=ps.data;st.people=pp.data||[];st.fol=new Set((fo.data||[]).map(x=>x.followee));
  st.bf=new Set(((bfo&&bfo.data)||[]).map(x=>x.biz_id));
  st.liked=new Set(((lk&&lk.data)||[]).map(x=>x.post_id));
  st.nm=Object.fromEntries(((nm&&nm.data)||[]).map(x=>[x.id,x]));
  st.bz=Object.fromEntries(((bz&&bz.data)||[]).map(x=>[x.biz_id,x]));
  chips();posts();people();
}
const pid=el=>+el.closest('.fd-p').dataset.id;
sec.addEventListener('click',async e=>{
  const t=e.target,b=k=>t.closest(k),SB=db();let x;
  if(b('[data-go]'))MS.show('msg');
  else if(b('[data-more]')){const id=pid(t);st.open.has(id)?st.open.delete(id):st.open.add(id);posts()}
  else if((x=b('[data-f]'))){st.f=x.dataset.f;chips();if(st.me)posts();window.scrollTo(0,0)}
  else if((x=b('[data-s]'))){st.s=x.dataset.s;chips();if(st.me)posts()}
  else if((x=b('[data-biz]'))){if(window.OF)OF.open(x.dataset.biz,x.dataset.n);else note('Страница компании пока не подключена')}
  else if((x=b('[data-u]'))){MS.show('prof');if(window.PF)PF.open(x.dataset.u)}
  else if(b('[data-like]')){
    const p=st.posts.find(z=>z.id===pid(t)),on=st.liked.has(p.id);
    p.post_likes=[{count:cn(p.post_likes)+(on?-1:1)}];on?st.liked.delete(p.id):st.liked.add(p.id);posts();
    const r=on?await SB.from('post_likes').delete().match({post_id:p.id,user_id:st.me.id}):await SB.from('post_likes').insert({post_id:p.id});
    if(r.error)note('Не получилось: '+r.error.message);
  }
  else if(b('[data-rep]')){const p=st.posts.find(z=>z.id===pid(t));CMT.report('post',p.id,p.user_id)}
  else if(b('[data-pdel]')){
    const p=st.posts.find(z=>z.id===pid(t));if(!confirm('Удалить публикацию?'))return;
    const r=await SB.from('posts').delete().eq('id',p.id).select();
    if(r.error||!r.data.length)return note('Не удалось удалить');
    st.posts=st.posts.filter(z=>z.id!==p.id);posts();
  }
  else if((x=b('[data-fw]'))){
    const id=x.dataset.fw;st.fol.add(id);people();
    const r=await SB.from('follows').insert({followee:id});
    if(r.error){st.fol.delete(id);people();note('Не получилось: '+r.error.message)}
  }
});
$('#fd-q').addEventListener('input',e=>{st.q=e.target.value.trim().toLowerCase();if(st.me)posts()});
chips();
(window.RV=window.RV||{}).feed=load;
document.addEventListener('sb',()=>{if(!sec.hidden)load()});
})();
