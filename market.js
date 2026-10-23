/* Милки — Маркетплейс (Supabase, модерация для @Sumaya_IT, витрина) */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

// Твой ник модератора
const MODERATOR_NICK = 'Sumaya_IT';

let items = [];
let myAvatars = [];
let sb = null;
let currentUser = null;
let currentProfile = null;

// Получаем Supabase клиент (из messenger.js / window.SB)
function getSB(){
  return new Promise(res=>{
    if(window.SB) return res(window.SB);
    let n=0;
    const t=setInterval(()=>{
      if(window.SB){ clearInterval(t); res(window.SB); }
      else if(++n>60){ clearInterval(t); res(null); }
    }, 100);
  });
}

// Каркас секции маркетплейса
const sec=document.createElement('section');
sec.id='v-market';sec.className='mk';sec.hidden=true;
document.querySelector('.main').appendChild(sec);

sec.innerHTML = `
  <div class="mk-cr"><a id="mk-home" style="cursor:pointer">Главная</a> &nbsp;|&nbsp; Маркетплейс</div>
  <h1 class="mk-h1">Маркетплейс</h1>
  
  <div class="mk-banners">
    <div class="mk-banner creator">
      <div class="mk-btxt">
        <h2>Панель управления Креатора</h2>
        <p>Управление своими аватарками и загрузка новых.</p>
        <button class="mk-btn-main" id="mk-open-creator">> Войти</button>
      </div>
      <div class="mk-bimg">🎨</div>
    </div>
    <div class="mk-banner sale">
      <div class="mk-btxt">
        <span class="mk-tag">Новые товары</span>
        <h2>ТВОЯ СКИДКА</h2>
        <button class="mk-btn-sec" id="mk-soon">> Скоро</button>
      </div>
      <div class="mk-bimg">🎁</div>
    </div>
  </div>

  <!-- Модалка креатора и модератора -->
  <div class="mk-modal" id="mk-creator-modal" hidden>
    <div class="mk-modal-content">
      <button class="mk-close" id="mk-close-modal">✕</button>
      <h2>Панель Креатора</h2>
      
      <div class="mk-section-box">
        <h3>Загрузить новую аватарку</h3>
        <input type="text" id="mk-item-name" placeholder="Название аватарки" autocomplete="off">
        <input type="text" id="mk-item-img" placeholder="Ссылка на картинку (например, ava.jpg)" value="ava.jpg" autocomplete="off">
        <button class="mk-action-btn" id="mk-submit-item">Отправить на модерацию</button>
      </div>

      <div class="mk-section-box" id="mk-moderation-box" style="display:none;">
        <h3>🔒 Очередь модерации (доступно только тебе)</h3>
        <div id="mk-mod-list">Загрузка очереди…</div>
      </div>
    </div>
  </div>

  <div class="mk-section-title">
    <h2>Почти даром</h2>
    <button class="mk-all-btn">Смотреть все</button>
  </div>

  <div class="mk-grid" id="mk-grid"></div>
`;

