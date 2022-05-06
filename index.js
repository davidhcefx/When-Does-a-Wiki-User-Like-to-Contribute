const express = require('express');
const user = require('./user.js');
const app = express();
const PORT = process.env.PORT || 80;
  
function reply404(req, res) {
  res.status(404).end(`File ${req.path} not found!`);
}

function logRequest(req) {
  console.log([Date.now(), req.ip, req.originalUrl].join('\t'));
}

app.get('/', (req, res) => {
  res.sendFile(
    'index.html',
    { root: `${__dirname}/web` },
    (err) => { if (err) reply404(req, res); },
  );
  logRequest(req);
});

app.get('/:name', (req, res) => {
  res.sendFile(
    req.params.name,
    { root: `${__dirname}/web` },
    (err) => { if (err) reply404(req, res); },
  );
  logRequest(req);
});

app.get('/api/v1/:user', (req, res) => {
  res.json(user.getStats(req.params.user));
  logRequest(req);
});

const server = app.listen(PORT, () => {
  console.log(`Server listening at port ${server.address().port}...`);
});
