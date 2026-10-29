/* MilkOffice: сетка инструментов, пока одна карточка (GDevelop) */
(function(){
  const st=document.createElement('style');
  st.textContent='.ofg{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:14px}@media(max-width:700px){.ofg{grid-template-columns:1fr}}.ofc{background:rgba(255,255,255,.75);backdrop-filter:blur(10px);border-radius:20px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;text-align:center;padding-bottom:18px}.ofc .ban{height:150px;font-size:60px}.ofc h3{font-size:18px;font-weight:700;margin:14px 8px 4px}.ofc p{font-size:12px;color:var(--mu);margin:0 14px 14px;line-height:1.5}';
  document.head.appendChild(st);

  const root=()=>document.getElementById('v-office');

  const CARDS=[
    {id:'gdevelop',emoji:'🎮',bg:'linear-gradient(160deg,#c9f0f8,#7ad3f0)',
     title:'GDevelop',
     text:'Конструктор игр без программирования. Игра собирается из блоков и событий: 2D и 3D, управление пальцем, уровни, сохранения. Готовую игру можно выложить на Milky.',
     url:'https://editor.gdevelop.io'}
  ];

  function home(){
    root().innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="ofg">'+
      CARDS.map(c=>`<article class="ofc"><div class="ban" style="background:${c.bg}">${c.emoji}</div><h3>${c.title}</h3><p>${c.text}</p><button class="join" data-of="${c.id}">Открыть</button></article>`).join('')+'</div>';
  }

  function openTool(id){
    const c=CARDS.find(x=>x.id===id);if(!c)return;
    root().innerHTML='<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px"><button class="back" id="of-back" style="margin:0">← К разделу</button><a class="sw" style="display:inline-flex;align-items:center;text-decoration:none" href="'+c.url+'" target="_blank" rel="noopener">Открыть в новой вкладке</a></div><iframe src="'+c.url+'" allow="fullscreen;autoplay;clipboard-read;clipboard-write" style="width:100%;height:calc(100vh - 150px);border:0;border-radius:18px;background:#fff"></iframe>';
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-of]');
    if(b){openTool(b.dataset.of);return}
    if(e.target.closest('#of-back'))home();
  });

  window.RV=window.RV||{};
  window.RV.office=home;
})();
