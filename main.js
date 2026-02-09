document.addEventListener('DOMContentLoaded', () => {

    // ===== Центрируем все галереи =====
    // При загрузке страницы прокручиваем каждую горизонтальную галерею к центру
    document.querySelectorAll('.palette__window').forEach(p => {
        p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2;
    });

    // ===== Слайдеры =====
    // Для каждого слайдера назначаем кнопки "влево/вправо" и активный слайд
    document.querySelectorAll('.slider').forEach(slider => {
        const slides = slider.querySelectorAll('.slides img');
        let index = 0;
        slides[index].classList.add('active');

        slider.querySelector('.left').onclick = () => {
            slides[index].classList.remove('active');
            index = (index - 1 + slides.length) % slides.length;
            slides[index].classList.add('active');
        };

        slider.querySelector('.right').onclick = () => {
            slides[index].classList.remove('active');
            index = (index + 1) % slides.length;
            slides[index].classList.add('active');
        };
    });

    // ===== Анимация появления секций =====
    // IntersectionObserver добавляет класс 'active', когда секция попадает в область видимости
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

    // Fallback: на случай, если IntersectionObserver не сработал, активируем все блоки через 0.5s
    setTimeout(() => {
        reveals.forEach(el => el.classList.add('active'));
    }, 500);

    // ===== Стрелка скролла с плавным исчезанием =====
    const scrollHint = document.querySelector('.scroll-hint');
    const finalSection = document.querySelector('.final');

    // Запускаем бесконечную анимацию стрелки
    const arrowAnim = scrollHint.animate(
        [
            { transform: 'translateX(-50%) translateY(0px)', opacity: 0.4 },
            { transform: 'translateX(-50%) translateY(10px)', opacity: 0.9 },
            { transform: 'translateX(-50%) translateY(0px)', opacity: 0.4 }
        ],
        { duration: 2000, iterations: Infinity }
    );

    // Добавляем плавное исчезновение через CSS
    scrollHint.style.transition = 'opacity 0.5s ease';

    // IntersectionObserver следит за финальным блоком
    // Когда финальный блок появляется, стрелка исчезает и анимация останавливается
    // Когда блок скрыт — стрелка возвращается и анимация продолжается
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

    // ===== Drag-scroll для галерей =====
    // Позволяет перетаскивать галерею мышью или пальцем
    document.querySelectorAll('.palette__window').forEach(container => {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        container.addEventListener('mousedown', e => {
            isDown = true;
            container.classList.add('dragging');
            startX = e.pageX;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('dragging');
        });
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('dragging');
        });
        container.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const walk = (e.pageX - startX) * 1.2;
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('touchstart', e => {
            startX = e.touches[0].pageX;
            scrollLeft = container.scrollLeft;
        }, { passive: true });

        container.addEventListener('touchmove', e => {
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 1.2;
            container.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    });

});
