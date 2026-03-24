const express = require('express');

const app = express();
const port = 3000;

const szolgaltatokMobilszama = {
    'Yettel': 20,
    'Telekom': 30,
    'Netfone': 31,
    'Digi': 50,
    'Vodafone/One': 70,
};

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/api', (req, res) => {
    res.json(szolgaltatokMobilszama);
});

app.post('/api', (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) {
    return res.status(400).send({ error: 'phone_number is required' });
  }

  const korzet = phone_number.replace('+', '').replace(' ', '').substring(2, 4);
  const szolgaltato = Object.keys(szolgaltatokMobilszama).find(key => szolgaltatokMobilszama[key] === parseInt(korzet));
  
  if (szolgaltato) {
      res.json({ szolgaltato });
  } else {
      res.status(404).json({ error: 'Szolgáltató nem található' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});