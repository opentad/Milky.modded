/* FreshMilk — раздел видеохостинга.
   Лимиты меняются в одном месте, вот здесь: */
(function(){
const LIM={
  maxMin:10,      // длительность, минут
  maxMB:150,      // вес видео, МБ
  maxSide:720,    // качество: меньшая сторона кадра (1280x720 или 720x1280)
  coverMB:5,      // вес обложки, МБ
  titleMax:100, descMax:2000, tagsMax:10
};

const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const mb=b=>(b/1048576).toFixed(1).replace('.',',');

/* ---------- хранилище (внутри браузера) ---------- */
let dbp=null;
const db=()=>dbp||(dbp=new Promise((ok,no)=>{
  const r=indexedDB.open('freshmilk',1);
  r.onupgradeneeded=()=>{r.result.createObjectStore('meta',{keyPath:'id'});r.result.createObjectStore('file')};
  r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}));
const tx=(st,mode,fn)=>db().then(d=>new Promise((ok,no)=>{
  const t=d.transaction(st,mode),r=fn(t);
  t.oncomplete=()=>ok(r&&r.result);t.onerror=t.onabort=()=>no(t.error)}));
const all=()=>tx('meta','readonly',t=>t.objectStore('meta').getAll());
const getFile=id=>tx('file','readonly',t=>t.objectStore('file').get(id));
const save=(m,f)=>tx(['meta','file'],'readwrite',t=>{t.objectStore('meta').put(m);t.objectStore('file').put(f,m.id)});
const del=id=>tx(['meta','file'],'readwrite',t=>{t.objectStore('meta').delete(id);t.objectStore('file').delete(id)});
const upd=m=>tx('meta','readwrite',t=>t.objectStore('meta').put(m));

/* ---------- стили ---------- */
const st=document.createElement('style');
st.textContent=`
#v-fm{padding-bottom:70px}
.fm-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;background:linear-gradient(110deg,#fff 35%,#d7f3fc);border-radius:28px;padding:28px 34px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.fm-hero small{display:flex;gap:10px;align-items:center;color:var(--cy);font-weight:600;font-size:13px}
.fm-hero small svg{width:24px;height:24px}
.fm-hero h1{font-weight:800;font-size:36px;color:#34404e;margin:6px 0 8px}
.fm-hero p{font-size:14px;color:#7b838c;max-width:560px;line-height:1.5}
.fm-bar{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:22px 0 4px}
.fm-tabs{display:inline-flex;gap:6px;background:#eef3f8;border-radius:20px;padding:6px}
.fm-tabs button{height:38px;padding:0 20px;border-radius:14px;color:#8a929b;font-weight:600;font-size:14px}
.fm-tabs button.on{background:#fff;color:var(--cy);box-shadow:0 3px 14px rgba(0,0,0,.06)}
.fm-q{flex:1;min-width:200px;height:46px;border:1px solid #e3e8ee;border-radius:18px;padding:0 18px;font:inherit;color:#566170;background:#fff;outline:0}
.fm-sh{font-size:15px;font-weight:600;margin:22px 0 12px}
.fm-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
.fm-g.v{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
.fm-c{background:#fff;border-radius:22px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;cursor:pointer}
.fm-th{position:relative;aspect-ratio:16/9;background:#eaf6fd center/cover no-repeat}
.fm-g.v .fm-th{aspect-ratio:9/16}
.fm-th i{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(255,255,255,.9);display:grid;place-items:center;opacity:0;transition:opacity .15s}
.fm-th i::after{content:"";border-left:14px solid var(--cy);border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:4px}
.fm-c:hover .fm-th i{opacity:1}
.fm-du{position:absolute;right:8px;bottom:8px;background:rgba(20,40,60,.78);color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-in{padding:12px 14px 14px}
.fm-in b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;font-weight:600;line-height:1.3}
.fm-in small{display:block;color:var(--mu);font-size:11px;margin-top:4px}
.fm-tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.fm-tg span{background:var(--pl);color:var(--bt);border-radius:10px;padding:2px 9px;font-size:11px;font-weight:600;cursor:pointer}
.fm-mod{position:fixed;inset:0;background:rgba(15,25,35,.55);display:grid;place-items:center;z-index:40;padding:16px;overflow:auto}
.fm-box{background:#fff;border-radius:25px;padding:26px;width:min(560px,100%);max-height:94vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.2)}
.fm-box h3{font-size:20px;font-weight:700;margin-bottom:6px}
.fm-rules{font-size:12px;color:var(--mu);margin-bottom:14px;line-height:1.5}
.fm-drop{display:block;border:1.5px dashed #bfe6f3;border-radius:16px;padding:26px 12px;text-align:center;color:var(--bt);font-weight:600;cursor:pointer;background:#f8fcfe}
.fm-info{font-size:13px;color:#566170;margin:10px 0 0;line-height:1.6}
.fm-err{color:#d97706;font-weight:600;font-size:13px;margin:10px 0 0;min-height:18px}
.fm-box .l{display:block;font-weight:600;font-size:13px;margin:16px 0 6px}
.fm-box input.t,.fm-box textarea{width:100%;border:1px solid #dfe5ea;border-radius:12px;padding:12px;font:inherit;outline:0}
.fm-box textarea{height:90px;resize:vertical}
.fm-cv{display:flex;gap:14px;align-items:flex-start}
.fm-cv img{height:110px;max-width:200px;border-radius:12px;background:#eaf6fd;object-fit:cover}
.fm-cv div{flex:1;min-width:0}
.fm-cv input[type=range]{width:100%}
.fm-row{display:flex;gap:10px;justify-content:flex-end;margin-top:18px;flex-wrap:wrap}
.fm-btn{height:40px;padding:0 22px;border-radius:20px;background:var(--cy);color:#fff;font-weight:700;font-size:14px}
.fm-btn.g{background:#eef3f8;color:#566170}
.fm-btn:disabled{background:#e9eef2;color:#a9b2bb}
.fm-pl{background:#fff;border-radius:25px;overflow:hidden;width:min(900px,100%)}
.fm-pl.v{width:min(420px,100%)}
.fm-pl video{width:100%;max-height:72vh;background:#000;display:block}
.fm-ds{font-size:14px;line-height:1.6;color:#566170;margin-top:12px}
@media(max-width:640px){.fm-hero{padding:22px 20px}.fm-hero h1{font-size:28px}}`;
document.head.appendChild(st);

const sec=document.createElement('section');
sec.id='v-fm';sec.hidden=true;
document.querySelector('.main').appendChild(sec);

let list=[],tab='all',q='',fail=false;
const urls={};
const cu=m=>urls[m.id]||(urls[m.id]=URL.createObjectURL(m.cover));

/* ---------- окна ---------- */
function modal(html,sticky){
  const m=document.createElement('div');m.className='fm-mod';m.innerHTML=html;
  m.close=()=>{m.onclose&&m.onclose();m.remove()};
  if(!sticky)m.addEventListener('mousedown',e=>{if(e.target===m)m.close()});
  document.body.appendChild(m);return m;
}

/* ---------- разбор видео и обложек ---------- */
const probe=f=>new Promise((ok,no)=>{
  const v=document.createElement('video'),u=URL.createObjectURL(f);
  v.preload='metadata';v.muted=true;
  v.onloadedmetadata=()=>ok({v,u,dur:v.duration,w:v.videoWidth,h:v.videoHeight});
  v.onerror=()=>{URL.revokeObjectURL(u);no()};
  v.src=u;
});
const frame=(v,t)=>new Promise(ok=>{
  v.onseeked=()=>{
    const k=Math.min(1,960/Math.max(v.videoWidth,v.videoHeight)),c=document.createElement('canvas');
    c.width=Math.round(v.videoWidth*k);c.height=Math.round(v.videoHeight*k);
    c.getContext('2d').drawImage(v,0,0,c.width,c.height);
    c.toBlob(ok,'image/jpeg',.85);
  };
  v.currentTime=t;
});
const img2blob=f=>new Promise((ok,no)=>{
  const i=new Image(),u=URL.createObjectURL(f);
  i.onload=()=>{
    const k=Math.min(1,960/Math.max(i.width,i.height)),c=document.createElement('canvas');
    c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);
    c.getContext('2d').drawImage(i,0,0,c.width,c.height);
    URL.revokeObjectURL(u);c.toBlob(ok,'image/jpeg',.88);
  };
  i.onerror=()=>{URL.revokeObjectURL(u);no()};
  i.src=u;
});
const parseTags=s=>[...new Set(s.split(/[\s,]+/)
  .map(x=>x.replace(/^#+/,'').toLowerCase().replace(/[^a-zа-яё0-9_]/g,'').slice(0,30))
  .filter(Boolean))];

/* ---------- загрузка ---------- */
function upload(){
  const m=modal(`<div class="fm-box"><h3>Загрузить видео</h3>
    <div class="fm-rules">До ${LIM.maxMin} минут · до ${LIM.maxMB} МБ · качество до ${LIM.maxSide}p (1280×720 или вертикальное 720×1280) · mp4 или webm</div>
    <label class="fm-drop">Выбрать видео<input type="file" id="vf" accept="video/mp4,video/webm" hidden></label>
    <div class="fm-info" id="info"></div>
    <div class="fm-err" id="e"></div>
    <div id="form" hidden>
      <span class="l">Обложка</span>
      <div class="fm-cv"><img id="cvi" alt="">
        <div><input type="range" id="sl" min="0" max="1" step="0.1" value="0"><div class="fm-rules" style="margin:4px 0 8px">Двигай ползунок, чтобы выбрать кадр из видео, или загрузи свою картинку</div>
        <label class="fm-btn g" style="display:inline-flex;align-items:center;cursor:pointer">Своя картинка<input type="file" id="cf" accept="image/*" hidden></label></div></div>
      <label class="l" for="ti">Название</label><input class="t" id="ti" maxlength="${LIM.titleMax}" placeholder="Например: Опыт с водой">
      <label class="l" for="de">Описание</label><textarea id="de" maxlength="${LIM.descMax}" placeholder="О чём это видео?"></textarea>
      <label class="l" for="tg">Хэштеги</label><input class="t" id="tg" placeholder="#физика #опыт (до ${LIM.tagsMax})">
    </div>
    <div class="fm-row"><button class="fm-btn g" id="cn">Отмена</button><button class="fm-btn" id="pub" disabled>Опубликовать</button></div>
  </div>`,true);
  const g=s=>m.querySelector(s);
  let P=null,cover=null,coverUrl=null;
  const err=t=>g('#e').textContent=t||'';
  const setCover=b=>{cover=b;if(coverUrl)URL.revokeObjectURL(coverUrl);coverUrl=URL.createObjectURL(b);g('#cvi').src=coverUrl};
  m.onclose=()=>{if(P)URL.revokeObjectURL(P.u);if(coverUrl)URL.revokeObjectURL(coverUrl)};
  g('#cn').onclick=()=>m.close();

  g('#vf').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    err();g('#form').hidden=true;g('#pub').disabled=true;g('#info').textContent='Проверяем видео…';
    if(P){URL.revokeObjectURL(P.u);P=null}
    if(f.size>LIM.maxMB*1048576){g('#info').textContent='';return err('Файл весит '+mb(f.size)+' МБ, а можно не больше '+LIM.maxMB+' МБ.')}
    let p;try{p=await probe(f)}catch(x){g('#info').textContent='';return err('Не удалось прочитать видео. Нужен mp4 (H.264) или webm.')}
    if(!isFinite(p.dur)||p.dur<=0){URL.revokeObjectURL(p.u);g('#info').textContent='';return err('Не удалось определить длительность видео.')}
    if(p.dur>LIM.maxMin*60+0.5){URL.revokeObjectURL(p.u);g('#info').textContent='';return err('Видео длится '+mmss(p.dur)+', а можно не больше '+LIM.maxMin+' минут.')}
    if(Math.min(p.w,p.h)>LIM.maxSide){URL.revokeObjectURL(p.u);g('#info').textContent='';return err('Качество '+p.w+'×'+p.h+' выше '+LIM.maxSide+'p. Сожми видео до 1280×720 (вертикальное — до 720×1280).')}
    P={...p,f};
    g('#info').innerHTML=esc(f.name)+'<br>'+mmss(p.dur)+' · '+p.w+'×'+p.h+' · '+mb(f.size)+' МБ · '+(p.h>p.w?'вертикальное':'горизонтальное');
    const sl=g('#sl');sl.max=p.dur.toFixed(1);sl.value=Math.min(1,p.dur/2);
    g('#form').hidden=false;g('#pub').disabled=false;
    setCover(await frame(p.v,+sl.value));
  };
  g('#sl').onchange=async e=>{if(P)setCover(await frame(P.v,+e.target.value))};
  g('#cf').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;err();
    if(f.size>LIM.coverMB*1048576)return err('Обложка весит больше '+LIM.coverMB+' МБ.');
    try{setCover(await img2blob(f))}catch(x){err('Не удалось открыть картинку.')}
  };
  g('#pub').onclick=async()=>{
    err();
    const title=g('#ti').value.trim(),desc=g('#de').value.trim(),tg=parseTags(g('#tg').value);
    if(!P)return err('Сначала выбери видео.');
    if(title.length<3)return err('Напиши название (минимум 3 символа).');
    if(tg.length>LIM.tagsMax)return err('Хэштегов не больше '+LIM.tagsMax+'.');
    if(!cover)return err('Нужна обложка.');
    const btn=g('#pub');btn.disabled=true;btn.textContent='Сохраняем…';
    const mt={id:Date.now().toString(36),title,desc,tags:tg,vert:P.h>P.w,dur:P.dur,w:P.w,h:P.h,size:P.f.size,created:Date.now(),views:0,cover};
    try{await save(mt,P.f)}
    catch(x){btn.disabled=false;btn.textContent='Опубликовать';return err('Браузер не смог сохранить видео: не хватает места. Попробуй видео поменьше.')}
    m.close();render();
  };
}

/* ---------- просмотр ---------- */
async function open(id){
  const x=list.find(a=>a.id===id);if(!x)return;
  const blob=await getFile(id);if(!blob)return;
  const u=URL.createObjectURL(blob);
  x.views=(x.views||0)+1;upd(x).catch(()=>{});
  const m=modal(`<div class="fm-pl${x.vert?' v':''}"><video src="${u}" controls autoplay playsinline></video>
    <div class="fm-in" style="padding:18px 22px 22px"><b style="font-size:18px;-webkit-line-clamp:3">${esc(x.title)}</b>
    <small>${x.views} просм. · ${new Date(x.created).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})} · ${x.w}×${x.h}</small>
    <div class="fm-tg">${x.tags.map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>
    ${x.desc?`<p class="fm-ds">${esc(x.desc).replace(/\n/g,'<br>')}</p>`:''}
    <div class="fm-row"><button class="fm-btn g" data-del>Удалить</button><button class="fm-btn" data-x>Закрыть</button></div></div></div>`);
  m.onclose=()=>{const v=m.querySelector('video');v.pause();v.removeAttribute('src');URL.revokeObjectURL(u);paint()};
  m.onclick=async e=>{
    const t=e.target.closest('[data-tag]');
    if(t){q='#'+t.dataset.tag;const i=$('#fm-q');if(i)i.value=q;m.close();return}
    if(e.target.closest('[data-x]'))m.close();
    else if(e.target.closest('[data-del]')&&confirm('Удалить это видео насовсем?')){
      await del(id);if(urls[id]){URL.revokeObjectURL(urls[id]);delete urls[id]}
      m.close();render();
    }
  };
}

/* ---------- страница ---------- */
const card=x=>`<div class="fm-c" data-o="${x.id}"><div class="fm-th" style="background-image:url('${cu(x)}')"><i></i><span class="fm-du">${mmss(x.dur)}</span></div>
  <div class="fm-in"><b>${esc(x.title)}</b><small>${x.views||0} просм. · ${new Date(x.created).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}</small>
  ${x.tags.length?`<div class="fm-tg">${x.tags.slice(0,3).map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}</div></div>`;

function paint(){
  const box=$('#fm-list');if(!box)return;
  const s=q.replace(/^#/,'').toLowerCase();
  const f=list.filter(x=>!s||x.title.toLowerCase().includes(s)||x.tags.some(t=>t.includes(s)));
  const H=f.filter(x=>!x.vert),V=f.filter(x=>x.vert);
  const grid=(a,c)=>`<div class="fm-g ${c}">${a.map(card).join('')}</div>`;
  let h='';
  if(tab!=='v'&&H.length)h+=(tab==='all'?'<div class="fm-sh">Видео</div>':'')+grid(H,'');
  if(tab!=='h'&&V.length)h+=(tab==='all'?'<div class="fm-sh">Вертикальные</div>':'')+grid(V,'v');
  box.innerHTML=h||`<div class="fr">${fail?'Браузер не даёт сохранять видео (возможно, приватное окно).':list.length?'Ничего не найдено':'Пока здесь пусто. Загрузи первое видео!'}</div>`;
}

async function render(){
  fail=false;
  try{list=(await all()).sort((a,b)=>b.created-a.created)}catch(e){list=[];fail=true}
  sec.innerHTML=`<div class="fm-hero"><div><small>${window.MS?MS.ic('tube'):''}FreshMilk</small><h1>FreshMilk</h1>
    <p>Видео школы: до ${LIM.maxMin} минут, качество до ${LIM.maxSide}p. Горизонтальные и вертикальные ролики. Сейчас видео: ${list.length}.</p></div>
    <button class="sw" id="fm-up">Загрузить видео</button></div>
    <div class="fm-bar"><div class="fm-tabs">${[['all','Все'],['h','Видео'],['v','Вертикальные']].map(b=>`<button data-tab="${b[0]}" class="${b[0]===tab?'on':''}">${b[1]}</button>`).join('')}</div>
    <input class="fm-q" id="fm-q" placeholder="Поиск по названию или #хэштегу" value="${esc(q)}"></div>
    <div id="fm-list"></div>`;
  paint();
}

sec.addEventListener('click',e=>{
  const t=e.target;
  if(t.closest('#fm-up'))return upload();
  const tb=t.closest('[data-tab]');
  if(tb){tab=tb.dataset.tab;sec.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b===tb));return paint()}
  const tg=t.closest('[data-tag]');
  if(tg){q='#'+tg.dataset.tag;$('#fm-q').value=q;return paint()}
  const c=t.closest('[data-o]');
  if(c)open(c.dataset.o);
});
sec.addEventListener('input',e=>{if(e.target.id==='fm-q'){q=e.target.value;paint()}});

/* ---------- подключение к меню ---------- */
window.RV=window.RV||{};
window.RV.fm=render;
$('#drawer').addEventListener('click',e=>{
  const b=e.target.closest('.mi');
  if(b&&b.textContent.trim()==='FreshMilk'){document.body.classList.remove('menu');MS.show('fm')}
});
})();
