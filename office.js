/* MilkOffice: вкладки Главная / Финансы / Команда / Бизнесы (модераторам) / Вакансии / Инструменты (всем) */
(function(){
/* Размер панели Милки. 0 = определить само. Если будет зазор или наезд, впиши числа в пикселях:
   PANEL_W: ширина боковой панели (компьютер), PANEL_H: высота верхней панели (телефон) */
const PANEL_W=0,PANEL_H=0;

const st=document.createElement('style');
st.textContent=`
.of-tabs{display:flex;gap:8px;margin:14px 0;overflow-x:auto;scrollbar-width:none}
.of-tabs button{display:flex;gap:8px;align-items:center;height:42px;padding:0 16px;border-radius:14px;background:#fff;color:#566170;font-weight:700;white-space:nowrap;border:0;cursor:pointer}
.of-tabs button.on{background:#34404e;color:#fff}
.of-tabs svg,.of-i svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.of-m{font-size:13px;font-weight:600;color:#2fa876;margin:0 0 10px}.of-m:empty{display:none}.of-m.e{color:#d6407f}
.ofp{background:rgba(255,255,255,.8);border-radius:20px;padding:18px;box-shadow:0 6px 30px rgba(0,0,0,.04);margin-bottom:14px}
.ofp h3{font-size:17px;font-weight:800;margin:0 0 10px}
.ofp small{display:block;color:var(--mu);font-size:12px}
.ofp.of-wn{background:#fff0f3;color:#d6407f;font-weight:600;font-size:13.5px;line-height:1.5}
.of-p{font-size:14px;line-height:1.5;color:#566170;margin:0}
.of-em{text-align:center;color:var(--mu);padding:22px 0}
.of-g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
@media(max-width:700px){.of-g{grid-template-columns:1fr 1fr}}
.of-g .ofp{margin:0}.of-g b{display:block;font-size:22px;font-weight:800;margin-top:4px}
.up{color:#2fa876}.dn{color:#d6407f}
.of-ch{display:flex;gap:6px;align-items:flex-end;height:80px}
.of-ch i{flex:1;background:#2fa876;border-radius:4px 4px 0 0}.of-ch i.n{background:#d6407f}
.of-r{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid #eef1f4;font-size:14px}
.of-r:first-of-type{border-top:0}
.of-r>span{min-width:0;overflow-wrap:anywhere}
.of-r small{display:block}
.of-in,.ofp select,.ofp textarea{width:100%;border:1px solid #dfe5ea;border-radius:12px;padding:11px;font:inherit;outline:0;background:#fff;margin:6px 0}
.ofp textarea{height:70px;resize:none}
.of-bt{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.of-bt button{height:38px;padding:0 16px;border-radius:12px;border:0;font-weight:700;cursor:pointer;background:var(--cy,#17b3e6);color:#fff}
.of-bt button.g{background:#eef3f8;color:#566170}.of-bt button.r{background:#e5314a}
.of-tag{display:inline-block;background:#e3f6fd;color:#17b3e6;border-radius:10px;padding:2px 9px;font-size:11px;font-weight:700;margin-right:6px}
.of-tag.w{background:#ffe3e8;color:#d6407f}
.ofg{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:14px}@media(max-width:700px){.ofg{grid-template-columns:1fr}}
.ofc{background:rgba(255,255,255,.75);backdrop-filter:blur(10px);border-radius:20px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;text-align:center;padding-bottom:18px}
.ofc .ban{height:150px;font-size:60px;display:grid;place-items:center}.ofc h3{font-size:18px;font-weight:700;margin:14px 8px 4px}.ofc p{font-size:12px;color:var(--mu);margin:0 14px 14px;line-height:1.5}
.of-fs{position:fixed;z-index:5;background:#f6f7f3}
.of-fs iframe{display:block;width:100%;height:100%;border:0;background:#fff}
.obh{background:rgba(255,255,255,.85);border-radius:24px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;margin-bottom:14px}
.obh-cv{height:170px;background:linear-gradient(120deg,#8fd3f0,#a99bf0) center/cover no-repeat}
.obh-bd{display:flex;gap:20px;align-items:flex-start;padding:0 24px 22px;flex-wrap:wrap}
.obh-av{flex:none;width:120px;height:120px;border-radius:50%;margin-top:-52px;border:6px solid #fff;display:grid;place-items:center;color:#fff;font-size:40px;font-weight:700;background-size:cover;background-position:center;box-shadow:0 0 0 3px #e3f6fd}
.obh-w{flex:1 1 240px;min-width:0;padding-top:14px}
.obh-w h2{font-size:24px;font-weight:800;line-height:1.2;margin:0;overflow-wrap:anywhere}
.obh-nk{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px;color:var(--mu);font-size:13px}
.obh-w .of-bt{margin-top:12px}
.obh-w .of-bt button.g{height:34px;padding:0 13px;font-size:12.5px}
@media(max-width:700px){.obh-cv{height:120px}.obh-av{width:92px;height:92px;margin-top:-40px;font-size:30px}.obh-bd{padding:0 16px 18px;gap:14px}.obh-w h2{font-size:20px}}`;
document.head.appendChild(st);

const root=()=>document.getElementById('v-office');
const $=s=>root().querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const IC={home:'M3 11l9-8 9 8M5 10v10h14V10',fin:'M4 20V10M10 20V4M16 20v-8M22 20H2',
  team:'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M21 19c0-2-1.5-3.5-4-4',
  jobs:'M4 8h16v11H4zM9 8V5h6v3M4 13h16',all:'M4 5h16v14H4zM4 10h16M9 5v14',
  tools:'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;
/* картинка для карточки 3D-песочницы (рисуется кодом, отдельный файл не нужен) */
const ART3D='<svg viewBox="0 0 160 120" width="160" height="120" fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M70 14l38 19v42L70 94 32 75V33z" fill="#ffffff" fill-opacity=".6" stroke="#1f6e43" stroke-width="3"/><path d="M32 33l38 19 38-19M70 52v42" stroke="#1f6e43" stroke-width="3"/><path d="M70 14l38 19-38 19-38-19z" fill="#2f8f5b" fill-opacity=".35"/><circle cx="122" cy="88" r="18" fill="#e8923a" stroke="#c4701f" stroke-width="3"/><ellipse cx="122" cy="88" rx="18" ry="6" stroke="#c4701f" stroke-width="2"/></svg>';
const CARDS=[{id:'sandbox3d',art:ART3D,bg:'linear-gradient(160deg,#d9f2e3,#8fd4ad)',title:'3D-песочница',
  text:'Лепи фигуры, красься, объединяй и вырезай. Готовые модели людей и животных. Скачивай .glb, .obj, .stl для игр и 3D-печати. Работа сохраняется сама.',
  url:'tools/sandbox3d.html'}];
const BLOG=['Маркетолог','Копирайтёр','Директор'];
const fd=t=>t?new Date(t).toLocaleDateString('ru-RU'):'';
const mk=n=>(+n||0)+' мк';
const KIND=k=>({npd:'ИП на НПД',ip:'ИП',ooo:'ООО'})[String(k||'').toLowerCase()]||String(k||'');
const lk=b=>String(b&&b.kind||'').toLowerCase();
const canHire=b=>!!b&&lk(b)!=='npd';
const norm=o=>{if(o){o.staff=o.staff||[];o.offers=o.offers||[];o.founds=o.founds||[]}return o};
let O=null,tab='jobs',FB=null,applyFor=null,view=null,qAll='',fineFor=null,stF='act';
const R=async(n,a)=>{const r=await window.SB.rpc(n,a||{});if(r.error)throw r.error;return r.data};
const say=(t,bad)=>{const m=$('#of-m');if(m){m.textContent=t||'';m.className='of-m'+(bad?' e':'')}};
const own=()=>O&&O.own&&O.own.status==='active'?O.own:null;
/* бизнес, которым я управляю: свой или как директор */
const mgrBiz=()=>{const o=own();if(o)return o;const s=O.staff.find(x=>x.role==='Директор');return s?{id:s.biz_id,kind:s.kind,name:s.name}:null};
/* бизнес, чьи финансы я вижу: свой, как директор или как бухгалтер */
const finBiz=()=>{const o=own();if(o)return o;const s=O.staff.find(x=>x.role==='Директор'||x.role==='Бухгалтер');if(s)return{id:s.biz_id,kind:s.kind,name:s.name};const f=O.founds[0];return f?{id:f.biz_id,kind:'ooo',name:f.name}:null};
const tabs=()=>{
  const t=[];
  if(own()||O.staff.length||O.offers.length||O.founds.length||O.mod)t.push(['home','Главная']);
  if(finBiz())t.push(['fin','Финансы']);
  if(mgrBiz()||O.staff.length)t.push(['team','Команда']);
  if(O.mod)t.push(['all','Бизнесы']);
  t.push(['jobs','Вакансии']);
  t.push(['tools','Инструменты']);
  return t;
};
const twice=(b,t1)=>{
  if(!b.dataset.sure){b.dataset.sure='1';b.dataset.t0=b.textContent;b.textContent=t1;
    setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=b.dataset.t0}},4000);return false}
  return true;
};

