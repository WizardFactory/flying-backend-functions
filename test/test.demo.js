'use strict';

const assert = require('assert');
const handlerDemo = require('../demo/handler');
const config = require('../config');
const AWS = require('aws-sdk');

var getDbPort = ()=>8000;
var getTableName = ()=> config.dynamoDb.demo.tableName;
var dbLocalOptions = {
    region: 'localhost',
    endpoint: 'http://localhost:'+ getDbPort(),
};

var getDbTableInfo = () => {
    return {
        TableName: getTableName(),
        AttributeDefinitions:[
            {
                AttributeName: 'userid',
                AttributeType: 'N'
            },
            {
                AttributeName: 'timestamp',
                AttributeType: 'N'
            }
        ],
        KeySchema:[
            {
                AttributeName: 'userid',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'timestamp',
                KeyType: 'RANGE'
            }
        ],
        ProvisionedThroughput:{
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    }
};

describe('test demo module', ()=>{

    before('create table', (done)=>{
        let dynamoDb = new AWS.DynamoDB(dbLocalOptions);
        dynamoDb.createTable(getDbTableInfo(), (err, res) =>{
            if(err){
                console.info(`Failed to create db table : ${err}`);
                return done();
            }
            //console.info(`Created DB Table : ${getTableName()}`);
            done();
        });
    });

    after('delete table', (done)=>{
        let dynamoDb = new AWS.DynamoDB(dbLocalOptions);
        dynamoDb.deleteTable({TableName:getTableName()}, (err, res) =>{
            if(err){
                console.info(`Failed to delete db table : ${err}`);
                return done();
            }
            //console.info(`Deleted DB Table : ${res}`);
            done();
        });
    });

    it('test request start', (done)=>{
        let getUserid = ()=> 10001;
        let getScooterid = ()=>20001;
        let event = {
            dbOptions:{
                port: getDbPort()
            },
            pathParameters:{
                userid : getUserid(),
            },
            queryStringParameters:{
                scooterid : getScooterid(),
                lon: 12.34,
                lat: 56.78,
                addr: 'TEST'
            }
        };

        handlerDemo.reqStart(event, context, (err, result)=>{
            if(err){
                console.error('Error!');
                assert().fail();
                return done();
            }
            console.info(JSON.stringify(result) + '\n');

            let body = JSON.parse(result.body);
            assert.equal(200, result.statusCode, 'Check statusCode');
            assert.equal('OK', body.status, 'Check statusCode');
            assert.equal(getUserid(), body.userid, 'Check statusCode');
            assert.equal(getScooterid(), body.scooterid, 'Check statusCode');
            done();
       })
    });

    it('test request end', (done)=>{
        let getUserid = ()=> 10001;
        let getScooterid = ()=>20001;
        let event = {
            dbOptions:{
                port: getDbPort()
            },
            pathParameters:{
                userid : getUserid(),
            },
            queryStringParameters:{
                scooterid : getScooterid(),
                lon: 12.34,
                lat: 56.78,
                addr: 'TEST'
            }
        };

        handlerDemo.reqEnd(event, context, (err, result)=>{
            if(err){
                console.error('Error!');
                assert().fail();
                return done();
            }

            console.info(JSON.stringify(result) + '\n');

            let body = JSON.parse(result.body);
            assert.equal(200, result.statusCode, 'Check statusCode');
            assert.equal('OK', body.status, 'Check statusCode');
            assert.equal(getUserid(), body.userid, 'Check statusCode');
            assert.equal(getScooterid(), body.scooterid, 'Check statusCode');
            done();
        })
    });

    it('test request query', (done)=>{
        let getUserid = ()=> 10001;
        let getScooterid = ()=>20001;
        let event = {
            dbOptions:{
                port: getDbPort()
            },
            pathParameters:{
                userid : getUserid(),
            },
            queryStringParameters:{
                scooterid : getScooterid(),
                lon: 12.34,
                lat: 56.78,
                addr: 'TEST'
            }
        };

        handlerDemo.reqQuery(event, context, (err, result)=>{
            if(err){
                console.error('Error!');
                assert().fail();
                return done();
            }

            let expectedQueriedItem = {
                status:'OK',
                userid:10001,
                result: {
                    Items:[
                        {
                            userid:10001,
                            timestamp:1535691904112,
                            info:{
                                date:'2018-08-31T05:05:04.112Z',
                                geo:[12.34,56.78],
                                addr:'TEST',
                                scooterid:20001,
                                status:'USE'
                            }
                        },
                        {
                            userid:10001,
                            timestamp:1535691904127,
                            info:{
                                date:'2018-08-31T05:05:04.127Z',
                                geo:[12.34,56.78],
                                addr:'TEST',
                                scooterid:20001,
                                status:'END'
                            }
                        }
                    ],
                    Count:2,
                    ScannedCount:2
                }
            };

            let body = JSON.parse(result.body);
            assert.equal(200, result.statusCode, 'Check statusCode');
            assert.equal('OK', body.status, 'Check statusCode');
            assert.equal(getUserid(), body.userid, 'Check statusCode');
            assert.equal(2, body.result.Count, 'Check count of items');
            assert.equal(2, body.result.ScannedCount, 'Check count of scanned items');


            console.info(JSON.stringify(result) + '\n');
            done();
        })
    });
});
