// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueQriously from 'vue-qriously'
import FastClick from 'fastclick'
// import MuseUI from 'muse-ui'

//mint-ui 加载更多组件
import {Loadmore, Spinner, Lazyload, Picker, Popup, Toast,Progress,MessageBox,Swipe, SwipeItem} from 'mint-ui'
import 'mint-ui/lib/style.css'




//使用Lazyload-图片懒加载
Vue.use(Lazyload);
Vue.component("mt-loadmore", Loadmore);
Vue.component("Spinner", Spinner);
Vue.component("mt-picker", Picker);
Vue.component("mt-popup", Popup);
Vue.component(Toast.name, Toast);
Vue.component(Progress.name, Progress);
Vue.component(MessageBox.name, MessageBox);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);


Vue.use(VueResource);
Vue.use(VueQriously);
// Vue.use(MuseUI)

import './assets/js/flexible.js'
import './assets/js/hybrid-bridge.js'
import './assets/js/hybrid.js'
import './assets/css/reset.css'
import 'weui/dist/style/weui.min.css'
// import 'muse-ui/dist/muse-ui.css'

Vue.config.productionTip = false;

window.addEventListener('load', () => {
  FastClick.attach(document.body)
});
window.isUrl_ = true;//定义跳转开关
window.reloadFun = function () {
	if(isUrl_){
		location.reload()
	}
};

window.localStorageClear = function () {
  localStorage.clear();
};

/*
 eg:"http://192.168.28.50:8090/#/applyForSecurity?isNeedToken=0"
 isNeedToken: 是url链接里面的标识,isNeedToken==0表示当前页面不需要token(即用户不需要登录也可以访问)
 getHashString方法在hybrid.js里面
 */
//var getTokenNum = getHashString("isNeedToken");
//if(!localStorage.accessToken && getTokenNum != 0) {
//getAccountToken("reloadFun");
//}

window.isUrl_ =
	((location.hash).indexOf("#/index") > -1
	|| (location.hash).indexOf("#/applyForSecurity") > -1
	|| (location.hash).indexOf("#/acceptanceOfDetails") > -1
	|| (location.hash).indexOf("#/sameCity") > -1
	|| (location.hash).indexOf("#/quotation") > -1
	|| (location.hash).indexOf("#/greenbeltCommunityActivityDetail") > -1
	|| (location.hash).indexOf("#/greenbeltCommunityCompany") > -1
	|| (location.hash).indexOf("#/avoidFraud") > -1)? false:true;

if(!localStorage.accessToken && isUrl_) {
  getAccountToken("reloadFun");
}


Vue.http.interceptors.push((request, next) => {
  if (localStorage.accessToken) {
    //如果请求时token存在,就为每次请求的headers中设置token,
    //后台根据headers中的token判断是否放行并且返回前端请求的数据。
    request.headers.set('access-token', localStorage.accessToken || "");
    request.headers.set('session-id', localStorage.sessionId || "");
  }

  next((response) => {

    invokeNative({"code": 1002}); //关闭加载圈
    //对于token是否已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
    if (response.data.stateCode === 312) { //未登录
      invokeNative({"code": 1001}); //loading
      getAccountToken("reloadFun");
      // invokeNative({"code": 1005,"callback":"loginReturn","extra":"reloadFun"});
    } else if (response.data.stateCode === 317) { //在其他设备登录
      invokeNative({"code": 1003}); //关闭WebView
    } else if (response.data.stateCode === 314) { //token过期
      invokeNative({"code": 1001}); //loading
      refreshToken("reloadFun")
    } else if (response.data.stateCode === 315) { //token已经刷新过了
      invokeNative({"code": 1001}); //loading
      getAccountToken("reloadFun");
    } else {
      invokeNative({"code": 1002}); //关闭加载圈
    }
    return response;
  });
});

// 货币过滤器
Vue.filter('currency', function (value, _currency, decimals) {
  var digitsRE = /(\d{3})(?=\d)/g;
  value = parseFloat(value);
  if (!isFinite(value) || !value && value !== 0) return '';
  _currency = _currency != null ? _currency : '$';
  decimals = decimals != null ? decimals : 2;
  var stringified = Math.abs(value).toFixed(decimals);
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  var i = _int.length % 3;
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
  var _float = decimals ? stringified.slice(-1 - decimals) : '';
  var sign = value < 0 ? '-' : '';
  return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
});

// 格式化时间2017.05.20 13:14
Vue.filter('setTime', function (value) {
  return setTime(value);
});

// 格式化日期2017.05.20
Vue.filter('setDate', function (value) {
  return setDate(value);
});

// 加一个m²
Vue.filter('squarMeter', function (value) {
  return value + "m²"
});

/*
 过滤电话号码182****1234/028-****1234
 start 表示从第几位开始过滤
 */
Vue.filter('phonefilter', function (value, start) {
  var data = value.split("");
  data.splice(start, 4, "*", "*", "*", "*");
  return data.join("");
});

//两个文字中间加空格 成 都
Vue.filter('addSpace', function (value) {
  return value.split("").join(" ");
});

//折扣显示0.08954->0.8
Vue.filter('toDiscount', function (value) {
  if (value) {
    var strValue = value.toString();
    if (strValue.indexOf(".") != -1) {
      var strNum = strValue.substring(0, strValue.indexOf(".") + 3);
      return accMul(strNum, 10);
    }
  } else {
    return "";
  }

});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
