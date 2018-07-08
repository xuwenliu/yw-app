// localStorage.accessToken="b306ce5a94707437ce9749844de2da28";
// localStorage.sessionId="c275";
(function (win, undefined) {
  // 设备检测
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var isWx = (window.navigator.userAgent.toLowerCase()).match(/MicroMessenger/i) == 'micromessenger' //是否微信

  win.userInfo = {
    "accessToken": !localStorage.accessToken ? null : localStorage.accessToken,
    "sessionId": !localStorage.sessionId ? null : localStorage.sessionId
  };

  //// 用户信息
  //var userInfo = {
  //    "accessToken": !localStorage.accessToken?null:localStorage.accessToken,
  //    "sessionId": !localStorage.sessionId?null:localStorage.sessionId,
  //};

  var invokeNative = function (data) {
    //Android接口
    if (isAndroid && (window.jsIntelligencer) && !isWx) {
      var data_android = JSON.stringify(data);
      window.jsIntelligencer.invokeNative(data_android);
    }
    //iOS接口
    if (isiOS && (window.webkit) && !isWx) {
      var message = data;
      window.webkit.messageHandlers.invokeNative.postMessage(message);
    }
  };

  var getAccountToken = function (name) {
    //Android接口
    if (isAndroid && (window.jsIntelligencer) && !isWx) {
      window.jsIntelligencer.getAccountToken(name);
    }
    //iOS接口
    if (isiOS && (window.webkit) && !isWx) {
      var message = name;
      window.webkit.messageHandlers.getAccountToken.postMessage(message);
    }
  };

  var refreshToken = function (name) {
    //Android接口
    if (isAndroid && (window.jsIntelligencer) && !isWx) {
      window.jsIntelligencer.refreshToken(name);
    }
    //iOS接口
    if (isiOS && (window.webkit) && !isWx) {
      var message = name;
      window.webkit.messageHandlers.refreshToken.postMessage(message);
    }
  };

  var getAccountTokenReturn = function (val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    var name = value.name;
    localStorage.accessToken = value.token;
    localStorage.sessionId = value.sessionId;

    userInfo.accessToken = localStorage.accessToken;
    userInfo.sessionId = localStorage.sessionId;
    if (!!name) {
      window[name]();
    }
  };

  var loginReturn = function (val) {

    var value = window.atob(val);
    res = JSON.parse(value);

    if (res.data === true) {
      getAccountToken(res.data.extra || "")
    }
  };

  /**
   * [toDouble 个位数字添0]
   * @param  {[type]} iNum [数字参数]
   */
  var toDouble = function (iNum) {
    if (iNum < 10) {
      return '0' + iNum;
    } else {
      return '' + iNum;
    }
  };
  /**
   * [setTime 通用时间格式转换]
   * @param {[type]} para [时间戳]
   */
  var setTime = function (para) {
    var newTime = new Date(para);
    var result = newTime.getFullYear() +
      "." + toDouble(newTime.getMonth() + 1) +
      "." + toDouble(newTime.getDate()) +
      " " + toDouble(newTime.getHours()) +
      ":" + toDouble(newTime.getMinutes());
    // + ":" + toDouble(newTime.getSeconds()没有秒
    return result;
  };

  /**
   * [setDate 通用日期格式转换]
   * @param {[type]} para [时间戳]
   */
  var setDate = function (para) {
    var newTime = new Date(para);
    var result = newTime.getFullYear() + "." + toDouble(newTime.getMonth() + 1) + "." + toDouble(newTime.getDate());
    return result;
  };
  /**
   * [getHashString 获取url参数]
   * @param {[type]} name [参数名称]
   */
  var getHashString = function (name) {
    var url = window.location.hash.substr(1);
    var theRequest = {};
    if (url.indexOf("?") > -1) {
      var strs = url.split("?")[1].split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      for (var j in theRequest) {
        if (name == j) {
          return theRequest[j];
        }
      }
    } else {
      return null;
    }
  };
  /**
   * [getQueryVal 获取url参数]
   * @param {[type]} s url eg:http://192.168.28.50:8090/#/materialSubsidy?target=1,这里的url可以是任意url包括hash和非hash
   * 结果{target:"1"}
   */
  var getQueryVal = function (s) {
    var s = s || '';
    var arr = (s.split("?")[1] || s || '').split("&");
    var o = {};
    if (arr[0] == '') {
      return o
    }
    arr.forEach(function (x) {
      var ar = x.split("=");
      o[ar[0]] = ar[1]
    });
    return o
  }
  /**
   * 返回两个数相乘的精确结果
   * arg1乘以arg2的精确结果
   *
   */
  var accMul = function (arg1, arg2) {
    var m = 0, s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m
    )
  }

  /**
   *
   * 使用公钥加密
   *
   */
  var Rsa = function (key) {
    var encrypt = new JSEncrypt(),
      publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBG3UFPAxh+a0NLv6Plvjo5YPDdnlbED8dI4GP21DdFKvXVFcPb0lSRrht5Xrg7ck4PJ/fovfSi7k8MYqPY52g9tnPzkAthVOs99Tw6DVe22vV2hcs7dXvtk+TxKy4IqMjZA77hiH8wMYcJur+o4R770mrVP4fP88x53EQ4PaayQIDAQAB";
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(key);
  };


  /**
   *
   * 处理网路请求错误
   */
  var didApiError = function (res) {
    if (res.body.stateCode != 317 && res.body.stateCode != 312) {
      console.log(res.body.message);
      invokeNative({"code": window.jsBridge.CODE_TOAST, "data": res.body.message})
    }
  };
  /*v1.10.0获取设备信息*/
  var getEquipmentInfo = function () {
    var equipmentSystem, equipmentSystemVersion, equipmentVersion;
    var uA = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    var isPC = !/Android|webOS|iPhone|SymbianOS|Windows Phone|iPad|iPod|BlackBerry/i.test(uA);
    var isWin7 = uA.indexOf("Windows NT 6.1") > -1 || uA.indexOf("Windows 7") > -1;
    var isWin8 = uA.indexOf("Windows NT 6.2") > -1 || uA.indexOf("Windows 8") > -1;
    var isWin10 = uA.indexOf("Windows NT 10.0") > -1 || uA.indexOf("Windows 10") > -1;

    if (isPC) {
      if (isWin) {
        equipmentSystem = "Windows";
        if (isWin7) {
          equipmentSystemVersion = "Win7";
        }
        if (isWin8) {
          equipmentSystemVersion = "Win8";
        }
        if (isWin10) {
          equipmentSystemVersion = "Win10";
        }
      } else if (isMac) {
        equipmentSystem = "Mac";
        equipmentSystemVersion = uA.split("Intel Mac OS X")[1].split(")")[0].replace(/_/g, ".");
      } else if (isUnix) {
        equipmentSystem = "Unix";
        equipmentSystemVersion = "";
      } else if (isLinux) {
        equipmentSystem = "Linux";
        equipmentSystemVersion = "";
      } else {
        equipmentSystem = "other";
        equipmentSystemVersion = "";
      }
      equipmentVersion = "";
    } else if (/Android/i.test(uA)) {
      equipmentVersion = uA.split(";")[2].split("Build/")[0];
      equipmentSystem = "Android";
      equipmentSystemVersion = uA.split(";")[1].split("Android")[1];

    } else if (/iPhone/i.test(uA)) {
      equipmentVersion = "iPhone";
      equipmentSystem = "IOS";
      var str = uA.toLowerCase();
      var ver = str.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g, ".");
      equipmentSystemVersion = ver;
    } else {
      equipmentVersion = "other";
      equipmentSystem = "other";
      equipmentSystemVersion = "";
    }

    return {
      "equipmentId": "",
      "equipmentVersion": equipmentVersion,
      "equipmentSystem": equipmentSystem,
      "equipmentSystemVersion": equipmentSystemVersion,
    }
  }
  /*
  *
  *  数据埋点字段
  */
  var dataLog = {
    /*(2,"账号相关")action*/
    ACTION_LOGIN: 2,                             //登录
    ACTION_REGISTER: 3,                          //注册
    ACTION_FIND_PASSWORD: 4,                     //找回密码
    /*账号相关来源actionResource*/
    ACTION_RESOURCE_SEE_MATERIAL_SUBSIDY: 13,    //(13, 2, "APP-优惠-查看主材补贴")
    ACTION_RESOURCE_ENROLL: 14,                  //(14, 2, " APP-优惠-立即报名"),
    ACTION_RESOURCE_CREATE_ORDER: 15,            //(15, 2, "APP-保障-立即下单"),
    ACTION_RESOURCE_DEVELOP_TWITTER: 19,         //(19, 2, " H5-发展推客"),
    ACTION_RESOURCE_REPORT_CUSTOMER: 20,         //(20, 2, " H5-报备客户"),
    ACTION_RESOURCE_MATERIAL_SUBSIDY: 21,        //(21, 2, " H5-主材补贴"),

    /*(4, "优惠相关")action*/
    ACTION_SEE_DISCOUNT_DETAIL: 12,              //(12, 4, "查看优惠详情"),
    ACTION_SEE_MATERIAL_SUBSIDY: 13,             //(13, 4, "查看主材补贴"),

    /*(5, "保障相关")action*/
    ACTION_CLICK_PEOPLE_ASK: 15,                 //(15, 5, "点击人工咨询"),
    ACTION_CLICK_APPLY_GUARANTEE: 16,            //(16, 5, "点击申请保障"),
  }
  /**
   * validRule
   */
  var validRule = {
    price: /^\d{1,12}(\.\d{1,2})?$/,
    short_number: /^[0-9]{1,50}$/,//数字
    number: /^[0-9]{15}$/,//数字
    phonecode: /^[0-9]{6}$/,//验证码
    reNumber: /^.*[^\d].*$/,//非数字
    username: /^[a-zA-Z0-9]{8,20}$/, ///^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,20}$/,//数字字母组合用户名
    password: /^[a-zA-Z0-9]{8,20}$/, // //密码
    phone: /0?(13|14|15|18|17)[0-9]{9}$/,//手机号
    identity: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)|(^\d{14}(\d|X|x)$)/,//身份证
    realname: /^[\u4e00-\u9fa5]{2,10}$/,// 真实姓名
    backname: /^[\u4e00-\u9fa5]{2,50}$/,// 银行、公司姓名
    mergeCert: /(\w{2})(\d{6})(\w{10})/,//三证合一
    comcode: /^[a-zA-Z0-9]/ //数字字母
  };

  //win["userInfo"] = userInfo;
  win["loginReturn"] = loginReturn;
  win["invokeNative"] = invokeNative;
  win["getAccountToken"] = getAccountToken;
  win["refreshToken"] = refreshToken;
  win["getAccountTokenReturn"] = getAccountTokenReturn;
  win["setDate"] = setDate;
  win["setTime"] = setTime;
  win["getHashString"] = getHashString;
  win["getQueryVal"] = getQueryVal;
  win["dataLog"] = dataLog;
  win["validRule"] = validRule;
  win["accMul"] = accMul;
  win["Rsa"] = Rsa;
  win["didApiError"] = didApiError;
  win["getEquipmentInfo"] = getEquipmentInfo;
  win["isAndroid"] = isAndroid;
  win["isiOS"] = isiOS;

})(window);
