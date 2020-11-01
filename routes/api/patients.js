const { request } = require('express');
const express = require('express');
const router = express.Router();
const patients = require('../../Patients');
// const uuid = require('uuid');

// include MongoDB
const { MongoClient } = require('mongodb');
/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://user:heartbits2020@heartbit2020-patients.f2wof.mongodb.net/patients?retryWrites=true&w=majority";

// MongoDB instance client
const client = new MongoClient(uri);
var ObjectId = require('mongodb').ObjectID;

/* // DB connection
await client.connect(); */



// Get all patients
router.get('/', (request, response) => response.json(patients));

// Get single patient
router.get('/:id', setTimeout((request, response) => {
    console.log("get");
    // let result = {};
    try {
        async function findPatientById(client, patientId) {
            try {
                // Connect to the MongoDB cluster
                await client.connect();
                patientObject = await client.db("patients").collection("heartbits2020")
                    .findOne({ _id: ObjectId(patientId) });

                response.json(patientObject);
            } catch (e) {
                response.status(400).json({ msg: `Error ${e}` });
            } finally {
                await client.close();
                console.log("closed");
            }

        }
        findPatientById(client, request.params.id);
    } catch {
        response.status(400).json({ msg: `No patient with id of ${patientId}` });
    }
}), 3000);

// Create patient
router.post('/', (request, response) => {
    const newPatient = {
        id: uuid.v4(),
        name: request.body.name,
        email: request.body.email,
        status: 'active'
    }

    if (!newPatient.name || !newPatient.email) {
        return response.status(400).json({ msg: 'Include a name and email' });
    }

    // In a database, it would be something like this
    // patients.save(newPatient);

    // Pushing new patient to array
    patients.push(newPatient);

    // response.json(patient);
    response.redirect('/');
});

// Update member
router.put('/:id', (request, response) => {
    const found = members.some(member => member.id === parseInt(request.params.id))
    if (found) {
        const updatedMember = request.body;
        members.forEach(member => {
            if (member.id === parseInt(request.params.id)) {
                member.name = updatedMember.name ? updatedMember.name : member.name;
                member.email = updatedMember.email ? updatedMember.email : member.email;

                response.json({ msg: 'Member uppdate', member });
            }
        })
    } else {
        response.status(400).json({ msg: `No member with id of ${request.params.id}` });
    }
});

// Delete member
router.delete('/:id', (request, response) => {
    const found = members.some(member => member.id === parseInt(request.params.id))
    if (found) {
        response.json({
            msg: 'Member deleted',
            members: members.filter(member => member.id !== parseInt(request.params.id))
        });
    } else {
        response.status(400).json({ msg: `No member with id of ${request.params.id}` });
    }
});

module.exports = router;