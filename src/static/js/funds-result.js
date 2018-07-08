$(function() {
    var url = window.Host.local + "funds.html";
    // 返回上一页
    $(".title").find("span").on("click", function() {
        window.location.href = url;
    });

    countDown(url);

});

/**
 * [countDown 倒计时]
 * @return {[type]} [description]
 */
function countDown(url) {
    var val = 5;
    var timer = setInterval(function() {
        val--;
        if (val === 0) {
            clearInterval(timer);
            // 跳转页面
            window.location.href = url;
        }
        $(".payResult-p").find("span").text(val);
    }, 1000);
}