// Стили
const st=document.createElement('style');
st.textContent=`
.mk{padding-bottom:40px}
.mk-cr{font-size:12px;color:#a5a8ac;margin-top:4px}
.mk .mk-h1{font-size:34px;margin:4px 0 20px;font-weight:800;color:var(--tx)}
.mk-banners{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
.mk-banner{background:linear-gradient(135deg, #fef4e7 0%, #fae1cd 100%);border-radius:24px;padding:24px;display:flex;justify-content:space-between;align-items:center;position:relative;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.03)}
.mk-banner.sale{background:linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)}
.mk-btxt h2{font-size:20px;font-weight:800;color:#34404e;margin-bottom:6px}
.mk-btxt p{font-size:13px;color:#7a838c;margin-bottom:14px}
.mk-tag{display:inline-block;font-size:11px;font-weight:700;color:#d97706;margin-bottom:4px;text-transform:uppercase}
.mk-btn-main{background:#00b4d8;color:#fff;border:0;border-radius:12px;padding:8px 18px;font-weight:700;font-size:13px;cursor:pointer}
.mk-btn-sec{background:#fff;color:#d97706;border:0;border-radius:12px;padding:8px 18px;font-weight:700;font-size:13px;cursor:pointer}
.mk-bimg{font-size:48px}

.mk-section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.mk-section-title h2{font-size:22px;font-weight:800;color:#34404e}
.mk-all-btn{background:#eef3f8;border:0;color:#00b4d8;font-weight:700;padding:6px 14px;border-radius:12px;cursor:pointer}

.mk-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(210px, 1fr));gap:16px}
.mk-card{background:#fff;border-radius:20px;padding:12px;box-shadow:0 4px 15px rgba(0,0,0,0.04);display:flex;flex-direction:column;position:relative}
.mk-c-img{width:100%;height:160px;border-radius:14px;background:#f0f3f6;background-size:cover;background-position:center;position:relative;margin-bottom:10px}
.mk-badge-free{position:absolute;top:8px;right:8px;background:rgba(0,180,216,0.9);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px}
.mk-c-title{font-size:14px;font-weight:700;color:#34404e;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-c-author{font-size:11.5px;color:#9aa5b0;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-c-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px;border-top:1px solid #f2f4f8}
.mk-price{font-size:13px;font-weight:800;color:#00b4d8}
.mk-buy-btn{background:#00b4d8;color:#fff;border:0;border-radius:10px;padding:6px 14px;font-weight:700;font-size:12px;cursor:pointer}
.mk-buy-btn.got{background:#2fa876}

.mk-modal{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:100;display:grid;place-items:center;padding:20px}
.mk-modal-content{background:#fff;border-radius:24px;width:100%;max-width:480px;padding:24px;position:relative;max-height:90vh;overflow-y:auto}
.mk-close{position:absolute;top:16px;right:16px;background:#f2f4f8;border:0;width:32px;height:32px;border-radius:50%;font-weight:bold;cursor:pointer}
.mk-section-box{margin-top:16px;padding-top:16px;border-top:1px solid #eee}
.mk-section-box h3{font-size:16px;margin-bottom:10px;color:#34404e}
.mk-section-box input{width:100%;height:42px;border:1px solid #e3e8ee;border-radius:12px;padding:0 12px;margin-bottom:8px;font:inherit;outline:0}
.mk-action-btn{width:100%;height:42px;background:#00b4d8;color:#fff;border:0;border-radius:12px;font-weight:700;cursor:pointer}
.mk-mod-row{display:flex;align-items:center;gap:10px;background:#f9fafc;padding:8px;border-radius:10px;margin-bottom:6px}
.mk-mod-row span{flex:1;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mod-row button{padding:4px 10px;border-radius:8px;border:0;font-weight:700;font-size:11px;cursor:pointer}
.mk-btn-accept{background:#2fa876;color:#fff}
.mk-btn-reject{background:#e5314a;color:#fff}
.mk-empty{text-align:center;color:#9aa5b0;padding:30px;font-size:14px;grid-column:1/-1}
`;
document.head.appendChild(st);

// Загрузка товаров из базы Supabase
async function loadMarketData(){
  sb = await getSB();
  if(!sb) return;

  // Получаем текущего пользователя
  const session = (await sb.auth.getSession()).data.session;
  currentUser = session ? session.user : null;

  if(currentUser){
    const prof = await sb.from('profiles').select('nick, name').eq('id', currentUser.id).maybeSingle();
    currentProfile = prof.data;
  }

  // Загружаем одобренные товары для витрины
  const res = await sb.from('market_items').select('*').eq('status', 'approved').order('created_at', {ascending: false});
  if(!res.error){
    items = res.data || [];
  }
  renderMarket();
}

