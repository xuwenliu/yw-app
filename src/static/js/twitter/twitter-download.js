/**
 * Created by jiaminghe on 2017/4/11.
 */
(function(win, $, undefined) {


    var source =GC.Lib.GetQueryString("source");


    $(function() {

        $("title").text(source == 2?"注册成功":"加入推客");
        
        $(".download-submit").on("click",function () {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yingwumeijia.android.ywmj.client";
        });

    });

})(window, Zepto);