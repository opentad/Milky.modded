(function(){
const $=s=>document.querySelector(s);
let L=[],ov=null,fr=null;
const st=document.createElement('style');
st.textContent='.gmg{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:14px}@media(max-width:700px){.gmg{grid-template-columns:1fr}}.gmc{background:rgba(255,255,255,.75);backdrop-filter:blur(10px);border-radius:20px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;text-align:center;padding-bottom:18px}.gmc .ban{height:130px;font-size:56px;font-weight:800;color:#2d6a9f}.gmc h3{font-size:18px;font-weight:700;margin:14px 8px 4px}.gmc p{font-size:12px;color:var(--mu);margin-bottom:12px}.gmt{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px}';
document.head.appendChild(st);
const page=h=>{$('#v-games').innerHTML=h};
function home(){
  page('<h2 class="sec" style="margin-top:0">Игры</h2><div class="gmg"><article class="gmc"><div class="ban" style="background:linear-gradient(160deg,#c9f0f8,#7ad3f0)">🧱</div><h3>Jump Brick Jump</h3><p>Прыгай по блокам</p><button class="join" data-j="levels">Играть</button></article></div>');
}
async function levels(){
  page('<p class="intro">Загружаем уровни…</p>');
  const sb=window.SB;
  const r=sb?await sb.from('jbj_levels').select('id,data').order('id'):null;
  if(!r||r.error){page('<button class="back" data-j="home">← К играм</button><p class="intro">Не удалось загрузить: '+(r&&r.error?r.error.message:'нет связи')+'</p>');return}
  L=r.data||[];
  const mod=window.IS_MOD;
  page('<button class="back" data-j="home">← К играм</button><div class="gmt"><h2 class="sec" style="margin:0">Jump Brick Jump</h2>'+(mod?'<button class="start" data-j="edit">Создать уровень</button>':'')+'</div><div class="gmg">'+(L.map((x,i)=>'<article class="gmc"><div class="ban" style="background:linear-gradient(160deg,#ffe8c8,#fdd9a8)">'+(i+1)+'</div><h3>Уровень '+(i+1)+'</h3><button class="join" data-j="play" data-i="'+i+'">Играть</button></article>').join('')||'<p class="intro">Уровней пока нет</p>')+'</div>');
}
function full(src){
  close();
  ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:60;background:#000';
  fr=document.createElement('iframe');
  fr.style.cssText='width:100%;height:100%;border:0;display:block';
  fr.allow='fullscreen';fr.src=src;
  ov.appendChild(fr);document.body.appendChild(ov);
  if(ov.requestFullscreen)ov.requestFullscreen().catch(()=>{});
}
function close(){
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  if(ov)ov.remove();
  ov=null;fr=null;
}
function open(){
  const g=$('#v-games');
  g.onclick=e=>{
    const b=e.target.closest('[data-j]');if(!b)return;
    const k=b.dataset.j;
    if(k==='home')home();
    else if(k==='levels')levels();
    else if(k==='play'){
      const lv=L[+b.dataset.i];if(!lv)return;
      localStorage.setItem('mk_test_game',JSON.stringify({game:lv.data,level:0}));
      full('jbj/play.html?t='+Date.now()+'#test');
    }
    else if(k==='edit'&&window.IS_MOD)full('jbj/index.html');
  };
  home();
}
window.addEventListener('message',async ev=>{
  if(ev.origin!==location.origin||!ev.data)return;
  const t=ev.data.type;
  if(t==='mk-exit'||t==='jbj-close'){close();if($('#v-games')&&!$('#v-games').hidden&&window.IS_MOD&&t==='jbj-close')levels()}
  else if(t==='jbj-publish'&&fr&&ev.source===fr.contentWindow){
    let res={type:'jbj-result',ok:false,err:'нет доступа'};
    if(window.IS_MOD&&window.SB){
      const r=await window.SB.from('jbj_levels').insert({data:ev.data.data,author:ev.data.author||''});
      res=r.error?{type:'jbj-result',ok:false,err:r.error.message}:{type:'jbj-result',ok:true};
    }
    ev.source.postMessage(res,location.origin);
  }
});
window.JBJ={open};
})();
