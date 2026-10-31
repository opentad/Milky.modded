/* FreshMilk: Flashes, короткие вертикальные видео.
   Видео лежит на GitHub (его туда кладёт Edge Function upload-video),
   название, обложка и просмотры хранятся в таблице flashes (Supabase).
   Все лимиты меняются здесь: */
(function(){
const LIM={
  maxSec:60,     // длительность, секунд
  maxMB:25,      // вес видео, МБ
  maxSide:720,   // качество: меньшая сторона кадра (720x1280)
  coverMB:5,     // вес своей обложки, МБ
  titleMax:100, descMax:1000, tagsMax:10,
  freshMin:3     // сколько минут после загрузки видео «обрабатывается»
};
const FN='upload-video';
const URL_OK=/^https:\/\/[a-z0-9-]+\.github\.io\//i;
const COVER_OK=/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/;
const $=s=>document.querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const mb=b=>(b/1048576).toFixed(1).replace('.',',');
const dt=s=>new Date(s).toLocaleDateString('ru-RU',{day:'numeric',month:'long'});

/* ---------- стили ---------- */
const st=document.createElement('style');
st.textContent=`
#v-fm{padding-bottom:70px}
.fm-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;background:linear-gradient(110deg,#fff 35%,#d7f3fc);border-radius:28px;padding:28px 34px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.fm-hero small{display:flex;gap:10px;align-items:center;color:var(--cy);font-weight:600;font-size:13px}
.fm-hero small svg{width:24px;height:24px}
.fm-hero h1{font-weight:800;font-size:36px;color:#34404e;margin:6px 0 8px}
.fm-hero p{font-size:14px;color:#7b838c;max-width:560px;line-height:1.5}
.fm-msg{margin-top:14px;padding:12px 18px;border-radius:16px;background:#e7f6e5;color:var(--ok);font-weight:600;font-size:13px}
.fm-msg:empty{display:none}
.fm-panel{background:rgba(255,255,255,.75);backdrop-filter:blur(10px);border-radius:25px;padding:22px;box-shadow:0 6px 30px rgba(0,0,0,.04);margin-top:18px}
.fm-rules{font-size:12px;color:var(--mu);margin-bottom:14px;line-height:1.5}
.fm-info{font-size:13px;color:#566170;margin:10px 0 0;line-height:1.6}
.fm-err{color:#d97706;font-weight:600;font-size:13px;margin:10px 0 0;min-height:18px}
.fm-form{display:flex;gap:22px;margin-top:14px;flex-wrap:wrap}
.fm-cvi{flex:none;width:120px;aspect-ratio:9/16;border-radius:14px;background:#eaf6fd center top/cover no-repeat}
.fm-fld{flex:1;min-width:240px}
.fm-fld .l{display:block;font-weight:600;font-size:13px;margin:12px 0 6px}
.fm-fld .l:first-child{margin-top:0}
.fm-fld input.t,.fm-fld textarea{width:100%;border:1px solid #dfe5ea;border-radius:12px;padding:12px;font:inherit;outline:0}
.fm-fld textarea{height:80px;resize:vertical}
.fm-fld input[type=range]{width:100%;margin-bottom:8px}
.fm-row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
.fm-btn{height:40px;padding:0 22px;border-radius:20px;background:var(--cy);color:#fff;font-weight:700;font-size:14px}
.fm-btn.g{background:#eef3f8;color:#566170}
.fm-btn.r{background:#e5314a;color:#fff}
.fm-btn:disabled{background:#e9eef2;color:#a9b2bb}
.fm-bar{margin:22px 0 4px}
.fm-q{width:100%;height:46px;border:1px solid #e3e8ee;border-radius:18px;padding:0 18px;font:inherit;color:#566170;background:#fff;outline:0}
.fm-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px;margin-top:14px}
.fm-c{background:#fff;border-radius:22px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;cursor:pointer}
.fm-th{position:relative;aspect-ratio:9/16;background:#eaf6fd center top/cover no-repeat}
.fm-th i{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(255,255,255,.9);display:grid;place-items:center;opacity:0;transition:opacity .15s}
.fm-th i::after{content:"";border-left:14px solid var(--cy);border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:4px}
.fm-c:hover .fm-th i{opacity:1}
.fm-du{position:absolute;right:8px;bottom:8px;background:rgba(20,40,60,.78);color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-nw{position:absolute;left:8px;top:8px;background:#fff4e0;color:#c9730f;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-in{padding:12px 14px 14px}
.fm-in b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;font-weight:600;line-height:1.3}
.fm-in small{display:block;color:var(--mu);font-size:11px;margin-top:4px}
.fm-tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.fm-tg span{background:var(--pl);color:var(--bt);border-radius:10px;padding:2px 9px;font-size:11px;font-weight:600;cursor:pointer}
.fm-plw{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.fm-pv{position:relative;flex:none;width:min(100%,calc(74vh * 9 / 16));aspect-ratio:9/16;border-radius:20px;overflow:hidden;background:#000}
.fm-pv video{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.fm-pe{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:#fff;font-weight:600;background:rgba(0,0,0,.7)}
.fm-pi{flex:1;min-width:220px}
.fm-pi b{display:block;font-size:20px;font-weight:700;line-height:1.3}
.fm-pi small{display:block;color:var(--mu);font-size:12px;margin-top:6px}
.fm-ds{font-size:14px;line-height:1.6;color:#566170;margin-top:12px}
.fm-plw{justify-content:center}
.fm-wr{width:min(100%,calc74vh * 9 / 16))}
.fm-pv{width:100%;border-radius:24px}
.fm-pv video{cursor:pointer}
.fm-pe{z-index:1}
.fm-pe[hidden]{display:none}
.fm-xx{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;font-size:16px;z-index:3}
.fm-bt{position:absolute;left:0;right:64px;bottom:0;padding:50px 14px 16px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.7));z-index:2}
.fm-au{font-weight:700;font-size:15px}
.fm-tt{display:block;margin-top:6px;font-size:14px;font-weight:600;cursor:pointer}
.fm-bt .fm-tg span{background:none;color:#fff;padding:0;margin-right:4px}
.fm-side{position:absolute;right:8px;bottom:80px;display:flex;flex-direction:column;gap:18px;align-items:center;color:#fff;z-index:2;font-size:12px;font-weight:600}
.fm-lk{display:flex;flex-direction:column;align-items:center;gap:4px;color:#fff}
.fm-lk svg{width:30px;height:30px}
.fm-lk.on{color:#3fc3ee}
.fm-dp{position:absolute;left:0;right:0;bottom:0;max-height:75%;overflow:auto;background:#fff;border-radius:20px 20px 0 0;padding:16px;z-index:4}
@media(max-width:640px){.fm-hero{padding:22px 20px}.fm-hero h1{font-size:28px}}`;
document.head.appendChild(st);

const sec=document.createElement('section');
sec.id='v-fm';sec.hidden=true;
document.querySelector('.main').appendChild(sec);

/* ---------- состояние и связь с Supabase ---------- */
let list=[],q='',uid=null,loadErr=false,openId=null,msgT=null;
const ready=()=>new Promise(ok=>{
  if(window.SB)return ok(window.SB);
  let n=0;const t=setInterval(()=>{if(window.SB||++n>120){clearInterval(t);ok(window.SB||null)}},250);
});
const say=t=>{const m=$('#fm-msg');if(!m)return;m.textContent=t;clearTimeout(msgT);msgT=setTimeout(()=>{m.textContent=''},9000)};
const fnErr=async e=>{try{const j=await e.context.json();if(j&&j.error)return j.error}catch(x){}return 'Не удалось загрузить видео. Проверь интернет и попробуй ещё раз.'};
const fresh=x=>Date.now()-new Date(x.created_at)<LIM.freshMin*60000;
const waitTxt=s=>{const t=Math.ceil(s/60),h=Math.floor(t/60),m=t%60;return h?h+' ч '+m+' мин':m+' мин'};
const parseTags=s=>[...new Set(s.split(/[\s,]+/)
  .map(x=>x.replace(/^#+/,'').toLowerCase().replace(/[^a-zа-яё0-9_]/g,'').slice(0,30))
  .filter(Boolean))];

/* ---------- разбор видео и обложек ---------- */
const probe=f=>new Promise((ok,no)=>{
  const v=document.createElement('video'),u=URL.createObjectURL(f);
  v.preload='auto';v.muted=true;v.playsInline=true;
  const t=setTimeout(()=>{URL.revokeObjectURL(u);no()},8000);
  v.onloadedmetadata=()=>{clearTimeout(t);ok({v,u,dur:v.duration,w:v.videoWidth,h:v.videoHeight})};
  v.onerror=()=>{clearTimeout(t);URL.revokeObjectURL(u);no()};
  v.src=u;
});
const shot=(src,w,h)=>{
  const k=Math.min(1,640/Math.max(w,h)),c=document.createElement('canvas');
  c.width=Math.round(w*k);c.height=Math.round(h*k);
  c.getContext('2d').drawImage(src,0,0,c.width,c.height);
  return c.toDataURL('image/jpeg',.72);
};
const frame=(v,t)=>new Promise(ok=>{
  let done=false;const fin=()=>{if(!done){done=true;ok(shot(v,v.videoWidth,v.videoHeight))}};
  v.addEventListener('seeked',fin,{once:true});setTimeout(fin,2500);
  v.currentTime=t;
});
const imgCover=f=>new Promise((ok,no)=>{
  const i=new Image(),u=URL.createObjectURL(f);
  i.onload=()=>{URL.revokeObjectURL(u);ok(shot(i,i.width,i.height))};
  i.onerror=()=>{URL.revokeObjectURL(u);no()};
  i.src=u;
});

/* ---------- страница ---------- */
function shell(){
  sec.innerHTML=`<div class="fm-hero"><div><small>${window.MS?MS.ic('tube'):''}FreshMilk</small><h1>Flashes</h1>
    <p>Короткие вертикальные видео школы: до ${LIM.maxSec} секунд, качество до ${LIM.maxSide}p. Квадратные тоже подходят.</p></div>
    <button class="sw" id="fm-new">Загрузить Flash</button></div>
    <div class="fm-msg" id="fm-msg"></div>
    <div class="fm-panel" id="fm-up" hidden>
      <div class="fm-rules">До ${LIM.maxSec} секунд, до ${LIM.maxMB} МБ, вертикальное или квадратное, не выше ${LIM.maxSide}p (720×1280), формат mp4 или mov. Чтобы видео прошло, сними его в настройках камеры в качестве HD (720p).</div>
      <div class="fm-err" id="lim"></div>
      <label class="fm-btn g" id="vfl" style="display:inline-flex;align-items:center;cursor:pointer">Выбрать видео<input type="file" id="vf" accept="video/mp4,video/quicktime,.mp4,.mov" hidden></label>
      <div class="fm-info" id="info"></div>
      <div class="fm-err" id="e"></div>
      <div class="fm-form" id="form" hidden>
        <div class="fm-cvi" id="cvi"></div>
        <div class="fm-fld">
          <span class="l">Обложка: выбери кадр или свою картинку</span>
          <input type="range" id="sl" min="0" max="1" step="0.1" value="0">
          <label class="fm-btn g" style="display:inline-flex;align-items:center;cursor:pointer">Своя картинка<input type="file" id="cf" accept="image/*" hidden></label>
          <label class="l" for="ti">Название</label><input class="t" id="ti" maxlength="${LIM.titleMax}" placeholder="Например: Опыт с водой">
          <label class="l" for="de">Описание</label><textarea id="de" maxlength="${LIM.descMax}" placeholder="О чём это видео?"></textarea>
          <label class="l" for="tg">Хэштеги</label><input class="t" id="tg" placeholder="#физика #опыт (до ${LIM.tagsMax})">
        </div>
      </div>
      <div class="fm-row"><button class="fm-btn" id="pub" disabled>Опубликовать</button><button class="fm-btn g" id="cn">Отмена</button></div>
    </div>
    <div class="fm-panel" id="fm-pl" hidden></div>
    <div class="fm-bar"><input class="fm-q" id="fm-q" placeholder="Поиск по названию, автору или #хэштегу" value="${esc(q)}"></div>
    <div id="fm-list"></div>`;
  initUpload();
}

const bg=c=>COVER_OK.test(c||'')?` style="background-image:url('${c}')"`:'';
const card=x=>`<div class="fm-c" data-o="${esc(x.id)}"><div class="fm-th"${bg(x.cover)}>${fresh(x)?'<span class="fm-nw">Обрабатывается</span>':''}<i></i><span class="fm-du">${mmss(x.dur)}</span></div>
  <div class="fm-in"><b>${esc(x.title)}</b><small>${esc(x.author)}</small><small>${x.views||0} просм., ${dt(x.created_at)}</small>
  ${(x.tags||[]).length?`<div class="fm-tg">${x.tags.slice(0,3).map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}</div></div>`;

function paint(){
  const box=$('#fm-list');if(!box)return;
  const s=q.replace(/^#/,'').toLowerCase();
  const f=list.filter(x=>!s||(x.title||'').toLowerCase().includes(s)||(x.author||'').toLowerCase().includes(s)||(x.tags||[]).some(t=>t.includes(s)));
  box.innerHTML=f.length?`<div class="fm-g">${f.map(card).join('')}</div>`
    :`<div class="fr">${loadErr?'Flashes не загрузились. Обнови страницу.':list.length?'Ничего не найдено.':'Здесь пока пусто. Загрузи первый Flash!'}</div>`;
}

async function loadList(){
  const S=await ready();loadErr=false;
  if(!S){loadErr=true;list=[];return paint()}
  try{
    if(!uid){const u=await S.auth.getUser();uid=u.data&&u.data.user?u.data.user.id:null}
    const r=await S.from('flashes')
      .select('id,user_id,author,title,description,tags,url,cover,dur,w,h,views,created_at')
      .order('created_at',{ascending:false}).limit(60);
    if(r.error)throw r.error;
    list=r.data||[];
  }catch(e){list=[];loadErr=true}
  paint();
}

/* ---------- загрузка ---------- */
function initUpload(){
  const box=$('#fm-up'),g=s=>box.querySelector(s);
  let P=null,cover='',busy=false;
  const err=t=>{g('#e').textContent=t||''};
  const setCover=d=>{cover=d;g('#cvi').style.backgroundImage="url('"+d+"')"};
  const drop=()=>{
    if(P){URL.revokeObjectURL(P.u);P=null}
    cover='';g('#vf').value='';g('#cf').value='';g('#info').textContent='';err();
    g('#form').hidden=true;g('#pub').disabled=true;
    g('#ti').value='';g('#de').value='';g('#tg').value='';
  };
  const checkLimit=async()=>{
    g('#lim').textContent='';g('#vfl').hidden=false;
    const S=await ready();if(!S)return;
    try{
      const r=await S.rpc('flash_wait');
      const left=r&&!r.error?Number(r.data)||0:0;
      if(left>0){g('#lim').textContent='Один Flash в сутки. Следующий можно загрузить через '+waitTxt(left)+'.';g('#vfl').hidden=true}
    }catch(x){}
  };
  $('#fm-new').onclick=()=>{box.hidden=!box.hidden;if(!box.hidden){box.scrollIntoView({behavior:'smooth',block:'nearest'});checkLimit()}};
  g('#cn').onclick=()=>{if(busy)return;drop();box.hidden=true};

  g('#vf').onchange=async e=>{
    const f=e.target.files[0];if(!f||busy)return;
    err();g('#form').hidden=true;g('#pub').disabled=true;
    if(P){URL.revokeObjectURL(P.u);P=null}
    g('#info').textContent='Проверяем видео…';
    const bad=t=>{g('#info').textContent='';err(t)};
    const ext=(f.name.split('.').pop()||'').toLowerCase();
    if(!['mp4','mov'].includes(ext))return bad('Нужен файл mp4 или mov.');
    if(f.size>LIM.maxMB*1048576)return bad('Файл весит '+mb(f.size)+' МБ, а можно не больше '+LIM.maxMB+' МБ.');
    let p;try{p=await probe(f)}catch(x){return bad('Не удалось прочитать видео. Нужен mp4 (H.264).')}
    const no=t=>{URL.revokeObjectURL(p.u);bad(t)};
    if(!isFinite(p.dur)||p.dur<=0)return no('Не удалось определить длительность видео.');
    if(p.dur>LIM.maxSec+.5)return no('Видео длится '+mmss(p.dur)+', а можно не больше '+mmss(LIM.maxSec)+'.');
    if(p.w>p.h)return no('Видео горизонтальное. В Flashes можно только вертикальные и квадратные.');
    if(Math.min(p.w,p.h)>LIM.maxSide)return no('Качество '+p.w+'×'+p.h+' выше '+LIM.maxSide+'p. Сними заново в HD (720p): в настройках камеры выбери «HD», а не «FHD» или «4K».');
    P={...p,f};
    g('#info').textContent=f.name+': '+mmss(p.dur)+', '+p.w+'×'+p.h+', '+mb(f.size)+' МБ, '+(p.h>p.w?'вертикальное':'квадратное');
    const sl=g('#sl');sl.max=p.dur.toFixed(1);sl.value=Math.min(1,p.dur/2);
    g('#form').hidden=false;g('#pub').disabled=false;
    setCover(await frame(p.v,+sl.value));
  };
  g('#sl').onchange=async e=>{if(P&&!busy)setCover(await frame(P.v,+e.target.value))};
  g('#cf').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;err();
    if(f.size>LIM.coverMB*1048576)return err('Обложка весит больше '+LIM.coverMB+' МБ.');
    try{setCover(await imgCover(f))}catch(x){err('Не удалось открыть картинку.')}
  };

  g('#pub').onclick=async()=>{
    if(busy)return;err();
    const title=g('#ti').value.trim(),desc=g('#de').value.trim(),tags=parseTags(g('#tg').value);
    if(!P)return err('Сначала выбери видео.');
    if(title.length<3)return err('Напиши название: минимум 3 символа.');
    if(tags.length>LIM.tagsMax)return err('Хэштегов не больше '+LIM.tagsMax+'.');
    const S=await ready();if(!S)return err('Нет связи с сервером. Обнови страницу.');
    busy=true;const b=g('#pub');b.disabled=true;b.textContent='Загружаем…';
    g('#info').textContent='Загружаем видео, не закрывай страницу. Это может занять до минуты.';
    const fail=t=>{busy=false;b.disabled=false;b.textContent='Опубликовать';g('#info').textContent='';err(t)};
    try{
      const fd=new FormData();fd.append('file',P.f,P.f.name);
      const up=await S.functions.invoke(FN,{body:fd});
      if(up.error)return fail(await fnErr(up.error));
      const url=up.data&&up.data.url;
      if(!url||!URL_OK.test(url))return fail('Сервер вернул странный ответ. Попробуй ещё раз.');
      const ins=await S.from('flashes').insert({author:window.ME_NAME||'Участник',title,description:desc,tags,url,cover,dur:P.dur,w:P.w,h:P.h,size:P.f.size});
      if(ins.error)return fail('Видео загружено, но запись не сохранилась. Сообщи об этом.');
    }catch(x){return fail('Что-то пошло не так. Попробуй ещё раз.')}
    busy=false;b.textContent='Опубликовать';drop();box.hidden=true;
    say('Flash опубликован. Видео заработает по ссылке через 1–2 минуты.');
    loadList();
  };
}

/* ---------- просмотр ---------- */
function closePlayer(){const pl=$('#fm-pl');if(!pl)return;pl.hidden=true;pl.innerHTML='';openId=null}
function openFlash(id){
  const x=list.find(a=>a.id===id),pl=$('#fm-pl');
  if(!x||!pl||!URL_OK.test(x.url||''))return;
  openId=id;
  const mine=uid&&x.user_id===uid;
  pl.hidden=false;
 pl.innerHTML=`<div class="fm-plw"><div class="fm-wr"><div class="fm-pv"><video src="${esc(x.url)}" autoplay loop playsinline></video><div class="fm-pe" hidden>Видео ещё обрабатывается. Подожди минуту-две и открой снова.</div>
  <button class="fm-xx" data-x>✕</button>
  <div class="fm-side"><button class="fm-lk" data-like><svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>Нравится</button><div>${(x.views||0)+1} просм.</div></div>
  <div class="fm-bt"><div class="fm-au">${esc(x.author)}</div><b class="fm-tt" data-info>${esc(x.title)}</b>
  ${(x.tags||[]).length?`<div class="fm-tg">${x.tags.map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}</div>
  <div class="fm-dp" hidden><div class="fm-row" style="margin:0 0 8px;justify-content:space-between;align-items:center"><b>Описание</b><button class="fm-btn g" data-dx>Закрыть</button></div>
  <b>${esc(x.title)}</b><small style="display:block;color:var(--mu);margin-top:6px">${(x.views||0)+1} просм., ${dt(x.created_at)}</small>
  ${x.description?`<p class="fm-ds">${esc(x.description).replace(/\n/g,'<br>')}</p>`:'<p class="fm-ds">Описания нет.</p>'}</div></div>
  ${mine?'<div class="fm-row"><button class="fm-btn g" data-del>Удалить</button></div>':''}</div></div>`;
  pl.querySelector('video').onerror=()=>{pl.querySelector('.fm-pe').hidden=false};
  pl.scrollIntoView({behavior:'smooth',block:'start'});
  x.views=(x.views||0)+1;paint();
  ready().then(S=>S&&S.rpc('flash_view',{fid:id})).catch(()=>{});
}

sec.addEventListener('click',async e=>{
  const t=e.target;
  const tg=t.closest('[data-tag]');
  if(tg){q='#'+tg.dataset.tag;const i=$('#fm-q');if(i)i.value=q;return paint()}
   if(t.tagName==='VIDEO'){t.paused?t.play():t.pause();return}
  if(t.closest('[data-like]')){t.closest('[data-like]').classList.toggle('on');return}
  if(t.closest('[data-info]')){const dp=$('#fm-pl .fm-dp');if(dp)dp.hidden=false;return}
  if(t.closest('[data-dx]')){const dp=$('#fm-pl .fm-dp');if(dp)dp.hidden=true;return}
  const c=t.closest('[data-o]');
  if(c)return openFlash(c.dataset.o);
  if(t.closest('[data-x]'))return closePlayer();
  const d=t.closest('[data-del]');
  if(d){
    if(!d.dataset.sure){
      d.dataset.sure='1';d.textContent='Точно удалить?';d.classList.add('r');
      setTimeout(()=>{if(d.isConnected){delete d.dataset.sure;d.textContent='Удалить';d.classList.remove('r')}},4000);
      return;
    }
    const S=await ready();if(!S||!openId)return;
    const r=await S.from('flashes').delete().eq('id',openId);
    if(r.error)return say('Не удалось удалить Flash.');
    closePlayer();say('Flash удалён.');loadList();
  }
});
sec.addEventListener('input',e=>{if(e.target.id==='fm-q'){q=e.target.value;paint()}});

/* ---------- подключение к меню ---------- */
window.RV=window.RV||{};
window.RV.fm=()=>{shell();loadList()};
$('#drawer').addEventListener('click',e=>{
  const b=e.target.closest('.mi');
  if(b&&b.textContent.trim()==='FreshMilk'){document.body.classList.remove('menu');MS.show('fm')}
});
})();
