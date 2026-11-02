
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо ORM-модель у корінь контейнера
COPY models.py /app/models.py

# Копіюємо міграційний застосунок
COPY migrations/ /app/migrations/

ENV PYTHONPATH=/app

CMD ["python", "-m", "migrations.main"]
