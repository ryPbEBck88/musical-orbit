// Мобильное меню
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const hasSubmenuItems = document.querySelectorAll('.has-submenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Раскрытие подменю на мобильных устройствах (если есть)
hasSubmenuItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
    }
});

// Закрытие меню при клике вне его
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// Бегущая строка - дублирование контента для бесшовной анимации
const tickerContent = document.querySelector('.ticker-content');
if (tickerContent) {
    const originalContent = tickerContent.innerHTML;
    tickerContent.innerHTML = originalContent + originalContent;
}

// Проверка загрузки логотипов
function checkLogoLoad(img, container) {
    if (!img || !container) return;
    
    // Если изображение уже загружено
    if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
        container.classList.add('has-image');
        return;
    }
    
    // Обработчик успешной загрузки
    img.addEventListener('load', function() {
        img.classList.add('loaded');
        container.classList.add('has-image');
    });
    
    // Обработчик ошибки загрузки
    img.addEventListener('error', function() {
        // Изображение не найдено - скрываем его, оставляем текст
        img.style.display = 'none';
        container.classList.remove('has-image');
    });
}

// Проверяем логотип в header после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const headerLogo = document.querySelector('.logo .logo-img');
    const headerLogoContainer = document.querySelector('.logo');
    if (headerLogo && headerLogoContainer) {
        checkLogoLoad(headerLogo, headerLogoContainer);
    }
    
});

// Также проверяем сразу (на случай если DOM уже загружен)
const headerLogo = document.querySelector('.logo .logo-img');
const headerLogoContainer = document.querySelector('.logo');
if (headerLogo && headerLogoContainer) {
    checkLogoLoad(headerLogo, headerLogoContainer);
}

// Проверка загрузки фонового изображения hero
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    const bgImageUrl = heroImage.getAttribute('data-bg-image');
    // Загружаем изображение только если указан URL и он не пустой
    if (bgImageUrl && bgImageUrl.trim() !== '') {
        const testImg = new Image();
        testImg.onload = function() {
            // Изображение загрузилось успешно - устанавливаем его как фон
            heroImage.style.backgroundImage = `url('${bgImageUrl}')`;
        };
        testImg.onerror = function() {
            // Изображение не загрузилось - остается fallback градиент из CSS
            // Убираем атрибут, чтобы не было повторных попыток
            heroImage.removeAttribute('data-bg-image');
        };
        // Устанавливаем src в конце, чтобы обработчики были уже прикреплены
        testImg.src = bgImageUrl;
    }
}
