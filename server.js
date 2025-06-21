const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const adapter = new JSONFile('db.json');
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= { scripts: [] };
  await db.write();
}
initDB();

// Upload script
app.post('/upload', async (req, res) => {
  const { name, level, unc, code } = req.body;
  if (!name || !level || !unc || !code) return res.status(400).send({ error: 'Missing fields' });

  const newScript = {
    id: nanoid(8),
    name,
    level,
    unc,
    code,
    date: new Date().toISOString()
  };

  db.data.scripts.push(newScript);
  await db.write();
  res.status(201).send({ success: true, script: newScript });
});

// Get all scripts
app.get('/scripts', async (req, res) => {
  await db.read();
  res.send(db.data.scripts);
});

// Get script by ID
app.get('/scripts/:id', async (req, res) => {
  await db.read();
  const script = db.data.scripts.find(s => s.id === req.params.id);
  if (!script) return res.status(404).send({ error: 'Script not found' });
  res.send(script);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
