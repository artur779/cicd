# Web Service CI/CD Lab 1
Цей сервіс реалізує базовий REST API за допомогою Python (FastAPI).

## Запуск за допомогою Docker
1. Зібрати образ: `docker build -t lab1-api .`
2. Запустити контейнер: `docker run -d -p 8000:8000 lab1-api`
3. Документація Swagger UI доступна за адресою: `http://localhost:8000/docs`

## Запуск unit-тестів
Виконайте команду: `pytest`