function shell(){
  root().innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="of-tabs">'+
    tabs().map(t=>`<button data-ot="${t[0]}" class="${tab===t[0]?'on':''}">${ic(t[0])}<span>${t[1]}</span></button>`).join('')+
    '</div><div class="of-m" id="of-m"></div><div id="of-b"></div>';
  show();
}
async function show(){
  const b=$('#of-b');if(!b)return;
  b.innerHTML='<div class="of-em">Загружаем…</div>';
  try{
    if(view&&view.t==='blog')await blogView(view.b,view.n);
    else await ({home,fin,team,all,jobs,tools}[tab])();
  }catch(e){b.innerHTML='';say(e.message||'Не получилось',1)}
}

/* ---------- Блог: шапка как у профиля ---------- */
const okImg=u=>/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(u||'')?u:'';
const PL=['#17b3e6','#8774e1','#e5617a','#5cc08a','#f0a04b','#4a8fd9'];
const hue=t=>{let x=7;for(const c of String(t))x=(x*31+c.charCodeAt(0))>>>0;return PL[x%PL.length]};
async function getBlog(bid){
  const SB=window.SB;
  let r=await SB.from('biz_blogs').select('title,avatar_url,cover_url').eq('biz_id',bid).maybeSingle();
  if(r.error){r=await SB.from('biz_blogs').select('title').eq('biz_id',bid).maybeSingle();if(r.data)r.data.nomedia=true}
  return r.data||null;
}
async function postCount(bid){const r=await window.SB.from('biz_posts').select('id',{count:'exact',head:true}).eq('biz_id',bid);return r.count||0}
function blogHead(bid,bl,kind,np,go,name){
  const m=mgrBiz(),ed=!!m&&m.id===bid&&!bl.nomedia,av=okImg(bl.avatar_url),cv=okImg(bl.cover_url),t=bl.title||name||'';
  const w=np%10===1&&np%100!==11?'публикация':(np%10>=2&&np%10<=4&&(np%100<10||np%100>=20))?'публикации':'публикаций';
  const bt=(go?`<button data-oa="blog" data-b="${bid}" data-n="${esc(t)}">Перейти в блог</button>`:'')+
    (ed?`<button class="g" data-oa="bmav" data-b="${bid}">${av?'Сменить фото':'Добавить фото'}</button><button class="g" data-oa="bmcv" data-b="${bid}">${cv?'Сменить баннер':'Добавить баннер'}</button>${av?`<button class="g" data-oa="bmavx" data-b="${bid}">Убрать фото</button>`:''}${cv?`<button class="g" data-oa="bmcvx" data-b="${bid}">Убрать баннер</button>`:''}`:'');
  return `<div class="obh"><div class="obh-cv"${cv?` style="background-image:url('${cv}')"`:''}></div><div class="obh-bd"><span class="obh-av" style="background-color:${hue(t)};${av?`background-image:url('${av}')`:''}">${av?'':esc((t.trim()[0]||'?').toUpperCase())}</span><div class="obh-w"><h2>${esc(t)}</h2><div class="obh-nk">${kind?`<span class="of-tag" style="margin:0">${esc(kind)}</span>`:''}<span>${np} ${w}</span></div>${bt?`<div class="of-bt">${bt}</div>`:''}</div></div></div>`;
}
/* картинка: обрезаем по центру и сжимаем в jpeg */
function cropJpeg(file,w,h,q){
  return new Promise((ok,no)=>{
    const u=URL.createObjectURL(file),im=new Image();
    im.onload=()=>{URL.revokeObjectURL(u);const c=document.createElement('canvas');c.width=w;c.height=h;const k=Math.max(w/im.width,h/im.height),sw=w/k,sh=h/k;
      c.getContext('2d').drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,0,0,w,h);ok(c.toDataURL('image/jpeg',q))};
    im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('Не удалось открыть картинку'))};
    im.src=u;
  });
}
function pick(cb){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{if(i.files[0])cb(i.files[0])};i.click()}

