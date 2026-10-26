/* --- Таймер времени на сайте --- */
(function() {
  let activeSeconds = 0;
  let timerId = null;
  let saveIntervalId = null;

  // Функция форматирования секунд в читаемый вид
  window.formatOnlineTime = function(totalSec) {
    totalSec = parseInt(totalSec || 0, 10);
    if (!totalSec || totalSec <= 0) return '0 мин';

    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(days + ' дн');
    if (hours > 0) parts.push(hours + ' ч');
    if (minutes > 0 || parts.length === 0) parts.push(minutes + ' мин');

    return parts.join(' ');
  };

  function startTimer() {
    if (!timerId) {
      timerId = setInterval(() => {
        if (!document.hidden) activeSeconds++;
      }, 1000);
    }
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Сохранение накопленных секунд в Supabase
  async function syncOnlineTime() {
    if (activeSeconds <= 0 || !window.SB) return;
    const user = (await window.SB.auth.getUser())?.data?.user;
    if (!user) return;

    const addSec = activeSeconds;
    activeSeconds = 0; // Сбрасываем счетчик перед запросом

    // Используем rpc или инкремент через текущее значение
    const { data } = await window.SB.from('profiles').select('online_seconds').eq('id', user.id).maybeSingle();
    const currentTotal = parseInt(data?.online_seconds || 0, 10);
    
    await window.SB.from('profiles').update({
      online_seconds: currentTotal + addSec,
      last_seen: new Date().toISOString()
    }).eq('id', user.id);
  }

  // Отслеживаем активность вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
      syncOnlineTime();
    } else {
      startTimer();
    }
  });

  window.addEventListener('beforeunload', () => {
    syncOnlineTime();
  });

  // Запуск при старте
  startTimer();
  saveIntervalId = setInterval(syncOnlineTime, 30000); // Сохраняем каждые 30 секунд
})();
