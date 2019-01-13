// AWS Experiment - app to exercise S3

var aws = require('aws-sdk'),
    express = require('express'),
    uuid = require('uuid');

var s3 = new aws.S3();
var app = express();
var bucket;

// Status endpoint
app.get('/status',function(req,resp){
    resp.end('Running ok');
    console.log('Status called');
})

// Create S3 bucket
app.post('/s3CreateBucket/:bucket',function(req,resp){
    console.log('s3CreateBucket called with ',req.params.bucket);
    bucket = req.params.bucket + '-' + uuid();
    s3.createBucket(
        {Bucket: bucket},
        function(err,data){
            if (err) {
                console.log('Error - ',err);
            } else {
                console.log('s3 bucket created - ',bucket);
            }
        }
    );
    resp.end('Create bucket called - ' + bucket);
})
// List s3 buckets
app.get('/s3ListBuckets',function(req,resp){
    console.log('s3ListBucket called');
    s3.listBuckets(
      function(err,data){
          console.log(data);
          resp.end('Buckets: ' + '\n'  + JSON.stringify(data));
      }  
    )
})

// Store data in s3
app.post('/s3CreateObject/:id',function(req,resp){
    console.log('s3Create called with ',req.params.id);
    s3.putObject(
        {Bucket: bucket,
        Key: req.params.id,
        Body: req.body,
        Matadata:{test_label:'test_value'}
        }
    );
    resp.end('Create s3 object: ' + req.params.id);
})

// Retrieve data from s3 bucket
app.get('/s3RetrieveObject/:id',function(req,resp){
    console.log('s3RetrieveObject called with ',req.params.id);
    s3.getObject(
      {Bucket: bucket,
      Key: id},
      function(err,data){
          console.log(data);
          resp.end('Retrieved data from Bucket: ' + bucket +'\n' + 'Key: ' + id +'\n' + 'Data: ' +data);
      }  
    )
})

// Delete data from s3
app.delete('s3DeleteObject/:id',function(req,resp){
    console.log('s3DeleteObject called with ',req.params.id);
    s3.deletetObject(
      {Bucket: bucket,
      Key: id},
      function(err,data){
          console.log(data);
          resp.end('Deleted data from Bucket: ' + bucket +'\n' + 'Key: ' + id +'\n' + 'Data: ' +data);
      }  
    ) 
})

// List data objectsfrom s3
app.get('s3ListObject',function(req,resp){
    console.log('s3ListObject called');
    s3.listObject(
      {Bucket: bucket},
      function(err,data){
          console.log(JSON.stringify(data));
          resp.end('Listed data from Bucket: ' + bucket +'\n' + 'Key: ' + id +'\n' + 'Data: ' +JSON.stringify(data));
      }  
    ) 
})
// Start web server
app.listen(8081);