/* ---------- Главная ---------- */
async function home(){
  const o=own(),SB=window.SB;let h='';
  if(O.offers.length)h+='<div class="ofp"><h3>Вам предлагают долю</h3>'+O.offers.map(f=>`<div class="of-r" style="display:block"><b>${esc(f.name)}</b><small>${esc(f.from_name||'Игрок')} отдаёт вам ${f.share}% ${f.price>0?'за '+mk(f.price):'бесплатно'}. Вы станете сооснователем.</small><div class="of-bt"><button data-oa="offyes" data-id="${f.id}">Принять</button><button class="g" data-oa="offno" data-id="${f.id}">Отказаться</button></div></div>`).join('')+'</div>';
  if(o){
    h+=`<div class="ofp"><h3>${esc(o.name)} <span class="of-tag">${esc(KIND(o.kind))}</span></h3><p class="of-p">Баланс счёта: ${mk(o.balance)}.${lk(o)==='npd'?' Сотрудников нанимать нельзя.':''}</p></div>`;
    if(o.frozen)h+=`<div class="ofp of-wn">Счёт заморожен: не хватает денег на взнос, зарплату или штраф.${o.debt>0?' Штраф: '+mk(o.debt)+(o.debt_note?' ('+esc(o.debt_note)+')':'')+'.':''} Пополни счёт в MilkBank.${lk(o)==='ooo'?' Если долги не оплатить 30 дней, компания закроется.':''}</div>`;
    const bl=await getBlog(o.id);
    if(bl)h+=blogHead(o.id,bl,KIND(o.kind),await postCount(o.id),true,o.name);
    else h+=`<div class="ofp"><h3>Блог бизнеса</h3><p class="of-p">Блог получит название вашего бизнеса: «${esc(o.name)}». Название потом не меняется.</p><div class="of-bt"><button data-oa="blogmk">Создать блог</button></div></div>`;
  }else if(O.own){
    const S={pending:'заявка на проверке',rejected:'заявка отклонена',closed:'компания закрыта'}[O.own.status]||O.own.status;
    h+=`<div class="ofp"><h3>Ваш бизнес «${esc(O.own.name)}»</h3><p class="of-p">Статус: ${esc(S)}.${O.own.reason?' '+esc(O.own.reason)+'.':''}${O.own.status==='pending'?' Разделы Офиса откроются после одобрения.':''}</p></div>`;
  }
  if(O.staff.length)h+='<div class="ofp"><h3>Где вы работаете</h3>'+O.staff.map(s=>`<div class="of-r"><span><b>${esc(s.name)}</b> <span class="of-tag">${esc(KIND(s.kind))}</span><small>${esc(s.role)}${s.salary?', '+mk(s.salary)+' в месяц':''}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="blog" data-b="${s.biz_id}" data-n="${esc(s.name)}">Блог</button></div></div>`).join('')+'</div>';
  if(o&&lk(o)==='ooo')h+=await founders(o.id,o.name);
  for(const f of O.founds)h+=await founders(f.biz_id,f.name);
  $('#of-b').innerHTML=h||'<div class="of-em">Пока здесь пусто</div>';
}

