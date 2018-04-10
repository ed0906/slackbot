const handler = require('./handler');

exports.handler = (payload, context, callback) => {
    console.log("Inbound Request with body=[" + JSON.stringify(payload) + "]");
    handler(payload, callback);
};