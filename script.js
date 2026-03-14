(function() {
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const header = document.getElementById('header');
            if (header && header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
            }
        });
    });

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

    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => window.location.reload());
    }

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
        }
    }

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

    // --- Слайдеры со стрелками внутри ---
    function initProductSliders() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const slider = card.querySelector('.product-slider');
            const sliderImages = slider.querySelectorAll('.slider-image');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            if (!sliderImages.length) return;

            let currentIndex = 0;
            const totalImages = sliderImages.length;

            function showImage(index) {
                sliderImages.forEach((img, i) => {
                    img.classList.toggle('active', i === index);
                });
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalImages;
                showImage(currentIndex);
            }

            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                showImage(currentIndex);
            }

            // Стрелки внутри слайдера
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevSlide();
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                });
            }

            // Свайпы для мобильных
            let touchStartX = 0, touchEndX = 0, minSwipeDistance = 50;
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].screenX;
            }, { passive: true });
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const distance = touchEndX - touchStartX;
                if (Math.abs(distance) > minSwipeDistance) {
                    e.preventDefault();
                    if (distance > 0) prevSlide();
                    else nextSlide();
                }
            }, { passive: false });

            // Клик по изображению (левая/правая треть листает, центр — модалка)
            sliderImages.forEach((img) => {
                img.addEventListener('click', (e) => {
                    const rect = img.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    if (clickX < width / 3) {
                        prevSlide();
                    } else if (clickX > width * 2 / 3) {
                        nextSlide();
                    } else {
                        openModal(card, currentIndex);
                    }
                });
            });

            showImage(currentIndex);
        });
    }

    // --- Модальное окно ---
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');

    let currentModalSlider = null;
    let currentModalIndex = 0;

    function openModal(card, index) {
        currentModalSlider = card.querySelector('.product-slider');
        currentModalIndex = index;
        updateModalImage();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
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

    // Клик по изображению в модалке (листание по краям)
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

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Запуск слайдеров
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductSliders);
    } else {
        initProductSliders();
    }
})();