async function founders(bid,name){
  let d;try{d=await R('biz_founders_info',{p_bid:bid})}catch(e){return ''}
  const rows=(d.list||[]).map(x=>`<div class="of-r"><span><b>${esc(x.name||'Игрок')}</b>${x.nick?' @'+esc(x.nick):''}<small>${x.is_owner?'Главный владелец':'Сооснователь'}</small></span><b>${x.share}%</b></div>`).join('');
  const out=(d.out||[]).map(x=>`<div class="of-r"><span>Предложено: ${esc(x.to_name||'игроку')}, ${x.share}%${x.price>0?' за '+mk(x.price):' бесплатно'}</span><div class="of-bt" style="margin:0"><button class="g" data-oa="offx" data-id="${x.id}">Отозвать</button></div></div>`).join('');
  return `<div class="ofp"><h3>Сооснователи: ${esc(name)}</h3>${rows}<small style="margin-top:8px">Твоя доля: ${d.me}%. Прибыль делится по долям: когда главный владелец выводит деньги со счёта, каждый получает свою часть.</small>${out?'<h3 style="margin-top:14px">Мои предложения</h3>'+out:''}<h3 style="margin-top:14px">Предложить долю</h3><input class="of-in" id="of-on-${bid}" placeholder="Ник игрока" autocomplete="off"><input class="of-in" id="of-os-${bid}" type="number" min="1" max="49" placeholder="Сколько % отдать"><input class="of-in" id="of-op-${bid}" type="number" min="0" placeholder="Цена в монетах (0 — бесплатно)"><small>Можно позвать сооснователя или продать часть своей доли. Главный владелец всегда держит не меньше 51%. Всего сооснователей до 5.</small><div class="of-bt"><button data-oa="offmk" data-b="${bid}">Предложить</button></div></div>`;
}

