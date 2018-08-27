/**
 * Created by Peter on 2018. 8. 27..
 */
'use strict';

module.export = {
    dynamoDb: {
        demo: {
            tableName: (process.env.DYNAMO_DEMO_TABLENAME || '')
        },
        scooter:{
            tableName: (process.env.DYNAMO_SCOOTER_TABLENAME || '')
        }
    }
};
