const { response } = require('express');
const express = require('express');
const { request } = require('http');
const path = require('path');
const { send } = require('process');

const exphbs = require('express-handlebars');

const logger = require('./middleware/logger');

const patients = require('./Patients');

const app = express();

require('dotenv').config()

// include MongoDB
const { MongoClient } = require('mongodb');

/* // Get request
app.get('/', (reqeust, response) => {
    response.sendFile(path.join(__dirname,'public','index.html'));
}) */

// Init middleware
// app.use(logger);

// Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Homepage Route
app.get('/', (request, response) => response.render('index', {
    title: 'Patient Info App',

}));

// Profile page Route
app.get('/patients/:id', (request, response) => {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://user:heartbits2020@heartbit2020-patients.f2wof.mongodb.net/patients?retryWrites=true&w=majority";

    // MongoDB instance client
    const client = new MongoClient(uri);
    var ObjectId = require('mongodb').ObjectID;

    async function findPatientById(client, patientId) {
        if (patientId == 1) { patientId = '5f9def0ef0ccee22c46f253d' }
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            patientObject = await client.db("patients").collection("heartbits2020")
                .findOne({ _id: ObjectId(patientId) });
            console.log(patientObject);
            response.render('profile', {
                name: patientObject.name,
                blood_type: patientObject.blood_type,
                alergies: (patientObject.alergies).split(', '),
                image: patientObject.image,
                medication: (patientObject.medication).split(', '),
                chrondesies: (patientObject.chrondesies).split(', '),
                emercontact: patientObject.emercontact,
                medexams: (patientObject.medexams).split(', '),
                medreports: (patientObject.medreports).split(', '),
                pattreat: (patientObject.pattreat).split(', ')
            })
        } catch (e) {
            response.status(500).json({ msg: `Error ${e}` });
        } finally {
            await client.close();
            console.log("closed");
        }
    }
    try {
        findPatientById(client, request.params.id);
    } catch {
        response.status(400).json({ msg: `No patient with id of ${request.params.id}` });
    }

    /* response.render('profile', {
        name: patientObject.name,

    }) */
});


// Members API Routes
app.use('/api/patients', require('./routes/api/patients'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server port ${PORT}`));