async function blogView(bid,name){
  const SB=window.SB,b0=await getBlog(bid);
  const ps=b0?(await SB.from('biz_posts').select('id,body,created_at').eq('biz_id',bid).order('id',{ascending:false}).limit(50)).data||[]:[];
  const can=(own()&&own().id===bid)||O.founds.some(f=>f.biz_id===bid)||O.staff.some(s=>s.biz_id===bid&&BLOG.includes(s.role));
  const sf=O.staff.find(s=>s.biz_id===bid),kd=own()&&own().id===bid?own().kind:(sf?sf.kind:'');
  const np=b0?await postCount(bid):0;
  $('#of-b').innerHTML='<button class="back" data-oa="back">← Назад</button>'+
    (b0?blogHead(bid,b0,kd?KIND(kd):'',np,false,name):'<div class="ofp"><h3>'+esc(name)+'</h3><p class="of-p">Блога пока нет.</p></div>')+
    (b0&&can?'<div class="ofp"><textarea id="of-pt" maxlength="2000" placeholder="Что нового в бизнесе?"></textarea><div class="of-bt"><button data-oa="post" data-b="'+bid+'">Опубликовать</button></div></div>':'')+
    ps.map(p=>`<div class="ofp"><small>${fd(p.created_at)}</small><p class="of-p" style="white-space:pre-wrap;color:inherit">${esc(p.body)}</p></div>`).join('');
}

/* ---------- Финансы ---------- */
function chart(ops){
  const m={},now=new Date();now.setHours(0,0,0,0);
  for(let i=0;i<14;i++){const d=new Date(now);d.setDate(d.getDate()-i);m[d.toDateString()]=0}
  ops.forEach(o=>{const k=new Date(o.created_at);k.setHours(0,0,0,0);const s=k.toDateString();if(s in m)m[s]+=+o.amount});
  const v=Object.values(m).reverse(),mx=Math.max(1,...v.map(Math.abs));
  return '<div class="of-ch">'+v.map(n=>`<i class="${n<0?'n':''}" style="height:${Math.max(3,Math.abs(n)/mx*76)}px"></i>`).join('')+'</div>';
}
async function fin(){
  const m=finBiz(),bid=FB||(m&&m.id);
  if(!bid){$('#of-b').innerHTML='<div class="of-em">Нет доступа</div>';return}
  const d=await R('biz_fin',{bid}),ops=d.ops||[],lim=Date.now()-30*864e5;
  let inc=0,exp=0;
  ops.forEach(o=>{if(new Date(o.created_at)>=lim){const a=+o.amount;if(a>0)inc+=a;else exp-=a}});
  $('#of-b').innerHTML=(FB?'<button class="back" data-oa="all">← К списку</button>':'')+
    (d.frozen?`<div class="ofp of-wn">Счёт заморожен: не хватает денег на взнос, зарплату или штраф.${d.debt>0?' Штраф: '+mk(d.debt)+'.':''}</div>`:'')+
    `<div class="of-g"><div class="ofp"><small>Баланс · ${esc(KIND(d.kind))}</small><b>${mk(d.balance)}</b><small>Счёт ${esc(d.acc||'')}</small></div>`+
    `<div class="ofp"><small>Доходы за 30 дней</small><b class="up">+${inc}</b></div>`+
    `<div class="ofp"><small>Расходы за 30 дней</small><b class="dn">−${exp}</b></div>`+
    `<div class="ofp"><small>Прибыль за 30 дней</small><b class="${inc-exp<0?'dn':'up'}">${inc-exp}</b></div></div>`+
    (d.payroll>0?`<div class="ofp"><small>Зарплаты сотрудникам в месяц</small><b>${mk(d.payroll)}</b></div>`:'')+
    `<div class="ofp"><h3>Движение за 14 дней</h3>${chart(ops)}</div>`+
    `<div class="ofp"><h3>Операции</h3>${ops.length?ops.slice(0,50).map(o=>`<div class="of-r"><span>${esc(o.title)}<small>${fd(o.created_at)}</small></span><b class="${+o.amount<0?'dn':'up'}">${+o.amount>0?'+':''}${o.amount}</b></div>`).join(''):'<div class="of-em">Операций пока нет</div>'}</div>`+
    (d.fee_until?`<div class="ofp"><small>Квартальный взнос оплачен до ${fd(d.fee_until)}</small></div>`:'');
}

