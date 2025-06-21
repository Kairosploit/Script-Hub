import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
app.use(express.json());

const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Add default data here
await db.read();
db.data ||= { scripts: [] };
await db.write();

// Example route
app.get('/scripts', async (req, res) => {
  await db.read();
  res.json(db.data.scripts);
});

app.post('/scripts', async (req, res) => {
  const { name, code, universal, games } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Missing name or code' });
  }

  const newScript = {
    id: Date.now(),
    name,
    code,
    universal: !!universal,
    games: universal ? [] : games || []
  };

  db.data.scripts.push(newScript);
  await db.write();

  res.status(201).json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
