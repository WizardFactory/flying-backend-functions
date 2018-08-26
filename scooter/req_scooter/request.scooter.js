'use strict';

const async = require('async');

class ReqScooter{
    constructor(){
        this.userId = 0;
        this.scooterId = 0;
        this.key = '';
    }

    requestScooter(event, callback){
        let meta = {};

        console.log(`Req Scooter : ${meta}`);
        return callback(null);
    }
}

module.exports = ReqScooter;
