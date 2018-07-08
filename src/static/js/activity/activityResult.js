$(function() {
    // 返回前一个页面
    $(".title").find("span").on("click", function() {
        GC.Hybrid.closePage();
    });

    // 分享
    $(".result-btn").on("click", function() {
        var storage = window.localStorage;
        var shareInfo = storage.getItem("shareInfo");
        shareInfo = JSON.parse(shareInfo);

        GC.Hybrid.shareActivity(shareInfo);
    });
});