/* ---------- Команда ---------- */
async function team(){
  const m=mgrBiz();let h='';
  if(m){
    if(!canHire(m))h+='<div class="ofp"><h3>Команда</h3><p class="of-p">ИП на НПД работает один: на этом налоге нанимать сотрудников нельзя. Чтобы нанимать, открой ИП или ООО.</p></div>';
    else{
      const d=await R('biz_team',{bid:m.id});
      h+=`<div class="ofp"><h3>Новая вакансия</h3><select id="of-vr">${(d.roles||[]).map(r=>`<option>${esc(r)}</option>`).join('')}</select><textarea id="of-vd" maxlength="500" placeholder="Что делать и что нужно уметь."></textarea><input class="of-in" id="of-vs" type="number" min="0" max="100000" placeholder="Зарплата в месяц, мк"><label style="display:flex;gap:8px;align-items:center;font-size:13px;margin:6px 0"><input type="checkbox" id="of-vn"> Зарплату можно обсудить</label><small>${lk(m)==='ip'?'ИП нанимает до 3 человек. ':''}Зарплата выплачивается раз в месяц со счёта проекта сама.</small><div class="of-bt"><button data-oa="vacmk">Опубликовать</button></div></div>`;
      h+='<div class="ofp"><h3>Открытые вакансии</h3>'+((d.vacs||[]).map(v=>`<div class="of-r"><span><span class="of-tag">${esc(v.role)}</span>${esc(v.descr)}<small>${mk(v.salary)} в месяц, ${v.negotiable?'можно обсудить':'без обсуждения'}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="vacx" data-id="${v.id}">Закрыть</button></div></div>`).join('')||'<div class="of-em">Нет открытых вакансий</div>')+'</div>';
      h+='<div class="ofp"><h3>Отклики</h3>'+((d.apps||[]).map(a=>`<div class="of-r" style="display:block"><b>${esc(a.name||'Без имени')}</b> <span class="of-tag">${esc(a.role)}</span><small>${esc(a.msg)}</small>${a.negotiable?`<small>Зарплата в вакансии: ${mk(a.salary)}, можно обсудить</small><input class="of-in" id="of-s${a.id}" type="number" min="0" value="${+a.salary||0}" placeholder="Договорённая зарплата в месяц, мк">`:`<small>Зарплата без обсуждения: ${mk(a.salary)} в месяц</small>`}<div class="of-bt"><button data-oa="yes" data-id="${a.id}">Принять</button><button class="g" data-oa="no" data-id="${a.id}">Отклонить</button></div></div>`).join('')||'<div class="of-em">Откликов пока нет</div>')+'</div>';
      h+='<div class="ofp"><h3>Сотрудники</h3>'+((d.staff||[]).map(s=>`<div class="of-r"><span><b>${esc(s.name||'Без имени')}</b><small>${esc(s.role)}${s.salary?', '+mk(s.salary)+' в месяц':''}</small></span>${s.role==='Директор'&&!own()?'':`<div class="of-bt" style="margin:0"><button class="g" data-oa="end" data-id="${s.id}">Уволить</button></div>`}</div>`).join('')||'<div class="of-em">Пока никого</div>')+'</div>';
    }
  }
  const mine=O.staff.filter(s=>!(own()&&own().id===s.biz_id));
  if(mine.length)h+='<div class="ofp"><h3>Мои места работы</h3>'+mine.map(s=>`<div class="of-r"><span><b>${esc(s.name)}</b> <span class="of-tag">${esc(KIND(s.kind))}</span><small>${esc(s.role)}${s.salary?', '+mk(s.salary)+' в месяц':''}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="end" data-id="${s.id}">Уволиться</button></div></div>`).join('')+'</div>';
  $('#of-b').innerHTML=h||'<div class="of-em">Пока пусто</div>';
}

/* ---------- Бизнесы (модераторам) ---------- */
async function all(){
  FB=null;
  const L=await R('biz_all');
  const SF={act:b=>b.status==='active',pend:b=>b.status==='pending',old:b=>b.status==='rejected'||b.status==='closed'};
  const f=L.filter(SF[stF]).filter(b=>!qAll||(b.name+' '+(b.owner_name||'')+' '+(b.acc||'')).toLowerCase().includes(qAll));
  const chips='<div class="of-bt" style="margin:0 0 8px">'+[['act','Работают'],['pend','На проверке'],['old','Отклонённые и закрытые']].map(([k,l])=>`<button class="${stF===k?'':'g'}" data-oa="stf" data-k="${k}">${l} · ${L.filter(SF[k]).length}</button>`).join('')+'</div>';
  $('#of-b').innerHTML=chips+`<input class="of-in" id="of-q" placeholder="Поиск по названию, владельцу или счёту" value="${esc(qAll)}"><div class="ofp">`+
    (f.map(b=>`<div class="of-r" style="display:block"><b>${esc(b.name)}</b> <span class="of-tag">${esc(KIND(b.kind))}</span><span class="of-tag">${esc(b.status)}</span>${b.frozen?'<span class="of-tag w">заморожен</span>':''}${b.debt>0?'<span class="of-tag w">штраф '+b.debt+'</span>':''}<small>Владелец: ${esc(b.owner_name||'—')}. Счёт: ${esc(b.acc||'нет')}. Баланс: ${mk(b.balance)}. ${esc(b.activity||'')}</small>`+
      (fineFor===b.id
        ?`<input class="of-in" id="of-fa" type="number" min="1" placeholder="Сумма штрафа, мк"><input class="of-in" id="of-fr" maxlength="100" placeholder="Причина штрафа"><div class="of-bt"><button class="r" data-oa="fineok" data-b="${b.id}">Выписать штраф</button><button class="g" data-oa="finex">Отмена</button></div>`
        :stF==='old'?`<div class="of-bt"><button class="r" data-oa="bizdel" data-b="${b.id}">Удалить из списка</button></div>`
        :`<div class="of-bt"><button class="g" data-oa="fin" data-b="${b.id}">Финансы</button><button class="g" data-oa="blog" data-b="${b.id}" data-n="${esc(b.name)}">Блог</button>${b.status==='active'?`<button class="g" data-oa="fine" data-b="${b.id}">Штраф</button>`:''}</div>`)+
      '</div>').join('')||'<div class="of-em">Ничего не найдено</div>')+'</div>';
}

