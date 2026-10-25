(function(){
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t),n=new Date(),y=new Date(n-864e5),hm=p2(d.getHours())+':'+p2(d.getMinutes());return d.toDateString()===n.toDateString()?'Сегодня в '+hm:d.toDateString()===y.toDateString()?'Вчера в '+hm:p2(d.getDate())+'.'+p2(d.getMonth()+1)+' в '+hm};
const HEART='<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/></svg>';
const SEND='<svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-3-7z"/></svg>';
const st={c:{},nm:{},lk:{},open:{},rep:null,me:null,cb:null};
const redraw=()=>st.cb&&st.cb();
function toast(t){let d=document.getElementById('cm-note');if(!d){d=document.createElement('div');d.id='cm-note';d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#34404e;color:#fff;padding:12px 20px;border-radius:16px;z-index:90;font-size:13px;max-width:90vw';document.body.appendChild(d)}d.textContent=t;d.hidden=false;clearTimeout(d._t);d._t=setTimeout(()=>d.hidden=true,3500)}

const css=document.createElement('style');
css.textContent=`
.cm{margin-top:12px;padding-top:14px;border-top:1px solid var(--ln)}
.fd-p .cm{margin:0;padding:14px 24px 18px}
.cm-i{display:flex;gap:12px;align-items:flex-start;margin-bottom:10px}
.cm-a{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:14px;background-size:cover;background-position:center}
.cm-k .cm-a{width:38px;height:38px;font-size:12px;border-radius:12px}
.cm-bw{flex:1;min-width:0}
.cm-b{background:#f8f9fb;border:1px solid var(--ln);border-radius:20px;padding:12px 16px}
.cm-b b{display:block;font-size:13.5px;font-weight:700;cursor:pointer;color:var(--tx)}
.cm-b p{margin:4px 0 6px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;color:var(--tx)}
.cm-m{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--mu)}
.cm-m button{font-size:11.5px;font-weight:700;color:#566170;display:flex;gap:5px;align-items:center}
.cm-m button svg{width:18px;height:18px}
.cm-m button.on{color:#f45b97}
.cm-m button.on svg path{fill:#f45b97!important;stroke:#f45b97!important}
.cm-m .dg{color:#e5314a}
.cm-k{margin-top:10px;padding-left:12px;border-left:2px solid #e8edf2}
.cm-k .cm-k{padding-left:0;border-left:0}
.cm-more{display:block;margin:4px 0 10px;font-weight:700;font-size:13px;color:#f45b97}
.cm-f{display:flex;gap:10px;margin:6px 0 10px}
.cm-f input{flex:1;min-width:0;height:46px;border:1px solid var(--ln);border-radius:16px;padding:0 16px;font:inherit;outline:0;color:var(--tx);background:#fff}
.cm-f button{width:56px;height:46px;border-radius:16px;background:#f45b97;color:#fff;display:grid;place-items:center;flex:none}
.cm-f svg{width:20px;height:20px}
.cm-off{color:var(--mu);font-size:13px}
.cm-fio{display:block;font-size:10px;font-weight:300;color:#9aa1a9;margin-top:1px}
.cm-b{position:relative}
.cm-b>b{padding-right:34px}
.cm-b .pm-w{position:absolute;top:4px;right:4px}
.pm-w{display:inline-flex;align-items:center;flex:none}
.pm-b{width:34px;height:34px;padding:0;border:0;border-radius:50%;background:transparent;color:#8a94a3;display:grid;place-items:center;cursor:pointer}
.pm-b:hover{background:rgba(0,0,0,.06)}
.pm-h{display:none!important}
.pf-tm,.fd-tm{white-space:nowrap}
#pm-pop{position:fixed;z-index:10000;min-width:170px;padding:6px;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.18)}
#pm-pop button{display:block;width:100%;padding:11px 14px;border:0;border-radius:10px;background:transparent;text-align:left;font:inherit;color:#1f2937;cursor:pointer}
#pm-pop button:hover{background:#f2f4f8}
#pm-pop button.dg{color:#e5314a}
.pf-hd>.pm-w{position:absolute;top:10px;right:14px;z-index:3}`;
document.head.appendChild(css);

const form=(pid,par)=>`<form class="cm-f" data-pid="${pid}" data-par="${par||''}"><input placeholder="${par?'Ответить…':'Написать комментарий…'}" maxlength="500" aria-label="Комментарий"><button aria-label="Отправить">${SEND}</button></form>`;
function item(c,post,off){
  const n=st.nm[c.user_id]||{name:'Участник'},name=n.name||'Участник',L=st.lk[c.id]||[],on=L.includes(st.me.id),
    can=c.user_id===st.me.id||post.owner===st.me.id||st.mod,kids=(st.c[post.id]||[]).filter(k=>k.parent_id===c.id);
  return `<div class="cm-i" data-cid="${c.id}"><button class="cm-a" data-cu="${c.user_id}" aria-label="Профиль" style="background-color:${PAL[hs(name)%7]};${n.avatar_url?`background-image:url('${esc(n.avatar_url)}')`:''}">${n.avatar_url?'':esc(ini(name))}</button>
  <div class="cm-bw"><div class="cm-b">${CMT.dots((c.user_id!==st.me.id?'<button data-crep>Пожаловаться</button>':'')+(can?'<button data-cd data-danger>Удалить</button>':''))}<b data-cu="${c.user_id}">${esc(name)}</b>${n.fio?`<span class="cm-fio">${esc(n.fio)}</span>`:''}<p>${esc(c.body)}</p>
  <div class="cm-m"><span>${dt(c.created_at)}</span>${off?'':'<button data-cr>Ответить</button>'}<button data-cl class="${on?'on':''}">${HEART}${L.length}</button></div></div>
  ${st.rep===String(c.id)&&!off?form(post.id,c.id):''}${kids.length?`<div class="cm-k">${kids.map(k=>item(k,post,off)).join('')}</div>`:''}</div></div>`;
}
window.CMT={
  mod:()=>st.mod,
  n:id=>(st.c[id]||[]).length,
  async load(SB,me,ids,cb){
    st.me=me;st.cb=cb;st.c={};st.lk={};
    if(st.modOf!==me.id){const m=await SB.from('moderators').select('user_id').eq('user_id',me.id).maybeSingle();st.mod=!!m.data;st.modOf=me.id}
    if(!ids.length)return;
    const r=await SB.from('post_comments').select('id,post_id,user_id,body,created_at,parent_id').in('post_id',ids).order('created_at',{ascending:false}).limit(500);
    if(r.error){toast('Комментарии не загрузились: '+r.error.message);return}
    const cs=(r.data||[]).reverse(),cid=cs.map(c=>c.id),uid=[...new Set(cs.map(c=>c.user_id))];
    const [lk,nm]=await Promise.all([
      cid.length?SB.from('comment_likes').select('comment_id,user_id').in('comment_id',cid):null,
      uid.length?SB.from('profiles').select('id,name,fio,avatar_url').in('id',uid):null]);
    if(nm&&nm.error)toast('Профили: '+nm.error.message);
    cs.forEach(c=>(st.c[c.post_id]||(st.c[c.post_id]=[])).push(c));
    ((lk&&lk.data)||[]).forEach(l=>(st.lk[l.comment_id]||(st.lk[l.comment_id]=[])).push(l.user_id));
    ((nm&&nm.data)||[]).forEach(x=>st.nm[x.id]=x);
  },
  html(pid,owner,off){
    if(!st.me)return'';
    const top=(st.c[pid]||[]).filter(c=>!c.parent_id),sh=st.open[pid]?top:top.slice(0,3),post={id:pid,owner};
    return '<div class="cm" data-pid="'+pid+'">'+sh.map(c=>item(c,post,off)).join('')+
      (top.length>3?'<button class="cm-more" data-cmore>'+(st.open[pid]?'Скрыть комментарии':'Показать комментарии ('+top.length+')')+'</button>':'')+
      (off?'<div class="cm-off">Автор отключил комментарии</div>':form(pid,''))+'</div>';
  }
};
  CMT.report=function(kind,id,uid){
  if(document.getElementById('rp-bg'))return;
  const R=['Оскорбления или травля','Спам или реклама','Неприемлемый контент','Другое'];
  const o=document.createElement('div');o.id='rp-bg';
  o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;justify-content:center;align-items:center;padding:16px';
  o.innerHTML=`<div style="background:#fff;border-radius:22px;width:100%;max-width:380px;padding:22px;color:#1f2937">
    <h3 style="margin:0 0 4px;font-size:20px;font-weight:800">Пожаловаться</h3>
    <div style="color:#7a8594;font-size:13px;margin-bottom:12px">${kind==='post'?'На публикацию':kind==='profile'?'На аккаунт':'На комментарий'}. Модераторы посмотрят жалобу.</div>
    ${R.map(r=>`<button data-r="${r}" style="display:block;width:100%;text-align:left;padding:13px 14px;margin-bottom:8px;border:1px solid #e6e9ef;border-radius:14px;background:#fff;font:inherit;cursor:pointer">${r}</button>`).join('')}
    <button data-x style="width:100%;padding:12px;border:0;border-radius:14px;background:#f2f4f8;font:inherit;font-weight:700;cursor:pointer">Отмена</button></div>`;
  o.onclick=async e=>{
    if(e.target===o||e.target.closest('[data-x]')){o.remove();return}
    const r=e.target.closest('[data-r]');if(!r)return;
    o.remove();
    const q=await window.SB.from('reports').insert({kind,target_id:id,target_user:uid||null,reason:r.dataset.r});
    toast(q.error?(q.error.code==='23505'?'Вы уже жаловались на это':'Не отправилось: '+q.error.message):'Жалоба отправлена, спасибо');
  };
  document.body.appendChild(o);
};
CMT.dots=h=>h?'<span class="pm-w"><button class="pm-b" data-pmenu aria-label="Ещё"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/></svg></button><span class="pm-h" hidden>'+h+'</span></span>':'';
document.addEventListener('click',e=>{
  const pop=document.getElementById('pm-pop'),it=e.target.closest('[data-pmi]'),b=e.target.closest('[data-pmenu]');
  if(pop&&it){const s=pop._s[+it.dataset.pmi];pop.remove();s.click();return}
  if(pop){pop.remove();if(b&&pop._b===b)return}
  if(!b)return;
  const s=[...b.parentNode.querySelectorAll('.pm-h button')];if(!s.length)return;
  const m=document.createElement('div');m.id='pm-pop';m._b=b;m._s=s;
  m.innerHTML=s.map((x,i)=>'<button data-pmi="'+i+'"'+(x.hasAttribute('data-danger')?' class="dg"':'')+'>'+esc(x.textContent)+'</button>').join('');
  document.body.appendChild(m);
  const r=b.getBoundingClientRect();
  m.style.top=Math.min(r.bottom+4,innerHeight-m.offsetHeight-8)+'px';
  m.style.right=Math.max(8,innerWidth-r.right)+'px';
});
window.addEventListener('scroll',()=>{const p=document.getElementById('pm-pop');if(p)p.remove()},true);
document.addEventListener('click',async e=>{
  const t=e.target,b=k=>t.closest(k),box=b('.cm');if(!box)return;
  const SB=window.SB;let x;
  if((x=b('[data-cu]'))){if(window.MS)MS.show('prof');if(window.PF)PF.open(x.dataset.cu)}
  else if(b('[data-cmore]')){const p=box.dataset.pid;st.open[p]=!st.open[p];redraw()}
  else if(b('[data-cr]')){const id=b('.cm-i').dataset.cid;st.rep=st.rep===id?null:id;redraw();const i=document.querySelector('.cm-f[data-par="'+id+'"] input');if(i)i.focus()}
  else if(b('[data-cl]')){
    const id=+b('.cm-i').dataset.cid,L=st.lk[id]||(st.lk[id]=[]),on=L.includes(st.me.id);
    if(on)L.splice(L.indexOf(st.me.id),1);else L.push(st.me.id);redraw();
    const r=on?await SB.from('comment_likes').delete().match({comment_id:id,user_id:st.me.id}):await SB.from('comment_likes').insert({comment_id:id});
    if(r.error){if(on)L.push(st.me.id);else L.splice(L.indexOf(st.me.id),1);redraw();toast('Не получилось: '+r.error.message)}
  }
    else if(b('[data-crep]')){
    const i=+b('.cm-i').dataset.cid,c=Object.values(st.c).flat().find(z=>z.id===i);
    CMT.report('comment',i,c&&c.user_id);
  }
  else if(b('[data-cd]')){
    const id=+b('.cm-i').dataset.cid;if(!confirm('Удалить комментарий?'))return;
    const r=await SB.from('post_comments').delete().eq('id',id).select();
    if(r.error||!r.data.length)return toast('Не удалось удалить: '+(r.error?r.error.message:'нет прав'));
    const gone=new Set([id]);let n;
    do{n=0;for(const p in st.c)st.c[p]=st.c[p].filter(c=>{const g=gone.has(c.id)||gone.has(c.parent_id);if(g&&!gone.has(c.id))gone.add(c.id);if(g)n=1;return !g})}while(n);
    redraw();
  }
});
document.addEventListener('submit',async e=>{
  const f=e.target.closest('.cm-f');if(!f)return;e.preventDefault();
  const inp=f.querySelector('input'),body=inp.value.trim();if(!body)return;
  const SB=window.SB,pid=+f.dataset.pid,par=f.dataset.par?+f.dataset.par:null;
  inp.disabled=true;
  const r=await SB.from('post_comments').insert({post_id:pid,body,parent_id:par}).select('id,post_id,user_id,body,created_at,parent_id').single();
  if(r.error){inp.disabled=false;toast('Не отправилось: '+r.error.message);return}
  if(!st.nm[st.me.id]){const q=await SB.from('profiles').select('id,name,fio,avatar_url').eq('id',st.me.id).maybeSingle();if(q.data)st.nm[st.me.id]=q.data}
  (st.c[pid]||(st.c[pid]=[])).push(r.data);st.rep=null;st.open[pid]=1;redraw();
});
})();
