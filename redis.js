var redis = require("redis"),
    client = redis.createClient();




var url = require('url'),
    http = require('http');
   // app = require('./model/router');

http.createServer(function(req,res) {
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    //redis.print() A handy callback function for displaying return values when testing
    client.set("stringkey", "string val", redis.print);	//redis.print输出的是执行的结果,也可以使用回调：function (err, replies){}

    client.get("key", function (err, reply) {
        console.log(err, reply);
        console.log('get key xx');
        
    });

    // this key will expire after 10 seconds
    //client.set('key', 'value!', 'EX', 10);
    //client.hset('EX', 10, "name", "test val 1", "details", "test val 2");

    // No further commands will be processed 
    //client.end(true); 
}).listen(7500);