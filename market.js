(function () {
  // Проверяем, подключен ли Supabase
  function getSupabase() {
    return window.supabaseClient || window.supabase;
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
        <div style="padding: 20px; max-width: 900px; margin: 0 auto; color: var(--text, #333);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
            <h2>Маркетплейс Аватарок</h2>
            <button id="btnOpenCreator" style="padding: 10px 18px; background: #0083ca; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">
              + Панель Креатора
            </button>
          </div>

          <h3>Доступные аватарки</h3>
          <div id="marketCatalog" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; margin-top: 15px;">
            <p style="color:#888;">Загрузка каталога...</p>
          </div>

          <!-- Модальное окно Креатора -->
          <div id="creatorModal" style="display:none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content:center; align-items:center;">
            <div style="background: white; border-radius: 16px; width: 90%; max-width: 450px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
              <button id="btnCloseCreator" style="position: absolute; right: 15px; top: 15px; border:none; background:none; font-size: 20px; cursor:pointer;">✕</button>
              
              <h3 style="margin-top:0;">Панель Креатора</h3>
              <p style="font-size: 13px; color: #666;">Загрузи свою аватарку на модерацию</p>

              <form id="creatorForm" style="display:flex; flex-direction:column; gap: 12px; margin-top: 15px;">
                <input type="text" id="avatarTitle" placeholder="Название аватарки (напр. Карыч)" required style="padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
                
                <label style="display:flex; flex-direction:column; gap: 5px; font-size: 13px; color: #444;">
                  Выберите картинку (JPG, PNG):
                  <input type="file" id="avatarFileInput" accept="image/*" required style="padding: 5px; border: 1px solid #ccc; border-radius: 8px;">
                </label>

                <div id="avatarPreviewBox" style="display:none; text-align:center; margin-top: 5px;">
                  <img id="avatarPreview" src="" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 2px solid #0083ca;">
                </div>

                <button type="submit" id="btnSubmitItem" style="padding: 12px; background: #00a896; color: white; border:none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                  Отправить на модерацию
                </button>
              </form>

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

              <h4 style="margin: 0 0 10px 0;">🔐 Очередь модерации</h4>
              <div id="moderationQueue" style="max-height: 150px; overflow-y: auto; display:flex; flex-direction:column; gap: 8px;">
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

      // Предпросмотр выбранной картинки
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

      // Отправка в Supabase
      form.onsubmit = async (e) => {
        e.preventDefault();
        const sb = getSupabase();
        if (!sb) return alert('Ошибка: Supabase не найден!');

        const title = document.getElementById('avatarTitle').value.trim();
        const file = fileInput.files[0];
        if (!file) return alert('Выберите файл!');

        const submitBtn = document.getElementById('btnSubmitItem');
        submitBtn.textContent = 'Загрузка...';
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
            alert('Ошибка отправки: ' + error.message);
          } else {
            alert('Успешно отправлено на модерацию!');
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
      if (!sb) return;

      const { data, error } = await sb
        .from('market_items')
        .select('*')
        .eq('status', 'approved')
        .order('id', { ascending: false });

      if (error) {
        catalog.innerHTML = `<p style="color:red;">Ошибка загрузки: ${error.message}</p>`;
        return;
      }

      if (!data || data.length === 0) {
        catalog.innerHTML = '<p style="color:#888;">Каталог пока пуст.</p>';
        return;
      }

      catalog.innerHTML = data.map(item => `
        <div style="background: white; padding: 12px; border-radius: 12px; border: 1px solid #eee; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <img src="${item.image_url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; margin-bottom: 8px; background: #f0f0f0;">
          <div style="font-weight: bold; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
          <button onclick="window.Market.selectAvatar('${item.image_url}')" style="margin-top: 8px; width: 100%; padding: 6px; background: #eef6ff; color: #0083ca; border: 1px solid #0083ca; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
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
        queue.innerHTML = '<p style="font-size: 12px; color: #888; margin: 0;">Очередь модерации пуста</p>';
        return;
      }

      queue.innerHTML = data.map(item => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:#f9f9f9; padding: 8px; border-radius: 8px; font-size: 12px;">
          <div style="display:flex; align-items:center; gap: 8px;">
            <img src="${item.image_url}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
            <span><b>${item.title}</b></span>
          </div>
          <div style="display:flex; gap: 4px;">
            <button onclick="window.Market.approveItem(${item.id})" style="background: #2ec4b6; color:white; border:none; padding: 4px 8px; border-radius: 4px; cursor:pointer;">Одобрить</button>
            <button onclick="window.Market.rejectItem(${item.id})" style="background: #e63946; color:white; border:none; padding: 4px 8px; border-radius: 4px; cursor:pointer;">Удалить</button>
          </div>
        </div>
      `).join('');
    },

    approveItem: async function (id) {
      const sb = getSupabase();
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
