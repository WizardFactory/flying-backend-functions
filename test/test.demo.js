'use strict';

const handlerDemo = require('../demo/handler');

describe('test demo module', ()=>{

    it('test request use', (done)=>{
        let event = {
            pathParameters:{
                userid : 10001,
                scooterid : 20001
            }
        };

        handlerDemo.reqUse(event, context, (err, result)=>{
           if(err){
               console.error('Error!');
               assert().fail();
               return done();
           }

           console.info(JSON.stringify(result));
           done();
       })
    });
});
