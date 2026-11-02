from models import Base
from migrations.database import engine


def run_migrations():
    print("Підключення до бази даних PostgreSQL...")

    try:
        Base.metadata.create_all(bind=engine)

        print("Міграція успішно виконана.")
        print("Таблиці бази даних створені або вже існують.")

    except Exception as error:
        print(f"Помилка під час виконання міграції: {error}")
        raise


if __name__ == "__main__":
    run_migrations()