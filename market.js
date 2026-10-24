(function () {
  function getSupabase() {
    return window.SB || window.supabaseClient || null;
  }

  window.Coins = {
    set: function (n) {
      document.querySelectorAll('.cn').forEach(e => e.textContent = n);
    },
    refresh: async function () {
      const sb = getSupabase(); if (!sb) return;
      const u = (await sb.auth.getUser()).data.user;
      if (!u) { this.set('0'); return; }
      const r = await sb.from('profiles').select('coins').eq('id', u.id).maybeSingle();
      this.set(r.data ? r.data.coins : 0);
    }
  };
  document.addEventListener('sb', () => {
    Coins.refresh();
    const sb = getSupabase();
    if (sb) sb.auth.onAuthStateChange(() => setTimeout(() => Coins.refresh(), 0));
  });
  document.addEventListener('coins', e => Coins.set(e.detail));
  setInterval(() => Coins.refresh(), 60000);

  const MAXW = { status: 500, banner: 750 };
  function compress(file, kind, crop) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        URL.revokeObjectURL(u);
        const c = document.createElement('canvas');
        if (kind === 'status') {            // строго 500x166
          c.width = 500; c.height = 166;
          c.getContext('2d').drawImage(im, 0, 0, 500, 166);
        } else {                            // баннер: кроп 750x230
          c.width = 750; c.height = 230;
          const k = crop.s, CH = Math.round(300 * 230 / 750), ry = (300 - CH) / 2;
          c.getContext('2d').drawImage(im, -crop.x / k, (ry - crop.y) / k, 300 / k, CH / k, 0, 0, 750, 230);
        }
        c.toBlob(b => b ? res(b) : rej(new Error('сжатие')), 'image/webp', 0.8);
      };
      im.onerror = () => rej(new Error('не картинка'));
      im.src = u;
    });
  }
  const KINDS = { status: 'Статусы', banner: 'Баннеры' };

  window.Market = {
    open: function () {
      this.renderUI();
      this.loadItems();
      this.loadCoins();
    },

    openPurchases: function () {
      this.renderUI();
      const el = document.getElementById('creatorPanel');
      if (el) el.style.display = 'block';
      this.loadMyPurchases();
      const cat = document.getElementById('v-market');
      if (cat) cat.scrollIntoView({ behavior: 'smooth' });
    },

    hide: function () {
      const el = document.getElementById('v-market');
      if (el) el.style.display = 'none';
    },

    isMod: false,
    renderUI: function () {
      let c = document.getElementById('v-market');
      if (!c) {
        c = document.createElement('section'); c.id = 'v-market';
        (document.querySelector('.main') || document.body).appendChild(c);
      }
      c.hidden = false; c.style.display = 'block';
      c.innerHTML = `
      <div style="padding:24px;max-width:1100px;margin:0 auto;font-family:inherit;color:var(--text,#333)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <h2 style="margin:0;font-size:28px;font-weight:400">Маркетплейс</h2>
          <div style="background:#fff;border-radius:14px;padding:8px 16px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.06)">Баланс: <span id="mkCoins">…</span> 🪙</div>
        </div>

        <div style="background:linear-gradient(120deg,#cdeeff,#e6f6ff);border-radius:24px;padding:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
          <div style="font-size:22px;font-weight:600;color:#0b5f8a">Личный кабинет креатора</div>
          <div style="display:flex;gap:10px">
            <button id="btnMod" style="display:none;padding:12px 22px;border:0;border-radius:12px;background:#ffb703;font-weight:700;cursor:pointer">Модерация</button>
            <button id="btnOpenCreator" style="padding:12px 28px;border:0;border-radius:12px;background:#00bcf2;color:#fff;font-weight:700;cursor:pointer">Войти</button>
          </div>
        </div>

        <h3 style="margin:28px 0 14px;font-size:20px">Товары</h3>
        <div id="marketCatalog" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px"></div>

        <div id="creatorPanel" style="display:none;margin-top:28px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <h3 style="margin:0;font-size:22px">Панель управления Креатора</h3>
            <button id="btnAddItem" style="padding:10px 18px;border:1px solid #00bcf2;background:#fff;color:#00a5d6;border-radius:12px;cursor:pointer">+ Добавить товар</button>
          </div>
          <div style="display:flex;gap:10px;margin-bottom:16px">
            <button id="tabMyItems" style="padding:8px 16px;border:0;border-radius:10px;background:#00bcf2;color:#fff;font-weight:700;cursor:pointer">Мои товары</button>
            <button id="tabMyPurchases" style="padding:8px 16px;border:0;border-radius:10px;background:#eee;color:#333;font-weight:700;cursor:pointer">Мои покупки</button>
          </div>
          <div id="myItems" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px"></div>
        </div>

        <div id="modPanel" style="display:none;margin-top:28px">
          <h3 style="font-size:20px">Очередь модерации</h3>
          <div id="moderationQueue" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px"></div>
        </div>

        <div id="creatorModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;justify-content:center;align-items:center">
          <div style="background:#fff;border-radius:20px;width:92%;max-width:560px;max-height:92vh;overflow:auto;padding:26px;position:relative">
            <button id="btnCloseCreator" style="position:absolute;right:16px;top:16px;border:0;background:#f0f0f0;width:32px;height:32px;border-radius:50%;cursor:pointer">✕</button>
            <h3 style="margin:0 0 16px">Загрузка товара</h3>
            <div style="display:flex;gap:10px">
              <input id="itTitle" placeholder="Название" maxlength="40" style="flex:1;padding:12px;border:1px solid #ddd;border-radius:10px">
              <input id="itPrice" type="number" min="1" max="1000" placeholder="Цена" style="width:90px;padding:12px;border:1px solid #ddd;border-radius:10px">
            </div>
            <select id="itKind" style="width:100%;margin-top:12px;padding:12px;border:1px solid #ddd;border-radius:10px;background:#fff">
              <option value="">Выберите тип…</option>
              <option value="status">Статусы</option>
              <option value="banner">Баннеры</option>
            </select>
            <div id="itHint" style="font-size:12px;color:#888;margin:8px 0"></div>
            <input type="file" id="itFile" accept="image/*" disabled style="width:100%;padding:10px;border:1px dashed #00bcf2;border-radius:10px">
            <canvas id="itCv" width="300" height="300" style="display:none;margin:12px auto 0;max-width:100%;border-radius:12px;touch-action:none;background:#eee"></canvas>
            <img id="itPrev" style="display:none;max-width:100%;margin:12px auto 0;border-radius:8px">
            <input type="range" id="itZoom" min="0" max="100" value="0" style="display:none;width:100%;margin-top:8px">
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
              <button id="itCancel" style="padding:10px 20px;border:0;border-radius:10px;background:#0b8bd0;color:#fff;cursor:pointer">Отмена</button>
              <button id="itSend" disabled style="padding:10px 20px;border:0;border-radius:10px;background:#00bcf2;color:#fff;cursor:pointer;opacity:.5">Добавить</button>
            </div>
          </div>
        </div>
      </div>`;
      this.bindEvents();
      this.checkMod();
    },

    checkMod: async function () {
      const sb = getSupabase(); if (!sb) return;
      const u = (await sb.auth.getUser()).data.user; if (!u) return;
      const r = await sb.from('moderators').select('user_id').eq('user_id', u.id).maybeSingle();
      this.isMod = !!r.data;
      if (this.isMod) document.getElementById('btnMod').style.display = 'block';
    },

    bindEvents: function () {
      const $ = id => document.getElementById(id), self = this;
      let crop = null, drag = null;
      const hints = { status: 'Нужна картинка 500×166 пикселей', banner: 'Любая картинка. Двигай её: в рамке то, что попадёт в баннер' };
      const VIEW = 300, CW = 300, CH = Math.round(300 * 230 / 750);

      $('btnOpenCreator').onclick = async () => {
        const sb = getSupabase(), u = sb && (await sb.auth.getUser()).data.user;
        if (!u) return alert('Сначала войди в аккаунт');
        const p = $('creatorPanel'); p.style.display = 'block';
        self.loadMyItems(); p.scrollIntoView({ behavior: 'smooth' });
      };
      
      $('tabMyItems').onclick = () => {
        $('tabMyItems').style.background = '#00bcf2'; $('tabMyItems').style.color = '#fff';
        $('tabMyPurchases').style.background = '#eee'; $('tabMyPurchases').style.color = '#333';
        self.loadMyItems();
      };
      $('tabMyPurchases').onclick = () => {
        $('tabMyPurchases').style.background = '#00bcf2'; $('tabMyPurchases').style.color = '#fff';
        $('tabMyItems').style.background = '#eee'; $('tabMyItems').style.color = '#333';
        self.loadMyPurchases();
      };

      $('btnMod').onclick = () => { $('modPanel').style.display = 'block'; self.loadModerationQueue(); };
      $('btnAddItem').onclick = () => { $('creatorModal').style.display = 'flex'; };
      const close = () => { $('creatorModal').style.display = 'none'; reset(); };
      $('btnCloseCreator').onclick = close; $('itCancel').onclick = close;

      function reset() {
        crop = null; $('itFile').value = ''; $('itFile').disabled = !$('itKind').value;
        ['itCv', 'itPrev', 'itZoom'].forEach(i => $(i).style.display = 'none');
        $('itSend').disabled = true; $('itSend').style.opacity = .5;
      }
      $('itKind').onchange = () => {
        reset(); const k = $('itKind').value;
        $('itHint').textContent = hints[k] || ''; $('itFile').disabled = !k;
      };

      function paint() {
        const cv = $('itCv'), x = cv.getContext('2d');
        x.clearRect(0, 0, VIEW, VIEW);
        x.drawImage(crop.img, crop.x, crop.y, crop.img.width * crop.s, crop.img.height * crop.s);
        const rx = (VIEW - CW) / 2, ry = (VIEW - CH) / 2;
        x.fillStyle = 'rgba(0,0,0,.6)'; x.beginPath(); x.rect(0, 0, VIEW, VIEW); x.rect(rx, ry, CW, CH); x.fill('evenodd');
        x.strokeStyle = '#fff'; x.lineWidth = 2; x.strokeRect(rx, ry, CW, CH);
      }
      function clamp() {
        const rx = (VIEW - CW) / 2, ry = (VIEW - CH) / 2, iw = crop.img.width * crop.s, ih = crop.img.height * crop.s;
        crop.x = Math.min(rx, Math.max(VIEW - rx - iw, crop.x));
        crop.y = Math.min(ry, Math.max(VIEW - ry - ih, crop.y));
      }

      $('itFile').onchange = e => {
        const f = e.target.files[0], k = $('itKind').value; if (!f) return;
        const u = URL.createObjectURL(f), img = new Image();
        img.onload = () => {
          if (k === 'status') {
            $('itPrev').src = u; $('itPrev').style.display = 'block';
            if (img.width !== 500 || img.height !== 166)
              $('itHint').textContent = `Размер ${img.width}×${img.height}, будет подогнан к 500×166`;
          } else {
            const min = Math.max(CW / img.width, CH / img.height);
            crop = { img, min, s: min, x: VIEW / 2 - img.width * min / 2, y: VIEW / 2 - img.height * min / 2 };
            clamp(); $('itCv').style.display = 'block'; $('itZoom').style.display = 'block'; $('itZoom').value = 0; paint();
          }
          $('itSend').disabled = false; $('itSend').style.opacity = 1;
        };
        img.src = u;
      };
      $('itZoom').oninput = e => {
        const ox = (VIEW / 2 - crop.x) / crop.s, oy = (VIEW / 2 - crop.y) / crop.s;
        crop.s = crop.min * (1 + 3 * e.target.value / 100);
        crop.x = VIEW / 2 - ox * crop.s; crop.y = VIEW / 2 - oy * crop.s; clamp(); paint();
      };
      const cv = $('itCv');
      cv.onpointerdown = e => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY }; };
      cv.onpointermove = e => {
        if (!drag || !crop) return;
        const k = VIEW / cv.getBoundingClientRect().width;
        crop.x += (e.clientX - drag.x) * k; crop.y += (e.clientY - drag.y) * k;
        drag = { x: e.clientX, y: e.clientY }; clamp(); paint();
      };
      cv.onpointerup = cv.onpointercancel = () => { drag = null; };

      $('itSend').onclick = async () => {
        const title = $('itTitle').value.trim(), price = +$('itPrice').value, kind = $('itKind').value, f = $('itFile').files[0];
        if (!title || !(price > 0) || !kind || !f) return alert('Заполни название, цену, тип и файл');
        const sb = getSupabase(), u = (await sb.auth.getUser()).data.user;
        if (!u) return alert('Войди в аккаунт');
        const btn = $('itSend'); btn.disabled = true; btn.textContent = 'Загрузка…';
        try {
          const blob = await compress(f, kind, crop);
          const fd = new FormData(); fd.append('file', blob); fd.append('upload_preset', 'milk_img');
          const rs = await fetch('https://api.cloudinary.com/v1_1/z8gpeqex/image/upload', { method: 'POST', body: fd });
          const js = await rs.json(); if (!js.secure_url) throw new Error(js.error && js.error.message || 'ошибка');
          const url = js.secure_url;
          const ins = await sb.from('market_items').insert({ title, price, kind, image_url: url, status: 'pending' });
          if (ins.error) throw ins.error;
          alert('Отправлено на модерацию');
          $('itTitle').value = ''; $('itPrice').value = ''; close();
          self.loadMyItems(); 
        } catch (err) { alert('Ошибка: ' + err.message); }
        btn.textContent = 'Добавить'; btn.disabled = !$('itFile').files[0];
      };
      this.loadItems();
    },

    card: function (it, actions, badge) {
      const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
      return `<div style="background:#fff;border-radius:22px;padding:16px;box-shadow:0 6px 24px rgba(0,0,0,.05);display:flex;gap:14px;align-items:center">
        <div style="position:relative;flex:none;width:130px;display:grid;place-items:center">
          <img src="${esc(it.image_url)}" loading="lazy" style="max-width:130px;max-height:90px;border-radius:8px">
        </div>
        <div style="flex:1;min-width:0">
          <span style="font-size:11px;border:1px solid #00bcf2;color:#00a5d6;border-radius:12px;padding:2px 9px">${KINDS[it.kind] || 'Статусы'}</span>
          ${badge || ''}
          <div style="font-size:17px;margin:6px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it.title)}</div>
          <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:20px">${it.price || 10} 🪙</b>${actions}</div>
        </div></div>`;
    },
    loadItems: async function () {
      const el = document.getElementById('marketCatalog'), sb = getSupabase(); if (!el || !sb) return;
      const me = (await sb.auth.getUser()).data.user;
      const r = await sb.from('market_items').select('*').eq('status', 'approved').order('id', { ascending: false });
      if (r.error) { el.innerHTML = '<p style="color:red">' + r.error.message + '</p>'; return; }
      let bought = new Set();
      if (me) {
        const p = await sb.from('purchases').select('item_id').eq('buyer', me.id);
        bought = new Set((p.data || []).map(x => x.item_id));
      }
      const btn = (t, on, dis) => `<button ${dis ? 'disabled' : ''} onclick="${on}" style="padding:10px 20px;border:0;border-radius:12px;background:${dis ? '#cfd5df' : '#00bcf2'};color:#fff;font-weight:700">${t}</button>`;
      el.innerHTML = (r.data || []).map(i => this.card(i,
        me && i.user_id === me.id ? btn('Ваш товар', '', true)
        : bought.has(i.id) ? btn('Куплено', '', true)
        : btn('Купить', `Market.buy(${i.id})`)
      )).join('') || '<p style="color:#888">Пока нет товаров</p>';
    },
    loadCoins: async function () {
      const sb = getSupabase(); if (!sb) return;
      const me = (await sb.auth.getUser()).data.user; if (!me) return;
      const r = await sb.from('profiles').select('coins').eq('id', me.id).maybeSingle();
      this.setCoins(r.data ? r.data.coins : 0);
    },
    setCoins: function (n) {
      const el = document.getElementById('mkCoins'); if (el) el.textContent = n;
      document.dispatchEvent(new CustomEvent('coins', { detail: n }));
    },
    buy: async function (id) {
      if (!confirm('Купить этот товар?')) return;
      const r = await getSupabase().rpc('buy_item', { p_item: id });
      if (r.error) return alert(r.error.message);
      this.setCoins(r.data);
      alert('Куплено!');
      this.loadItems();
    },
    loadMyItems: async function () {
      const el = document.getElementById('myItems'), sb = getSupabase(); if (!el || !sb) return;
      const u = (await sb.auth.getUser()).data.user;
      const r = await sb.from('market_items').select('*').eq('user_id', u.id).order('id', { ascending: false });
      const B = { approved: ['Продаётся', '#2e9e3e'], pending: ['На модерации', '#e6a100'] };
      el.innerHTML = (r.data || []).map(i => {
        const b = B[i.status] || B.pending;
        return this.card(i, `<button onclick="Market.removeItem(${i.id})" style="padding:10px 18px;border:0;border-radius:12px;background:#d62839;color:#fff;font-weight:700">Удалить</button>`,
          `<span style="font-size:11px;color:#fff;background:${b[1]};border-radius:10px;padding:2px 9px;margin-left:6px">${b[0]}</span>`);
      }).join('') || '<p style="color:#888;grid-column:1/-1">У вас пока нет товаров</p>';
    },
    loadMyPurchases: async function () {
      const el = document.getElementById('myItems'), sb = getSupabase(); if (!el || !sb) return;
      const u = (await sb.auth.getUser()).data.user; if (!u) return;
      const p = await sb.from('purchases').select('item_id').eq('buyer', u.id);
      const ids = (p.data || []).map(x => x.item_id);
      if (!ids.length) {
        el.innerHTML = '<p style="color:#888;grid-column:1/-1">У вас пока нет купленных товаров</p>';
        return;
      }
      const r = await sb.from('market_items').select('*').in('id', ids).order('id', { ascending: false });
      el.innerHTML = (r.data || []).map(i => {
        const applyAction = i.kind === 'banner' 
          ? `Market.applyCover('${i.image_url}')` 
          : `Market.applyPlate('${i.image_url}')`;
        return this.card(i, `<button onclick="${applyAction}" style="padding:10px 18px;border:0;border-radius:12px;background:#2ec4b6;color:#fff;font-weight:700">Установить</button>`);
      }).join('') || '<p style="color:#888;grid-column:1/-1">У вас пока нет купленных товаров</p>';
    },
    applyCover: async function (url) {
      const sb = getSupabase();
      const r = await sb.rpc('set_cover', { p_url: url });
      if (r.error) return alert(r.error.message);
      alert('Баннер успешно установлен в профиль!');
    },
    applyPlate: async function (url) {
      const sb = getSupabase();
      const r = await sb.rpc('set_plate', { p_url: url });
      if (r.error) return alert(r.error.message);
      alert('Статус (плашка) успешно установлен в профиль!');
    },
    loadModerationQueue: async function () {
      const el = document.getElementById('moderationQueue'), sb = getSupabase(); if (!el || !sb || !this.isMod) return;
      const r = await sb.from('market_items').select('*').eq('status', 'pending').order('id');
      el.innerHTML = (r.data || []).map(i => this.card(i,
        `<span style="display:flex;gap:6px"><button onclick="Market.approveItem(${i.id})" style="padding:8px 12px;border:0;border-radius:10px;background:#2ec4b6;color:#fff;font-weight:700">Одобрить</button><button onclick="Market.rejectItem(${i.id})" style="padding:8px 12px;border:0;border-radius:10px;background:#e63946;color:#fff;font-weight:700">Отклонить</button></span>`)
      ).join('') || '<p style="color:#888">Очередь пуста</p>';
    },
    approveItem: async function (id) {
      const r = await getSupabase().from('market_items').update({ status: 'approved' }).eq('id', id);
      if (r.error) return alert(r.error.message);
      this.loadModerationQueue(); this.loadItems();
    },
    rejectItem: async function (id) { await this.removeItem(id, true); },
    removeItem: async function (id, fromMod) {
      if (!fromMod && !confirm('Удалить товар?')) return;
      const sb = getSupabase(), it = (await sb.from('market_items').select('image_url').eq('id', id).maybeSingle()).data;
      const r = await sb.from('market_items').delete().eq('id', id);
      if (r.error) return alert(r.error.message);
      const p = it && it.image_url && it.image_url.split('/market/')[1];
      if (p) sb.storage.from('market').remove([decodeURIComponent(p.split('?')[0])]);
      this.loadMyItems(); this.loadModerationQueue(); this.loadItems();
    }
  };
})();
