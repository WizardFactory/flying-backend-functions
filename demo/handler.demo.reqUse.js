/**
 * Created by Peter on 2018. 8. 27..
 */
'use strict';

const AWS = require('aws-sdk');
const async = require('async');

class dynamoDb{
    constructor(){
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    getDb(params, callback){

    }

    updateDb(params, callback){
        
    }
}


module.exports.reqUse = (event, context, callback) => {

};

