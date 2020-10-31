const moment = require('moment');


// Middleware function
const logger = (request, response, next) => {
    console.log(
        `${request.protocol}://${request.get('host')}${request.originalUrl
        } : ${moment().format()}`
    );
    next();
};

module.exports = logger;