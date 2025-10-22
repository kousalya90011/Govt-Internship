const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS districts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS monthly (
      id SERIAL PRIMARY KEY,
      district_id INTEGER REFERENCES districts(id),
      month DATE,
      workers INTEGER,
      expenditure NUMERIC
    );
  `);
}

async function seedIfEmpty() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM districts');
  if (rows[0].c > 0) return;
  const seed = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'seed', 'sample_data.json')));
  for (const d of seed.districts) {
    const r = await pool.query('INSERT INTO districts(name) VALUES($1) RETURNING id', [d.name]);
    const id = r.rows[0].id;
    for (const m of d.monthly) {
      await pool.query('INSERT INTO monthly(district_id, month, workers, expenditure) VALUES($1, $2, $3, $4)', [id, m.month, m.workers, m.expenditure]);
    }
  }
  console.log('Seeded DB with sample data');
}

ensureSchema().then(seedIfEmpty).catch(err => console.error(err));

module.exports = {};
