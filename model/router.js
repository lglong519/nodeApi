
const url = require('url'),
    querystring = require("querystring"),
    sendMail = require("./mail"),
    redis = require("redis"),
    client = redis.createClient(),
    randomCode=require('./randomCode');
client.on("error", function (err) {
    console.log("Error " + err);
});
let server = () => {

    let app = (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        //获取请求的方式
        let method = req.method;
        //如果不是POST返回错误
        if (method != 'POST') {
            res.writeHeader(403, { 'contentType': 'text/html;charset:"utf-8"' });
            res.write('Request method "GET" not supported');
            res.end();
        } else {
            let postStr = '',
                datas;
            //获取post数据
            req.on('data', (chunk) => {
                postStr += chunk;
            });
            //获取数据结束
            req.on('end', (err, chunk) => {
                //将数据转为对象类型
                datas = querystring.parse(postStr, '&', '=');

                res.writeHeader(200, { 'contentType': 'text/html;charset:utf-8' });

                //判断请求的api
                let pathName = url.parse(req.url).pathname.replace('/', '');

                //创建/发送验证码
                if (pathName == 'generateCode') {
                    //创建随机码
                    let codes = randomCode();
                    console.log('接收邮箱：',datas.user);
                    console.log('验证码：',codes);
                    //储存验证码，设置过期时间3分钟
                    if (datas.user && datas.user.indexOf('@') > -1) {
                        client.set(datas.user, codes, 'EX', 180);
                        //向邮箱发送验证码
                        sendMail(datas.user, '登录验证码', '登录验证码：' + codes);
                        res.write('ok');
                    }else{
                        res.write('account error');
                    }
                    res.end();
                }
                //验证 验证码
                if (pathName == 'verifyCode') {
                    //redis获取临时验证码
                    client.get(datas.user, function (err, reply) {
                        if (err){
                            res.write('Please get your verifyCode first.');
                        }else{
                            if (reply){
                                //将数据库的验证和个人输入的验证码对比
                                if (reply.toLowerCase() == datas.verifyCode.toLowerCase()) {
                                    res.write('success');
                                    //成功验证后删除key
                                    client.del(datas.user);
                                    res.end();
                                    return;
                                }
                            }
                            res.write('verifyCode error');
                        }
                        console.log(err, reply);
                        res.end();
                    });  
                }
            });
        }

    };
    return app;
}

module.exports = server();