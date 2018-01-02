
var url=require('url'),
    http=require('http'),
    app=require('./model/router_mongodb');
    
http.createServer(app).listen(7500);
