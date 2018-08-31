/**
 * Created by Peter on 2018. 8. 27..
 */
'use strict';

const config = require('../config');
const dynamoDb = require('./demo.dynamoDB.js');

var getDbOptions = (v)=>{
    if(v.dbOptions){
        return {
            region: 'localhost',
            endpoint: 'http://localhost:'+v.dbOptions.port,
        };
    }

    return undefined;
};
var getPathParameters = v => (v.pathParameters || {});
var getQueryStringParameters = v => (v.queryStringParameters || {});
var getUserId = v => parseInt(getPathParameters(v).userid || 0);
var getScooterId = v => parseInt(getQueryStringParameters(v).scooterid || 0);
var getAddr = v => (getQueryStringParameters(v).addr || 'none');
var getStartStatus = ()=> 'USE';
var getEndStatus = ()=> 'END';
var getTableName = ()=> config.dynamoDb.demo.tableName;
var getGeoLon = v => parseFloat(getQueryStringParameters(v).lon || 0.0);
var getGeoLat = v => parseFloat(getQueryStringParameters(v).lat || 0.0);
var getGeo = (v)=>{
    let geo = [];
    geo.push(getGeoLon(v));
    geo.push(getGeoLat(v));
    return geo;
};
var getDate = ()=>(new Date().toISOString());
var getTimestamp = ()=>(new Date().getTime());

var makePutParams = (v, fnStatus) => {
    return {
        TableName: getTableName(),
        Item: {
            userid: getUserId(v),
            timestamp: getTimestamp(),
            info: {
                scooterid: getScooterId(v),
                date: getDate(),
                status: fnStatus(),
                geo: getGeo(v),
                addr: getAddr(v)
            }
        }
    }
};

var makeQueryParams = (v, fnStatus) => {
    return {
        TableName: getTableName(),
        KeyConditionExpression: '#userid = :userid',
        ExpressionAttributeNames: {
            '#userid': 'userid'
        },
        ExpressionAttributeValues:{
            ':userid': getUserId(v)
        },
        ScanIndexForward: true
    }
};

var makeResponse = (event, err, result) =>{
    if(err){
        console.error(`Error : msg type[${err}]`);
        return {
            statusCode: err.statusCode || 501,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'cache-control': 'max-age=2592000',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                status: 'ERROR',
                userid: getUserId(event),
                scooterid: getScooterId(event),
                ErrorString : err.toString()
            })
        }
    }else{
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'cache-control': 'max-age=2592000',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                status: 'OK',
                userid: getUserId(event),
                scooterid: getScooterId(event),
                result : result
            })
        }
    }
};


/**
 *
 * @param event
 * @param context
 * @param callback
 * @returns {*}
 */
module.exports.reqQuery = (event, context, callback) => {
    //console.info(`\n reqQuery event : ${JSON.stringify(event)}`);
    try{
        var params = makeQueryParams(event, getStartStatus);
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    // 1. make dynamo db instance
    let db = new dynamoDb(getDbOptions(event));
    //console.info(`reqQuery DB getItem params: ${JSON.stringify(params)}`);

    // 2. Query to get items from DB
    db.setParams(params).queryDB((err, res)=>{
        //console.log(`query : Err[${err}], Res[${res}]`);
        //console.log(`items : ${JSON.stringify(res)}`);
        return callback(err, makeResponse(event, err, res));
    });
};

/**
 * Description : To insert start item which is happened by pressing start button by user on the application
 * @param event
 * @param context
 * @param callback
 * @returns {*}
 */
module.exports.reqStart = (event, context, callback) => {
    //console.info(`\n reqStart event : ${JSON.stringify(event)}`);
    try{
        var params = makePutParams(event, getStartStatus);
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    // 1. make dynamo db instance
    let db = new dynamoDb(getDbOptions(event));
    //console.info(`reqStart DB put params: ${JSON.stringify(params)}`);

    // 2. Put item of start to DB
    db.setParams(params).putDB((err, res)=>{
        //console.log(`reqStart put : Err[${err}], Res[${res}]`);
        return callback(err, makeResponse(event, err, res));
    });
};

/**
 * Description : To insert end item which is happened by pressing end button by user on the application
 * @param event
 * @param context
 * @param callback
 * @returns {*}
 */
module.exports.reqEnd = (event, context, callback) => {
    //console.info(`\n reqEnd event : ${JSON.stringify(event)}`);
    try{
        var params = makePutParams(event, getEndStatus);
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    // 1. make dynamo db instance
    let db = new dynamoDb(getDbOptions(event));
    //console.info(`reqEnd DB put params: ${JSON.stringify(params)}`);

    // 2. Put item of end to DB
    db.setParams(params).putDB((err, res)=>{
        //console.log(`reqEnd put : Err[${err}], Res[${res}]`);
        return callback(err, makeResponse(event, err, res));
    });
};
