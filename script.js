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
