(function() {
    // --- Константы для плавной прокрутки ---
    const SCROLL_DURATION = 800;
    const HEADER_OFFSET = 20;

    // --- Плавная прокрутка к якорю ---
    function smoothScrollToTarget(targetId, duration = SCROLL_DURATION) {
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offset = headerHeight + HEADER_OFFSET;

        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;

        if (Math.abs(distance) < 5) {
            window.scrollTo(0, targetPosition);
            return;
        }

        let startTime = null;
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, startPosition + distance * easeOutCubic);
            if (elapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        requestAnimationFrame(animation);
    }

    // --- Обработка якорей ---
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToTarget(targetId, SCROLL_DURATION);

            const header = document.getElementById('header');
            if (header && header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
            }
        });
    });

    // --- Подсветка активного пункта меню ---
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveMenu() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        if (!current && sections.length > 0) {
            current = 'production';
        }
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateActiveMenu);
    window.addEventListener('load', updateActiveMenu);

    // --- Анимация появления ---
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appeared');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => observer.observe(el));

    // --- Форма ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const comment = document.getElementById('comment').value.trim();
            const channel = document.querySelector('input[name="channel"]:checked').value;

            if (!name || !phone) {
                alert('Пожалуйста, заполните имя и телефон');
                return;
            }

            const text = `Здравствуйте! Меня зовут ${name}. Телефон: ${phone}. Комментарий: ${comment || '—'}`;
            const encodedText = encodeURIComponent(text);
            const companyPhone = '74951234567';

            let url = '';
            if (channel === 'whatsapp') {
                url = `https://wa.me/${companyPhone}?text=${encodedText}`;
            } else if (channel === 'telegram') {
                const telegramUsername = 'omega_vent';
                url = `https://t.me/${telegramUsername}?start=${encodedText}`;
            } else if (channel === 'viber') {
                url = `viber://chat?number=%2B${companyPhone}&text=${encodedText}`;
            }

            if (url) {
                window.open(url, '_blank');
            }
            alert('Спасибо! Сейчас вы будете перенаправлены в выбранное приложение для отправки сообщения.');
            form.reset();
        });
    }

    // --- Логотип перезагружает страницу ---
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => window.location.reload());
    }

    // --- Якорь при загрузке ---
    if (window.location.hash) {
        const targetId = window.location.hash;
        setTimeout(() => smoothScrollToTarget(targetId, SCROLL_DURATION), 300);
    }

    // --- Бургер-меню ---
    const burger = document.getElementById('burger');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    if (burger && header && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('menu-open');
        });
        document.addEventListener('click', (event) => {
            if (header.classList.contains('menu-open') && !header.contains(event.target)) {
                header.classList.remove('menu-open');
            }
        });
        nav.addEventListener('click', (e) => e.stopPropagation());
    }

    // --- ПОЛНЫЙ МАССИВ ВСЕХ ИЗОБРАЖЕНИЙ (глобальный) ---
    const allImages = [
        // Гибкие воздуховоды
        { src: 'images/Гибкие воздуховоды/IMG_4558.PNG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4559.PNG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4560.PNG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4561.PNG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4562.PNG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4533.JPG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4534.JPG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4535.JPG', category: 'Гибкие воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4532.JPG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4541.JPG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4547.JPG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4563.PNG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4619.PNG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4620.PNG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4621.PNG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        { src: 'images/Гибкие воздуховоды/IMG_4622.PNG', category: 'Гибкие воздуховоды', description: 'Для больших предприятий, где требуется воздухоотвод из системы вентиляции.' },
        // Оцинкованные воздуховоды
        { src: 'images/Оцинкованные воздуховоды/IMG_4520.JPG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4521.JPG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4522.JPG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4524.JPG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4525.JPG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4526.JPG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4554.PNG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4555.PNG', category: 'Оцинкованные воздуховоды', description: 'Круглые воздуховоды из оцинкованной стали. Выпускаются с поршневыми задвижками.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4570.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4572.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4569.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4557.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4549.JPG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4550.JPG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4564.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4565.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4566.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/Оцинкованные воздуховоды/IMG_4568.PNG', category: 'Оцинкованные воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        // ПВХ воздуховоды
        { src: 'images/ПВХ воздуховоды/IMG_4575.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4577.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4578.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4579.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4580.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4581.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4582.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4583.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4584.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4586.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4588.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4603.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        { src: 'images/ПВХ воздуховоды/IMG_4617.PNG', category: 'ПВХ воздуховоды', description: 'Пластиковые воздуховоды с опорными заслонками для установки в системах вентиляции.' },
        // Решетки и диффузоры
        { src: 'images/Решетки и диффузоры/IMG_4523.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4527.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4538.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4539.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4540.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4548.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4551.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4552.JPG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4567.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4590.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4591.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4592.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4593.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4594.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4595.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4596.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4602.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4615.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4616.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' },
        { src: 'images/Решетки и диффузоры/IMG_4618.PNG', category: 'Решетки и диффузоры', description: 'Вентиляционные фаски и детали для создания различных форм вентиляционных систем.' }
    ];

    // --- Функции для работы карусели (общие) ---
    function waitForImages(track) {
        const images = Array.from(track.querySelectorAll('img'));
        const promises = images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            });
        });
        return Promise.all(promises);
    }

    let activeCarouselAnim = null;
    function smoothScrollCarousel(container, targetLeft, duration = 500) {
        if (activeCarouselAnim) {
            cancelAnimationFrame(activeCarouselAnim);
            activeCarouselAnim = null;
        }
        const startLeft = container.scrollLeft;
        const distance = targetLeft - startLeft;
        if (Math.abs(distance) < 1) return;
        const originalSnapType = container.style.scrollSnapType;
        const originalWebkitSnapType = container.style.webkitScrollSnapType;
        container.style.scrollSnapType = 'none';
        container.style.webkitScrollSnapType = 'none';
        const startTime = performance.now();
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            container.scrollLeft = startLeft + distance * easeProgress;
            if (elapsed < duration) {
                activeCarouselAnim = requestAnimationFrame(step);
            } else {
                container.style.scrollSnapType = originalSnapType;
                container.style.webkitScrollSnapType = originalWebkitSnapType;
                activeCarouselAnim = null;
            }
        }
        activeCarouselAnim = requestAnimationFrame(step);
    }

    function getTargetScrollForIndex(container, track, index) {
        if (!container || !track || track.children.length === 0) return 0;
        const items = track.children;
        if (index < 0) index = 0;
        if (index >= items.length) index = items.length - 1;
        const item = items[index];
        const containerWidth = container.clientWidth;
        const itemOffset = item.offsetLeft;
        const itemWidth = item.offsetWidth;
        let target = itemOffset - (containerWidth / 2) + (itemWidth / 2);
        return Math.max(0, target);
    }

    // --- Инициализация одной карусели по ID элементов и массиву изображений (с глобальными индексами) ---
    function initCarousel(containerId, trackId, imagesArray, prevBtnId, nextBtnId, resetBtnId, moreBtnId = null) {
        const container = document.getElementById(containerId);
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const resetBtn = document.getElementById(resetBtnId);
        const moreBtn = moreBtnId ? document.getElementById(moreBtnId) : null;

        if (!container || !track) {
            console.error(`Карусель ${containerId} не найдена`);
            return;
        }

        // Заполняем трек
        track.innerHTML = '';
        imagesArray.forEach((item, idx) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            carouselItem.innerHTML = `<img src="${item.src}" alt="${item.category}" loading="lazy">`;
            carouselItem.dataset.index = item.globalIndex;  // сохраняем глобальный индекс для модалки
            carouselItem.dataset.category = item.category;
            carouselItem.dataset.description = item.description;
            track.appendChild(carouselItem);
        });

        let currentActiveIndex = 0;

        function setActiveIndex(index) {
            const items = track.children;
            if (index < 0) index = 0;
            if (index >= items.length) index = items.length - 1;
            if (index === currentActiveIndex) return;
            items[currentActiveIndex]?.classList.remove('active');
            items[index].classList.add('active');
            currentActiveIndex = index;
            if (prevBtn) prevBtn.disabled = currentActiveIndex === 0;
            if (nextBtn) nextBtn.disabled = currentActiveIndex === items.length - 1;
            if (resetBtn) resetBtn.classList.toggle('visible', currentActiveIndex > 0);
        }

        function centerActiveIndex(index, smooth = true) {
            const items = track.children;
            if (index < 0) index = 0;
            if (index >= items.length) index = items.length - 1;
            const targetScroll = getTargetScrollForIndex(container, track, index);
            if (smooth) {
                smoothScrollCarousel(container, targetScroll, 500);
            } else {
                const originalSnapType = container.style.scrollSnapType;
                container.style.scrollSnapType = 'none';
                container.scrollLeft = targetScroll;
                container.style.scrollSnapType = originalSnapType;
            }
        }

        waitForImages(track).then(() => {
            const originalSnapType = container.style.scrollSnapType;
            container.style.scrollSnapType = 'none';
            container.scrollLeft = 0;
            setActiveIndex(0);
            container.style.scrollSnapType = originalSnapType || 'x proximity';
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentActiveIndex > 0) {
                    const newIndex = currentActiveIndex - 1;
                    setActiveIndex(newIndex);
                    centerActiveIndex(newIndex, true);
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentActiveIndex < track.children.length - 1) {
                    const newIndex = currentActiveIndex + 1;
                    setActiveIndex(newIndex);
                    centerActiveIndex(newIndex, true);
                }
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                centerActiveIndex(0, true);
            });
        }
        if (moreBtn) {
            moreBtn.addEventListener('click', () => {
                smoothScrollToTarget('#request-form', SCROLL_DURATION);
            });
        }

        container.addEventListener('scroll', () => {
            const containerCenter = container.scrollLeft + container.clientWidth / 2;
            let bestIndex = 0;
            let bestDistance = Infinity;
            for (let i = 0; i < track.children.length; i++) {
                const item = track.children[i];
                const itemRect = item.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2 - containerRect.left + container.scrollLeft;
                const distance = Math.abs(itemCenter - containerCenter);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = i;
                }
            }
            if (bestIndex !== currentActiveIndex) {
                setActiveIndex(bestIndex);
            }
        });

        // Клик для открытия модалки
        track.addEventListener('click', (e) => {
            const item = e.target.closest('.carousel-item');
            if (!item) return;
            const globalIndex = parseInt(item.dataset.index, 10);
            openModal(globalIndex);
        });
    }

    // --- Подготовка данных для каждой категории (с глобальными индексами) ---
    const categoryImages = {
        'Гибкие воздуховоды': [],
        'Оцинкованные воздуховоды': [],
        'ПВХ воздуховоды': [],
        'Решетки и диффузоры': []
    };
    allImages.forEach((img, globalIdx) => {
        const cat = img.category;
        if (categoryImages[cat]) {
            categoryImages[cat].push({
                src: img.src,
                category: img.category,
                description: img.description,
                globalIndex: globalIdx
            });
        }
    });

    // --- МОДАЛЬНОЕ ОКНО (работает с глобальным массивом allImages) ---
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');

    let currentModalIndex = 0;

    function openModal(index) {
        if (!allImages.length) return;
        currentModalIndex = index;
        modalImage.src = allImages[currentModalIndex].src;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function prevModalImage() {
        if (!allImages.length) return;
        currentModalIndex = (currentModalIndex - 1 + allImages.length) % allImages.length;
        modalImage.src = allImages[currentModalIndex].src;
    }

    function nextModalImage() {
        if (!allImages.length) return;
        currentModalIndex = (currentModalIndex + 1) % allImages.length;
        modalImage.src = allImages[currentModalIndex].src;
    }

    if (modalImage) {
        modalImage.addEventListener('click', (e) => {
            const rect = modalImage.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            if (clickX < width / 3) {
                prevModalImage();
            } else if (clickX > width * 2 / 3) {
                nextModalImage();
            }
        });
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalPrev) modalPrev.addEventListener('click', (e) => { e.stopPropagation(); prevModalImage(); });
    if (modalNext) modalNext.addEventListener('click', (e) => { e.stopPropagation(); nextModalImage(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

    // --- Запуск всех каруселей после загрузки страницы ---
    function initAllCarousels() {
        // Гибкие воздуховоды (без кнопки more)
        initCarousel('carouselFlex', 'trackFlex', categoryImages['Гибкие воздуховоды'], 'prevFlex', 'nextFlex', 'resetFlex');
        // Оцинкованные (без кнопки more)
        initCarousel('carouselGalvanized', 'trackGalvanized', categoryImages['Оцинкованные воздуховоды'], 'prevGalvanized', 'nextGalvanized', 'resetGalvanized');
        // ПВХ (без кнопки more)
        initCarousel('carouselPVC', 'trackPVC', categoryImages['ПВХ воздуховоды'], 'prevPVC', 'nextPVC', 'resetPVC');
        // Решетки и диффузоры (с кнопкой more)
        initCarousel('carouselGrilles', 'trackGrilles', categoryImages['Решетки и диффузоры'], 'prevGrilles', 'nextGrilles', 'resetGrilles', 'moreGrilles');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllCarousels);
    } else {
        initAllCarousels();
    }
})();