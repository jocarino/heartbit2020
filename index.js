const { response } = require('express');
const express = require('express');
const { request } = require('http');
const path = require('path');
const { send } = require('process');

const exphbs = require('express-handlebars');

const logger = require('./middleware/logger');

const patients = require('./Patients');

const app = express();


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



// Members API Routes
app.use('/api/patients', require('./routes/api/patients'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server port ${PORT}`));