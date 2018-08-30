'use strict';

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
        let event = {
            dbOptions:{
                port: getDbPort()
            },
            pathParameters:{
                userid : 10001,
            },
            queryStringParameters:{
                scooterid : 20001,
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
           done();
       })
    });

    it('test request end', (done)=>{
        let event = {
            dbOptions:{
                port: getDbPort()
            },
            pathParameters:{
                userid : 10001,
            },
            queryStringParameters:{
                scooterid : 20001,
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
            done();
        })
    });

    it('test request query', (done)=>{
        let event = {
            dbOptions:{
                port: getDbPort()
            },
            pathParameters:{
                userid : 10001,
            },
            queryStringParameters:{
                scooterid : 20001,
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

            console.info(JSON.stringify(result) + '\n');
            done();
        })
    });
});
