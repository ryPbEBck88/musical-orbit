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

// ============================================
// HERO SLIDER
// ============================================
const heroSlides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
const slideInterval = 5000; // 5 секунд

function showSlide(index) {
    // Убираем активный класс со всех слайдов
    heroSlides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Добавляем активный класс к текущему слайду
    if (heroSlides[index]) {
        heroSlides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
}

// Автоматическая смена слайдов
let slideTimer = setInterval(nextSlide, slideInterval);

// Клик по индикаторам
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        // Сбрасываем таймер
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, slideInterval);
    });
});

// Пауза при наведении на слайдер
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });
    
    heroSlider.addEventListener('mouseleave', () => {
        slideTimer = setInterval(nextSlide, slideInterval);
    });
}

// Проверка загрузки фоновых изображений для всех слайдов
heroSlides.forEach(slide => {
    const heroImage = slide.querySelector('.hero-image');
    if (heroImage) {
        const bgImageUrl = heroImage.getAttribute('data-bg-image');
        if (bgImageUrl && bgImageUrl.trim() !== '') {
            const testImg = new Image();
            testImg.onload = function() {
                heroImage.style.backgroundImage = `url('${bgImageUrl}')`;
            };
            testImg.onerror = function() {
                console.log(`Hero background image not found: ${bgImageUrl}, using gradient fallback`);
            };
            testImg.src = bgImageUrl;
        }
    }
});

// ============================================
// КОНФИГУРАЦИЯ ЗАГРУЖАЕТСЯ ИЗ config.js
// ============================================
// config.js добавлен в .gitignore для безопасности
// Создайте config.js на основе config.example.js
// Переменные WEB_APP_URL и FORMSUBMIT_EMAIL должны быть определены в config.js

