(function() {
    // Плавный скролл для якорей
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Закрываем мобильное меню после клика на ссылку
            if (header && header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
            }
        });
    });

    // Подсветка активного пункта меню
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

    // Анимация появления
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

    // Обработка формы
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

    // Перезагрузка по клику на логотип
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.reload();
        });
    }

    // Якорь при загрузке
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }

    // *** БУРГЕР-МЕНЮ ***
    const burger = document.getElementById('burger');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');

    if (burger && header && nav) {
        // Открытие/закрытие по клику на бургер
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            header.classList.toggle('menu-open');
        });

        // Закрытие меню при клике вне его (на документе)
        document.addEventListener('click', function(event) {
            if (header.classList.contains('menu-open') && 
                !header.contains(event.target)) {
                header.classList.remove('menu-open');
            }
        });

        // Предотвращаем закрытие при клике внутри меню
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // *** СЛАЙДЕРЫ ДЛЯ КАРТОЧЕК ТОВАРОВ ***
    function initProductSliders() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const sliderImages = card.querySelectorAll('.slider-image');
            const prevBtn = card.querySelector('.slider-prev');
            const nextBtn = card.querySelector('.slider-next');
            if (!sliderImages.length || !prevBtn || !nextBtn) return;

            let currentIndex = 0;
            const totalImages = sliderImages.length;

            function showImage(index) {
                sliderImages.forEach((img, i) => {
                    img.classList.toggle('active', i === index);
                });
            }

            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                showImage(currentIndex);
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % totalImages;
                showImage(currentIndex);
            });

            // Открытие модального окна при клике на изображение
            sliderImages.forEach((img, index) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openModal(card, index);
                });
            });
        });
    }

    // *** МОДАЛЬНОЕ ОКНО (LIGHTBOX) ***
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');

    let currentModalSlider = null; // ссылка на слайдер (карточку)
    let currentModalIndex = 0;

    function openModal(card, index) {
        currentModalSlider = card.querySelector('.product-slider');
        currentModalIndex = index;
        updateModalImage();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // запрещаем скролл страницы
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // возвращаем скролл
    }

    function updateModalImage() {
        if (!currentModalSlider) return;
        const images = currentModalSlider.querySelectorAll('.slider-image');
        if (images.length && currentModalIndex >= 0 && currentModalIndex < images.length) {
            modalImage.src = images[currentModalIndex].src;
        }
    }

    function prevModalImage() {
        if (!currentModalSlider) return;
        const images = currentModalSlider.querySelectorAll('.slider-image');
        if (images.length) {
            currentModalIndex = (currentModalIndex - 1 + images.length) % images.length;
            updateModalImage();
        }
    }

    function nextModalImage() {
        if (!currentModalSlider) return;
        const images = currentModalSlider.querySelectorAll('.slider-image');
        if (images.length) {
            currentModalIndex = (currentModalIndex + 1) % images.length;
            updateModalImage();
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevModalImage();
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextModalImage();
        });
    }

    // Закрытие по клику вне изображения (на фон)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Запускаем инициализацию слайдеров после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductSliders);
    } else {
        initProductSliders();
    }
})();