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

Create a `.env` file:

```dotenv
# URL of your id6 authorization endpoint
ID6_AUTHORIZATION_URL=https://authorize.company.com
# secret to access your id6 authorization endpoint
ID6_AUTHORIZATION_SECRET=changeMe
```

Setup authentication:

```js
require('dotenv/config'); // loads .env in process.env
const express = require('express');
const { authenticate, isAuthenticated } = require('id6-express');

const app = express();

app.use(cookieParser());
app.use(authenticate);

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
