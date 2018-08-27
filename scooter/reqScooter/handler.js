'use strict';

const reqScooter = require('./request.scooter.js');
module.exports.reqScooter = (event, context, callback) => {
    let meta = {};
    let req = new reqScooter();
    console.log(`reqScooter : ${meta}`);
    return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            input: event,
        }),
    });
};
