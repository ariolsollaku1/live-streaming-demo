const express = require('express');
const http = require('http');
require('dotenv').config()

const port = process.env.PORT;

const app = express();
app.use('/', express.static(__dirname));
const server = http.createServer(app);

server.listen(port, () => console.log(`Server started on port localhost:${port}`));
