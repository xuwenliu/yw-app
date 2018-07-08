/**
 * Created by jiaminghe on 2017/4/7.
 */
window.jsBridge = {
  CODE_DIALOG_SHOW: 1001,//显示加载圈
  CODE_DIALOG_HIDE: 1002,//隐藏加载圈
  CODE_CLOSE: 1003,//关闭页面
  CODE_TOAST: 1004,//显示弹窗消息
  CODE_LOGIN: 1005,//去登陆页面
  CODE_SHARE: 1006,//分享
  CODE_PAY: 1007,//去支付
  CODE_OPEN: 1008,//打开新的WebView页面
  CODE_PAY_RESULT: 1009,//支付完成
  CODE_GET_SINGLE_PHOTO: 1010,//获取一张图片
  CODE_OPEN_CASE_DETIAL: 1011,//打开作品详情
  CODE_CHOOSE_ADRESS: 1012,//获取地址
  CODE_GET_CONTACT_INFO: 1013,//获取联系人信息
  CODE_PICK_SINGLE_STING: 1014,//单选弹窗
  CODE_CALL_PHONE_NUMBER: 1015,//打电话
  CODE_ORDER_PAY_MESSAGE: 1016,//创建订单后邀请付款
  CODE_ORDER_BILL_PAY: 1017,//到收银台支付订单账单---废弃
  CODE_GET_BILL_ID: 1018,//获取账单ID
  CODE_COPY: 1019,//复制到粘贴板
  CODE_GET_LOGIN_STATUS: 1020,//获取用户登录状态
  CODE_OPEN_UPLOAD: 1021,//android上传图片
  CODE_DEVICE_SYSTEM_INFO: 1022,//数据埋点获取设备信息
  CODE_LOG_ACTION_RESOURCE: 1023,//数据埋点修改用户行为来源-告诉APP从哪个页面去的登录页
  CODE_PAY_ACTION_WITH_TYPE: 1024,//直接打开支付程序

  CODE_GO_COMPANY_DETAIL: 3001,//去公司详情页
  CODE_GO_DESIGNER_DETAIL: 3002,//去设计师详情页
  CODE_NAV_CHANGE: 3003,//让底部导航切换
  CODE_REGISTER: 3004,//注册
  CODE_STORE: 3005,//向app存储数据
  CODE_EXTRACT: 3006,//向app取数据

  CODE_GO_COMPANY_PICTURE: 3007,//去公司图片列表
};
