
var url=require('url'),
    http=require('http'),
    app=require('./model/router');
    
http.createServer(app).listen(7500);
