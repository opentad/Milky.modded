(function () {
  function getSupabase() {
    return window.supabaseClient || window.supabase || null;
  }

  window.Market = {
    open: function () {
      this.renderUI();
      this.loadItems();
    },

    hide: function () {
      const el = document.getElementById('v-market');
      if (el) el.style.display = 'none';
    },

    renderUI: function () {
      let container = document.getElementById('v-market');
      if (!container) {
        container = document.createElement('section');
        container.id = 'v-market';
        const main = document.querySelector('.main') || document.body;
        main.appendChild(container);
      }
      container.hidden = false;
      container.style.display = 'block';

      container.innerHTML = `
        <div style="padding: 24px; max-width: 950px; margin: 0 auto; color: var(--text, #333); font-family: inherit;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 24px;">Маркетплейс Аватарок</h2>
            <button id="btnOpenCreator" style="padding: 10px 20px; background: #0083ca; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(0,131,202,0.2);">
              + Панель Креатора
            </button>
          </div>

          <h3 style="margin-bottom: 15px; font-size: 18px;">Доступные аватарки</h3>
          <div id="marketCatalog" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px;">
            <p style="color:#888;">Загрузка каталога с сервера...</p>
          </div>

          <!-- Модальное окно Креатора -->
          <div id="creatorModal" style="display:none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content:center; align-items:center; backdrop-filter: blur(4px);">
            <div style="background: white; border-radius: 20px; width: 90%; max-width: 460px; padding: 28px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); position: relative;">
              <button id="btnCloseCreator" style="position: absolute; right: 18px; top: 18px; border:none; background: #f0f0f0; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
              
              <h3 style="margin:0 0 4px 0; font-size: 20px;">Панель Креатора</h3>
              <p style="font-size: 13px; color: #666; margin-bottom: 20px;">Загрузи свою аватарку на модерацию</p>

              <form id="creatorForm" style="display:flex; flex-direction:column; gap: 14px;">
                <input type="text" id="avatarTitle" placeholder="Название аватарки (например, Карыч)" required style="padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; outline: none;">
                
                <label style="display:flex; flex-direction:column; gap: 6px; font-size: 13px; color: #555; font-weight: 500;">
                  Выберите картинку (JPG, PNG):
                  <input type="file" id="avatarFileInput" accept="image/*" required style="padding: 8px; border: 1px dashed #0083ca; border-radius: 10px; background: #f8fbff; cursor: pointer;">
                </label>

                <div id="avatarPreviewBox" style="display:none; text-align:center; margin-top: 4px;">
                  <img id="avatarPreview" src="" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid #0083ca; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                </div>

                <button type="submit" id="btnSubmitItem" style="padding: 12px; background: #00a896; color: white; border:none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 15px; margin-top: 6px; box-shadow: 0 4px 12px rgba(0,168,150,0.2);">
                  Отправить на модерацию
                </button>
              </form>

              <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">

              <h4 style="margin: 0 0 12px 0; font-size: 15px; display:flex; align-items:center; gap: 6px;">🔐 Очередь модерации</h4>
              <div id="moderationQueue" style="max-height: 160px; overflow-y: auto; display:flex; flex-direction:column; gap: 8px; padding-right: 4px;">
                <p style="font-size: 12px; color: #888; margin: 0;">Загрузка очереди...</p>
              </div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    },

    bindEvents: function () {
      const modal = document.getElementById('creatorModal');
      const btnOpen = document.getElementById('btnOpenCreator');
      const btnClose = document.getElementById('btnCloseCreator');
      const form = document.getElementById('creatorForm');
      const fileInput = document.getElementById('avatarFileInput');
      const previewBox = document.getElementById('avatarPreviewBox');
      const previewImg = document.getElementById('avatarPreview');

      btnOpen.onclick = () => {
        modal.style.display = 'flex';
        this.loadModerationQueue();
      };

      btnClose.onclick = () => {
        modal.style.display = 'none';
      };

      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewBox.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          previewBox.style.display = 'none';
        }
      };

      form.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('avatarTitle').value.trim();
        const file = fileInput.files[0];
        if (!file) return alert('Выберите файл!');

        const sb = getSupabase();
        if (!sb) {
          alert('Ошибка: клиент Supabase не найден на странице!');
          return;
        }

        const submitBtn = document.getElementById('btnSubmitItem');
        submitBtn.textContent = 'Отправка на сервер...';
        submitBtn.disabled = true;

        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Image = event.target.result;

          const { error } = await sb.from('market_items').insert([
            {
              title: title,
              image_url: base64Image,
              status: 'pending',
              author: '@Sumaya_IT'
            }
          ]);

          submitBtn.textContent = 'Отправить на модерацию';
          submitBtn.disabled = false;

          if (error) {
            alert('Ошибка сервера: ' + error.message);
          } else {
            alert('Успешно отправлено! Ожидает модерации.');
            form.reset();
            previewBox.style.display = 'none';
            this.loadModerationQueue();
            this.loadItems();
          }
        };
        reader.readAsDataURL(file);
      };
    },

    loadItems: async function () {
      const catalog = document.getElementById('marketCatalog');
      if (!catalog) return;

      const sb = getSupabase();
      if (!sb) {
        catalog.innerHTML = '<p style="color:red;">Ошибка: нет связи с Supabase.</p>';
        return;
      }

      const { data, error } = await sb
        .from('market_items')
        .select('*')
        .eq('status', 'approved')
        .order('id', { ascending: false });

      if (error) {
        catalog.innerHTML = `<p style="color:red;">Ошибка загрузки каталога: ${error.message}</p>`;
        return;
      }

      if (!data || data.length === 0) {
        catalog.innerHTML = '<p style="color:#888; grid-column: 1/-1;">Каталог пока пуст.</p>';
        return;
      }

      catalog.innerHTML = data.map(item => `
        <div style="background: white; padding: 16px 12px; border-radius: 16px; border: 1px solid #eee; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
          <img src="${item.image_url}" style="width: 72px; height: 72px; object-fit: cover; border-radius: 50%; margin-bottom: 10px; background: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.title}">${item.title}</div>
          <button onclick="window.Market.selectAvatar('${item.image_url}')" style="width: 100%; padding: 7px; background: #eef6ff; color: #0083ca; border: 1px solid #bce2ff; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: bold;">
            Надеть
          </button>
        </div>
      `).join('');
    },

    loadModerationQueue: async function () {
      const queue = document.getElementById('moderationQueue');
      if (!queue) return;

      const sb = getSupabase();
      if (!sb) return;

      const { data, error } = await sb
        .from('market_items')
        .select('*')
        .eq('status', 'pending')
        .order('id', { ascending: false });

      if (error || !data || data.length === 0) {
        queue.innerHTML = '<p style="font-size: 12px; color: #888; margin: 0; text-align: center; padding: 10px 0;">Очередь модерации пуста</p>';
        return;
      }

      queue.innerHTML = data.map(item => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:#f8f9fa; padding: 10px 12px; border-radius: 10px; font-size: 13px; border: 1px solid #eee;">
          <div style="display:flex; align-items:center; gap: 10px; overflow: hidden;">
            <img src="${item.image_url}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
            <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.title}">${item.title}</span>
          </div>
          <div style="display:flex; gap: 6px; flex-shrink: 0;">
            <button onclick="window.Market.approveItem(${item.id})" style="background: #2ec4b6; color:white; border:none; padding: 6px 10px; border-radius: 6px; cursor:pointer; font-weight: bold; font-size: 11px;">Одобрить</button>
            <button onclick="window.Market.rejectItem(${item.id})" style="background: #e63946; color:white; border:none; padding: 6px 10px; border-radius: 6px; cursor:pointer; font-weight: bold; font-size: 11px;">Удалить</button>
          </div>
        </div>
      `).join('');
    },

    approveItem: async function (id) {
      const sb = getSupabase();
      if (!sb) return;

      const { error } = await sb.from('market_items').update({ status: 'approved' }).eq('id', id);
      if (!error) {
        this.loadModerationQueue();
        this.loadItems();
      } else {
        alert('Ошибка: ' + error.message);
      }
    },

    rejectItem: async function (id) {
      const sb = getSupabase();
      if (!sb) return;

      const { error } = await sb.from('market_items').delete().eq('id', id);
      if (!error) {
        this.loadModerationQueue();
      } else {
        alert('Ошибка: ' + error.message);
      }
    },

    selectAvatar: function (url) {
      alert('Аватарка успешно выбрана и применена!');
    }
  };
})();
