
document.addEventListener('DOMContentLoaded', () => {

    /* ============================
       1. БУРГЕР-МЕНЮ
       ============================ */
    const burgerBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
  
    if (burgerBtn && mobileMenu) {
      burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        const isOpen = burgerBtn.classList.contains('open');
        mobileMenu.style.transform = isOpen ? 'translateY(0)' : 'translateY(-100%)';
      });
  
      // Закрываем меню при клике по ссылке
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          burgerBtn.classList.remove('open');
          mobileMenu.style.transform = 'translateY(-100%)';
        });
      });
    }
  
    /* ============================
       3. СЛАЙДЕР ПРОГРАММ
       ============================ */
  
    // Проверим, есть ли блок слайдера на странице
    const sliderContainer = document.querySelector('#programs-slider');
    const sliderPrev = document.querySelector('#slider-prev');
    const sliderNext = document.querySelector('#slider-next');
    const sliderDotsContainer = document.querySelector('#slider-dots');
  
    if (sliderContainer && sliderPrev && sliderNext && sliderDotsContainer) {
      class ProgramSlider {
        constructor(slider, prevBtn, nextBtn, dotsContainer) {
          this.slider = slider;
          this.prevBtn = prevBtn;
          this.nextBtn = nextBtn;
          this.dotsContainer = dotsContainer;
          this.slides = slider.querySelectorAll('.program-slide');
          this.currentIndex = 0;
          this.slidesPerView = this.getSlidesPerView();
          this.totalSlides = this.slides.length;
  
          this.init();
        }
  
        // Вычисляем, сколько карточек помещается в видимой области
        getSlidesPerView() {
          if (window.innerWidth >= 1024) return 4; // десктоп
          if (window.innerWidth >= 768) return 2;  // планшет
          return 1;                                // телефон
        }
  
        // Создаём точки-индикаторы
        createDots() {
          this.dotsContainer.innerHTML = '';
          const dotsCount = Math.ceil(this.totalSlides / this.slidesPerView);
          for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
          }
          this.dots = this.dotsContainer.querySelectorAll('.slider-dot');
        }
  
        // Переход к слайду
        goToSlide(index) {
          const dotsCount = Math.ceil(this.totalSlides / this.slidesPerView);
          if (index < 0) index = dotsCount - 1;
          if (index >= dotsCount) index = 0;
          this.currentIndex = index;
          const offset = -(index * 100);
          this.slider.style.transform = `translateX(${offset}%)`;
  
          // обновляем активную точку
          this.dots.forEach(dot => dot.classList.remove('active'));
          if (this.dots[index]) this.dots[index].classList.add('active');
        }
  
        nextSlide() { this.goToSlide(this.currentIndex + 1); }
        prevSlide() { this.goToSlide(this.currentIndex - 1); }
  
        // Обновляем количество видимых карточек при изменении размера окна
        onResize() {
          const oldSlidesPerView = this.slidesPerView;
          this.slidesPerView = this.getSlidesPerView();
          if (oldSlidesPerView !== this.slidesPerView) {
            this.createDots();
            this.goToSlide(0);
          }
        }
  
        init() {
          this.createDots();
          this.prevBtn.addEventListener('click', () => this.prevSlide());
          this.nextBtn.addEventListener('click', () => this.nextSlide());
          window.addEventListener('resize', () => this.onResize());
        }
      }
  
      // Инициализируем слайдер
      new ProgramSlider(sliderContainer, sliderPrev, sliderNext, sliderDotsContainer);
    }
  
    /* ============================
       4. ПЛАВНЫЙ СКРОЛЛ (если есть якоря внутри страницы)
       ============================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
  
        // Применяем только для ссылок на этой же странице
        const samePage = this.pathname === location.pathname && this.host === location.host;
        if (!samePage) return;
  
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
  }); // конец DOMContentLoaded
  // ===============================
// NAV: авто-активатор и scroll-spy
// ===============================
(function(){
  const header = document.querySelector('#main-nav');
  const desktopNav = header ? header.querySelector('nav.hidden.lg\\:block, nav[aria-label="Основная навигация"]') : null;
  const mobileNav = document.querySelector('#mobile-menu');
  const allNavLinks = [
    ...Array.from(desktopNav ? desktopNav.querySelectorAll('a[href]') : []),
    ...Array.from(mobileNav ? mobileNav.querySelectorAll('a[href]') : [])
  ];

  // 1) Автоподсветка по текущему URL
  const currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function setActiveByUrl(){
    allNavLinks.forEach(a => a.classList.remove('active'));
    // index: допускаем "" и "index.html"
    allNavLinks.forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (
        (currentPath === '' && (href === '' || href === 'index.html')) ||
        (currentPath === 'index.html' && (href === 'index.html' || href === './' || href === '')) ||
        (href === currentPath)
      ){
        a.classList.add('active');
      }
    });
  }

  setActiveByUrl();

  // 2) Мгновенная подсветка по клику (визуальная обратная связь),
  //    плюс закрываем мобильное меню после перехода
  allNavLinks.forEach(a => {
    a.addEventListener('click', () => {
      allNavLinks.forEach(l => l.classList.remove('active'));
      a.classList.add('active');

      // Закрыть мобильное меню, если оно открыто
      const btn = document.getElementById('mobile-menu-btn');
      if (mobileNav && btn && !mobileNav.classList.contains('-translate-y-full')) {
        btn.classList.remove('active');
        mobileNav.classList.add('-translate-y-full');
      }
    }, { passive: true });
  });

  // 3) Scroll-Spy (подсветка в зависимости от видимого блока на странице)
  // Работает для ссылок, ведущих на якоря текущей страницы (#about, #docs, и т.п.)
  const sectionTargets = document.querySelectorAll('[data-section-id]');
  if (sectionTargets.length){
    const linkMap = new Map(); // sectionId -> [links]
    allNavLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')){
        const id = href.slice(1);
        if (!linkMap.has(id)) linkMap.set(id, []);
        linkMap.get(id).push(a);
      } else if (href.includes('#')){
        // поддержка относительных ссылок вида "index.html#about" когда мы на index.html
        try{
          const url = new URL(href, location.href);
          if (url.pathname.split('/').pop().toLowerCase() === currentPath && url.hash){
            const id = url.hash.slice(1);
            if (!linkMap.has(id)) linkMap.set(id, []);
            linkMap.get(id).push(a);
          }
        }catch(e){}
      }
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section-id');
        const links = linkMap.get(id) || [];
        if (entry.isIntersecting){
          // снять active со всех внутренних якорных ссылок
          linkMap.forEach(list => list.forEach(l => l.classList.remove('active')));
          // включить актив у текущих
          links.forEach(l => l.classList.add('active'));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 });

    sectionTargets.forEach(sec => io.observe(sec));
  }
})();
// ====================== ABOUT GALLERY (auto + swipe) ======================
(function initAboutGallery(){
  const viewport = document.getElementById('about-gallery');
  if(!viewport) return;

  const track = viewport.querySelector('.ag-track');
  let slides = Array.from(track.children);
  const slideCount = slides.length;

  // Клонируем первый и последний для бесконечного цикла
  const firstClone = slides[0].cloneNode(true);
  const lastClone  = slides[slides.length - 1].cloneNode(true);
  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  // Обновляем список и ставим стартовую позицию на "первый реальный" слайд
  slides = Array.from(track.children);
  let index = 1; // из-за клона
  const slideWidth = () => viewport.clientWidth;

  function setPosition(animate = true){
    if(!animate) track.style.transition = 'none';
    track.style.transform = `translateX(${-index * slideWidth()}px)`;
    if(!animate){
      // форс-рефлоу чтобы убрать "залипание" transition
      // eslint-disable-next-line no-unused-expressions
      track.offsetHeight;
      track.style.transition = '';
    }
  }

  setPosition(false);

  // Автоплей
  let autoplayMs = 3000;
  let timer = setInterval(next, autoplayMs);

  function next(){
    index++;
    setPosition(true);
  }
  function prev(){
    index--;
    setPosition(true);
  }

  // Зацикливание на границах
  track.addEventListener('transitionend', () => {
    if(index === slides.length - 1){ // ушли на клон первого
      index = 1;
      setPosition(false);
    }
    if(index === 0){ // ушли на клон последнего
      index = slides.length - 2;
      setPosition(false);
    }
  });

  // Свайп/drag (тач и мышь)
  let startX = 0, currentX = 0, isDown = false, moved = false;

  function pointerDown(clientX){
    isDown = true; moved = false;
    startX = clientX; currentX = clientX;
    viewport.classList.add('grabbing');
    clearInterval(timer); // при ручном свайпе — стопаем автоплей
    track.style.transition = 'none';
  }
  function pointerMove(clientX){
    if(!isDown) return;
    moved = true;
    currentX = clientX;
    const delta = currentX - startX;
    track.style.transform = `translateX(${-(index * slideWidth()) + delta}px)`;
  }
  function pointerUp(){
    if(!isDown) return;
    viewport.classList.remove('grabbing');
    track.style.transition = ''; // вернуть анимацию
    const delta = currentX - startX;
    const threshold = slideWidth() * 0.15; // 15% ширины — порог свайпа

    if(moved && Math.abs(delta) > threshold){
      if(delta < 0) next(); else prev();
    }else{
      setPosition(true);
    }
    isDown = false;
    timer = setInterval(next, autoplayMs); // запускаем автоплей снова
  }

  // Touch
  viewport.addEventListener('touchstart', e => pointerDown(e.touches[0].clientX), {passive: true});
  viewport.addEventListener('touchmove',  e => pointerMove(e.touches[0].clientX), {passive: true});
  viewport.addEventListener('touchend',   pointerUp, {passive: true});
  viewport.addEventListener('touchcancel',pointerUp, {passive: true});

  // Mouse
  viewport.addEventListener('mousedown', e => pointerDown(e.clientX));
  window.addEventListener('mousemove',   e => pointerMove(e.clientX));
  window.addEventListener('mouseup',     pointerUp);

  // На ресайз — пересчитать позицию
  window.addEventListener('resize', () => setPosition(false));
})();
// ===== NEWS: "Показать ещё" =====
(function(){
  const grid = document.getElementById('news-grid');
  const btn  = document.getElementById('see-more-news');
  if (!grid || !btn) return;

  // гарантируем, что по умолчанию видны только первые 6
  grid.classList.add('al-see-more');

  btn.addEventListener('click', () => {
    grid.classList.remove('al-see-more'); // показать все карточки
    btn.remove();                         // убрать кнопку
  });
})();
// ===== THANKS: "Показать ещё" =====
(function(){
  const grid = document.getElementById('thanks-grid');
  const btn  = document.getElementById('see-more-btn');
  if (!grid || !btn) return;

  // по умолчанию показываем только 6
  grid.classList.add('al-see-more');

  btn.addEventListener('click', () => {
    grid.classList.remove('al-see-more'); // показать все карточки
    btn.remove();                         // убрать кнопку
  });
})();
// Универсальный "Показать ещё"
document.addEventListener('DOMContentLoaded', () => {
  // 1) Пробегаемся по всем сеткам и помечаем те, где карточек ≤6 — чтобы скрыть кнопку.
  document.querySelectorAll('.al-see-more').forEach(grid => {
    const items = grid.children.length;
    if (items <= 6) {
      grid.classList.add('has-6-or-less');
      const btn = grid.parentElement.querySelector('.al-see-more-btn');
      if (btn) btn.style.display = 'none';
    }
  });

  // 2) Вешаем клики на кнопки
  // Вариант №1 — кнопка с data-see-more-target (как в благодарностях)
  document.querySelectorAll('[data-see-more-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSel = btn.getAttribute('data-see-more-target');
      const grid = document.querySelector(targetSel);
      if (!grid) return;
      grid.classList.remove('al-collapsed');
      btn.remove(); // можно заменить на смену текста, если хочешь
    });
  });

  // Вариант №2 — конкретная кнопка по id (как у новостей)
  const newsBtn = document.getElementById('see-more-news');
  if (newsBtn) {
    const grid = document.getElementById('news-grid');
    newsBtn.addEventListener('click', () => {
      if (!grid) return;
      grid.classList.remove('al-collapsed');
      newsBtn.remove();
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Скрыть кнопки, если карточек <= 6
  document.querySelectorAll('.al-see-more').forEach(grid => {
    if (grid.children.length <= 6) {
      const btn = grid.parentElement.querySelector('button[id^="see-more"], [data-see-more-target]');
      if (btn) btn.style.display = 'none';
    }
  });

  // Вариант 1: кнопка с data-see-more-target (как под благодарностями на news.html)
  document.querySelectorAll('[data-see-more-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-see-more-target');
      const grid = document.querySelector(sel);
      if (grid) grid.classList.remove('al-collapsed');
      btn.remove();
    });
  });

  // Вариант 2: кнопка с конкретным id (как у новостей и как на thanks.html)
  ['see-more-news','see-more-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      // Ищем ближайшую "ал-see-more" в том же секционном блоке
      let grid = btn.closest('section, .max-w-7xl, main, body').querySelector('.al-see-more');
      if (!grid) grid = document.getElementById('news-grid'); // на всякий случай
      if (grid) grid.classList.remove('al-collapsed');
      btn.remove();
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const thanksGrid = document.getElementById('thanks-grid-news');
  const thanksBtn  = document.getElementById('see-more-thanks');

  if (!thanksGrid || !thanksBtn) return;

  // Спрятать кнопку, если карточек <= 6 (тогда разворачивать нечего)
  if (thanksGrid.children.length <= 6) {
    thanksBtn.style.display = 'none';
    return;
  }

  // Клик "Показать ещё" — снимаем свёртку только у благодарностей
  thanksBtn.addEventListener('click', () => {
    thanksGrid.classList.remove('al-collapsed');

    // На всякий случай (если по каким-то причинам нет CSS-правил):
    [...thanksGrid.children].forEach((el) => { el.style.display = ''; });

    thanksBtn.remove();
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // спрятать кнопки, если карточек <= 6
  document.querySelectorAll('.al-see-more').forEach(grid => {
    const btn = document.querySelector(`[data-see-more-target="#${grid.id}"]`);
    if (btn && grid.children.length <= 6) btn.style.display = 'none';
  });

  // единый делегированный обработчик "Показать ещё" (работает как у новостей)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-see-more-target]');
    if (!btn) return;

    const sel = btn.getAttribute('data-see-more-target');
    const grid = document.querySelector(sel);
    if (!grid) return;

    // снимаем свернутый режим
    grid.classList.remove('al-collapsed');

    // страховка: если на детях были inline-стили display:none — удалим их
    Array.from(grid.children).forEach(el => {
      if (el.style && el.style.display) el.style.removeProperty('display');
    });

    // aria и удаление кнопки (как у новостей)
    btn.setAttribute('aria-expanded', 'true');
    btn.remove();
  });
  // === СОРТИРОВКА НОВОСТЕЙ: новые → старые ===
(function sortNewsByDateDesc(){
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.news-item'));

  // Парсим дату из "Дата – dd.mm.yyyy" или из data-date, если вдруг появится
  function getTime(el) {
    // 1) приоритет: data-date в ISO (yyyy-mm-dd), если когда-нибудь добавишь
    const iso = el.getAttribute('data-date');
    if (iso) {
      const t = Date.parse(iso);
      if (!Number.isNaN(t)) return t;
    }
    // 2) текущий формат в разметке: "Дата – dd.mm.yyyy"
    const m = el.textContent.match(/Дата[^0-9]*?(\d{2})\.(\d{2})\.(\d{4})/);
    if (!m) return 0;
    const [ , dd, mm, yyyy ] = m;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
  }

  items.sort((a, b) => getTime(b) - getTime(a)); // по убыванию (новые первыми)
  items.forEach(el => grid.appendChild(el));      // переотрисовываем порядок
})();

  // 1) Приводим карточки к стилю news-item (для общих CSS)
  items.forEach(el => {
    el.classList.add('news-item');                 // общий вид как у новостей
    el.classList.remove('g-item');                 // снимаем старый класс, если есть
  });

  // 2) Сортируем по дате: приоритет data-date="YYYY-MM-DD"; fallback "dd.mm.yyyy" в тексте
  const getTime = (el) => {
    const iso = el.getAttribute('data-date');
    if (iso) {
      const t = Date.parse(iso);
      if (!Number.isNaN(t)) return t;
    }
    const m = el.textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!m) return 0;
    const [, dd, mm, yyyy] = m;
    return new Date(+yyyy, +mm - 1, +dd).getTime();
  };

  items.sort((a,b) => getTime(b) - getTime(a));
  items.forEach(el => grid.appendChild(el));

  // 3) Гарантируем наличие нужных подпунктов: картинка грамоты, дата, от кого
  // (ничего не ломаем, только добавим классы, если они уже есть в разметке)
  items.forEach(card => {
    // картинка
    const img = card.querySelector('img');
    if (img) img.classList.add('ln-img'); // 16:9 и cover из блока новостей

    // дата
    const dateEl = card.querySelector('.g-date, .thanks-date, time, .date');
    if (dateEl) dateEl.classList.add('ln-date');

    // от кого
    const fromEl = card.querySelector('.g-title, .thanks-title, h3, .title');
    if (fromEl) fromEl.classList.add('ln-title');
  });
  // === Перекрашиваем hero в "Активные сборы" и "Благодарности" без правок HTML ===
(function brandHeroSections() {
  const wanted = new Set(["активные сборы", "благодарности"]);

  // ищем h1/h2 с нужным текстом (регистронезависимо), поднимаемся до ближайшей секции и красим её
  document.querySelectorAll("h1, h2").forEach(h => {
    const t = (h.textContent || "").trim().toLowerCase();
    if (!wanted.has(t)) return;

    const sec = h.closest("section") || h.parentElement;
    if (sec) sec.classList.add("hero-brand");
  });

  // если на странице body успели покрасить в белый классами — убираем их влияние
  document.body.classList.remove("bg-white");
})();

})();
// === Formspree: AJAX + внутренние уведомления ===
document.querySelectorAll('form[action*="formspree.io"]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn   = form.querySelector('button[type="submit"]');
    const originalTxt = submitBtn ? submitBtn.innerHTML : null;

    // кнопка в режим "отправка"
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Отправка…';
      submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
    }

    const fd = new FormData(form);

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      const alertEl = document.getElementById('alert-modal');
      const helpEl  = document.getElementById('help-modal');

      if (resp.ok) {
        // успех: закрываем форму, показываем ваш alert
        form.reset();
        if (helpEl)  closeModal(helpEl);

        document.getElementById('alert-title').textContent   = 'Сообщение отправлено';
        document.getElementById('alert-message').textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами.';
        if (alertEl) openModal(alertEl);
      } else {
        // ошибка от Formspree
        document.getElementById('alert-title').textContent   = 'Ошибка отправки';
        document.getElementById('alert-message').textContent = 'Не удалось отправить сообщение. Попробуйте позже.';
        if (alertEl) openModal(alertEl);
      }
    } catch (err) {
      // сеть/исключение
      document.getElementById('alert-title').textContent   = 'Сбой сети';
      document.getElementById('alert-message').textContent = 'Проверьте подключение и повторите попытку.';
      const alertEl = document.getElementById('alert-modal');
      if (alertEl) openModal(alertEl);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalTxt;
        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
      }
    }
  });
});

// Кнопки закрытия alert-модалки
document.getElementById('alert-ok')?.addEventListener('click', () => {
  const m = document.getElementById('alert-modal'); if (m) closeModal(m);
});
document.getElementById('alert-close')?.addEventListener('click', () => {
  const m = document.getElementById('alert-modal'); if (m) closeModal(m);
});
// клик по фону alert-модалки — тоже закрыть
document.getElementById('alert-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'alert-modal') { const m = e.currentTarget; closeModal(m); }
});
