const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload());

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

    app.post('/getAppointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date);
        appointmentsCollection.find({ date: date.date })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/appointments', (req, res) => {
        appointmentsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addDoctor', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        file.mv(`${__dirname}/doctors/${file.name}`, err => {
            if (err) {
                console.log(err);
                return res.status(500).send({ msg: 'Failed to upload the image' })
            } else {
                return res.send({ name: file.name, path: `/${file.name}` })
            }
        })
    })

});


app.get('/', (req, res) => {
    res.send('Server Opened')
})

app.listen(process.env.PORT || 4000);