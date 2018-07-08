(function(win, $, undefined) {

    $(function() {
        $(".title").find("span").on("click", function() {
            window.history.go(-1);
        });

        
    });

})(window, Zepto);