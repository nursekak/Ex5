const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Переключение между формами регистрации и входа
function toggleForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
}

// Обработка регистрации
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Регистрация успешна! Теперь вы можете войти.');
            toggleForms();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Ошибка при регистрации');
    }
}

// Обработка входа
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showProtectedContent(username);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Ошибка при входе');
    }
}

// Получение защищенных данных
async function fetchProtectedData() {
    try {
        const response = await fetch(`${API_URL}/protected`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('protectedData').innerHTML = `
                <p>${data.message}</p>
                <p>Пользователь: ${data.user.username}</p>
            `;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Ошибка при получении данных');
    }
}

// Выход из системы
function logout() {
    token = null;
    localStorage.removeItem('token');
    document.getElementById('protectedContent').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

// Показ защищенного контента
function showProtectedContent(username) {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('protectedContent').style.display = 'block';
    document.getElementById('userInfo').textContent = `Добро пожаловать, ${username}!`;
}

// Проверка наличия токена при загрузке страницы
if (token) {
    const username = JSON.parse(atob(token.split('.')[1])).username;
    showProtectedContent(username);
} 