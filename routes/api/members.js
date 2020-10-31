const { request } = require('express');
const express = require('express');
const router = express.Router();
const patients = require('../../Patients');
const uuid = require('uuid');

// Get all patients
router.get('/', (request, response) => response.json(patients));

// Get single patient
router.get('/:id', (request, response) => {
    const found = patients.some(patient => patient.id === parseInt(request.params.id))
    if (found) {
        response.json(patients.filter(patient => patient.id === parseInt(request.params.id)));
    } else {
        response.status(400).json({ msg: `No patient with id of ${request.params.id}` });
    }
});

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