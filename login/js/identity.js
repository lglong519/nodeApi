/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-01-01 23:11:08
 * @version $Id$
 */
//登录验证
$('#login').on('click', login);
function login() {
    var code = $('#verifyCode').val(),
        user = $('#username').val();
    console.log(code, user)
    if (user && code) {
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:7500/verifyCode',
            data: {
                'user': user,
                'verifyCode': code,
            },
            success: data => {
                console.log(data);
                if (data == 'success') {
                    location.href='login_success.html';
                }else{
                    $('#error').show();
                }
            }
        });
    }
}
//请求验证码
$('#getCode').on('click', function () {
    var user = $('#username').val();
    $('#error').hide();
    if (user && $('#getCode').attr('disabled') != "disabled") {
        $(this).attr('disabled',true);
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:7500/generateCode',
            data: {
                'user': user
            },
            success: data => {
                console.log(data);
            }
        });
        $(this).css({
            'color': '#666',
            'border-color': '#b0b0b0'
        });
        var overTime = 60;
        leftTime(overTime);
    }
    return false;
});
//enter 登录
$(document).on('keydown',function (e) {
    if(e.keyCode==13){
        login();
    };
})
$('#verifyCode,#username').on('focus', function () {
    $('#error').hide();
})
function leftTime(time) {
    $('#leftTime').html(`(${time})`);
    if (time > 0) {
        setTimeout(() => {
            leftTime(--time);
        }, 1000);
    } else {
        setTimeout(() => {
            $('#leftTime').html('');
            $('#getCode').css({
                'color': '#3F7396',
                'border-color': '#3F7396'
            });
        $('#getCode').attr('disabled',false);
        }, 1000);
    }

}