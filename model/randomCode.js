
module.exports =function(n) {
	var n=n||4;
	var letters = 'abcedfghijklmlopqrstuvwxyzABCEEFGHIJKLMLOPQRSTUVWXYZ0123456789';
	//创建随机码
	for (var i = 0, codes = ''; i <n; i++) {
		codes += letters[parseInt(Math.random() * (letters.length - 1))];
	}
	return codes;
}
