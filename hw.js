/* Модуль домашних заданий: страница ДЗ, симуляции, тесты, сдача */
(function(){
const $=s=>document.querySelector(s);
const css=document.createElement('style');
css.textContent=`
#v-hw,#v-sim{padding-bottom:80px}
.crumb{font-size:12px;color:#a5a8ac;margin-bottom:16px}.crumb a{cursor:pointer}
.hero{display:flex;gap:22px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:linear-gradient(120deg,#fff 40%,#d9f4fd);border-radius:25px;padding:24px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.hero small{color:var(--bt);font-weight:600;font-size:13px}
.hero h1{font-weight:800;color:#34404e;font-size:34px;margin:6px 0 14px}
.chp{display:inline-block;background:#f1fcff;border-radius:16px;padding:9px 16px;font-weight:600;font-size:13px;margin:0 8px 8px 0;color:#566170}
.ban2{width:290px;height:165px;border-radius:18px;background:linear-gradient(160deg,#ffe8c8,#fdd9a8) center/cover;display:grid;place-items:center;font-size:60px}
.stc{width:220px;background:#fff;border-radius:20px;padding:18px;text-align:center;font-size:12px;color:var(--mu)}
.stc b{display:block;font-size:15px;color:#4a5563;margin-bottom:8px}
.stc i{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--pl);color:var(--cy);font-style:normal;font-size:22px;font-weight:700;margin:0 auto 8px}
.stc.g i{background:var(--ok);color:#fff}.stc.r i{background:#9aa5b0;color:#fff}
.hg{display:grid;grid-template-columns:1.15fr 1fr;gap:22px;margin-top:22px;align-items:start}
.hg .card{margin-bottom:22px}
.card h2.t{font-size:22px;font-weight:800;color:#34404e;margin-bottom:4px}
.txt{background:#f9fafc;border-radius:17px;padding:18px 22px;line-height:1.7;font-size:14px;margin:14px 0}
.mats{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px}
.mats button{width:150px;text-align:left;font-size:11px;color:var(--mu)}
.mats img{width:150px;height:110px;object-fit:cover;object-position:top;border-radius:12px;margin-bottom:4px}
.lbl{font-weight:600;font-size:13px;margin:14px 0 8px}
.ed{border:1px solid #dfe5ea;border-radius:12px;overflow:hidden}
.ed .tb{padding:10px 16px;border-bottom:1px solid #e7ecf0;font-size:15px;color:#566170}
.ed textarea{width:100%;height:170px;border:0;padding:14px;font:inherit;resize:vertical;outline:0}
.fl{border:1px dashed #cfe9f3;background:#f8fcfe;border-radius:17px;padding:18px;margin-top:16px}
.fl small{display:block;color:var(--mu);margin:2px 0 12px}
.up{background:#fff;border-radius:12px;text-align:center;padding:14px;color:var(--bt);font-weight:600;margin-bottom:10px}
.dz{border:1.5px dashed #bfe6f3;border-radius:12px;padding:34px 12px;text-align:center;color:#566170;font-weight:500}
.bt{display:block;width:100%;height:46px;border-radius:14px;background:#12b3e8;color:#fff;font-weight:700;font-size:15px;margin-top:16px}
.bt.gn{background:#2fbf5a}
.note{margin-top:16px;padding:14px;border-radius:14px;background:var(--pl);color:#566170;text-align:center}
.cmt{background:#f1fcff;border-radius:14px;padding:12px 16px;margin-bottom:14px}.cmt small{color:var(--mu);font-size:10px;letter-spacing:1px}
.sg{display:grid;grid-template-columns:1fr 300px;gap:22px;align-items:start}
.sg canvas{width:100%;height:auto;border-radius:14px;background:#f4fbff;touch-action:none;display:block}
.intro{color:#566170;margin:-4px 0 16px;font-size:14px}
.chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px}
.chips span,.chips button{border-radius:16px;padding:8px 14px;background:#f1fcff;color:var(--bt);font-weight:600;font-size:12.5px}
.chips button.on{background:var(--cy);color:#fff}.chips span.s{background:#eef1f4;color:#566170}
.mi2{display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--ln);font-size:13px}
.mi2 i{flex:none;width:22px;height:22px;border-radius:50%;border:2px solid #cfd8de;display:grid;place-items:center;font-style:normal;font-size:12px;color:#fff}
.mi2.d i{background:var(--ok);border-color:var(--ok)}
.q{padding:18px 0;border-bottom:1px solid var(--ln)}.q b{display:block;margin-bottom:10px;font-size:15px}
.q textarea,.q input.n,.eq2 input{width:100%;border:1px solid #dfe5ea;border-radius:12px;padding:12px;font:inherit;outline:0}
.q textarea{height:90px}
.q label{display:flex;gap:10px;align-items:center;padding:8px 0;font-size:14px}
.opts{display:flex;gap:12px;flex-wrap:wrap}.opts label{flex-direction:column;border:2px solid #e3eaef;border-radius:14px;padding:8px}
.eqb{font-size:34px;font-weight:800;text-align:center;padding:26px 0;background:#f4fbff;border-radius:14px;color:#34404e}
.fb{font-size:13px;margin-top:8px;min-height:18px;font-weight:600}.ok2{color:var(--ok)}.bad{color:#d97706}
.ucard{border:1px solid var(--ln);border-radius:14px;padding:14px;margin-top:10px}
.ucard input{width:120px;border:1px solid #dfe5ea;border-radius:10px;padding:8px;font:inherit;margin-right:8px}
@media(max-width:1000px){.hg,.sg{grid-template-columns:1fr}}`;
document.head.appendChild(css);

/* ---------- данные ---------- */
const ang=d=>{const r=d*Math.PI/180;return `<svg viewBox="0 0 120 90" width="120" height="90"><path d="M10 80H110M10 80L${(10+70*Math.cos(r)).toFixed(1)} ${(80-70*Math.sin(r)).toFixed(1)}" stroke="#34404e" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M40 80A30 30 0 0 0 ${(10+30*Math.cos(r)).toFixed(1)} ${(80-30*Math.sin(r)).toFixed(1)}" stroke="#0ad1f8" stroke-width="3" fill="none"/></svg>`};
const D={
phys:{img:'kvantonomika.jpg',task:['Физика / Тема: механическое движение, траектория, путь (§14–15)','ДЗ: прочитай параграфы по материалам, пройди симуляции и ответь на вопросы теста своими словами.','Не забываем про аккуратность и полные ответы.'],mat:[],sims:['ref','units'],
 test:[{q:'Сформулируй определение механического движения.',k:'t'},{q:'Почему необходимо указывать, относительно каких тел движется тело?',k:'t'},{q:'Чем отличается путь от траектории? Приведи пример.',k:'t'},{q:'Почему пассажирам самолёта в облаках кажется, что самолёт не движется?',k:'t'},{q:'Глубина Байкала — 1642 м. Запиши её в километрах (только число).',k:'n'},{q:'Выбери все примеры механического движения.',k:'m',o:['едет машина','тает лёд','убегает заяц','наступают сумерки','падает яблоко','идёт телевизионный фильм','прошёл год','вращается колесо']}]},
bio:{img:'ecoznanie2.jpg',task:['Биология / Тема: строение и жизнедеятельность кишечнополостных (§8)','ДЗ: изучи параграф, пройди симуляцию и ответь на вопросы теста.'],mat:[],sims:['touch'],
 test:[{q:'Почему у гидры лучевая симметрия? Как это связано с образом жизни?',k:'t'},{q:'Опиши своими словами, как гидра реагирует на укол иглой. Какие клетки участвуют?',k:'t'},{q:'Сравни особенности жизнедеятельности кишечнополостных и простейших и сделай вывод об уровне организации.',k:'t'},{q:'Сколько слоёв клеток в стенке тела гидры? (число)',k:'n'},{q:'Выбери клетки, которые находятся в эктодерме гидры.',k:'m',o:['эпителиально-мускульные','стрекательные','нервные','промежуточные','пищеварительно-мускульные','железистые']}]},
alg:{img:'formulogia.jpg',task:['Алгебра / Тема: решение задач с помощью уравнений','ДЗ: выполнить задания со слайда, пройти симуляцию и тест.','Не забываем про правила оформления работ, пишем аккуратно.'],mat:[],sims:['bal'],
 test:[{q:'Число увеличили в 3 раза и получили 24. Найди число.',k:'n'},{q:'За x одинаковых карандашей заплатили 40 рублей, цена одного — 8 рублей. Найди x.',k:'n'},{q:'Найди значение выражения 3x + 5 при x = 9.',k:'n'},{q:'Выбери все уравнения с тем же корнем, что и у 4x + 6 = 18.',k:'m',o:['4x = 12','x = 3','2x + 3 = 9','4x = 24','x + 6 = 18','8x + 12 = 36','5x = 20']},{q:'Объясни, почему в уравнении 7x − 5 = 16 сначала прибавляют 5, а не делят на 7.',k:'t'}]},
geom:{img:'',task:['Геометрия / Тема: смежные углы, перпендикулярные прямые','ДЗ: выполнить задания со слайда, построить чертёж в симуляции и пройти тест.'],mat:[],sims:['draw'],
 test:[{q:'Выбери рисунок, на котором угол прямой.',k:'i',o:[60,90,120,150]},{q:'Выбери рисунок, на котором угол равен 120°.',k:'i',o:[150,60,120,90]},{q:'Один из смежных углов равен 90°. Найди другой (в градусах).',k:'n'},{q:'Один из смежных углов равен 40°. Найди другой (в градусах).',k:'n'},{q:'Выбери все пары, которые могут быть смежными углами.',k:'m',o:['40° и 140°','90° и 90°','70° и 100°','120° и 60°','110° и 80°','135° и 45°']},{q:'Объясни, как построить перпендикуляр к прямой в точке A.',k:'t'}]},
inf:{img:'programmirovanie.jpg',task:['Информатика / Тема: алгоритмы','ДЗ: пройди игру «Робот» и ответь на вопросы теста.'],mat:[],sims:['robot'],
 test:[{q:'Что такое алгоритм? Объясни своими словами.',k:'t'},{q:'Как повтор (цикл) помог тебе сократить программу? Приведи пример.',k:'t'},{q:'Сколько команд выполнит робот: «повторить 4 раза: вперёд, направо»? (число)',k:'n'},{q:'Выбери свойства алгоритма.',k:'m',o:['понятность','определённость','результативность','конечность','красота','скорость звука']}]},
def:{task:['Выполни упражнения по теме урока.','Оформи ответ аккуратно.'],mat:[],sims:[],test:null}
};

/* ---------- состояние ---------- */
const S={};let cur=null,destroy=null,timer=null;
const get=id=>S[id]||(S[id]={sim:{},text:'',saved:false,status:'new',due:0,ans:{},tdone:false});
const dd=id=>D[id]||D.def;
const SUBJ=id=>(MS.HW.find(x=>x[0]===id)||[])[1]||'';
const simDone=(id,k)=>{const a=get(id).sim[k];return !!a&&a.every(Boolean)};
const progress=id=>{const d=dd(id);return [d.sims.filter(k=>simDone(id,k)).length+(d.test&&get(id).tdone?1:0),d.sims.length+(d.test?1:0)]};
const changed=()=>window.HWM.onchange&&window.HWM.onchange();
const tdate=()=>{const n=new Date(),M=['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];return n.getDate()+' '+M[n.getMonth()]};
const grade=id=>{const s=get(id);s.status='graded';s.date=tdate();if(cur===id&&!$('#v-hw').hidden)render();changed()};
function tick(){
  for(const id in S){const s=S[id];if(s.status==='review'){const left=s.due-Date.now();if(left<=0)grade(id);else if(cur===id){const e=$('#cd');if(e){const m=Math.floor(left/60000),c=Math.floor(left/1000)%60;e.textContent='оценка придёт через '+m+':'+String(c).padStart(2,'0')}}}}
}
timer=setInterval(tick,1000);

/* ---------- страница ДЗ ---------- */
function render(){
  const id=cur,d=dd(id),s=get(id),w=MS.HW.find(x=>x[0]===id),sub=SUBJ(id),[pd,pt]=progress(id);
  const sc={new:['Новое','+','можно приступить',''],draft:['Черновик','✎','ответ сохранён',''],review:['На проверке','⏳','<span id="cd" title="Нажми, чтобы пропустить ожидание (для демо)" style="cursor:pointer"></span>','r'],graded:['Оценка','5','проверено','g']}[s.status];
  const locked=s.status==='review'||s.status==='graded';
  const items=d.sims.map(k=>{const m=SIM[k];return `<div class="it"><div class="ico">${m.e}</div><div><b>${m.t}</b><small>${m.d}</small></div><button class="go${simDone(id,k)?' ok':''}" data-sim="${k}">${simDone(id,k)?'Пройдено ✓':'Перейти к симуляции'}</button></div>`}).join('')+
    (d.test?`<div class="it"><div class="ico">📝</div><div><b>Тест по теме</b><small>${d.test.length} вопросов: ответы нужно формулировать самому</small></div><button class="go${s.tdone?' ok':''}" data-test="1">${s.tdone?'Пройден ✓':'Перейти к тесту'}</button></div>`:'');
  $('#v-hw').innerHTML=`<div class="crumb"><a id="hb">Главная</a> &nbsp;|&nbsp; Домашние задания</div>
  <div class="hero"><div><small>Домашнее задание</small><h1>${sub}</h1><span class="chp">7 уровень</span><span class="chp">Учитель: Имя учителя</span><span class="chp">Сдать до: ${w?w[3]:''}</span></div>
  <div class="ban2" style="${d.img?`background-image:url('${d.img}')`:''}">${d.img?'':'📐'}</div>
  <div class="stc ${sc[3]}"><b>${sc[0]}</b><i>${sc[1]}</i>${sc[2]}</div></div>
  <div class="hg"><div>
   ${s.status==='graded'?'<div class="card"><div class="cmt"><small>КОММЕНТАРИЙ УЧИТЕЛЯ</small><br><b>Молодец! Интересная работа получилась.</b></div></div>':''}
   <section class="card"><h2 class="t">Задание от учителя</h2><div class="hd2">Посмотри материалы перед отправкой ответа.</div><div class="txt">${d.task.map(t=>`<p>${t}</p>`).join('')}</div>
   ${d.mat.length?`<div class="lbl">Материалы к заданию</div><div class="mats">${d.mat.map(m=>`<button data-img="${m[0]}"><img src="${m[0]}" alt="">${m[1]}</button>`).join('')}</div>`:''}</section>
   ${d.sims.length||d.test?`<section class="card"><div class="hd"><h2 class="t" style="font-size:20px">Интерактивное задание</h2><span>Выполнено ${pd} из ${pt}</span></div><div class="bar" style="margin:6px 0 16px"><i style="width:${pd/pt*100}%"></i></div>${items}</section>`:''}
   ${s.saved?`<section class="card"><h2 class="t" style="font-size:20px">Твой ответ</h2><div class="hd2">Текст, сохранённый для проверки.</div><div class="txt">${s.text?s.text.replace(/</g,'&lt;').replace(/\n/g,'<br>'):'<i style="color:#9aa5b0">Текст не добавлен</i>'}</div></section>`:''}
  </div><section class="card"><h2 class="t">Сдать домашнее задание</h2><div class="hd2">Добавь текст, фото, аудио или видео.</div>
   <div class="lbl">Текст ответа</div><div class="ed"><div class="tb"><b>B</b> &nbsp; <i>I</i> &nbsp; ☰ &nbsp; •</div><textarea id="hwt" placeholder="Напиши ответ здесь…"${locked?' disabled':''}>${s.text}</textarea></div>
   <div class="fl"><b>Файлы ответа</b><small>Фото, аудио или видео.</small><div class="up">⬆ Загрузить файл</div><div class="dz">Перетащи файлы сюда или нажми для выбора</div></div>
   ${locked?`<div class="note">${s.status==='review'?'Работа отправлена учителю':'Работа проверена'}</div>`:s.saved?'<button class="bt" id="sv">Сохранить изменения</button><button class="bt gn" id="snd">Проверил, можно отправлять учителю</button>':'<button class="bt" id="sv">Сохранить ответ</button>'}
  </section></div>`;
  tick();
}
function modal(html){const m=document.createElement('div');m.className='mod';m.style.zIndex=30;m.innerHTML=html;m.addEventListener('click',e=>{if(e.target===m)m.remove()});document.body.appendChild(m);return m}
function sendModal(){
  const [pd,pt]=progress(cur);
  const m=modal(`<div class="mbox" style="text-align:left;min-width:min(480px,90vw)"><h3>Проверь перед отправкой</h3>${['Я проверил текст ответа','Я проверил, что файлы открываются','Я понимаю, что после отправки исправить нельзя'].map(t=>`<div class="mi2 d"><i>✓</i>${t}</div>`).join('')}${pd<pt?`<p style="margin:12px 0 0">Интерактивное задание выполнено не полностью: ${pd} из ${pt}.</p>`:''}<div style="margin-top:20px;justify-content:flex-end"><button class="back" style="margin:0;height:38px;min-width:120px" id="mb">Вернуться</button><button class="no" id="ms">Отправить учителю</button></div></div>`);
  m.querySelector('#mb').onclick=()=>m.remove();
  m.querySelector('#ms').onclick=()=>{const s=get(cur);s.status='review';s.due=Date.now()+300000;m.remove();render();changed()};
}
document.addEventListener('input',e=>{if(e.target.id==='hwt'&&cur)get(cur).text=e.target.value});
document.addEventListener('click',e=>{
  const t=e.target,b=k=>t.closest(k);
  if($('#v-hw').hidden&&$('#v-sim').hidden)return;
  if(b('#hb')||b('#bk')){leave();MS.show(b('#bk')?'hw':'home');if(b('#bk'))render()}
  else if(b('[data-sim]'))openSim(b('[data-sim]').dataset.sim);
  else if(b('[data-test]'))openTest();
  else if(b('[data-img]'))modal(`<img src="${b('[data-img]').dataset.img}" style="max-height:90vh;max-width:90vw;border-radius:14px">`);
  else if(b('#sv')){const s=get(cur);s.text=$('#hwt').value;s.saved=true;if(s.status==='new')s.status='draft';render();changed()}
  else if(b('#snd')){get(cur).text=$('#hwt').value;sendModal()}
  else if(b('#cd')){get(cur).due=Date.now()}
});
function leave(){if(destroy){destroy();destroy=null}}

/* ---------- экран симуляции ---------- */
function frame(title,intro){return `<button class="back" id="bk"><svg viewBox="0 0 24 24"><path d="M12 6l-6 6 6 6M19 6l-6 6 6 6"/></svg>К заданию</button><h2 class="sec" style="margin-top:14px">${title}</h2><p class="intro">${intro}</p>`}
function openSim(k){
  const m=SIM[k],s=get(cur);if(!s.sim[k])s.sim[k]=m.m.map(()=>false);
  MS.show('sim');
  $('#v-sim').innerHTML=frame(m.t,m.d)+'<div class="sg"><section class="card" id="sr"></section><section class="card"><h2 class="t" style="font-size:18px">Задания</h2><div id="ml"></div></section></div>';
  const ml=()=>{$('#ml').innerHTML=m.m.map((x,i)=>`<div class="mi2${s.sim[k][i]?' d':''}"><i>${s.sim[k][i]?'✓':''}</i>${x}</div>`).join('')+(s.sim[k].every(Boolean)?'<div class="note">Симуляция пройдена! Вернись к заданию.</div>':'')};
  ml();leave();
  destroy=m.mount($('#sr'),{ok:i=>{if(!s.sim[k][i]){s.sim[k][i]=true;ml();changed()}}});
}
/* ---------- тест ---------- */
function openTest(){
  const d=dd(cur),s=get(cur);MS.show('sim');leave();
  $('#v-sim').innerHTML=frame('Тест по теме «'+SUBJ(cur)+'»','Отвечай своими словами. Автопроверки нет — учитель посмотрит работу.')+`<section class="card">${d.test.map((q,i)=>`<div class="q"><b>${i+1}. ${q.q}</b>${
   q.k==='t'?`<textarea data-q="${i}" placeholder="Напиши ответ…">${s.ans[i]||''}</textarea>`:
   q.k==='n'?`<input class="n" data-q="${i}" inputmode="decimal" placeholder="Число" value="${s.ans[i]||''}">`:
   q.k==='m'?q.o.map((o,j)=>`<label><input type="checkbox" data-q="${i}" data-j="${j}"${(s.ans[i]||[]).includes(j)?' checked':''}>${o}</label>`).join(''):
   `<div class="opts">${q.o.map((o,j)=>`<label><input type="radio" name="q${i}" data-q="${i}" data-j="${j}"${s.ans[i]===j?' checked':''}>${ang(o)}<span>${'АБВГ'[j]}</span></label>`).join('')}</div>`}</div>`).join('')}<button class="bt gn" id="tf">Завершить тест</button></section>`;
  $('#v-sim').oninput=$('#v-sim').onchange=e=>{const i=e.target.dataset.q;if(i===undefined)return;const q=d.test[i];
    if(q.k==='m'){const a=s.ans[i]||[],j=+e.target.dataset.j;s.ans[i]=e.target.checked?[...new Set([...a,j])]:a.filter(x=>x!==j)}else if(q.k==='i')s.ans[i]=+e.target.dataset.j;else s.ans[i]=e.target.value};
  $('#tf').onclick=()=>{s.tdone=true;changed();MS.show('hw');render()};
}

/* ---------- симуляции ---------- */
const SIM={};
const mk=(r,w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;r.appendChild(c);return [c,c.getContext('2d')]};
const pt=(c,e)=>{const b=c.getBoundingClientRect();return {x:(e.clientX-b.left)*c.width/b.width,y:(e.clientY-b.top)*c.height/b.height}};
const raf=(f)=>{let on=true;const l=t=>{if(!on)return;f(t);requestAnimationFrame(l)};requestAnimationFrame(l);return ()=>on=false};

SIM.ref={e:'🚌',t:'Относительно кого?',d:'Выбери тело отсчёта и посмотри на мир его глазами: что движется, а что покоится?',m:['Посмотри глазами дерева','Посмотри глазами автобуса','Посмотри глазами встречной машины'],
mount(r,c){
  const [cv,x]=mk(r,700,230),O=[['🌳','Дерево',0,0],['🚌','Автобус',50,0],['🧍','Пассажир',50,0],['🚗','Встречная машина',-80,700]];
  let ref=0,t0=performance.now();
  r.insertAdjacentHTML('beforeend','<div class="chips" id="rb"></div><div class="chips" id="st"></div>');
  const sel=(i,u)=>{ref=i;const mi={0:0,1:1,3:2}[i];if(u&&mi!==undefined)c.ok(mi);$('#rb').innerHTML='<span class="s">Я — это:</span>'+O.map((o,j)=>`<button class="${j===ref?'on':''}" data-r="${j}">${o[0]} ${o[1]}</button>`).join('');
    $('#st').innerHTML=O.map((o,j)=>{if(j===ref)return `<span class="s">${o[1]}: тело отсчёта</span>`;const v=o[2]-O[ref][2];return `<span>${o[1]}: ${v===0?'покоится':'движется '+(v>0?'→':'←')}</span>`}).join('')};
  r.addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(b)sel(+b.dataset.r,1)});sel(0);
  return raf(()=>{const t=(performance.now()-t0)/1000,p=i=>O[i][3]+O[i][2]*t,cam=p(ref),sx=w=>((w-cam)%1400+2100)%1400-700+350;
    x.fillStyle='#d9f4fd';x.fillRect(0,0,700,230);x.fillStyle='#9aa5b0';x.fillRect(0,150,700,60);x.fillStyle='#bfe3a8';x.fillRect(0,210,700,20);
    x.textAlign='center';x.font='50px serif';for(let k=0;k<4;k++)x.fillText('🌳',sx(k*350),120);
    x.fillText('🚌',sx(p(1)),150);x.font='24px serif';x.fillText('🧍',sx(p(2)),128);x.font='44px serif';x.fillText('🚗',sx(p(3)),205);
    x.font='bold 13px Montserrat,sans-serif';x.fillStyle='#e8793a';const rx=ref===0?sx(0):sx(p(ref));x.fillText('▼ ты',rx,ref===3?140:ref===2?100:ref===1?85:55)});
}};

SIM.units={e:'📏',t:'Единицы длины (СИ)',d:'Лестница единиц: переведи значения и введи ответ.',m:['Байкал: метры → километры','Дюймы → метры','Аршины, дюймы и вершки → сантиметры'],
mount(r,c){
  r.innerHTML='<div class="chips"><span class="s">мм ←×10→ см ←×10→ дм ←×10→ м ←×1000→ км</span></div><p class="intro" style="margin-top:10px">1 аршин = 28 дюймов = 16 вершков = 71,12 см</p>'+
  [['Глубина Байкала 1642 м. Запиши в километрах:',1.642,'км',0.0005],['Сколько метров в 30 дюймах?',0.762,'м',0.002],['2 аршина 16 дюймов и 3 вершка — сколько это сантиметров?',196.2,'см',0.3]].map((q,i)=>`<div class="ucard">${q[0]}<br><br><input data-u="${i}" inputmode="decimal"> ${q[2]} <button class="go" data-ck="${i}">Проверить</button><div class="fb" id="f${i}"></div></div>`).join('');
  const A=[[1.642,.0005],[.762,.002],[196.2,.3]];
  r.onclick=e=>{const b=e.target.closest('[data-ck]');if(!b)return;const i=+b.dataset.ck,v=parseFloat(r.querySelector(`[data-u="${i}"]`).value.replace(',','.')),f=r.querySelector('#f'+i);
    if(Math.abs(v-A[i][0])<=A[i][1]){f.className='fb ok2';f.textContent='Верно!';c.ok(i)}else{f.className='fb bad';f.textContent='Пока нет. Проверь, сколько единиц в одной и в какую сторону переводишь.'}};
  return ()=>{};
}};

SIM.touch={e:'🪱',t:'Потрогай гидру',d:'Коснись гидры иглой и посмотри, как сигнал бежит по нервной сети. Это рефлекс!',m:['Дотронься до тела гидры','Дотронься до щупальца','Включи нервную сеть и дотронься снова'],
mount(r,c){
  const [cv,x]=mk(r,420,340),CX=210,B=300;let net=false,wave=null,seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const N=Array.from({length:34},()=>({u:rnd(),v:rnd()}));
  r.insertAdjacentHTML('beforeend','<div class="chips"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="nt"> Показать нервную сеть</label></div>');
  $('#nt').onchange=e=>net=e.target.checked;
  cv.onpointerdown=e=>{const p=pt(cv,e);if(Math.abs(p.x-CX)>110||p.y<40||p.y>B)return;wave={x:p.x,y:p.y,t:performance.now()};
    const top=B-180;if(p.y>=top&&Math.abs(p.x-CX)<40)c.ok(0);else if(p.y<top)c.ok(1);if(net)c.ok(2)};
  return raf(()=>{x.clearRect(0,0,420,340);x.fillStyle='#e6f7fc';x.fillRect(0,0,420,340);
    const tt=wave?(performance.now()-wave.t)/1000:99,k=tt>.5&&tt<2.1?1-.5*Math.sin(Math.PI*(tt-.5)/1.6):1,top=B-180*k,rad=tt*260;
    x.strokeStyle='#4aa86a';x.lineWidth=7;x.lineCap='round';for(let i=0;i<6;i++){const o=(i-2.5);x.beginPath();x.moveTo(CX+o*9,top);x.quadraticCurveTo(CX+o*30,top-40*k,CX+o*42,top-75*k);x.stroke()}
    x.fillStyle='#bfe8c9';x.strokeStyle='#4aa86a';x.lineWidth=5;x.beginPath();x.roundRect(CX-32,top,64,B-top,16);x.fill();x.stroke();
    x.fillStyle='#8fd0a5';x.beginPath();x.ellipse(CX,B+4,46,10,0,0,7);x.fill();
    if(net){const P=N.map(n=>({x:CX-24+n.u*48,y:top+8+n.v*(B-top-16)}));x.lineWidth=1;
      P.forEach((a,i)=>P.forEach((b,j)=>{if(j>i&&Math.hypot(a.x-b.x,a.y-b.y)<42){const lit=wave&&Math.hypot(a.x-wave.x,a.y-wave.y)<rad&&tt<2;x.strokeStyle=lit?'#e5314a':'#4a90c9';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}));
      P.forEach(a=>{const lit=wave&&Math.hypot(a.x-wave.x,a.y-wave.y)<rad&&tt<2;x.fillStyle=lit?'#e5314a':'#2d6a9f';x.beginPath();x.arc(a.x,a.y,3,0,7);x.fill()})}
    if(wave&&tt<.6){x.strokeStyle='#555';x.lineWidth=3;x.beginPath();x.moveTo(wave.x+60,wave.y-20);x.lineTo(wave.x+4,wave.y-1);x.stroke()}});
}};

SIM.bal={e:'⚖️',t:'Весы-уравнения',d:'Делай одно и то же с обеими частями уравнения, пока x не останется один.',m:['Реши 4x + 6 = 18','Реши 7x − 5 = 16','Реши 8x = 40 (карандаши)'],
mount(r,c){
  const E=[[4,6,18],[7,-5,16],[8,0,40]];let i=0,q=[...E[0]];
  r.innerHTML='<div class="chips" id="es"></div><div class="eqb" id="eq" style="margin-top:12px"></div><div class="chips"><span class="s">Сделать с обеими частями:</span>'+['+','−','×','÷'].map(o=>`<button data-o="${o}">${o}</button>`).join('')+'</div><div class="eq2" style="margin-top:12px;display:flex;gap:10px"><input id="nn" inputmode="numeric" placeholder="число"><button class="go" id="ap">Применить</button></div><div class="fb" id="fm"></div>';
  let op='+';
  const f=(a,b,cc)=>`${a===1?'':a}x ${b>0?'+ '+b:b<0?'− '+(-b):''} = ${cc}`;
  const dr=()=>{$('#eq').textContent=f(...q);$('#es').innerHTML=E.map((e,j)=>`<button class="${j===i?'on':''}" data-e="${j}">${f(...e)}</button>`).join('');r.querySelectorAll('[data-o]').forEach(b=>b.classList.toggle('on',b.dataset.o===op))};
  r.onclick=e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.e){i=+t.dataset.e;q=[...E[i]];$('#fm').textContent='';dr()}
    else if(t.dataset.o){op=t.dataset.o;dr()}
    else if(t.id==='ap'){const n=parseFloat($('#nn').value),fm=$('#fm');if(!n){fm.className='fb bad';fm.textContent='Введи число';return}
      if(op==='+'){q[1]+=n;q[2]+=n}else if(op==='−'){q[1]-=n;q[2]-=n}else if(op==='×'){q=q.map(v=>v*n)}else{if(q.some(v=>v%n)){fm.className='fb bad';fm.textContent='Не делится нацело — подумай, что нужно сделать сначала.';return}q=q.map(v=>v/n)}
      fm.textContent='';dr();if(q[0]===1&&q[1]===0){fm.className='fb ok2';fm.textContent='x = '+q[2]+'. Верно!';c.ok(i)}}};
  dr();return ()=>{};
}};

SIM.draw={e:'📐',t:'Построй и измерь',d:'Проведи линию (тяни пальцем или мышью). Построй перпендикуляр в точке A и измерь угол транспортиром.',m:['Построй прямую AB','Построй в точке A перпендикуляр','Измерь угол транспортиром'],
mount(r,c){
  const [cv,x]=mk(r,700,360),L=[];let cu=null,pr=false;const sn=v=>Math.round(v/20)*20;
  r.insertAdjacentHTML('beforeend','<div class="chips"><button id="pb">Транспортир</button><button id="cb">Очистить</button><b id="rd" style="margin-left:8px"></b></div>');
  const vert=()=>{if(L.length<2)return L[0]?L[0].a:null;const [p,q]=[L[0],L[1]],d1={x:p.b.x-p.a.x,y:p.b.y-p.a.y},d2={x:q.b.x-q.a.x,y:q.b.y-q.a.y},den=d1.x*d2.y-d1.y*d2.x;if(Math.abs(den)<1e-6)return p.a;const t=((q.a.x-p.a.x)*d2.y-(q.a.y-p.a.y)*d2.x)/den;return {x:p.a.x+t*d1.x,y:p.a.y+t*d1.y}};
  const far=(l,v)=>Math.hypot(l.a.x-v.x,l.a.y-v.y)>Math.hypot(l.b.x-v.x,l.b.y-v.y)?l.a:l.b;
  const angle=()=>{const V=vert();if(!V||L.length<2)return null;const p=L[0].b,q=far(L[1],V),a=Math.atan2(p.y-V.y,p.x-V.x),b=Math.atan2(q.y-V.y,q.x-V.x);let d=Math.abs(a-b)*180/Math.PI;if(d>180)d=360-d;return d};
  const check=()=>{if(L.length>=1)c.ok(0);if(L.length>=2){const d=angle(),A=L[0].a,l=L[1],len=Math.hypot(l.b.x-l.a.x,l.b.y-l.a.y),dist=Math.abs((l.b.x-l.a.x)*(l.a.y-A.y)-(l.a.x-A.x)*(l.b.y-l.a.y))/len;if(Math.abs(d-90)<3&&dist<8)c.ok(1)}if(pr&&L.length>=2)c.ok(2)};
  cv.onpointerdown=e=>{const p=pt(cv,e);cu={a:{x:sn(p.x),y:sn(p.y)},b:{x:sn(p.x),y:sn(p.y)}};cv.setPointerCapture(e.pointerId)};
  cv.onpointermove=e=>{if(!cu)return;const p=pt(cv,e);cu.b={x:sn(p.x),y:sn(p.y)}};
  cv.onpointerup=()=>{if(cu&&Math.hypot(cu.b.x-cu.a.x,cu.b.y-cu.a.y)>=40){if(L.length>=2)L.length=0;L.push(cu);check()}cu=null};
  r.onclick=e=>{if(e.target.id==='pb'){pr=!pr;check()}if(e.target.id==='cb'){L.length=0;pr=false}};
  return raf(()=>{x.fillStyle='#fff';x.fillRect(0,0,700,360);x.strokeStyle='#dbeef5';x.lineWidth=1;for(let i=0;i<=700;i+=20){x.beginPath();x.moveTo(i,0);x.lineTo(i,360);x.stroke()}for(let i=0;i<=360;i+=20){x.beginPath();x.moveTo(0,i);x.lineTo(700,i);x.stroke()}
    x.lineCap='round';[...L,...(cu?[cu]:[])].forEach(l=>{x.strokeStyle='#34404e';x.lineWidth=3;x.beginPath();x.moveTo(l.a.x,l.a.y);x.lineTo(l.b.x,l.b.y);x.stroke()});
    x.fillStyle='#e8793a';x.font='bold 16px Montserrat,sans-serif';if(L[0]){x.fillText('A',L[0].a.x-14,L[0].a.y-8);x.fillText('B',L[0].b.x+8,L[0].b.y-8)}
    const V=vert(),rd=$('#rd'),a=angle();
    if(pr&&V&&L.length>=1){const p=L[0].b,rot=Math.atan2(p.y-V.y,p.x-V.x);x.save();x.translate(V.x,V.y);x.rotate(rot);x.fillStyle='rgba(10,209,248,.15)';x.strokeStyle='#0ad1f8';x.lineWidth=2;x.beginPath();x.arc(0,0,120,-Math.PI,0);x.closePath();x.fill();x.stroke();
      x.font='10px sans-serif';x.fillStyle='#17b3e6';for(let d=0;d<=180;d+=10){const t=-d*Math.PI/180;x.beginPath();x.moveTo(Math.cos(t)*(d%30?112:104)*1,Math.sin(t)*(d%30?112:104));x.lineTo(Math.cos(t)*120,Math.sin(t)*120);x.stroke();if(d%30===0)x.fillText(d,Math.cos(t)*88-8,Math.sin(t)*88+4)}x.restore()}
    rd.textContent=pr?(a===null?'Построй вторую линию':'Угол между лучами: '+Math.round(a)+'°'):''});
}};

SIM.robot={e:'🤖',t:'Робот-алгоритмист',d:'Составь программу из команд, чтобы робот дошёл до флажка. Команда «3×⬆» повторяет шаг три раза.',m:['Уровень 1','Уровень 2','Уровень 3 (со стенами)'],
mount(r,c){
  const LV=[{s:[0,5],g:[0,2],w:[]},{s:[0,5],g:[3,2],w:[]},{s:[0,5],g:[4,0],w:[[0,3],[2,2],[3,5]]}];let lv=0,prog=[],run=null;
  const [cv,x]=mk(r,300,300);cv.style.maxWidth='300px';
  r.insertAdjacentHTML('beforeend','<div class="chips" id="lv"></div><div class="chips">'+[['f','⬆ вперёд'],['l','↶ налево'],['r','↷ направо'],['m','3×⬆'],['x','Очистить'],['go','▶ Запустить']].map(b=>`<button data-c="${b[0]}">${b[1]}</button>`).join('')+'</div><div class="fb" id="pg"></div><div class="fb" id="rm"></div>');
  let rb={x:0,y:5,d:0};const reset=()=>{const L=LV[lv];rb={x:L.s[0],y:L.s[1],d:0};clearInterval(run);$('#rm').textContent='';$('#lv').innerHTML=LV.map((_,j)=>`<button class="${j===lv?'on':''}" data-l="${j}">Уровень ${j+1}</button>`).join('')};
  const show=()=>{$('#pg').textContent='Программа: '+(prog.map(p=>({f:'⬆',l:'↶',r:'↷',m:'3×⬆'}[p])).join(' ')||'пусто')};
  const step=cmd=>{const D=[[0,-1],[1,0],[0,1],[-1,0]],L=LV[lv];if(cmd==='l')rb.d=(rb.d+3)%4;else if(cmd==='r')rb.d=(rb.d+1)%4;else{const n=cmd==='m'?3:1;for(let i=0;i<n;i++){const nx=rb.x+D[rb.d][0],ny=rb.y+D[rb.d][1];if(nx<0||ny<0||nx>5||ny>5||L.w.some(w=>w[0]===nx&&w[1]===ny)){$('#rm').className='fb bad';$('#rm').textContent='Стена! Робот не может пройти.';return}rb.x=nx;rb.y=ny}}};
  r.onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.l!==undefined){lv=+b.dataset.l;prog=[];reset();show()}
    else if(b.dataset.c==='x'){prog=[];reset();show()}
    else if(b.dataset.c==='go'){reset();let i=0;run=setInterval(()=>{if(i>=prog.length){clearInterval(run);const L=LV[lv];if(rb.x===L.g[0]&&rb.y===L.g[1]){$('#rm').className='fb ok2';$('#rm').textContent='Флажок достигнут!';c.ok(lv)}else{$('#rm').className='fb bad';$('#rm').textContent='Не дошёл. Попробуй изменить программу.'}return}step(prog[i++])},450)}
    else if(b.dataset.c){prog.push(b.dataset.c);show()}};
  reset();show();
  return raf(()=>{const L=LV[lv];x.fillStyle='#fff';x.fillRect(0,0,300,300);x.strokeStyle='#cfe9f3';for(let i=0;i<=6;i++){x.beginPath();x.moveTo(i*50,0);x.lineTo(i*50,300);x.moveTo(0,i*50);x.lineTo(300,i*50);x.stroke()}
    x.textAlign='center';x.font='30px serif';L.w.forEach(w=>x.fillText('🧱',w[0]*50+25,w[1]*50+36));x.fillText('🚩',L.g[0]*50+25,L.g[1]*50+36);x.fillText('🤖',rb.x*50+25,rb.y*50+36);
    x.font='bold 14px sans-serif';x.fillStyle='#e8793a';x.fillText(['▲','▶','▼','◀'][rb.d],rb.x*50+25,rb.y*50+12)});
}};

/* ---------- публичный интерфейс ---------- */
window.HWM={
  onchange:null,
  open(id){cur=id;leave();MS.show('hw');render()},
  st:id=>get(id).status,
  grades:()=>Object.keys(S).filter(id=>S[id].status==='graded').map(id=>['Домашнее задание',SUBJ(id),5,S[id].date])
};
})();
