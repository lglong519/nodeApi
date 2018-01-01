#initialization

  npm install

#Boot server

  node server

#or

  supervisor server




#---------------------------


#api：get verifyCode

	type:'post',
	data:{'user':''},
	url:'http://127.0.0.1:7500/generateCode'

#api：check verifyCode

	type:'post',
	data:{
		'user':'',
		'verifyCode': ''
	},
	url:http://127.0.0.1:7500/verifyCode




