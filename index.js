const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();




const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kmggs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentsCollection = client.db("doctorsPortal").collection("dpCollection");

    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointmentsCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

});


app.get('/', (req, res) => {
    res.send('Server Opened')
})

app.listen(process.env.PORT || 4000);