// Обработка формы заявки
const applicationForm = document.getElementById('application-form');
if (applicationForm) {
    applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(applicationForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Показываем индикатор загрузки
        const submitButton = applicationForm.querySelector('.btn-submit');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        try {
            // Вариант 1: Отправка в Google Sheets
            if (WEB_APP_URL && WEB_APP_URL.trim() !== '') {
                const response = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                showFormMessage('Заявка успешно отправлена! Спасибо за участие.', 'success');
                applicationForm.reset();
                
                setTimeout(() => {
                    closeModal();
                }, 2000);
            }
            // Вариант 2: Отправка через FormSubmit
            else if (FORMSUBMIT_EMAIL && FORMSUBMIT_EMAIL.trim() !== '') {
                const formSubmitUrl = `https://formsubmit.co/${FORMSUBMIT_EMAIL}`;
                
                // Создаем FormData для FormSubmit
                const formData = new FormData();
                formData.append('_subject', 'Заявка на участие в фестивале «Музыкальная орбита»');
                formData.append('_template', 'table');
                formData.append('_captcha', 'false');
                
                // Добавляем все поля
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });

                const response = await fetch(formSubmitUrl, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showFormMessage('Заявка успешно отправлена! Спасибо за участие.', 'success');
                    applicationForm.reset();
                    
                    setTimeout(() => {
                        closeModal();
                    }, 2000);
                } else {
                    throw new Error('Ошибка отправки');
                }
            }
            // Fallback: отправка через mailto
            else {
                // Fallback: отправка через mailto, если Google Sheets не настроен
                const subject = encodeURIComponent('Заявка на участие в фестивале «Музыкальная орбита»');
                const body = encodeURIComponent(
                    `Заявка на участие в фестивале «Музыкальная орбита»

ФИО исполнителя / название коллектива: ${data.name}
Количество участников: ${data.participants}
Возраст: ${data.age}
Название произведения, авторы произведения: ${data.composition}
ФИО руководителя: ${data.director}
Электронная почта: ${data.email}
Страна, город исполнителя / коллектива: ${data.location}
Ссылка на творческий номер: ${data['video-link']}`
                );

                const mailtoLink = `mailto:festival@example.com?subject=${subject}&body=${body}`;
                
                showFormMessage('Заявка подготовлена! Откроется почтовый клиент для отправки.', 'success');
                
                setTimeout(() => {
                    window.location.href = mailtoLink;
                    setTimeout(() => {
                        closeModal();
                    }, 2000);
                }, 500);
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showFormMessage('Произошла ошибка при отправке. Попробуйте позже или отправьте заявку на email.', 'error');
        } finally {
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Функция для отображения сообщения
function showFormMessage(message, type) {
    // Удаляем предыдущее сообщение, если есть
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Создаем новое сообщение
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Вставляем после формы
    const form = document.getElementById('application-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Функция для отправки на сервер (закомментировано, можно использовать при наличии сервера)
/*
async function sendFormToServer(data) {
    try {
        const response = await fetch('/api/submit-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showFormMessage('Заявка успешно отправлена!', 'success');
            applicationForm.reset();
        } else {
            showFormMessage('Ошибка при отправке заявки. Попробуйте позже.', 'error');
        }
    } catch (error) {
        showFormMessage('Ошибка при отправке заявки. Попробуйте позже.', 'error');
    }
}
*/

// Управление модальным окном
const modal = document.getElementById('participate-modal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Открытие модального окна при клике на кнопку "ПРИНЯТЬ УЧАСТИЕ"
document.querySelectorAll('a[href="#participate"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
});

// Закрытие модального окна
function openModal() {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Разблокируем прокрутку
        // Очищаем форму при закрытии
        const form = document.getElementById('application-form');
        if (form) {
            form.reset();
            // Удаляем сообщения
            const message = document.querySelector('.form-message');
            if (message) {
                message.remove();
            }
        }
    }
}

// Закрытие по клику на крестик
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Закрытие по клику на overlay
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Закрытие по нажатию Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

// Кнопка "Наверх"
const scrollToTopButton = document.getElementById('scroll-to-top');

if (scrollToTopButton) {
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });

    // Плавная прокрутка наверх при клике
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Обработка клика по телефону
const phoneLink = document.getElementById('phone-link');

if (phoneLink) {
    // Функция определения мобильного устройства
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    }

    // Функция копирования в буфер обмена
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(() => true);
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return Promise.resolve(true);
            } catch (err) {
                document.body.removeChild(textArea);
                return Promise.resolve(false);
            }
        }
    }

    // Функция показа уведомления
    function showNotification(message) {
        // Удаляем старое уведомление, если есть
        const oldNotification = document.querySelector('.copy-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Скрываем и удаляем через 2 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // Обработчик клика
    phoneLink.addEventListener('click', function(e) {
        // На мобильных устройствах оставляем стандартное поведение (tel:)
        if (isMobileDevice()) {
            return; // Разрешаем стандартное поведение - откроется приложение для звонка
        }

        // На десктопе предотвращаем переход и копируем номер
        e.preventDefault();
        const phoneNumber = this.getAttribute('data-phone') || this.textContent.trim();
        
        copyToClipboard(phoneNumber).then(success => {
            if (success) {
                showNotification('Номер телефона скопирован в буфер обмена');
            } else {
                showNotification('Не удалось скопировать номер');
            }
        });
    });
}

// Обработка скачивания файла согласия из формы
document.addEventListener('DOMContentLoaded', function() {
    const consentLinks = document.querySelectorAll('a[href*="согласия.docx"]');
    consentLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Создаем временную ссылку для принудительного скачивания
            const downloadLink = document.createElement('a');
            downloadLink.href = 'согласия.docx';
            downloadLink.download = 'Согласия_на_обработку_персональных_данных.docx';
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            
            // Программно кликаем для скачивания
            downloadLink.click();
            
            // Удаляем временную ссылку
            setTimeout(function() {
                document.body.removeChild(downloadLink);
            }, 100);
        });
    });
});
