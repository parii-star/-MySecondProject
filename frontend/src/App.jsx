import { useCallback, useEffect, useMemo, useState } from 'react'
import { createEntry, fetchEntries, getApiBaseUrl } from './api'
import './App.css'

function App() {
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), [])

  const loadEntries = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchEntries()
      setEntries(data)
    } catch (err) {
      setError(err.message || 'Unable to load entries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) {
      setError('Please enter some text before submitting.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const newEntry = await createEntry(trimmed)
      setEntries((prev) => [newEntry, ...prev])
      setContent('')
    } catch (err) {
      setError(err.message || 'Unable to save entry')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Full Stack Demo</p>
          <h1>Capture Data And View It Instantly</h1>
          <p className="lead">
            Enter any text in the form below. The backend running on port 5000 stores
            it in PostgreSQL, and the table refreshes to show the latest entries.
          </p>
        </div>
        <div className="status-card">
          <span>API Endpoint</span>
          <strong>{apiBaseUrl}</strong>
        </div>
      </header>

      <main>
        <form className="entry-form" onSubmit={handleSubmit}>
          <label htmlFor="content">What would you like to store?</label>
          <div className="form-row">
            <input
              id="content"
              name="content"
              type="text"
              placeholder="Type anything..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Entry'}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>

        <section className="entries-section">
          <div className="section-headline">
            <h2>Stored Entries</h2>
            <button type="button" className="ghost" onClick={loadEntries} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {loading ? (
            <p className="muted">Loading entries...</p>
          ) : entries.length === 0 ? (
            <p className="muted">No entries yet. Be the first to add one!</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Content</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td>{entry.content}</td>
                      <td>{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
