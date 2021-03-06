/**
 * Created by Peter on 2018. 8. 27..
 */
'use strict';

const config = require('../config');
const AWS = require('aws-sdk');

class dynamoDb{
    constructor(options){
        this.dynamoDb = new AWS.DynamoDB.DocumentClient(options);
        this.queryParams = {};
    }

    setParams(params){
        this.queryParams = params;
        return this;
    }
    getParams(){
        return this.queryParams;
    }

    updateDB(callback){
        this.dynamoDb.update(this.getParams(), (err, result)=>{
            return callback(err, result);
        });
    }

    putDB(callback){
        this.dynamoDb.put(this.getParams(), (err, result)=>{
            return callback(err, result);
        });
    }

    getItemDB(callback){
        this.dynamoDb.get(this.getParams(), (err, result)=>{
            return callback(err, result);
        });
    }

    queryDB(callback){
        this.dynamoDb.query(this.getParams(), (err, result)=>{
            return callback(err, result);
        });
    }
}


module.exports = dynamoDb;

