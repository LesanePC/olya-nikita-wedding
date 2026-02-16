document.addEventListener('DOMContentLoaded', () => {

    // ===== Центрируем все галереи =====
    document.querySelectorAll('.palette__window').forEach(p => {
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
                { transform: 'translateX(-50%) translateY(0px)', opacity: 0.4 }
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

    // ===== Плавный Drag-scroll для галерей =====
    document.querySelectorAll('.palette__window').forEach(container => {
        let isDown = false;
        let startX = 0;
        let currentScroll = 0;
        let targetScroll = 0;

        // Постоянная анимация сглаживания
        const smoothScroll = () => {
            currentScroll += (targetScroll - currentScroll) * 0.5; // коэффициент сглаживания
            container.scrollLeft = currentScroll;
            requestAnimationFrame(smoothScroll);
        };
        smoothScroll();

        // ===== Mouse =====
        container.addEventListener('mousedown', e => {
            isDown = true;
            container.classList.add('dragging');
            startX = e.pageX;
            currentScroll = container.scrollLeft;
            targetScroll = currentScroll;
        });

        container.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const walk = (e.pageX - startX) * 0.5;
            targetScroll = currentScroll - walk;
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('dragging');
            currentScroll = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('dragging');
            currentScroll = container.scrollLeft;
        });

        // ===== Touch =====
        container.addEventListener('touchstart', e => {
            startX = e.touches[0].pageX;
            currentScroll = container.scrollLeft;
            targetScroll = currentScroll;
        }, { passive: true });

        container.addEventListener('touchmove', e => {
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 0.5;
            targetScroll = currentScroll - walk;
        }, { passive: true });
    });

});
