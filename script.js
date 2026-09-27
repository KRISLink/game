document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const lamp = document.getElementById('lamp');
    const lampToggle = document.getElementById('lampToggle');
    const authWrapper = document.getElementById('authWrapper');
    const authCard = document.getElementById('authCard');
    const toggleSwitch = document.getElementById('toggleSwitch');
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    
    const dashboard = document.getElementById('dashboard');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Состояние ---
    let isLampOn = false;
    let isLoginTab = true;

    // --- 1. Логика Лампочки ---
    lampToggle.addEventListener('click', () => {
        isLampOn = !isLampOn;
        
        if (isLampOn) {
            lamp.classList.add('on');
            authWrapper.classList.add('visible');
        } else {
            lamp.classList.remove('on');
            authWrapper.classList.remove('visible');
            // Сброс ошибок при выключении
            loginError.textContent = '';
            signupError.textContent = '';
        }
    });

    // --- 2. Логика Переключения (Login / Sign Up) ---
    tabLogin.addEventListener('click', () => {
        if (!isLoginTab) {
            isLoginTab = true;
            authCard.classList.remove('flipped');
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            
            // Сброс форм
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        }
    });

    tabSignup.addEventListener('click', () => {
        if (isLoginTab) {
            isLoginTab = false;
            authCard.classList.add('flipped');
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            
            // Сброс форм
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });

    // --- 3. Регистрация ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value.trim();
        const password = document.getElementById('signupPassword').value.trim();

        if (!username || !password) {
            signupError.textContent = 'Заполните все поля';
            return;
        }

        // Получаем базу данных пользователей
        let users = JSON.parse(localStorage.getItem('mono_users')) || {};

        // Проверка: существует ли пользователь
        if (users[username]) {
            signupError.textContent = 'Это имя пользователя уже занято!';
            return;
        }

        // Сохраняем нового пользователя
        users[username] = password;
        localStorage.setItem('mono_users', JSON.stringify(users));
        
        // Успешная регистрация
        signupError.style.color = '#4CAF50';
        signupError.textContent = 'Успешно! Теперь войдите.';
        
        // Очищаем форму
        document.getElementById('signupUsername').value = '';
        document.getElementById('signupPassword').value = '';
        
        // Автоматически переключаем на Login через 1.5 секунды
        setTimeout(() => {
            tabLogin.click();
            signupError.style.color = '#ff4444';
            signupError.textContent = '';
        }, 1500);
    });

    // --- 4. Вход (Login) ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        let users = JSON.parse(localStorage.getItem('mono_users')) || {};

        if (users[username] && users[username] === password) {
            // Успешный вход
            loginError.textContent = '';
            loginForm.reset();
            
            // Показываем личный кабинет
            showDashboard(username);
        } else {
            loginError.textContent = 'Неверное имя пользователя или пароль';
        }
    });

    // --- 5. Личный кабинет и Выход ---
    function showDashboard(username) {
        userNameDisplay.textContent = username;
        
        // Скрываем всё остальное
        authWrapper.classList.remove('visible');
        dashboard.classList.add('visible');
        
        // Сохраняем сессию (чтобы при перезагрузке страницы пользователь остался в кабинете)
        sessionStorage.setItem('mono_current_user', username);
    }

    logoutBtn.addEventListener('click', () => {
        dashboard.classList.remove('visible');
        authWrapper.classList.add('visible');
        sessionStorage.removeItem('mono_current_user');
        
        // Выключаем лампочку (по желанию, для красоты)
        isLampOn = false;
        lamp.classList.remove('on');
    });

    // Проверка сессии при загрузке страницы (если уже залогинен)
    const savedUser = sessionStorage.getItem('mono_current_user');
    if (savedUser) {
        // Имитируем вход, если пользователь уже в сессии
        // Но сначала проверим, есть ли он в базе (на случай очистки)
        let users = JSON.parse(localStorage.getItem('mono_users')) || {};
        if (users[savedUser]) {
            showDashboard(savedUser);
        }
    }
});(loc
