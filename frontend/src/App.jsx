import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Vite exposes env vars via import.meta.env and user-defined vars must be prefixed with VITE_
const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function LargeCard({ title, value, sub }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  )
}

export default function App() {
  const [districts, setDistricts] = useState([])
  const [selected, setSelected] = useState(null)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    axios.get(`${API}/districts`).then(r => setDistricts(r.data)).catch(() => {
      // fallback to local static data for quick demo
      fetch('/sample_data.json').then(r => r.json()).then(d => setDistricts(d.districts.map(x => ({ id: x.id, name: x.name })))).catch(() => setDistricts([]))
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    axios.get(`${API}/district/${selected}/summary`).then(r => setSummary(r.data)).catch(() => {
      // fallback to local static monthly data
      fetch('/sample_data.json').then(r => r.json()).then(d => {
        const times = d.monthly[selected] || []
        setSummary({ district: d.districts.find(x => x.id == selected).name, timeseries: times })
      }).catch(() => setSummary(null))
    })
  }, [selected])

  return (
    <div className="app">
      <header className="header">Our Voice, Our Rights</header>
      <main>
        <div className="selector">
          <label className="label">Select District</label>
          <select onChange={e => setSelected(e.target.value)} aria-label="District selector">
            <option value="">-- choose --</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {summary && (
          <section>
            <h2 className="section-title">{summary.district}</h2>
            <div className="cards">
              <LargeCard title="Latest month workers" value={summary.timeseries[0].workers} />
              <LargeCard title="Latest month expenditure" value={summary.timeseries[0].expenditure} sub="INR" />
            </div>

            <h3 className="small">Last 12 months</h3>
            <ul className="timeseries">
              {summary.timeseries.map(t => (
                <li key={t.month} className="ts-item">
                  <div className="ts-month">{new Date(t.month).toLocaleDateString()}</div>
                  <div className="ts-workers">{t.workers} workers</div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
