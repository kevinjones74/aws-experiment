const aws = require('aws-sdk');
const csv = require('csvtojson');
const fs = require('fs');

const csvfile = '//Users/Kevin/Documents/AWS-Experiment/s3log.csv';

var events = [];
var provEvents = {};

csv({delimiter:' ',noheader:true, quote:'"',
    headers: ['bucketOwner','bucket','time','timeOffset','remoteIP','requestor',
    'requestID','operation','key','requestURI','httpStatus',
    'errorCode','bytesSent','objectSize','totalTime','turnAroundtime',
    'referrer','userAgent','version']})
    .fromFile(csvfile)
    .then((jsonObj)=>{
         console.log(jsonObj);
         jsonObj.forEach((row, index) => {
            console.log('index = ',index,'\n',
                'time = ',row.time,'\n',
                'requestor = ',row.requestor,'\n',
                'operation = ', row.operation,'\n',
                'bucket+key =', row.bucket, row.key,'\n');
            events.push({datetime:row.time, eventtype:row.operation, actor:row.requestor});
           // console.log('provEvnt\n',events);
         });
         console.log('Events\n',events);
         provEvents.events = events;
         fs.writeFile('prov.json', JSON.stringify(provEvents),(err) => {
             if (err) throw err;
             console.log("Success");
         });
     });

     