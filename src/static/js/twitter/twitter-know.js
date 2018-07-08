/**
 * Created by jiaminghe on 2017/4/11.
 */
(function(win, $, undefined) {

    $(function() {
        /*后退*/
        $(".title").find("span").on("click", function() {
            var closeView=GC.Lib.GetQueryString("close");
            closeView==1? invokeNative({"code":1003}):window.history.go(-1);
        });

    });

})(window, Zepto);