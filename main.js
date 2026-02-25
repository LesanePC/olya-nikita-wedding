document.addEventListener('DOMContentLoaded', () => {
  // ===== Центрируем все галереи =====
  document
    .querySelectorAll('.palette__window, .palette__window_shoes')
    .forEach(p => {
      p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2;
    });

  // ===== Слайдеры =====
  document.querySelectorAll('.slider').forEach(slider => {
    const slides = slider.querySelectorAll('.slides img');
    let index = 0;

    slides[index].classList.add('active');

    slider.querySelector('.left')?.addEventListener('click', () => {
      slides[index].classList.remove('active');
      index = (index - 1 + slides.length) % slides.length;
      slides[index].classList.add('active');
    });

    slider.querySelector('.right')?.addEventListener('click', () => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    });
  });

  // ===== Анимация появления секций =====
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );
  reveals.forEach(el => revealObserver.observe(el));

  // Fallback: если IntersectionObserver не сработал
  setTimeout(() => {
    reveals.forEach(el => el.classList.add('active'));
  }, 500);

  // ===== Стрелка скролла =====
  const scrollHint = document.querySelector('.scroll-hint');
  const finalSection = document.querySelector('.final');

  if (scrollHint && finalSection) {
    // Анимация стрелки
    const arrowAnim = scrollHint.animate(
      [
        { transform: 'translateX(-50%) translateY(0px)', opacity: 0.4 },
        { transform: 'translateX(-50%) translateY(10px)', opacity: 0.9 },
        { transform: 'translateX(-50%) translateY(0px)', opacity: 0.4 },
      ],
      { duration: 2000, iterations: Infinity }
    );

    scrollHint.style.transition = 'opacity 0.5s ease';

    // Скрытие стрелки при финальном блоке
    const arrowObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            scrollHint.style.opacity = 0;
            arrowAnim.cancel();
          } else {
            scrollHint.style.opacity = 0.7;
            arrowAnim.play();
          }
        });
      },
      { threshold: 0.1 }
    );
    arrowObserver.observe(finalSection);
  }

  // ===== ПЛАВНЫЙ Drag-scroll ДЛЯ ВСЕХ =====
  document
    .querySelectorAll('.palette__window, .palette__window_shoes')
    .forEach(container => {
      let isDragging = false;
      let startX = 0;
      let scrollLeft = 0;
      let velocity = 0;
      let rafId = null;

      const smoothScroll = () => {
        container.scrollLeft += velocity;
        velocity *= 0.92; // Трение

        if (Math.abs(velocity) > 0.1) {
          rafId = requestAnimationFrame(smoothScroll);
        }
      };

      // ===== MOUSE ДЕСКТОП (ИСПРАВЛЕНО) =====
      container.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.pageX;
        scrollLeft = container.scrollLeft;
        velocity = 0;
        if (rafId) cancelAnimationFrame(rafId);
        container.classList.add('dragging');
        container.style.scrollBehavior = 'auto';
      });

      container.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 1.2; // Чувствительность для мыши
        container.scrollLeft = scrollLeft - walk;
        velocity = walk * 0.1;
      });

      container.addEventListener('mouseup', () => {
        isDragging = false;
        container.classList.remove('dragging');
        container.style.scrollBehavior = 'smooth';
        rafId = requestAnimationFrame(smoothScroll);
      });

      container.addEventListener('mouseleave', () => {
        if (isDragging) {
          isDragging = false;
          container.classList.remove('dragging');
          container.style.scrollBehavior = 'smooth';
          rafId = requestAnimationFrame(smoothScroll);
        }
      });

      // ===== TOUCH МОБИЛКИ (ОСТАЕТСЯ) =====
      let touchStartX = 0;

      container.addEventListener(
        'touchstart',
        e => {
          touchStartX = e.touches[0].pageX;
          velocity = 0;
          if (rafId) cancelAnimationFrame(rafId);
          container.style.scrollBehavior = 'auto';
        },
        { passive: true }
      );

      container.addEventListener(
        'touchmove',
        e => {
          const x = e.touches[0].pageX;
          const walk = (x - touchStartX) * 1;
          container.scrollLeft -= walk;
          velocity = walk * 0.05;
          touchStartX = x;
          e.preventDefault();
        },
        { passive: false }
      );

      container.addEventListener(
        'touchend',
        () => {
          container.style.scrollBehavior = 'smooth';
          rafId = requestAnimationFrame(smoothScroll);
        },
        { passive: true }
      );

      // Wheel скролл как бонус
      container.addEventListener(
        'wheel',
        e => {
          e.preventDefault();
          const walk = e.deltaY * 0.5;
          container.scrollLeft += walk;
          velocity = walk * 0.1;
          rafId = requestAnimationFrame(smoothScroll);
        },
        { passive: false }
      );
    });
});
