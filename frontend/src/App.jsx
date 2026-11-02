import { useEffect, useState } from 'react'

const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || '/api'
const API_URL = `${API_BASE_URL.replace(/\/$/, '')}/items`

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Отримання предметів із сервера
  async function loadItems() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Не вдалося отримати список предметів')
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError(
        'Не вдалося з’єднатися із сервером. Перевір, чи запущений FastAPI.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  // Очищення форми
  function resetForm() {
    setName('')
    setDescription('')
    setEditingId(null)
    setError('')
  }

  // Додавання або редагування предмета
  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Введіть назву предмета.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let response

      if (editingId !== null) {
        // Редагування предмета
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingId,
            name: trimmedName,
            description: description.trim()
          })
        })
      } else {
        // Генерація наступного ID
        const nextId =
          items.length > 0
            ? Math.max(...items.map((item) => item.id)) + 1
            : 1

        // Додавання нового предмета
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: nextId,
            name: trimmedName,
            description: description.trim()
          })
        })
      }

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Помилка збереження предмета')
      }

      await loadItems()

      setSuccess(
        editingId !== null
          ? 'Предмет успішно відредаговано.'
          : 'Предмет успішно додано.'
      )

      resetForm()
    } catch (err) {
      setError(err.message || 'Не вдалося зберегти предмет.')
    } finally {
      setSaving(false)
    }
  }

  // Заповнення форми даними предмета для редагування
  function handleEdit(item) {
    setEditingId(item.id)
    setName(item.name)
    setDescription(item.description || '')
    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Видалення предмета
  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Ви дійсно хочете видалити цей предмет?'
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Не вдалося видалити предмет')
      }

      if (editingId === id) {
        resetForm()
      }

      await loadItems()
      setSuccess('Предмет успішно видалено.')
    } catch (err) {
      setError(err.message || 'Помилка видалення предмета.')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">П</div>

          <div>
            <h1>Навчальні предмети</h1>
            <p>Система керування навчальними дисциплінами</p>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="intro">
          <span className="eyebrow">УПРАВЛІННЯ ДАНИМИ</span>
          <h2>Мої предмети</h2>
          <p>
            Переглядайте, додавайте та редагуйте навчальні предмети.
            Усі зміни передаються на сервер.
          </p>
        </section>

        <section className="form-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {editingId !== null ? 'РЕДАГУВАННЯ' : 'НОВИЙ ПРЕДМЕТ'}
              </span>

              <h3>
                {editingId !== null
                  ? 'Редагувати предмет'
                  : 'Додати предмет'}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Назва предмета</label>

              <input
                id="name"
                type="text"
                placeholder="Наприклад, Бази даних"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Опис предмета</label>

              <textarea
                id="description"
                placeholder="Короткий опис навчального предмета..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="button button-primary"
                disabled={saving}
              >
                {saving
                  ? 'Збереження...'
                  : editingId !== null
                    ? 'Зберегти зміни'
                    : 'Додати предмет'}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={resetForm}
                >
                  Скасувати
                </button>
              )}
            </div>
          </form>
        </section>

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        <section className="items-section">
          <div className="items-heading">
            <div>
              <span className="eyebrow">СПИСОК</span>
              <h3>Навчальні предмети</h3>
            </div>

            <span className="items-count">
              {items.length} предметів
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              Завантаження предметів...
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h4>Предметів поки немає</h4>
              <p>Додайте перший навчальний предмет за допомогою форми вище.</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <article className="item-card" key={item.id}>
                  <div className="item-top">
                    <span className="item-id">
                      ID: {item.id}
                    </span>

                    <span className="item-icon">📘</span>
                  </div>

                  <h4>{item.name}</h4>

                  <p className="item-description">
                    {item.description || 'Опис відсутній'}
                  </p>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="button button-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Редагувати
                    </button>

                    <button
                      type="button"
                      className="button button-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Навчальні предмети · FastAPI + React</p>
      </footer>
    </div>
  )
}

export default App