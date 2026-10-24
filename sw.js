/* Милки-соцсеть: Service Worker (уведомления) */

self.addEventListener('push', e => {
  let d = {};
  if (e.data) {
    try {
      // Пытаемся прочитать как JSON объект
      d = e.data.json();
    } catch (err) {
      // Если пришла обычная строка, используем её как текст уведомления
      d = { body: e.data.text() };
    }
  }
  
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cl => {
      // Если у пользователя прямо сейчас открыта вкладка соцсети, не надоедаем пушем
      if (cl.some(c => c.visibilityState === 'visible')) return;
      
      // Показываем уведомление безопасно
      return self.registration.showNotification(d.title || 'Милки', {
        body: d.body || '',
        tag: d.tag,
        icon: 'ava.jpg',
        data: { url: './' }
      });
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cl => {
      // Если вкладка уже есть, просто переключаемся на неё
      for (const c of cl) {
        if ('focus' in c) return c.focus();
      }
      // Если вкладок нет, открываем сайт с нуля
      return clients.openWindow(e.notification.data.url);
    })
  );
});
