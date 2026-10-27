/* Дополнительные домашние задания Milky.
   Подключается в index.html одной строкой <script src="hw-extra.js"></script>.
   Новые дз добавляются сюда, index.html трогать не нужно. */
(function () {
  const X = window.HWX, MS = window.MS;
  if (!X || !MS) return;

  /* ---------- ДЗ: Числовая дорога (алгебра, рациональные числа) ---------- */
  X.D.numroad = {
    img: 'formulogia.jpg',
    task: [
      'Алгебра / Тема: рациональные числа',
      'Задание 1. Найди числа на числовой прямой.',
      'Задание 2. Определи натуральные, целые и дробные числа.',
      'Задание 3. Запиши одно число разными дробями.',
      'Задание 4. Переведи дробь в десятичную: дробь — это деление.',
      'Задание 5. Сравни числа.',
      'Пройди все 5 заданий симуляции «Числовая дорога», потом пройди тест.'
    ],
    mat: [],
    sims: ['road'],
    test: [
      { q: 'Переведи дробь 3/4 в десятичную. Подсказка: дробь — это деление. (число)', k: 'n' },
      { q: 'Объясни своими словами: как превратить дробь в десятичную?', k: 't' },
      { q: 'Выбери все целые числа.', k: 'm', o: ['−4', '0', '5,6', '7', '3/4', '−0,7', '28'] },
      { q: 'Выбери все числа, которые больше −3,24.', k: 'm', o: ['−3,42', '−3,2', '0', '−4', '−3,5'] },
      { q: 'Чем отличается 1/3 = 0,(3) от 3/4 = 0,75? Что значат скобки?', k: 't' }
    ]
  };

  X.SIM.road = {
    t: 'Числовая дорога',
    btn: 'Перейти к симуляции',
    d: 'Пройди 5 заданий: числовая прямая, мишени, полоски, деление дробей на монетах и сравнение чисел.',
    m: ['Задание 1: числовая прямая', 'Задание 2: мишени', 'Задание 3: полоски', 'Задание 4: деление', 'Задание 5: сравнение'],
    mount(r, c) {
      const f = document.createElement('iframe');
      f.src = 'learn/algebra/algebra1.html';
      f.allow = 'fullscreen';
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:18px';
      r.appendChild(f);
      const h = e => {
        const m = /^doroga:ok:(\d)$/.exec(String(e.data));
        if (m) c.ok(+m[1]);
      };
      addEventListener('message', h);
      return () => { removeEventListener('message', h); f.remove(); };
    }
  };

  /* ---------- ДЗ: Лаборатория явлений (физика, §1) ---------- */
  X.D.phys1 = {
    img: 'kvantonomika.jpg',
    task: ['Физика / Тема: что изучает физика', 'Пройди 5 опытов в симуляции «Лаборатория явлений», потом пройди тест.'],
    mat: [], sims: ['phys1'],
    test: [{ q: 'Что изучает физика? Объясни своими словами.', k: 't' }]
  };
  X.SIM.phys1 = Object.assign({ t: 'Лаборатория явлений', btn: 'Перейти к симуляции',
    d: 'Пройди 5 опытов: движение, нагревание, зеркало, электризация, магнит.',
    m: ['Опыт 1: движение', 'Опыт 2: нагревание', 'Опыт 3: зеркало', 'Опыт 4: электризация', 'Опыт 5: магнит'] },
    { mount(r, c) { const f = document.createElement('iframe'); f.src = 'learn/physics/physics1.html'; f.allow = 'fullscreen';
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:18px'; r.appendChild(f);
      const h = e => { const m = /^fiz:ok:(\d)$/.exec(String(e.data)); if (m) c.ok(+m[1]); };
      addEventListener('message', h); return () => { removeEventListener('message', h); f.remove(); }; } });

  /* ---------- ДЗ: Лаборатория животных (биология, §1 «Зоология — наука о животных») ---------- */
  X.D.bio1 = {
    img: 'ecoznanie2.jpg',
    task: ['Биология / Тема: зоология — наука о животных', 'Пройди 5 станций в симуляции «Лаборатория животных», потом пройди тест.'],
    mat: [], sims: ['bio1'],
    test: [{ q: 'Что изучает зоология? Объясни своими словами.', k: 't' }]
  };
  X.SIM.bio1 = Object.assign({ t: 'Лаборатория животных', btn: 'Перейти к симуляции',
    d: 'Пройди 5 станций лаборатории животных.',
    m: ['Станция 1', 'Станция 2', 'Станция 3', 'Станция 4', 'Станция 5'] },
    { mount(r, c) { const f = document.createElement('iframe'); f.src = 'learn/biology/biology1.html'; f.allow = 'fullscreen';
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:18px'; r.appendChild(f);
      const h = e => { const m = /^bio:ok:(\d)$/.exec(String(e.data)); if (m) c.ok(+m[1]); };
      addEventListener('message', h); return () => { removeEventListener('message', h); f.remove(); }; } });

  /* ---------- список домашних заданий: [id, предмет, метка, «сдать до»] ---------- */
  const LIST = [
    ['numroad', 'Алгебра', '', '30 Октября 20:00'],
    ['phys1', 'Физика', '', '30 Октября 20:00'],
    ['bio1', 'Биология', '', '30 Октября 20:00']
  ];
  MS.HW.splice(0, MS.HW.length);
  LIST.forEach(w => MS.HW.push(w));

  if (window.HWM && typeof window.HWM.onchange === 'function') window.HWM.onchange();
})();
