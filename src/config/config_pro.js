/**
 * pro
 */
var version = "v1.13.0";

window.Host = {
    customer: "https://customer.yingwumeijia.com/v5",  // 版本接口
    employee: "https://employee.yingwumeijia.com/v5",  // 版本接口
    business: "https://bizapi.yingwumeijia.com", // B端接口，公众平台公司列表
    console: "https://conapi.yingwumeijia.com",  // E端接口，扫二维码
    local: "https://"+window.location.host+"/"+version+"/template/",  // 前端资源地址
    localUrl:"http://"+window.location.host+"/"+version+"/appv", //前端vue资源地址
    imgSize_750_750: "&imageView2/1/w/750/h/750",
    imgSize_750_500: "&imageView2/1/w/750/h/500",
    imgSize_750: "&imageView2/2/w/750",
    imgSize_330_330: "&imageView2/1/w/330/h/330",
    imgSize_128_128: "&imageView2/1/w/128/h/128",
    imgSize_190_190: "&imageView2/1/w/190/h/190",
    imgSize_80_80: "&imageView2/1/w/80/h/80",
    imgSize_200_84: "&imageView2/1/w/200/h/84",
    watermark: "|watermark/1/image/aHR0cDovL284bmxqZXdrZy5ia3QuY2xvdWRkbi5jb20vb18xYjR2Nmluamw4OHMybjY2YmJndHJjc2IyOC5wbmc=/gravity/SouthEast/dx/20/dy/20",
    imgSize_small_250:"&imageView2/1/w/250/h/250",
    imgSize_big_750:"&imageView2/2/w/750",
    groupBookingShare: 'https://groupbooking.yingwumeijia.com'
};
