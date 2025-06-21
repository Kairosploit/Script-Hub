import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';

const app = express();
const port = process.env.PORT || 3000;

const adapter = new JSONFile('db.json');
const db = new Low(adapter);

await db.read();
db.data ||= { scripts: [] };
await db.write();

app.use(cors());
app.use(express.json());

app.get('/scripts', (req, res) => {
  res.json(db.data.scripts);
});

app.post('/scripts', async (req, res) => {
  const { title, code, universal, supportedGames } = req.body;
  const newScript = {
    id: nanoid(),
    title,
    code,
    universal,
    supportedGames: universal ? [] : (supportedGames || [])
  };
  db.data.scripts.push(newScript);
  await db.write();
  res.status(201).json({ success: true, id: newScript.id });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
