/**
 * Created by Peter on 2018. 8. 27..
 */

const AWS = require('aws-sdk');
const async = require('async');

class dynamoDb{
    constructor(options){
        this.dynamoDb = new AWS.DynamoDB.DocumentClient(options);
        this.queryParams();
    }

    setQueryParams(params){
        this.queryParams = params;
        return this;
    }
    getQueryParams(){
        return this.queryParams;
    }

    updateDb(callback){
        this.dynamoDb.update(getQueryParams(), (err, result)=>{
            return callback(err, result);
        });
    }
}


module.exports.reqEnd = (event, context, callback) => {
    let query = {};
    let db = new dynamoDb();

    console.info(`DB update params: ${JSON.stringify(query)}`);
    db.setQueryParams(query).updateDb((err, res)=>{
        console.log(`update : Err[${err}], Res[${res}]`);
        return callback(err);
    });
};