function renderMarket(){
  const grid = $('#mk-grid');
  if(!items.length){
    grid.innerHTML = '<div class="mk-empty">товаров нет</div>';
    return;
  }

  grid.innerHTML = items.map(item => {
    const isGot = myAvatars.includes(item.id);
    return `
      <div class="mk-card">
        <div class="mk-c-img" style="background-image:url('${esc(item.img)}')">
          <span class="mk-badge-free">Аватарка</span>
        </div>
        <div class="mk-c-title" title="${esc(item.name)}">${esc(item.name)}</div>
        <div class="mk-c-author" title="${esc(item.author)}">${esc(item.author)}</div>
        <div class="mk-c-foot">
          <span class="mk-price">Бесплатно</span>
          <button class="mk-buy-btn ${isGot ? 'got' : ''}" data-get="${item.id}">
            ${isGot ? 'В профиле ✓' : 'Получить'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Загрузка очереди модерации (только для тебя)
async function loadModerationQueue(){
  const list = $('#mk-mod-list');
  const res = await sb.from('market_items').select('*').eq('status', 'pending').order('created_at', {ascending: true});
  
  if(res.error || !res.data.length){
    list.innerHTML = '<div style="font-size:13px;color:#9aa5b0">Очередь модерации пуста</div>';
    return;
  }

  list.innerHTML = res.data.map(item => `
    <div class="mk-mod-row">
      <span><b>${esc(item.name)}</b> (${esc(item.author)})</span>
      <button class="mk-btn-accept" data-accept="${item.id}">Принять</button>
      <button class="mk-btn-reject" data-reject="${item.id}">Отклонить</button>
    </div>
  `).join('');
}

// Клик по элементам маркетплейса
sec.addEventListener('click', async e => {
  const t = e.target;
  sb = await getSB();

  if(t.closest('#mk-home')) {
    if(window.MS) MS.show('home');
  }
  else if(t.closest('#mk-open-creator')) {
    if(!currentUser){
      alert('Сначала войди в аккаунт через мессенджер или профиль!');
      return;
    }
    $('#mk-creator-modal').hidden = false;

    // Проверяем, ты ли это (по нику @Sumaya_IT)
    const modBox = $('#mk-moderation-box');
    if(currentProfile && currentProfile.nick === MODERATOR_NICK){
      modBox.style.display = 'block';
      loadModerationQueue();
    } else {
      modBox.style.display = 'none';
    }
  }
  else if(t.closest('#mk-close-modal')) {
    $('#mk-creator-modal').hidden = true;
  }
  else if(t.closest('#mk-submit-item')) {
    const name = $('#mk-item-name').value.trim();
    const img = $('#mk-item-img').value.trim() || 'ava.jpg';
    if(!name){ alert('Введи название аватарки'); return; }

    const authorName = currentProfile ? (currentProfile.name || 'Креатор') : 'Креатор';

    // Отправляем в Supabase со статусом pending (на модерацию к тебе)
    const res = await sb.from('market_items').insert({
      name: name,
      img: img,
      author: authorName,
      user_id: currentUser.id,
      status: 'pending'
    });

    if(res.error){
      alert('Ошибка отправки: ' + res.error.message);
      return;
    }

    $('#mk-item-name').value = '';
    alert('Аватарка успешно отправлена на модерацию!');
    $('#mk-creator-modal').hidden = true;
  }
  // Модерация: Принять товар
  else if(t.dataset.accept) {
    const id = t.dataset.accept;
    const res = await sb.from('market_items').update({ status: 'approved' }).eq('id', id);
    if(!res.error){
      loadModerationQueue();
      loadMarketData();
    } else {
      alert('Ошибка: ' + res.error.message);
    }
  }
  // Модерация: Отклонить товар
  else if(t.dataset.reject) {
    const id = t.dataset.reject;
    const res = await sb.from('market_items').update({ status: 'rejected' }).eq('id', id);
    if(!res.error){
      loadModerationQueue();
    } else {
      alert('Ошибка: ' + res.error.message);
    }
  }
  // Получить аватарку бесплатно
  else if(t.dataset.get) {
    const id = t.dataset.get;
    if(!myAvatars.includes(id)){
      myAvatars.push(id);
      renderMarket();
      alert('Аватарка добавлена в твой профиль!');
    }
  }
});

// Слушаем событие готовности Supabase
document.addEventListener('sb', () => {
  loadMarketData();
});

// Первичный запуск, если Supabase уже загружен
getSB().then(() => { loadMarketData(); });

window.Market = {
  open: () => { sec.hidden = false; loadMarketData(); },
  hide: () => { sec.hidden = true; }
};

})();
