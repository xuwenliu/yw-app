/* 16-vue */
var version = "v1.13.0";

window.Host = {
  // customer:"http://192.168.28.78:8182/v5",//lf本机

  customer: "https://customer.yingwumeijia.com/v5",  // C端接口
  employee: "https://preemployee.yingwumeijia.com/v5",  // E端接口地址
  business: "https://devbusiness.yingwumeijia.com",  // B端接口，公司列表
  console: "https://devconsole.yingwumeijia.com",  // E端接口，扫二维码
  local: "http://" + window.location.host + "/" + version + "/template/",  // 前端资源地址
  localUrl: (location.port) ? ("http://" + window.location.hostname + ':8090') : ("http://" + window.location.host + "/" + version + "/appv"),//vue本地和正式环境
  imgSize_750_750: "&imageView2/1/w/375/h/375",
  imgSize_750_500: "&imageView2/1/w/375/h/250",
  imgSize_750: "&imageView2/2/w/375",
  imgSize_330_330: "&imageView2/1/w/115/h/115",
  imgSize_128_128: "&imageView2/1/w/64/h/64",
  imgSize_190_190: "&imageView2/1/w/95/h/95",
  imgSize_80_80: "&imageView2/1/w/40/h/40",
  imgSize_200_84: "&imageView2/1/w/100/h/42",
  watermark: "|watermark/1/image/aHR0cDovL284bmxqZXdrZy5ia3QuY2xvdWRkbi5jb20vb18xYjR2Nmluamw4OHMybjY2YmJndHJjc2IyOC5wbmc=/gravity/SouthEast/dx/20/dy/20",
  imgSize_small_250: "&imageView2/1/w/250/h/250",
  imgSize_big_750: "&imageView2/2/w/750",
  groupBookingShare: 'https://groupbooking.yingwumeijia.com'
};
