const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 3000;

const adapter = new JSONFile('db.json');
const db = new Low(adapter);

app.use(cors());
app.use(express.json());

(async () => {
  await db.read();
  db.data ||= { scripts: [] };
  await db.write();
})();

app.get('/scripts', async (req, res) => {
  await db.read();
  res.json(db.data.scripts);
});

app.post('/scripts', async (req, res) => {
  const { name, unc, level, code, universal, supportedGames } = req.body;

  if (!name || !unc || !level || !code) {
    return res.status(400).send('Missing fields');
  }

  const newScript = {
    id: nanoid(),
    name,
    unc,
    level,
    code,
    universal,
    supportedGames: universal ? 'Universal' : supportedGames || ''
  };

  db.data.scripts.push(newScript);
  await db.write();
  res.status(201).json({ success: true, id: newScript.id });
});

app.listen(port, () => {
  console.log(`Script hub backend running on port ${port}`);
});