/* ---------- Вакансии (видят все) ---------- */
async function jobs(){
  const L=await R('biz_jobs');
  const lab={new:'Отклик отправлен',yes:'Принят',no:'Отклонён'};
  $('#of-b').innerHTML=(!tabs().some(x=>x[0]==='home')?'<div class="ofp"><p class="of-p">Разделы про бизнес открываются владельцам бизнесов и их сотрудникам. Здесь можно найти работу в ИП или ООО, а во вкладке «Инструменты» есть программы для работы.</p></div>':'')+
    (L.map(v=>`<div class="ofp"><h3>${esc(v.name)} <span class="of-tag">${esc(v.role)}</span></h3><p class="of-p">${esc(v.descr)}</p><small style="margin-top:6px"><b>${mk(v.salary)} в месяц</b>, ${v.negotiable?'можно обсудить':'без обсуждения'}</small>`+
      (v.my?`<small style="margin-top:8px">${lab[v.my]||''}</small>`
        :applyFor===v.id?`<textarea id="of-am" maxlength="500" placeholder="Расскажи о себе и опыте"></textarea><div class="of-bt"><button data-oa="send" data-id="${v.id}">Отправить</button><button class="g" data-oa="applyx">Отмена</button></div>`
        :`<div class="of-bt"><button data-oa="apply" data-id="${v.id}">Откликнуться</button></div>`)+'</div>').join('')||'<div class="of-em">Открытых вакансий пока нет</div>');
}

/* ---------- Инструменты (видят все) ---------- */
async function tools(){
  $('#of-b').innerHTML='<div class="ofg" style="margin-top:0">'+CARDS.map(c=>`<article class="ofc"><div class="ban" style="background:${c.bg}">${c.art}</div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><button class="join" data-oa="tool" data-id="${c.id}">Открыть</button></article>`).join('')+'</div>';
}

/* инструмент на весь экран, видна только панель Милки */
function fit(){
  const w=document.getElementById('of-fs'),r=root();if(!w||!r)return;
  const rc=r.getBoundingClientRect();
  if(innerWidth>700){w.style.left=(PANEL_W||Math.max(0,Math.round(rc.left)))+'px';w.style.top='0';}
  else{w.style.left='0';w.style.top=(PANEL_H||Math.max(0,Math.round(rc.top)))+'px';}
  w.style.right='0';w.style.bottom='0';
}
addEventListener('resize',fit);
function openTool(c){
  scrollTo(0,0);
  root().innerHTML='<div class="of-fs" id="of-fs"><iframe src="'+esc(c.url)+'" allow="fullscreen;autoplay;clipboard-read;clipboard-write"></iframe></div>';
  /* точка отсчёта берётся от пустого корня, поэтому замеряем после вставки */
  fit();
}

