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
