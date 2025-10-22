const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// list districts
app.get('/districts', async (req, res) => {
  const result = await pool.query('SELECT id, name FROM districts ORDER BY name');
  res.json(result.rows);
});

// summary for district
app.get('/district/:id/summary', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const summary = await pool.query(
    `SELECT d.id, d.name, m.month, m.workers, m.expenditure
     FROM districts d JOIN monthly m ON d.id = m.district_id
     WHERE d.id = $1 ORDER BY m.month DESC LIMIT 12`,
    [id]
  );
  if (summary.rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json({ district: summary.rows[0].name, timeseries: summary.rows });
});

app.listen(4000, async () => {
  console.log('Backend listening on 4000');
  // run ETL on startup (best-effort)
  const shouldRunETL = process.env.DATABASE_URL && process.env.DISABLE_ETL !== '1';
  if (shouldRunETL) {
    try {
      require('./etl');
    } catch (e) {
      console.error('ETL start failed', e.message);
    }
  } else {
    console.log('Skipping ETL: no DATABASE_URL or DISABLE_ETL=1');
  }
});
