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
var makeGetParams = (v, fnStatus) => {
    return {
        TableName: getTableName(),
        Key: {
            userid: getUserId(v),
            timestamp: 0
        }
    }
};
module.exports.reqGet = (event, context, callback) => {
    console.info(`\n reqGet event : ${JSON.stringify(event)}`);
    try{
        var params = makeGetParams(event, getStartStatus);
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    let db = new dynamoDb(getDbOptions(event));
    console.info(`reqGet DB getItem params: ${JSON.stringify(params)}`);
    db.setParams(params).getItemDB((err, res)=>{
        console.log(`update : Err[${err}], Res[${res}]`);

        console.log(`item : ${JSON.stringify(res)}`);
        return callback(err);
    });
};

module.exports.reqStart = (event, context, callback) => {
    console.info(`\n reqStart event : ${JSON.stringify(event)}`);
    try{
        var params = makePutParams(event, getStartStatus);
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    let db = new dynamoDb(getDbOptions(event));

    console.info(`reqStart DB put params: ${JSON.stringify(params)}`);
    db.setParams(params).putDB((err, res)=>{
        console.log(`update : Err[${err}], Res[${res}]`);
        return callback(err);
    });
};

module.exports.reqEnd = (event, context, callback) => {
    console.info(`\n reqEnd event : ${JSON.stringify(event)}`);
    try{
        var params = makePutParams(event, getEndStatus);
    }catch(err){
        err.message += 'Unexpected error';
        console.error(`exception : ${err}`);
        return callback(err);
    }

    let db = new dynamoDb(getDbOptions(event));

    console.info(`reqEnd DB put params: ${JSON.stringify(params)}`);
    db.setParams(params).putDB((err, res)=>{
        console.log(`update : Err[${err}], Res[${res}]`);
        return callback(err);
    });
};
