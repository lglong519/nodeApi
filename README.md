#initialization

  npm install

#Boot server

  node server

#or

  supervisor server


#the other version uses mongodb

	node server_mongodb

#---------------------------


#api1：get verifyCode

	type:'post',
	data:{'user':''},
	url:'http://127.0.0.1:7500/generateCode'

#api2：check verifyCode

	type:'post',
	data:{
		'user':'',
		'verifyCode': ''
	},
	url:http://127.0.0.1:7500/verifyCode


#测试页面：/login/login.html

#输入个人邮箱
#点击 '获取验证码’ ，可在邮箱查看收到的 验证码
#点击 ’立即登录‘，验证输入的 验证码 是否正确

