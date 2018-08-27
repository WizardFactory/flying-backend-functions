/**
 * Created by Peter on 2018. 8. 27..
 */
'use strict';

module.exports = {
    dynamoDb: {
        demo: {
            tableName: (process.env.DYNAMODB_DEMO_TABLE || '')
        },
        scooter:{
            tableName: (process.env.DYNAMO_SCOOTER_TABLENAME || '')
        }
    }
};
