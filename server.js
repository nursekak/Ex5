const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key'; // Замените на более сложный ключ

app.use(cors());
app.use(bodyParser.json());

let users = []; // Массив для хранения пользователей

// Регистрация
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    users.push({ username, password });
    res.status(201).json({ message: 'Пользователь зарегистрирован' });
});

// Вход в систему
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Защищенный маршрут
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Это защищенные данные', user: req.user });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
