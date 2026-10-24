/* Милки-соцсеть: профиль. Секция #v-prof, Supabase через window.SB (из messenger.js). */
(function(){
const H0=location.hash;
const sec=document.createElement('section');sec.id='v-prof';sec.hidden=true;
document.querySelector('.main').appendChild(sec);
sec.innerHTML='<div class="pf-nt" id="pf-nt" hidden></div><div id="pf-c"></div><input type="file" id="pf-file" accept="image/*" hidden><input type="file" id="pf-pfile" accept="image/*" hidden>';
const $=s=>sec.querySelector(s);
const put=h=>{$('#pf-c').innerHTML=h};
const db=()=>window.SB;
const SBU='https://sjwvrljmqpbopbxqkhkl.supabase.co',SBK='sb_publishable_mWqrZq0Vw65Ahk7ZIbtlNQ_owreCtcj';
const BKT='avatars',VIEW=300,CR=130,OUT=800;

function getSB(){return new Promise(res=>{let n=0;const t=setInterval(()=>{
  if(!window.SB&&window.supabase)window.SB=window.supabase.createClient(SBU,SBK);
  if(window.SB){clearInterval(t);res(window.SB)}else if(++n>60){clearInterval(t);res(null)}},100)})}
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const SF=window.SF||(f=>String(f||'').trim().split(/\s+/).slice(0,2).join(' '));
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const col=n=>PAL[hs(n||'?')%PAL.length];
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const av=(p,c)=>`<span class="${c}" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}</span>`;
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t);return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()+' '+p2(d.getHours())+':'+p2(d.getMinutes())};
const seen=t=>{const d=Date.now()-Date.parse(t);if(!t||isNaN(d))return'';if(d<75000)return'В сети';const m=Math.floor(d/60000);if(m<60)return'Была '+m+' мин назад';const h=Math.floor(m/60);return h<24?'Была '+h+' ч назад':'Была '+Math.floor(h/24)+' дн назад'};
const cn=x=>x&&x[0]?x[0].count:0;
const IC={
 pen:'M4 20l4-1L19 8l-3-3L5 16z',
 heart:'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z',
 cmt:'M5 5h14v10H10l-5 4z',
 trash:'M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.5h9.2L17.5 7',
 cls:'M5 5h14v14H5zM8 9h8M8 13h5',
 coin:'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9.5 10h4a1.5 1.5 0 0 1 0 3h-3',
 bag:'M6 8h12l-1 11H7zM9 8V6a3 3 0 0 1 6 0v2',
 paint:'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3A9 9 0 0 0 12 3z',
 mark:'M7 4h10v16l-5-4-5 4z',
 gift:'M4 10h16v10H4zM3 7h18v3H3zM12 7v13',
 img:'M5 5h14v14H5zM8 9.5h.01M5 17l4.5-4.5 3 3 2.5-2.5 4 4'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;
let nt=0;
function note(t){const d=$('#pf-nt');d.textContent=t;d.hidden=false;clearTimeout(nt);nt=setTimeout(()=>d.hidden=true,4000)}
const setHash=k=>{try{history.replaceState(null,'','#/@'+encodeURIComponent(k))}catch(e){}};
new MutationObserver(()=>{if(sec.hidden&&location.hash.indexOf('#/@')===0)try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}).observe(sec,{attributes:true,attributeFilter:['hidden']});

const css=document.createElement('style');
css.textContent=`
#v-prof{--pk:#f45b97;--pkbg:#ffeaf2;--pkt:#d6407f;--c2:#f2f4f8;--sh:0 6px 30px rgba(0,0,0,.05);--ptx:var(--tx,#1f2937);--pmu:var(--mu,#7a8594);--pln:var(--ln,#e6e9ef);padding-bottom:70px}
#v-prof svg path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pf-nt{background:#fff0f5;color:var(--pkt);border-radius:14px;padding:10px 16px;margin-bottom:12px;font-size:13px;font-weight:600}
.pf-cv{height:230px;border-radius:26px 26px 0 0;background:linear-gradient(120deg,#e58bb3,#8f78c9) center/cover;position:relative;overflow:hidden}
.pf-cv.img{background-size:cover;background-position:center;image-rendering:-webkit-optimize-contrast}
.pf-cv:before,.pf-cv:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.16)}
.pf-cv:before{width:90px;height:90px;left:44%;top:60px}
.pf-cv:after{width:340px;height:340px;right:-60px;top:-120px}
.pf-cv.img:before,.pf-cv.img:after{display:none}
.pf-hd{position:relative;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;background:#fff;border-radius:0 0 26px 26px;padding:0 26px 22px;box-shadow:var(--sh)}
.pf-ava{flex:none;width:140px;position:relative;z-index:2}
.pf-big{position:relative;z-index:2;width:140px;height:140px;border-radius:50%;margin-top:-60px;border:6px solid #fff;display:grid;place-items:center;color:#fff;font-size:44px;font-weight:700;background-size:cover;background-position:center;flex:none;box-shadow:0 0 0 3px var(--pkbg)}
.pf-big.pf-me{cursor:pointer}
.pf-big.sq{border-radius:28px}
.pf-pl{display:block;width:180px;height:auto;aspect-ratio:500/166;margin:-34px 0 0 -10px;position:relative;z-index:3;border-radius:10px;object-fit:cover;box-shadow:0 4px 14px rgba(0,0,0,.18);image-rendering:-webkit-optimize-contrast}
.pf-w{flex:1 1 300px;min-width:0;padding-top:14px}
.pf-w h2{font-size:25px;font-weight:800;line-height:1.2;color:var(--ptx)}
.pf-fio{display:block;font-size:11px;font-weight:300;color:#9aa1a9;margin-top:2px}
.pf-nk{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px;color:var(--pmu);font-size:13px}
.pf-bd{display:inline-block;background:var(--pkbg);color:var(--pkt);border-radius:10px;padding:2px 10px;font-size:12px;font-weight:600}
.pf-st{margin:10px 0;color:var(--ptx);overflow-wrap:anywhere}
.pf-tg{display:flex;flex-wrap:wrap;gap:8px}
.pf-tg span{background:var(--pkbg);color:var(--pkt);border-radius:14px;padding:5px 13px;font-size:12.5px;font-weight:600}
.pf-sd{display:flex;gap:22px;align-items:center;padding-top:16px;flex-wrap:wrap}
.pf-ss{display:flex;gap:0;text-align:center}
.pf-ss>div{padding:0 20px;border-left:1px solid var(--pln)}
.pf-ss>div:first-child{border-left:0;padding-left:0}
.pf-ss b{display:block;font-size:21px;font-weight:800;color:var(--ptx)}
.pf-ss small{color:var(--pmu);font-size:11.5px}
.pf-b{height:46px;padding:0 22px;border-radius:15px;background:var(--pk);color:#fff;font-weight:700;display:inline-flex;gap:8px;align-items:center;justify-content:center;cursor:pointer;border:0}
.pf-b.g{background:var(--c2);color:var(--ptx)}
.pf-b:disabled{opacity:.6}
.pf-b svg{width:18px;height:18px}
.pf-bs{display:flex;gap:10px}
.pf-g{display:grid;grid-template-columns:250px minmax(0,1fr) 300px;gap:22px;margin-top:22px;align-items:start}
.pf-g.o{grid-template-columns:minmax(0,1fr) 300px}
.pf-x{background:#fff;border-radius:22px;padding:18px;box-shadow:var(--sh);margin-bottom:18px}
.pf-mn{padding:10px}
.pf-mi{display:flex;gap:12px;align-items:center;width:100%;padding:12px 14px;border-radius:14px;font-weight:700;color:var(--ptx);text-align:left;cursor:pointer;background:transparent;border:0;font:inherit}
.pf-mi svg{width:20px;height:20px;flex:none}
.pf-mi.on{background:var(--pkbg);color:var(--pkt)}
.pf-mi.off{color:var(--pmu);cursor:default}
.pf-mi small{margin-left:auto;font-size:11px;color:var(--pmu);font-weight:600}
.pf-comp{display:flex;gap:12px;align-items:flex-start}
.pf-comp .in{flex:1;min-width:0}
.pf-comp textarea{width:100%;height:84px;resize:none;background:var(--c2);border:0;border-radius:16px;padding:14px;font:inherit;outline:0;color:var(--ptx)}
.pf-comp .r{display:flex;justify-content:flex-end;margin-top:10px}
.pf-ph{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.pf-ph b{display:block;color:var(--ptx)}.pf-ph small{color:var(--pmu);font-size:12px}
.pf-a{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:14px;background-size:cover;background-position:center;flex:none}
.pf-p p{line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--ptx)}
.pf-ac{display:flex;gap:10px;margin-top:12px}
.pf-ac button{display:flex;gap:7px;align-items:center;height:38px;padding:0 14px;border-radius:12px;background:var(--c2);color:var(--pmu);font-weight:700;border:0;cursor:pointer}
.pf-ac button.on{color:var(--pk);background:var(--pkbg)}
.pf-ac button.dg{background:#ffe3e8;color:#d6407f}
.pf-ac svg{width:18px;height:18px}
.pf-sh{display:flex;justify-content:space-between;margin-bottom:10px}
.pf-sh h3{font-size:16px;font-weight:800;color:var(--ptx)}.pf-sh small{color:var(--pmu)}
.pf-pp{display:flex;gap:12px;align-items:center;width:100%;padding:7px 0;text-align:left;font-weight:600;color:var(--ptx);background:transparent;border:0;cursor:pointer}
.pf-mu{color:var(--pmu)}
.pf-em{color:var(--pmu);text-align:center;padding:24px 0}
.pf-ed{margin-top:18px}
.pf-eh{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.pf-eh h3{font-size:20px;font-weight:800;color:var(--ptx)}.pf-eh small{color:var(--pmu)}
.pf-f{display:grid;grid-template-columns:240px 1fr auto;gap:14px;align-items:center;padding:16px 0;border-top:1px solid var(--pln)}
.pf-f label b{display:block;color:var(--ptx)}.pf-f label small{color:var(--pmu);font-size:12px}
.pf-iw{position:relative}
.pf-f input,.pf-f textarea{width:100%;background:var(--c2);border:1px solid var(--pln);border-radius:14px;padding:15px 16px;font:inherit;outline:0;color:var(--ptx)}
.pf-iw input{padding-right:70px}
.pf-f textarea{height:96px;resize:none}
.pf-cnt{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--pmu)}
.pf-m{font-size:12px;margin-top:4px;color:#2fa876}.pf-m.e{color:#d6407f}
.pf-sw{width:54px;height:30px;border-radius:15px;background:#cfd5df;position:relative;border:0;cursor:pointer}
.pf-sw i{position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .15s}
.pf-sw.on{background:var(--pk)}.pf-sw.on i{transform:translateX(24px)}
.pf-cr{margin-top:18px;text-align:center}
.pf-cr h3{font-size:18px;font-weight:800;color:var(--ptx)}
.pf-cr small{display:block;color:var(--pmu);margin-top:2px}
.pf-cr canvas{display:block;width:300px;max-width:100%;height:auto;aspect-ratio:1;margin:12px auto;border-radius:18px;touch-action:none;cursor:grab;background:#e9edf3}
.pf-cr input[type=range]{width:min(300px,90%);accent-color:var(--pk)}
.pf-cr .r{display:flex;gap:10px;justify-content:center;margin-top:12px}
.pf-comp .r{gap:10px}
.pf-pv{display:flex;gap:12px;align-items:center;margin-top:10px}
.pf-pv img{width:64px;height:64px;border-radius:12px;object-fit:cover}
.pf-pimg{display:block;max-width:100%;border-radius:14px;margin-top:10px}
.pf-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;justify-content:center;align-items:center;padding:16px}
.pf-modal{background:#fff;border-radius:24px;width:100%;max-width:680px;max-height:85vh;overflow:auto;padding:24px;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.2)}
.pf-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.pf-modal-head h3{margin:0;font-size:22px;font-weight:800}
.pf-modal-close{border:0;background:#f0f2f5;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;font-weight:700}
.pf-p-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.pf-p-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px}
.pf-p-card img{width:100%;height:100px;object-fit:cover;border-radius:12px}
.pf-p-card-body{display:flex;justify-content:space-between;align-items:center}
.pf-p-card-title{font-weight:700;font-size:15px;color:var(--ptx)}
.pf-p-card-kind{font-size:11px;color:var(--pkt);background:var(--pkbg);padding:2px 8px;border-radius:8px;font-weight:600}
@media(max-width:1100px){.pf-g,.pf-g.o{grid-template-columns:1fr}.pf-mn{display:flex;flex-wrap:wrap}.pf-mi{width:auto}.pf-f{grid-template-columns:1fr}}
@media(max-width:640px){.pf-big{width:108px;height:108px;margin-top:-42px}.pf-cv{height:170px}.pf-ss>div{padding:0 12px}}`;
document.head.appendChild(css);

let tok=0,S=null;
const COLS='id,name,fio,nick,last_seen,status,tags,avatar_url,cover_url,comments_off,plate_url,ava_square';
async function render(u){
  const tk=++tok;
  put('<div class="pf-x pf-em">Загружаем…</div>');
  const SB=await getSB();if(tk!==tok)return;
  if(!SB){put('<div class="pf-x pf-em">Нет связи с сервером. Проверь интернет и обнови страницу.</div>');return}
  const me=(await SB.auth.getUser()).data.user;if(tk!==tok)return;
  if(!me){put('<div class="pf-x pf-em">Чтобы открыть профиль, войди в аккаунт.<br><button class="pf-b" data-go="1" style="margin:14px auto 0">Войти</button></div>');return}
  const key=u||me.id,q=SB.from('profiles').select(COLS);
  const pr=await(/^[0-9a-f-]{36}$/i.test(key)?q.eq('id',key):q.eq('nick',key)).maybeSingle();
  if(tk!==tok)return;
  if(pr.error||!pr.data){put('<div class="pf-x pf-em">'+(pr.error?'Не удалось загрузить: '+esc(pr.error.message)+'. Проверь, что SQL выполнен.':'Профиль не найден.')+'</div>');return}
  const id=pr.data.id,mine=id===me.id;
  const [np,nf,ng,fw,ps,fo,su]=await Promise.all([
    SB.from('posts').select('id',{count:'exact',head:true}).eq('user_id',id),
    SB.from('follows').select('follower',{count:'exact',head:true}).eq('followee',id),
    SB.from('follows').select('followee',{count:'exact',head:true}).eq('follower',id),
    mine?null:SB.from('follows').select('follower').match({follower:me.id,followee:id}).maybeSingle(),
    SB.from('posts').select('id,body,image_url,created_at,post_likes(count),post_comments(count)').eq('user_id',id).order('created_at',{ascending:false}).limit(50),
    SB.from('follows').select('follower').eq('followee',id).limit(6),
    SB.from('follows').select('followee').eq('follower',id).limit(6)]);
  if(tk!==tok)return;
  if(ps.error){put('<div class="pf-x pf-em">Не удалось загрузить: '+esc(ps.error.message)+'</div>');return}
  const ids=ps.data.map(x=>x.id),fol=(fo.data||[]).map(x=>x.follower),sub=(su.data||[]).map(x=>x.followee),all=[...new Set([...fol,...sub])];
  const [lk,nm]=await Promise.all([
    ids.length?SB.from('post_likes').select('post_id').eq('user_id',me.id).in('post_id',ids):null,
    all.length?SB.from('profiles').select('id,name,avatar_url').in('id',all):null,
    CMT.load(SB,me,ids,()=>S&&draw())]);
  if(tk!==tok)return;
  const M=Object.fromEntries(((nm&&nm.data)||[]).map(x=>[x.id,x]));
  S={me,id,mine,p:pr.data,np:np.count||0,nf:nf.count||0,ng:ng.count||0,fw:!!(fw&&fw.data),posts:ps.data,
     liked:new Set(((lk&&lk.data)||[]).map(x=>x.post_id)),fol:fol.map(i=>M[i]).filter(Boolean),sub:sub.map(i=>M[i]).filter(Boolean),
     ed:false,purchasesModal:false,purchasesList:[],ev:{},fm:{},draft:'',cd:null,crop:null,pimg:null};
  setHash(pr.data.nick||id);
  draw();
}
const ppl=(t,a,n)=>`<div class="pf-x"><div class="pf-sh"><h3>${t}</h3><small>${n}</small></div>${a.map(u=>`<button class="pf-pp" data-open="${u.id}">${av(u,'pf-a')}<span>${esc(u.name)}</span></button>`).join('')||'<small class="pf-mu">Пока никого</small>'}</div>`;
const mi=(k,t)=>`<div class="pf-mi off">${ic(k)}<span>${t}</span><small>скоро</small></div>`;

function editHtml(){
  const p=S.p,ev=S.ev;
  const F=[['nick','Никнейм','От 5 до 15 символов: латиница, цифры и _',p.nick||'',15],['status','Строка статуса','Показывается рядом с именем',p.status||'',120],['tags','Интересы','Разделяйте запятыми',(p.tags||[]).join(', '),0,1],['name','Имя в чате','От 2 до 30 символов',p.name||'',30]];
  return `<div class="pf-x pf-ed"><div class="pf-eh"><div><h3>Редактировать профиль</h3><small>Каждый параметр сохраняется отдельно</small></div><button class="pf-b g" data-x>Готово</button></div>`+
  `<div class="pf-f"><label><b>Фото профиля</b><small>Выбери фото и обрежь по кругу</small></label><span class="pf-mu">${p.avatar_url?'Фото загружено':'Пока нет фото'}</span><div class="pf-bs"><button class="pf-b" data-ava>Выбрать фото</button>${p.avatar_url?'<button class="pf-b g" data-avarm>Убрать</button>':''}</div></div>`+
  `<div class="pf-f"><label><b>Форма фото</b><small>Как показывать большое фото в профиле</small></label><span></span><div class="pf-bs"><button class="pf-b${p.ava_square?' g':''}" data-shape="0">Круг</button><button class="pf-b${p.ava_square?'':' g'}" data-shape="1">Квадрат</button></div></div>`+
  F.map(f=>{const v=ev[f[0]]!=null?ev[f[0]]:f[3],m=S.fm[f[0]];
    const ctl=f[5]?`<textarea data-k="${f[0]}">${esc(v)}</textarea>`:`<input data-k="${f[0]}" value="${esc(v)}" maxlength="${f[4]}"><span class="pf-cnt" data-c="${f[0]}">${v.length}/${f[4]}</span>`;
    return `<div class="pf-f"><label><b>${f[1]}</b><small>${f[2]}</small></label><div><div class="pf-iw">${ctl}</div><div class="pf-m${m&&m.e?' e':''}">${m?esc(m.t):''}</div></div><button class="pf-b" data-s="${f[0]}">Сохранить</button></div>`}).join('')+
  `<div class="pf-f"><label><b>Комментарии</b><small>Можно запретить комментарии под своими публикациями</small></label><span></span><button class="pf-sw${p.comments_off?' on':''}" data-sw role="switch" aria-checked="${!!p.comments_off}" aria-label="Запретить комментарии"><i></i></button></div></div>`;
}

function cropHtml(){
  const c=S.crop;
  return `<div class="pf-x pf-cr"><h3>Фото профиля</h3><small>Двигай фото пальцем. Квадрат: большое фото в профиле. Пунктирный круг: маленькие аватарки.</small><canvas id="pf-cv" width="${VIEW}" height="${VIEW}"></canvas><input type="range" id="pf-z" min="0" max="100" value="${c.t}" aria-label="Масштаб"><div class="r"><button class="pf-b g" data-cx>Отмена</button><button class="pf-b" data-csv${c.busy?' disabled':''}>${c.busy?'Загружаем…':'Сохранить фото'}</button></div></div>`;
}

function purchasesModalHtml(){
  const list = S.purchasesList || [];
  const KINDS = { banner: 'Баннер', status: 'Статус / Плашка' };
  
  const cards = list.map(item => {
    const isCurrentBanner = item.kind === 'banner' && S.p.cover_url === item.image_url;
    const isCurrentPlate = item.kind === 'status' && S.p.plate_url === item.image_url;
    const isActive = isCurrentBanner || isCurrentPlate;

    return `<div class="pf-p-card">
      <img src="${esc(item.image_url)}" alt="">
      <div class="pf-p-card-body">
        <div>
          <div class="pf-p-card-title">${esc(item.title)}</div>
          <span class="pf-p-card-kind">${KINDS[item.kind] || 'Товар'}</span>
        </div>
      </div>
      <div>
        ${isActive 
          ? `<button class="pf-b g" style="width:100%;height:38px;" data-remove-equipped="${item.kind}">Снять</button>` 
          : `<button class="pf-b" style="width:100%;height:38px;" data-equip-item="${item.id}" data-kind="${item.kind}" data-url="${esc(item.image_url)}">Установить</button>`
        }
      </div>
    </div>`;
  }).join('');

  return `<div class="pf-modal-bg" id="pfPurchasesModal">
    <div class="pf-modal">
      <div class="pf-modal-head">
        <h3>Мои покупки</h3>
        <button class="pf-modal-close" data-close-purchases>✕</button>
      </div>
      ${list.length ? `<div class="pf-p-grid">${cards}</div>` : '<div class="pf-em">У вас пока нет купленных товаров из маркетплейса</div>'}
    </div>
  </div>`;
}

function paint(){
  const cv=$('#pf-cv');if(!cv||!S||!S.crop)return;
  const c=S.crop,x=cv.getContext('2d');
  x.clearRect(0,0,VIEW,VIEW);
  x.drawImage(c.img,c.x,c.y,c.img.width*c.s,c.img.height*c.s);

  x.save();
  x.fillStyle='rgba(0,0,0,.6)';
  x.beginPath();
  x.rect(0,0,VIEW,VIEW);

  const m=VIEW/2-CR,s2=2*CR;
  x.rect(m,m,s2,s2);
  x.fill('evenodd');
  x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.rect(m,m,s2,s2);x.arc(VIEW/2,VIEW/2,CR,0,Math.PI*2,true);x.fill('evenodd');
  x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(m,m,s2,s2);
  x.setLineDash([6,5]);x.globalAlpha=.85;x.beginPath();x.arc(VIEW/2,VIEW/2,CR,0,Math.PI*2);x.stroke();
  x.restore();
}

function clampC(c){
  const m=VIEW/2-CR,iw=c.img.width*c.s,ih=c.img.height*c.s;
  c.x=Math.min(m,Math.max(VIEW-m-iw,c.x));
  c.y=Math.min(m,Math.max(VIEW-m-ih,c.y));
}

function zoom(t){
  const c=S.crop,ox=(VIEW/2-c.x)/c.s,oy=(VIEW/2-c.y)/c.s;
  c.t=t;c.s=c.min*(1+3*t/100);
  c.x=VIEW/2-ox*c.s;c.y=VIEW/2-oy*c.s;
  clampC(c);paint();
}

function openCrop(f){
  if(!f||!S||!S.mine)return;
  if(!/^image\//.test(f.type)){note('Выбери картинку: JPG или PNG');return}
  const u=URL.createObjectURL(f),img=new Image();
  img.onload=()=>{
    URL.revokeObjectURL(u);
    const k=Math.min(1,2400/Math.max(img.width,img.height));let src=img;
    if(k<1){const t=document.createElement('canvas');t.width=Math.round(img.width*k);t.height=Math.round(img.height*k);t.getContext('2d').drawImage(img,0,0,t.width,t.height);src=t}
    const min=2*CR/Math.min(src.width,src.height);
    S.crop={img:src,min,s:min,t:0,x:VIEW/2-src.width*min/2,y:VIEW/2-src.height*min/2,busy:false};
    clampC(S.crop);draw();
    const el=$('.pf-cr');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
  };
  img.onerror=()=>{URL.revokeObjectURL(u);note('Не удалось открыть картинку')};
  img.src=u;
}

async function saveCropResult(){
  const c=S&&S.crop,SB=db();if(!c||c.busy)return;
  c.busy=true;draw();
  const o=document.createElement('canvas');
  o.width=o.height=OUT;
  const sw=2*CR/c.s;
  o.getContext('2d').drawImage(c.img,(VIEW/2-CR-c.x)/c.s,(VIEW/2-CR-c.y)/c.s,sw,sw,0,0,OUT,OUT);

  const blob=await new Promise(r=>o.toBlob(r,'image/jpeg',.88));
  const path=S.id+'.jpg';
  const u=await SB.storage.from(BKT).upload(path,blob,{upsert:true,contentType:'image/jpeg',cacheControl:'3600'});
  if(u.error){c.busy=false;draw();note('Не загрузилось: '+u.error.message);return}
  const url=SB.storage.from(BKT).getPublicUrl(path).data.publicUrl+'?v='+Date.now();
  const r=await SB.from('profiles').update({avatar_url:url}).eq('id',S.id);
  if(r.error){c.busy=false;draw();note('Не сохранилось: '+r.error.message);return}
  S.p.avatar_url=url;S.crop=null;draw();note('Фото обновлено');
}

async function rmAva(){
  const SB=db(),r=await SB.from('profiles').update({avatar_url:''}).eq('id',S.id);
  if(r.error){note('Не получилось: '+r.error.message);return}
  SB.storage.from(BKT).remove([S.id+'.jpg']);
  S.p.avatar_url=null;draw();note('Фото убрано');
}

function draw(){
  const ta=$('#pf-t');if(ta)S.draft=ta.value;
  sec.querySelectorAll('[data-k]').forEach(i=>S.ev[i.dataset.k]=i.value);
  const {p,mine}=S,tags=(p.tags||[]).filter(Boolean),sn=mine?'В сети':seen(p.last_seen);
  const btns=mine?`<button class="pf-b" data-edit>${ic('pen')}Редактировать профиль</button>`:
    `<button class="pf-b${S.fw?' g':''}" data-follow>${S.fw?'Вы подписаны':'Подписаться'}</button><button class="pf-b g" data-dm>${ic('cmt')}Написать</button><button class="pf-b g" data-pmore aria-label="Ещё">⋯</button>`;
  const shown=p.name;
  const nick=p.nick?'@'+esc(p.nick):(mine?'ник не задан — задай в редактировании':'');
  const menu=mine?`<aside><div class="pf-x pf-mn">${mi('cls','Мой класс')}${mi('coin','MilkyCoin')}<button class="pf-mi" data-open-purchases>${ic('bag')}<span>Мои покупки</span></button>${mi('paint','Оформление')}<button class="pf-mi on" data-edit>${ic('pen')}<span>Редактировать профиль</span></button>${mi('mark','Сохранённое')}${mi('gift','Подарки')}</div></aside>`:'';
  put(`<div class="pf-cv${p.cover_url?' img':''}"${p.cover_url?` style="background-image:url('${esc(p.cover_url)}')"`:''}></div>
  <div class="pf-hd"><div class="pf-ava"><span class="pf-big${mine?' pf-me':''}${p.ava_square?' sq':''}"${mine?' data-ava role="button" aria-label="Сменить фото"':''} style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(shown))}</span>${p.plate_url?`<img class="pf-pl" src="${esc(p.plate_url)}" alt="">`:''}</div>
   <div class="pf-w"><h2>${esc(shown)}</h2>${p.fio?`<span class="pf-fio">${esc(SF(p.fio))}</span>`:''}<div class="pf-nk"><span>${nick}</span>${sn?`<span class="pf-bd">${sn}</span>`:''}</div>
    <div class="pf-st">${p.status?esc(p.status):''}</div>${tags.length?`<div class="pf-tg">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}
    <div class="pf-sd"><div class="pf-ss"><div><b>${S.np}</b><small>публикаций</small></div><div><b>${S.nf}</b><small>подписчиков</small></div><div><b>${S.ng}</b><small>подписок</small></div></div><div class="pf-bs">${btns}</div></div></div></div>
  ${mine&&S.crop?cropHtml():''}
  ${mine&&S.ed?editHtml():''}
  ${mine&&S.purchasesModal?purchasesModalHtml():''}
  <div class="pf-g${mine?'':' o'}">${menu}<div>
   ${mine?`<div class="pf-x pf-comp">${av(p,'pf-a')}<div class="in"><textarea id="pf-t" maxlength="2000" placeholder="Что нового?">${esc(S.draft)}</textarea>${S.pimg?`<div class="pf-pv"><img src="${esc(S.pimg.url)}" alt=""><button class="pf-b g" data-prm>Убрать фото</button></div>`:''}<div class="r"><button class="pf-b g" data-pph>${ic('img')}Фото</button><button class="pf-b" data-pub>Опубликовать</button></div></div></div>`:''}
   ${S.posts.map(x=>`<article class="pf-x pf-p"><div class="pf-ph">${av(p,'pf-a')}<div><b>${esc(shown)}</b>${p.fio?`<span class="pf-fio">${esc(SF(p.fio))}</span>`:''}<small>${dt(x.created_at)}</small></div></div>${x.body.trim()?`<p>${esc(x.body)}</p>`:''}${x.image_url?`<img class="pf-pimg" src="${esc(x.image_url)}" alt="" loading="lazy">`:''}
     <div class="pf-ac"><button data-like="${x.id}" class="${S.liked.has(x.id)?'on':''}">${ic('heart')}${cn(x.post_likes)}</button><button disabled>${ic('cmt')}${CMT.n(x.id)}</button>${mine?'':`<button data-pm="${x.id}" aria-label="Ещё">⋯</button>`}${mine?`<button data-del="${x.id}" class="${S.cd===x.id?'dg':''}" aria-label="Удалить">${ic('trash')}${S.cd===x.id?'Точно удалить?':''}</button>`:''}</div>${CMT.html(x.id,S.id,S.p.comments_off)}</article>`).join('')||`<div class="pf-x pf-em">${mine?'Публикаций пока нет. Напиши первую выше.':'Публикаций пока нет.'}</div>`}
  </div><aside>${ppl('Подписки',S.sub,S.ng)}${ppl('Подписчики',S.fol,S.nf)}</aside></div>`);
  if(S.crop)paint();
}

sec.addEventListener('input',e=>{
  if(e.target.id==='pf-z'&&S&&S.crop){zoom(+e.target.value);return}
  const i=e.target,k=i.dataset&&i.dataset.k;if(!k)return;
  if(k==='nick'){const v=i.value.replace(/[^A-Za-z0-9_]/g,'');if(v!==i.value)i.value=v}
  const c=$(`[data-c="${k}"]`);if(c)c.textContent=i.value.length+'/'+i.maxLength;
});

function shrinkImg(f,max){
  return new Promise((res,rej)=>{
    const u=URL.createObjectURL(f),im=new Image();
    im.onload=()=>{URL.revokeObjectURL(u);const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error('сжатие')),'image/jpeg',.82)};
    im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('не картинка'))};
    im.src=u;
  });
}

sec.addEventListener('change',async e=>{
  if(e.target.id==='pf-file'){openCrop(e.target.files[0]);return}
  if(e.target.id!=='pf-pfile')return;
  const f=e.target.files[0];if(!f||!S||!S.mine)return;
  if(!/^image\//.test(f.type)){note('Выбери картинку: JPG или PNG');return}
  try{
    const b=await shrinkImg(f,1280);
    if(S.pimg)URL.revokeObjectURL(S.pimg.url);
    S.pimg={blob:b,url:URL.createObjectURL(b)};draw();
  }catch(err){note('Не удалось открыть картинку')}
});

let dr=null;
sec.addEventListener('pointerdown',e=>{
  const cv=e.target.closest&&e.target.closest('#pf-cv');if(!cv||!S||!S.crop)return;
  try{cv.setPointerCapture(e.pointerId)}catch(err){}
  dr={x:e.clientX,y:e.clientY};
});
sec.addEventListener('pointermove',e=>{
  if(!dr||!S||!S.crop)return;
  const cv=$('#pf-cv');if(!cv)return;
  const k=VIEW/cv.getBoundingClientRect().width,c=S.crop;
  c.x+=(e.clientX-dr.x)*k;c.y+=(e.clientY-dr.y)*k;
  dr={x:e.clientX,y:e.clientY};clampC(c);paint();
});
const endDr=()=>{dr=null};
sec.addEventListener('pointerup',endDr);sec.addEventListener('pointercancel',endDr);

async function loadUserPurchases(){
  const SB = db(); if(!SB || !S || !S.me) return;
  const p = await SB.from('purchases').select('item_id').eq('buyer', S.me.id);
  const ids = (p.data || []).map(x => x.item_id);
  if (!ids.length) {
    S.purchasesList = [];
    S.purchasesModal = true;
    draw();
    return;
  }
  const r = await SB.from('market_items').select('*').in('id', ids).order('id', { ascending: false });
  S.purchasesList = r.data || [];
  S.purchasesModal = true;
  draw();
}

async function act(e){
  const t=e.target,b=k=>t.closest(k),SB=db();let x;
  if(b('[data-go]'))MS.show('msg');
    else if(b('[data-pmore]')){if(window.MOD)MOD.menu('profile',S.id,S.id,()=>render(S.id))}
  else if((x=b('[data-pm]'))){const pp=S.posts.find(z=>z.id==x.dataset.pm);if(window.MOD&&pp)MOD.menu('post',pp.id,S.id,()=>render(S.id))}
  else if(b('[data-ava]')){const f=$('#pf-file');f.value='';f.click()}
  else if(b('[data-avarm]'))rmAva();
  else if(b('[data-open-purchases]')){
    loadUserPurchases();
  }
  else if(b('[data-close-purchases]')){
    S.purchasesModal = false;
    draw();
  }
  else if((x=b('[data-equip-item]'))){
    const kind = x.dataset.kind, url = x.dataset.url;
    const updateData = kind === 'banner' ? { cover_url: url } : { plate_url: url };
    const r = await SB.from('profiles').update(updateData).eq('id', S.me.id);
    if(r.error) {
      note('Ошибка при установке: ' + r.error.message);
    } else {
      if(kind === 'banner') S.p.cover_url = url; else S.p.plate_url = url;
      draw();
      note((kind === 'banner' ? 'Баннер' : 'Плашка') + ' успешно установлен и сохранен на сервере!');
    }
  }
  else if((x=b('[data-remove-equipped]'))){
    const kind = x.dataset.removeEquipped;
    const updateData = kind === 'banner' ? { cover_url: '' } : { plate_url: '' };
    const r = await SB.from('profiles').update(updateData).eq('id', S.me.id);
    if(r.error) {
      note('Ошибка: ' + r.error.message);
    } else {
      if(kind === 'banner') S.p.cover_url = ''; else S.p.plate_url = '';
      draw();
      note((kind === 'banner' ? 'Баннер' : 'Плашка') + ' снят');
    }
  }
  else if((x=b('[data-shape]'))){
    const sq=x.dataset.shape==='1',r=await SB.from('profiles').update({ava_square:sq}).eq('id',S.id);
    if(r.error){note('Не получилось: '+r.error.message);return}
    S.p.ava_square=sq;draw();
  }
  else if(b('[data-cx]')){S.crop=null;draw()}
  else if(b('[data-csv]'))saveCropResult();
  else if((x=b('[data-open]')))render(x.dataset.open);
  else if(b('[data-edit]')){S.ed=true;draw();const el=$('.pf-ed');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
  else if(b('[data-x]')){S.ed=false;S.ev={};S.fm={};draw()}
  else if(b('[data-dm]')){if(window.MG)MG.dm(S.id);else note('Личные сообщения скоро появятся')}
  else if(b('[data-sw]')){
    const on=!S.p.comments_off,r=await SB.from('profiles').update({comments_off:on}).eq('id',S.id);
    if(r.error){note('Не получилось: '+r.error.message);return}
    S.p.comments_off=on;draw();
  }
  else if((x=b('[data-s]'))){
    const k=x.dataset.s,inp=$(`[data-k="${k}"]`),v=inp.value.trim();let arg,r;
    const bad=m=>{S.ev[k]=inp.value;S.fm[k]={t:m,e:1};draw()};
    if(k==='nick'){
      if(!/^[A-Za-z0-9_]{5,15}$/.test(v))return bad('5–15 символов: латиница, цифры и _');
      r=await SB.from('profiles').update({nick:v}).eq('id',S.id);
      if(r.error)return bad(r.error.code==='23505'?'Этот ник уже занят':'Не получилось: '+r.error.message);
      S.p.nick=v;setHash(v);
    }else{
      if(k==='name'){if(v.length<2||v.length>30)return bad('От 2 до 30 символов');arg={name:v}}
      else if(k==='status')arg={status:v};
      else arg={tags:v.split(',').map(s=>s.trim()).filter(Boolean).slice(0,10)};
      r=await SB.from('profiles').update(arg).eq('id',S.id);
      if(r.error)return bad('Не получилось: '+r.error.message);
      if(k==='name')S.p.name=v;else if(k==='status')S.p.status=v;else S.p.tags=arg.tags;
    }
    delete S.ev[k];S.fm[k]={t:'Сохранено',e:0};draw();
  }
  else if(b('[data-follow]')){
    const on=S.fw;S.fw=!on;S.nf+=on?-1:1;draw();
    const r=on?await SB.from('follows').delete().match({follower:S.me.id,followee:S.id}):await SB.from('follows').insert({followee:S.id});
    if(r.error){S.fw=on;S.nf+=on?1:-1;draw();note('Не получилось: '+r.error.message)}
  }
  else if(b('[data-pph]')){const f=$('#pf-pfile');f.value='';f.click()}
  else if(b('[data-prm]')){if(S.pimg)URL.revokeObjectURL(S.pimg.url);S.pimg=null;draw()}
  else if(b('[data-pub]')){
    const ta=$('#pf-t'),body=ta.value.trim();if(!body&&!S.pimg)return;
    const btn=b('[data-pub]');btn.disabled=true;btn.textContent='Публикуем…';
    let path=null,url=null;
    if(S.pimg){
      path=S.me.id+'/'+Date.now()+'.jpg';
      const u=await SB.storage.from('posts').upload(path,S.pimg.blob,{contentType:'image/jpeg',cacheControl:'3600'});
      if(u.error){draw();note('Фото не загрузилось: '+u.error.message);return}
      url=SB.storage.from('posts').getPublicUrl(path).data.publicUrl;
    }
    const r=await SB.from('posts').insert({body:body||' ',image_url:url}).select('id,body,image_url,created_at').single();
    if(r.error){if(path)SB.storage.from('posts').remove([path]);draw();note('Не опубликовалось: '+r.error.message);return}
    if(S.pimg)URL.revokeObjectURL(S.pimg.url);
    S.pimg=null;ta.value='';S.draft='';
    S.posts.unshift({...r.data,post_likes:[{count:0}],post_comments:[{count:0}]});S.np++;draw();
  }
  else if((x=b('[data-like]'))){
    const p=S.posts.find(z=>z.id==x.dataset.like),on=S.liked.has(p.id);
    p.post_likes=[{count:cn(p.post_likes)+(on?-1:1)}];on?S.liked.delete(p.id):S.liked.add(p.id);draw();
    const r=on?await SB.from('post_likes').delete().match({post_id:p.id,user_id:S.me.id}):await SB.from('post_likes').insert({post_id:p.id});
    if(r.error)note('Не получилось: '+r.error.message);
  }
  else if((x=b('[data-del]'))){
    const id=+x.dataset.del;
    if(S.cd!==id){S.cd=id;draw();return}
    const pp=S.posts.find(z=>z.id===id),r=await SB.from('posts').delete().eq('id',id);
    S.cd=null;
    if(r.error){draw();note('Не удалось удалить');return}
    const fp=pp&&pp.image_url?(pp.image_url.split('/posts/')[1]||''):'';
    if(fp)SB.storage.from('posts').remove([decodeURIComponent(fp.split('?')[0])]);
    S.posts=S.posts.filter(z=>z.id!==id);S.np--;draw();
  }
}
sec.addEventListener('click',act);

let want=null;
window.PF={open:u=>{want=u||null;render(want)}};
(window.RV=window.RV||{}).prof=()=>{want=null;render(null)};
document.addEventListener('sb',()=>{if(!sec.hidden)render(want)});

/* После перезагрузки: если в адресе #/@ник, открываем этот профиль */
(function(){
  const m=/^#\/@(.+)$/.exec(H0);if(!m)return;
  const k=decodeURIComponent(m[1]);let n=0;
  const t=setInterval(()=>{
    if(window.MS&&MS.show){clearInterval(t);MS.show('prof');setTimeout(()=>window.PF.open(k),80)}
    else if(++n>100)clearInterval(t);
  },100);
})();
})();