/* ---------- клики ---------- */
document.addEventListener('click',async e=>{
  const r=root();if(!r||!r.contains(e.target))return;
  const t=e.target,ot=t.closest('[data-ot]');
  if(ot){tab=ot.dataset.ot;FB=null;view=null;applyFor=null;fineFor=null;shell();return}
  const b=t.closest('[data-oa]');if(!b)return;
  const a=b.dataset.oa,id=b.dataset.id;
  try{
    if(a==='back'){view=null;show();return}
    if(a==='tool'){
      const c=CARDS.find(x=>x.id===id);if(!c)return;
      openTool(c);return;
    }
    if(a==='blog'){view={t:'blog',b:+b.dataset.b,n:b.dataset.n};show();return}
    if(a==='fin'){FB=+b.dataset.b;tab='fin';shell();return}
    if(a==='all'){FB=null;tab='all';shell();return}
    if(a==='stf'){stF=b.dataset.k;show();return}
    if(a==='bizdel'){
      if(!twice(b,'Точно?'))return;
      await R('biz_forget',{p_id:+b.dataset.b});say('Удалено');show();return;
    }
    if(a==='fine'){fineFor=+b.dataset.b;show();return}
    if(a==='finex'){fineFor=null;show();return}
    if(a==='fineok'){
      await R('biz_fine',{p_id:+b.dataset.b,p_amt:+($('#of-fa').value||0),p_reason:$('#of-fr').value});
      fineFor=null;say('Штраф выписан');show();return;
    }
    if(a==='bmav'||a==='bmcv'){
      const isA=a==='bmav',bd=+b.dataset.b;
      pick(async f=>{try{say('Загружаем…');const d=await cropJpeg(f,isA?320:1600,isA?320:400,isA?.86:.8);await R('biz_blog_media',{p_bid:bd,p_which:isA?'avatar':'cover',p_data:d});say('Сохранено');show()}catch(err){say(err.message||'Не получилось',1)}});
      return;
    }
    if(a==='bmavx'||a==='bmcvx'){await R('biz_blog_media',{p_bid:+b.dataset.b,p_which:a==='bmavx'?'avatar':'cover',p_data:''});say('Убрано');show();return}
    if(a==='blogmk'){await R('biz_blog_make',{bid:own().id});say('Блог создан');show();return}
    if(a==='post'){const v=$('#of-pt').value;await R('biz_post',{bid:+b.dataset.b,pbody:v});say('Опубликовано');show();return}
    if(a==='vacmk'){const m=mgrBiz();const vs=$('#of-vs').value;await R('biz_vac_create',{bid:m.id,prole:$('#of-vr').value,pdescr:$('#of-vd').value,psalary:vs===''?null:+vs,pnego:$('#of-vn').checked});say('Вакансия опубликована');show();return}
    if(a==='vacx'){await R('biz_vac_close',{vid:+id});show();return}
    if(a==='yes'||a==='no'){
      const s=document.getElementById('of-s'+id);
      await R('biz_app_decide',{aid:+id,ok:a==='yes',sal:a==='yes'?(+(s&&s.value)||0):0});
      say(a==='yes'?'Сотрудник принят':'Отклик отклонён');show();return;
    }
    if(a==='end'){
      if(!twice(b,'Точно?'))return;
      await R('biz_staff_end',{sid:+id});
      O=norm(await R('biz_office'));say('Готово');
      if(!tabs().some(x=>x[0]===tab))tab=tabs()[0][0];
      shell();return;
    }
    if(a==='offmk'){
      const bd=+b.dataset.b,g=k=>document.getElementById(k+bd).value;
      await R('biz_offer_make',{p_bid:bd,p_nick:g('of-on-'),p_share:+g('of-os-'),p_price:+(g('of-op-')||0)});
      say('Предложение отправлено');show();return;
    }
    if(a==='offx'){await R('biz_offer_cancel',{p_id:+id});say('Предложение отозвано');show();return}
    if(a==='offyes'||a==='offno'){
      await R('biz_offer_answer',{p_id:+id,p_ok:a==='offyes'});
      O=norm(await R('biz_office'));
      if(!tabs().some(x=>x[0]===tab))tab=tabs()[0][0];
      shell();say(a==='offyes'?'Вы теперь сооснователь':'Вы отказались');return;
    }
    if(a==='apply'){applyFor=+id;show();return}
    if(a==='applyx'){applyFor=null;show();return}
    if(a==='send'){await R('biz_apply',{vid:+id,pmsg:$('#of-am').value});applyFor=null;say('Отклик отправлен');show();return}
  }catch(err){say(err.message||'Не получилось',1)}
});
document.addEventListener('input',e=>{
  if(e.target.id==='of-q'){qAll=e.target.value.trim().toLowerCase();const p=e.target.selectionStart;all().then(()=>{const q=$('#of-q');if(q){q.focus();q.setSelectionRange(p,p)}})}
});

async function init(){
  const r=root();if(!r)return;
  r.innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="of-em">Загружаем…</div>';
  try{O=await R('biz_office')}catch(e){O=null}
  if(!O){r.innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="ofp"><p class="of-p">Чтобы открыть Офис, войди в аккаунт.</p></div>';return}
  norm(O);FB=null;view=null;applyFor=null;fineFor=null;
  tab=tabs()[0][0];shell();
}
window.RV=window.RV||{};
window.RV.office=init;
})();
