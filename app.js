const express = require('express');
const http = require('http');
var cors = require('cors')
require('dotenv').config()
const axios = require('axios');
var bodyParser = require('body-parser')

const port = process.env.PORT;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', express.static(__dirname));

app.use(cors())

app.post('/openai', async function (req, res, next) {
    console.log(req.body.messages)
  let resp = await axios.post('https://api.openai.com/v1/chat/completions', {
    "model": "gpt-3.5-turbo-16k",
    "messages": req.body.messages,
    "temperature": 0.8
  },{
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
  } )

  res.json(resp.data)

})

const server = http.createServer(app);

server.listen(port, () => console.log(`Server started on port localhost:${port}`));
