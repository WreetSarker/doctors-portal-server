const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();



app.get('/', (req, res) => {
    res.send('Server Opened')
})

app.listen(process.env.PORT || 4000);