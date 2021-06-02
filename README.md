<p align="center">
  <a href="https://id6.io">
    <img alt="id6-logo" src="https://raw.githubusercontent.com/id6/id6-brand/latest/logo/id6-logo-purple.svg" width="100"/>
  </a>
</p>
<h1 align="center">id6-express</h1>
<p align="center">Express middleware for id6</p>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/@id6/express">
</p>

## Usage

Install dependencies:

```
npm i @id6/express cookie-parser dotenv
```

Setup authentication:

```js
const express = require('express');
const cors = require('cors');
const { authenticate, isAuthenticated } = require('id6-express');

const app = express();

app.use(cors({
  // 1. allow browsers to send the auth cookie
  credentials: true,
}));
// 2. make sure express parses cookies
app.use(cookieParser());
// 3. add the auth middleware
app.use(authenticate({
  url: 'https://authorize.company.com',
  secret: 'changeMe',
}));

app.get('/hello', (req, res) => {
  const user = req.user; // set by id6
  res.json(user ? 'Authenticated' : 'Anonymous');
});
app.get('/private', isAuthenticated, (req, res) => {
  const user = req.user; // set by id6
  res.json(user ? 'Authenticated' : 'Anonymous');
});

app.listen(8000, () => console.log(`Listening on port 8000`));
```
