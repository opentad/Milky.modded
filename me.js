(function(){
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const col=n=>{let x=7;for(const c of n||'?')x=(x*31+c.charCodeAt(0))>>>0;return PAL[x%PAL.length]};
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
function apply(p){
  window.ME_NAME=p.name||'';
  const d=document.querySelector('#dname');
  if(d&&p.name&&d.textContent.indexOf('Имя учителя')<0)d.textContent=p.name;
  const h=document.querySelector('#hello');
  if(h&&p.name&&h.textContent.indexOf('Имя учителя')<0)h.textContent='Мир тебе, '+p.name+'!';
  document.querySelectorAll('.rail .ava,.drawer .ava').forEach(a=>{
    a.style.borderRadius=p.ava_square?'28%':'';
    if(p.avatar_url){
      a.style.cssText='border-radius:'+(p.ava_square?'28%':'50%');
      a.innerHTML='<img alt="">';a.firstChild.src=p.avatar_url;
    }else{
      a.textContent=ini(p.name);
      const big=!!a.closest('.drawer');
      a.style.cssText='border-radius:'+(p.ava_square?'28%':'50%')+';background:'+col(p.name)+';color:#fff;display:grid;place-items:center;font-weight:700;font-size:'+(big?'22px':'11px');
    }
  });
}
async function load(){
  const SB=window.SB;if(!SB)return;
  try{
    const u=(await SB.auth.getUser()).data.user;if(!u)return;
    const r=await SB.from('profiles').select('name,avatar_url,ava_square').eq('id',u.id).maybeSingle();
    if(r.data)apply(r.data);
  }catch(e){}
}
let n=0;
const t=setInterval(()=>{if(window.SB){clearInterval(t);load()}else if(++n>120)clearInterval(t)},250);
document.addEventListener('sb',load);
const pf=document.querySelector('#v-prof');
if(pf)new MutationObserver(()=>{if(pf.hidden)load()}).observe(pf,{attributes:true,attributeFilter:['hidden']});
})();
