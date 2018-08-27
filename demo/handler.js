/**
 * Created by Peter on 2018. 8. 27..
 */
'use strict';

const config = require('../config');
const dynamoDb = require('./demo.reqUse');

module.exports.reqUse = (event, context, callback) => {
    console.info(`event : ${JSON.stringify(event)}`);
    try{
        var params = {
            TableName: config.dynamoDb.demo.tableName,
            Key: {
                id: event.userid
            },
            userId: parseInt(event.userid),
            scooterId: parseInt(event.scooterid),
            status: 'start to use',
            date: new Date()
        };
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    let db = new dynamoDb();

    console.info(`DB update params: ${JSON.stringify(params)}`);
    db.setParams(params).updateDb((err, res)=>{
        console.log(`update : Err[${err}], Res[${res}]`);
        return callback(err);
    });
};

