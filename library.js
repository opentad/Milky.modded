(function(){
const $=s=>document.querySelector(s);
const KEY='milky_lib_v2',MY='milky_lib_my';
try{localStorage.removeItem('milky_lib_v1')}catch(e){}
let books=[],my={};
try{books=JSON.parse(localStorage.getItem(KEY))}catch(e){}
try{my=JSON.parse(localStorage.getItem(MY))||{}}catch(e){}
if(!Array.isArray(books))books=[];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(books));localStorage.setItem(MY,JSON.stringify(my))}catch(e){}};
const esc=t=>String(t).replace(/[<>&"]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[m]));
const hue=t=>{let x=7;for(const ch of t)x=(x*31+ch.charCodeAt(0))>>>0;return x%360};
const cover=(b,cls)=>{const h=hue(b.title);return `<div class="lb-cv ${cls||''}" style="background:linear-gradient(160deg,hsl(${h},70%,62%),hsl(${(h+35)%360},65%,44%))"><span>${esc(b.title)}</span></div>`};
const who=()=>(window.ME_NAME||'').trim()||'Автор';
const per=()=>window.matchMedia('(max-width:700px)').matches?1:2;
const avg=b=>b.rc?(b.rs/b.rc).toFixed(1).replace('.',',')+' ★ · оценок: '+b.rc:'Пока нет оценок';
const PLUS='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
const PEN='<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1zM14.5 6.5l3 3"/></svg>';
const UPL='<svg viewBox="0 0 24 24"><path d="M7.5 3.5h6.8l4.7 4.7v9.8a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3V6.5a3 3 0 0 1 3-3zM12 17v-6M9.5 13.5L12 11l2.5 2.5"/></svg>';
const BACK='<svg viewBox="0 0 24 24"><path d="M12 6l-6 6 6 6M19 6l-6 6 6 6"/></svg>';

const st=document.createElement('style');st.textContent=`
#v-lib{padding-bottom:70px}
.sw.lb-up{display:inline-flex;align-items:center;gap:8px}.sw svg{width:15px;height:15px}
.lb-hb{display:flex;gap:10px;flex-wrap:wrap}
.lb-up.g{background:#fff;color:var(--cy);border:1.5px solid var(--cy)}
.lb-it{cursor:pointer}
.lb-ed{width:36px;height:36px;border-radius:50%;background:var(--pl);color:var(--cy);display:grid;place-items:center;flex:none}.lb-ed svg{width:16px;height:16px}
.lb-ok{margin-top:16px;padding:12px 18px;border-radius:14px;background:#e7f6e5;color:var(--ok);font-weight:600;font-size:13px}
.lb-g{display:grid;grid-template-columns:300px 1fr;gap:22px;margin-top:22px;align-items:start}
.lb-books{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.lb-b{text-align:left;background:#fff;border-radius:20px;padding:12px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.lb-b b{display:block;font-size:14px;font-weight:600;margin:10px 4px 2px;line-height:1.25}
.lb-b small{display:block;font-size:11px;color:var(--mu);margin:0 4px 4px}
.lb-cv{position:relative;border-radius:6px 12px 12px 6px;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.15)}
.lb-cv::before{content:'';position:absolute;left:0;top:0;bottom:0;width:8%;background:rgba(0,0,0,.18)}
.lb-cv span{position:relative;padding:0 14px;line-height:1.2;font-size:15px}
.lb-b .lb-cv{aspect-ratio:3/4}
.lb-it{display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:8px;border:1px solid var(--ln);border-radius:14px;margin-bottom:8px}
.lb-it .lb-cv{width:42px;height:56px;flex:none}.lb-it .lb-cv span{font-size:6px;padding:0 4px}
.lb-it div{flex:1;min-width:0}.lb-it b{display:block;font-size:13px;font-weight:600;line-height:1.2}
.lb-it small{display:block;font-size:10px;color:var(--mu);margin-top:3px}
.lb-it em{font-style:normal;font-size:11px;font-weight:700;color:var(--bt)}
.lb-n{width:14px;font-style:normal;font-weight:700;color:var(--cy);font-size:13px}
.lb-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.lb-bar .r{display:flex;gap:10px;flex-wrap:wrap}
.lb-btn{height:36px;padding:0 18px;border-radius:18px;background:var(--cy);color:#fff;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:8px}
.lb-btn.gn{background:#2fbf5a}.lb-btn svg{width:16px;height:16px}
.lb-btn.big{height:46px;padding:0 38px;font-size:15px;align-self:flex-start;margin-top:14px}
.lb-info{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 110px);border-radius:25px;overflow:hidden;background:#fff;box-shadow:0 6px 30px rgba(0,0,0,.08)}
.lb-l{background:radial-gradient(circle at 30% 20%,#1c3a5c,#0b1626);display:grid;place-items:center;padding:30px}
.lb-l .lb-cv{width:min(100%,340px,calc(60vh*.75));aspect-ratio:3/4;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.lb-l .lb-cv span{font-size:26px}
.lb-r{padding:40px 36px;display:flex;flex-direction:column;gap:8px;overflow:auto}
.lb-r h1{font-weight:800;font-size:30px;color:#34404e;margin:0;line-height:1.15}
.lb-au{font-size:13px;color:var(--mu)}
.lb-r h3{font-size:14px;font-weight:600;color:var(--hd);margin-top:14px}
.lb-r p{font-size:14px;line-height:1.7;color:#566170}
.lb-stars{display:flex;gap:2px;align-items:center;margin-top:10px}
.lb-st{font-size:32px;line-height:1;color:#d5dbe0;padding:0 2px}.lb-st.on{color:#f5b81c}
.lb-avg{font-size:13px;font-weight:600;color:#566170}
.lb-tt{display:flex;align-items:center;gap:10px;justify-content:center;margin:20px 0 6px}
.lb-tt h2{font-size:22px;font-weight:700;color:#34404e}
.lb-tt input{font:inherit;font-size:22px;font-weight:700;color:#34404e;border:0;border-bottom:2px solid var(--cy);outline:0;background:transparent;text-align:center;max-width:80vw}
.lb-pen{width:34px;height:34px;border-radius:50%;background:var(--pl);color:var(--cy);display:grid;place-items:center}.lb-pen svg{width:16px;height:16px}
.lb-desc{display:block;width:100%;max-width:980px;margin:6px auto 0;height:56px;border:1px solid #dfe5ea;border-radius:14px;padding:10px 14px;font:inherit;font-size:13px;resize:none;outline:0;background:#fff}
.lb-sp{display:grid;grid-template-columns:1fr 1fr;max-width:980px;margin:10px auto 0;background:#fffdf7;border-radius:18px;box-shadow:0 14px 50px rgba(0,0,0,.12);overflow:hidden;position:relative}
.lb-sp::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:40px;margin-left:-20px;background:linear-gradient(90deg,transparent,rgba(0,0,0,.08),transparent);pointer-events:none}
.lb-sp.one{grid-template-columns:1fr;max-width:560px}
.lb-sp.one::after{display:none}.lb-sp.one .pgw+.pgw{display:none}
.pgw{position:relative}
.pg{display:block;width:100%;height:min(60vh,470px);border:0;outline:0;resize:none;background:transparent;padding:30px 32px 10px;font:inherit;font-size:14px;line-height:1.7;color:#34404e}
.pn{text-align:center;font-size:11px;color:var(--mu);padding:0 0 12px}
.meas{position:absolute;left:0;top:0;visibility:hidden;pointer-events:none}
.lb-nav{display:flex;gap:16px;justify-content:center;align-items:center;margin:18px 0;font-size:13px;color:#566170}
.lb-nav .go:disabled{opacity:.4}
@media(max-width:820px){.lb-g{grid-template-columns:1fr}}
@media(max-width:700px),(orientation:portrait){.lb-info{grid-template-columns:1fr;min-height:0}.lb-l{padding:24px}.lb-r{padding:24px 20px}}
@media(max-width:560px){.lb-books{grid-template-columns:repeat(2,1fr)}.pg{padding:24px 20px 10px}}`;
document.head.appendChild(st);

const sec=document.createElement('section');sec.id='v-lib';sec.hidden=true;$('.main').appendChild(sec);
let ret='list',mode='list',cur=null,pages=[''],sp=0,title='Без названия',desc='',ro=false,tas=[],meas=null,flash='',lastP=per();

function listV(){
  const top=[...books].sort((a,b)=>b.reads-a.reads).slice(0,5),all=[...books].sort((a,b)=>b.date-a.date);
  const ok=flash?`<div class="lb-ok">${esc(flash)}</div>`:'';flash='';
  sec.innerHTML=`<div class="top"><div><div class="cap">Милки</div><h1>Библиотека</h1></div><button class="sw lb-up" data-a="new">${PLUS}Загрузить</button></div>${ok}
  <div class="lb-g"><section class="card"><div class="hd"><h2>Топ книг недели</h2></div><div class="hd2">Самые читаемые</div>${top.length?top.map((b,i)=>`<button class="lb-it" data-o="${b.id}"><i class="lb-n">${i+1}</i>${cover(b)}<div><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div><em>Открыть ›</em></button>`).join(''):'<div class="fr">Пока пусто</div>'}</section>
  <section><h2 class="sec" style="margin-top:0">Книги участников</h2>${all.length?`<div class="lb-books">${all.map(b=>`<button class="lb-b" data-o="${b.id}">${cover(b)}<b>${esc(b.title)}</b><small>${esc(b.author)}</small></button>`).join('')}</div>`:'<div class="card">Книг пока нет. Нажми «Загрузить» и опубликуй первую!</div>'}</section></div>`;
}
function mineV(){
  const mb=books.filter(b=>b.own||b.author===who()).sort((a,b)=>b.date-a.date);
  const ok=flash?`<div class="lb-ok">${esc(flash)}</div>`:'';flash='';
  sec.innerHTML=`<div class="top"><div><div class="cap">Библиотека</div><h1>Мои работы</h1></div><div class="lb-hb"><button class="back" id="lb-back" style="margin:0">${BACK}Назад</button><button class="sw lb-up" data-a="new">${PLUS}Загрузить</button></div></div>${ok}
  <section class="card" style="margin-top:22px;max-width:560px"><div class="hd2">Нажми на карандашик, чтобы изменить работу</div>${mb.length?mb.map((b,i)=>`<div class="lb-it" data-o="${b.id}"><i class="lb-n">${i+1}</i>${cover(b)}<div><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div><button class="lb-ed" data-e="${b.id}" aria-label="Изменить">${PEN}</button></div>`).join(''):'<div class="fr">У тебя пока нет работ. Нажми «Загрузить» и опубликуй первую!</div>'}</section>`;
}
function infoV(){
  const b=cur,mine=my[b.id]||0,dt=new Date(b.date).toLocaleDateString('ru');
  sec.innerHTML=`<button class="back" id="lb-back" style="margin:0 0 12px">${BACK}Назад</button>
  <div class="lb-info"><div class="lb-l">${cover(b)}</div><div class="lb-r"><div class="lb-au">${esc(b.author)} · опубликовано ${dt}</div><h1>${esc(b.title)}</h1>
  <div class="lb-stars">${[1,2,3,4,5].map(i=>`<button class="lb-st${i<=mine?' on':''}" data-r="${i}" aria-label="Оценка ${i}">★</button>`).join('')}</div>
  <div class="lb-avg">${avg(b)}${mine?' · твоя оценка: '+mine:' · нажми на звезду, чтобы оценить'}</div>
  <h3>Описание</h3><p>${b.desc?esc(b.desc).replace(/\n/g,'<br>'):'Описания нет.'}</p>
  <button class="lb-btn big" id="lb-read">Читать</button></div></div>`;
}
function editV(){
  const ph=ro?'':' placeholder="Пиши здесь…"',r=ro?' readonly':'';
  lastP=per();
  sec.innerHTML=`<div class="lb-bar"><button class="back" id="lb-back" style="margin:0">${BACK}Назад</button><div class="r">${ro?'':`<button class="lb-btn" id="lb-word">${UPL}Загрузить из Word</button><button class="lb-btn gn" id="lb-pub">${cur?'Сохранить':'Опубликовать'}</button>`}</div></div>
  <div class="lb-tt" id="lb-tt"></div>${ro?'':'<textarea class="lb-desc" id="lb-desc" maxlength="500" placeholder="Описание книги: о чём она (по желанию)"></textarea>'}<div class="fb" id="lb-msg" style="text-align:center"></div>
  <div class="lb-sp"><div class="pgw"><textarea class="pg meas" tabindex="-1" aria-hidden="true"></textarea><textarea class="pg" data-i="0"${r}${ph}></textarea><div class="pn"></div></div><div class="pgw"><textarea class="pg" data-i="1"${r}></textarea><div class="pn"></div></div></div>
  <div class="lb-nav"><button class="go" id="lb-pv">‹</button><span id="lb-n"></span><button class="go" id="lb-nx">›</button></div><input type="file" id="lb-file" accept=".docx" hidden>`;
  tas=[...sec.querySelectorAll('textarea.pg:not(.meas)')];meas=sec.querySelector('.meas');
  if(!ro)sec.querySelector('#lb-desc').value=desc;
  if(mode==='read'||cur)pages=paginate(cur.text);
  if(per()===2&&pages.length%2)pages.push('');
  tt();fill();
}
const render=()=>{if(mode==='list'||mode==='mine')ret=mode;mode==='list'?listV():mode==='mine'?mineV():mode==='info'?infoV():editV();window.scrollTo(0,0)};
const msg=(t,ok)=>{const m=$('#lb-msg');if(m){m.className='fb '+(ok?'ok2':'bad');m.textContent=t}};
function tt(){$('#lb-tt').innerHTML='<h2>'+esc(title)+'</h2>'+(ro?'':'<button class="lb-pen" id="lb-pen" aria-label="Изменить название">'+PEN+'</button>')}
function editTitle(){
  const box=$('#lb-tt');box.innerHTML='<input maxlength="60" value="'+esc(title)+'">';
  const i=box.firstChild;let d=0;i.focus();i.select();
  i.onblur=()=>{if(d)return;d=1;title=i.value.trim()||'Без названия';tt()};
  i.onkeydown=e=>{if(e.key==='Enter')i.blur()};
}
function fits(t){meas.value=t;return meas.scrollHeight<=meas.clientHeight+1}
function paginate(text){
  const tk=text.match(/\S+\s*|\s+/g)||[],out=[];let i=0;
  while(i<tk.length){
    let lo=1,hi=tk.length-i,best=0;
    while(lo<=hi){const m=(lo+hi)>>1;if(fits(tk.slice(i,i+m).join(''))){best=m;lo=m+1}else hi=m-1}
    if(!best){const w=tk[i];let a=1,b=w.length,c=1;while(a<=b){const m=(a+b)>>1;if(fits(w.slice(0,m))){c=m;a=m+1}else b=m-1}
      out.push(w.slice(0,c));tk[i]=w.slice(c);if(!tk[i])i++;continue}
    out.push(tk.slice(i,i+best).join(''));i+=best;
  }
  return out.length?out:[''];
}
function fill(){
  const P=per(),pn=sec.querySelectorAll('.pn');
  sec.querySelector('.lb-sp').classList.toggle('one',P===1);
  [0,1].forEach(k=>{const v=pages[P*sp+k]||'';if(tas[k].value!==v)tas[k].value=v;pn[k].textContent=P*sp+k+1});
  $('#lb-n').textContent=(P===1?(sp+1):(2*sp+1)+'–'+Math.min(2*sp+2,pages.length))+' из '+pages.length;
  $('#lb-pv').disabled=sp===0;$('#lb-nx').disabled=P*(sp+1)>=pages.length;
}
function openBook(id){cur=books.find(b=>b.id===id);if(!cur)return;mode='info';render()}
function readBook(){cur.reads++;save();title=cur.title;ro=true;sp=0;mode='read';render()}
function editBook(id){cur=books.find(b=>b.id===id);if(!cur)return;title=cur.title;desc=cur.desc||'';sp=0;ro=false;mode='edit';render()}
function newBook(){cur=null;title='Без названия';desc='';pages=[''];sp=0;ro=false;mode='edit';render()}
function rate(r){const id=cur.id,old=my[id];if(old)cur.rs-=old;else cur.rc++;cur.rs+=r;my[id]=r;save();infoV()}
function publish(){
  const text=pages.join('').trim();
  if(title==='Без названия'){msg('Дай книге название: карандашик над разворотом.',0);return}
  if(text.length<20){msg('Напиши хотя бы пару предложений.',0);return}
  if(cur){cur.title=title;cur.text=text;cur.desc=desc.trim();save();flash='Изменения сохранены ✓';mode='mine';render();return}
  books.unshift({id:Date.now(),own:1,title,author:who(),text,desc:desc.trim(),reads:0,rs:0,rc:0,date:Date.now()});
  save();flash='Книга «'+title+'» опубликована ✓';mode='list';render();
}
const loadM=()=>new Promise((ok,no)=>{if(window.mammoth)return ok();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});

sec.addEventListener('click',e=>{
  const c=k=>e.target.closest(k);
  if(c('[data-e]'))editBook(+c('[data-e]').dataset.e);
  else if(c('[data-a="mine"]')){mode='mine';render()}
  else if(c('[data-o]'))openBook(+c('[data-o]').dataset.o);
  else if(c('[data-a="new"]'))newBook();
  else if(c('[data-r]'))rate(+c('[data-r]').dataset.r);
  else if(c('#lb-read'))readBook();
  else if(c('#lb-back')){mode=mode==='read'?'info':((mode==='info'||mode==='edit')&&ret==='mine')?'mine':'list';render()}
  else if(c('#lb-pen'))editTitle();
  else if(c('#lb-pv')){sp=Math.max(0,sp-1);fill()}
  else if(c('#lb-nx')){if(per()*(sp+1)<pages.length){sp++;fill()}}
  else if(c('#lb-word'))$('#lb-file').click();
  else if(c('#lb-pub'))publish();
});
sec.addEventListener('input',e=>{
  const ta=e.target;
  if(ta.id==='lb-desc'){desc=ta.value;return}
  if(!ta.classList.contains('pg')||ta.classList.contains('meas')||ro)return;
  const P=per(),k=+ta.dataset.i,p=P*sp+k,caret=ta.selectionStart;
  while(pages.length<=p)pages.push('');
  pages[p]=ta.value;
  const np=paginate(pages.slice(p).join(''));pages.splice(p,pages.length-p,...np);
  if(P===2&&pages.length%2)pages.push('');
  if(np.length>1&&caret>np[0].length){
    const off=caret-np[0].length;let nk=k+1;if(nk>=P){sp++;nk=0}
    fill();tas[nk].focus();tas[nk].setSelectionRange(off,off);
  }else{fill();ta.setSelectionRange(caret,caret)}
});
sec.addEventListener('change',async e=>{
  if(e.target.id!=='lb-file')return;const f=e.target.files[0];if(!f)return;
  msg('Читаю файл…',1);
  try{
    await loadM();
    const r=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()});
    pages=paginate(r.value.trim());if(per()===2&&pages.length%2)pages.push('');sp=0;
    if(title==='Без названия'){title=f.name.replace(/\.docx$/i,'');tt()}
    fill();msg('Готово. Страниц: '+pages.length,1);
  }catch(err){msg('Не получилось прочитать файл. Нужен формат .docx',0)}
  e.target.value='';
});
addEventListener('resize',()=>{
  if(sec.hidden||(mode!=='edit'&&mode!=='read'))return;
  const P=per();if(P===lastP)return;lastP=P;
  pages=paginate(pages.join(''));if(P===2&&pages.length%2)pages.push('');sp=0;fill();
});
window.RV=window.RV||{};window.RV.lib=()=>{mode='list';render()};
})();
