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
        });
    });

    // Подсветка активного пункта меню
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
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
    });

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
})();