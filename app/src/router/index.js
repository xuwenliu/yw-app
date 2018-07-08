import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import use from "../pages/use"

/*推客*/
/*推客信息*/
import twitterInfo from '../pages/twitter/twitterInfo'
/*说明*/
import description from '../pages/twitter/description'
/*我的佣金明细*/
import myCommission from "../pages/twitter/myCommission/myCommission"
/*佣金明细*/
import commissionDetails from "../pages/twitter/myCommission/commissionDetails"
/*来自报备客户*/
import fromRemarkCustomer from "../pages/twitter/myCommission/fromRemarkCustomer"
/*来自下级推客*/
import fromTwitter from "../pages/twitter/myCommission/fromTwitter"
/*结佣记录*/
import commissionRecord from "../pages/twitter/myCommission/commissionRecord"
/*结佣凭证*/
import commissionVoucher from "../pages/twitter/myCommission/commissionVoucher"
/*我的客户信息*/
import myCustomer from "../pages/twitter/myCustomer/myCustomer"
/*我的客户--报备--已洽谈--已签约--客户详情*/
import remark from "../pages/twitter/myCustomer/remark"
import talkOverWith from "../pages/twitter/myCustomer/talkOverWith"
import signAContract from "../pages/twitter/myCustomer/signAContract"
import customerDetails from "../pages/twitter/myCustomer/customerDetails"
/*发展下线推客*/
import developTwitter from "../pages/twitter/developTwitter/developTwitter"
/*推客-奖金规则*/
import moneyRule from "../pages/twitter/developTwitter/moneyRule"
/*邀请客户注册*/
import inviteCustomerRegister from "../pages/twitter/inviteCustomerRegister/inviteCustomerRegister"


/*订单*/
//订单详情
import orderDetails from "../pages/order/orderC/details/details"
//订单详情-总览
import orderOverview from "../pages/order/orderC/details/overview"
//订单详情-定金
import orderDeposit from "../pages/order/orderC/details/deposit"
//订单详情-首款
import orderFirst from "../pages/order/orderC/details/first"
//订单详情-阶段款
import orderPhase from "../pages/order/orderC/details/phase"
//订单详情-尾款
import orderFinalPayment from "../pages/order/orderC/details/finalPayment"
//订单列表
import orderList from "../pages/order/orderC/orderList/orderList"

//订单操作记录
import operationLog from "../pages/order/orderC/details/operationLog"
//账单付款明细
import billPayDetail from "../pages/order/orderC/details/billPayDetail"
//E订单打款明细
import payDetail from "../pages/order/orderE/details/payDetail"

//E端订单列表
import orderListE from "../pages/order/orderE/orderList/orderListE"
import orderDesignList from "../pages/order/orderE/orderList/orderDesignList"
import orderProjectList from "../pages/order/orderE/orderList/orderProjectList"
import orderSupervisorList from "../pages/order/orderE/orderList/orderSupervisorList"

//支付款项
import payList from "../pages/order/orderC/payList/payList"
//选择优惠券
import chooseDiscountCoupon from "../pages/order/orderC/payList/chooseDiscountCoupon"
//如何使用优惠券
import useDiscountCoupon from "../pages/order/orderC/payList/useDiscountCoupon"
//支付成功
import paySuccess from "../pages/order/orderC/payList/paySuccess"
//账单信息
import billInfo from "../pages/order/orderC/payList/billInfo"

//E端 创建订单/创建预订单
import createOrder from "../pages/order/orderE/createOrder/createOrder"
//E端 -创建预订单-生成二维码
import createTwoDimensionCode from "../pages/order/orderE/createOrder/createTwoDimensionCode"
//E端 邀请付款
import orderInvite from "../pages/order/orderE/orderInvite/orderInvite"

//C端 主材补贴
import materialSubsidy from "../pages/material/materialC/materialSubsidy"
//获取补贴
import getSubsidy from "../pages/material/materialC/getSubsidy"
//门店详情
import storeDetails from "../pages/material/materialC/storeDetails"


//邀请加入主材推荐
import materialInvite from "../pages/material/inviteMaterial/inviteMaterial"
//家居顾问列表
import consultantList from "../pages/homeConsultant/consultantList"
import consultantCanSendList from "../pages/homeConsultant/consultantsCanSendOrder"
import consultantNotSendList from "../pages/homeConsultant/consultantsNotSendOrder"
//下载鹦鹉美家app页面
import download from "../pages/download/downloadApp"
//注册页面用户协议页面
import userAgreement from "../pages/userAgreement/userAgreement"

//主材支付成功
import materialPaySuccess from "../pages/material/materialC/materialPaySuccess"
//E端 主材补贴
import materialSubsidyE from "../pages/material/materialE/materialSubsidyE"

/*E端 我的客户*/
import mineCustomer from "../pages/customer/mineCustomer"
import talking from "../pages/customer/talking"
import done from "../pages/customer/done"
import failure from "../pages/customer/failure"
import finishedOrders from "../pages/customer/finishedOrders"

//家具顾问详情
import consultantDetail from "../pages/homeConsultant/details/consultantDetail"
import consultantDetailOverview from "../pages/homeConsultant/details/overview"
import consultantDetailCustomer from "../pages/homeConsultant/details/customer"
import consultantDetailOrder from "../pages/homeConsultant/details/order"

// v1.8.0
//C端-保障-申请保障
import applyForSecurity from "../pages/safeguard/applyForSecurity"
//C端-保障-监理公司详情
import supervisionCompanyDetails from "../pages/safeguard/supervisionCompanyDetails"
//C端-保障-支付定金
import giveADeposit from "../pages/safeguard/giveADeposit"
//C端-独立监理验收详情
import acceptanceOfDetails from "../pages/safeguard/acceptanceOfDetails"
//上传图片组件
import upLoader from '../components/upLoader'
//图片预览组件
import picPreview from '../components/picPreview'

//E端-监理订单-详情
import supervisionOrderDetailsForEmployee from '../pages/order/orderE/supervisionDetails/supervisionOrderDetails'
//E端-监理订单-详情-总览
import supervisionOverviewForEmployee from '../pages/order/orderE/supervisionDetails/supervisionOverview'
//E端-监理订单-详情-款项支付
import supervisionBillForEmployee from '../pages/order/orderE/supervisionDetails/supervisionBill'
//E端-监理订单-详情-总览-监理合同
import supervisionContractForEmployee from '../pages/order/orderE/supervisionDetails/contract/superversionContractForEmployee'
//E端-监理订单-详情-总览-编辑客户基本信息
import supervisionEditCustomerInfo from '../pages/order/orderE/supervisionDetails/supervisionEditCustomerInfo'

//C端-监理订单-详情
import supervisionOrderDetailsForCustomer from '../pages/order/orderC/supervisionDetailsCustomer/supervisionOrderDetailsCustomer'
//C端-监理订单-详情-总览
import supervisionOverviewForCustomer from '../pages/order/orderC/supervisionDetailsCustomer/supervisionOverviewCustomer'
//C端-监理订单-详情-款项支付
import supervisionBillForCustomer from '../pages/order/orderC/supervisionDetailsCustomer/supervisionBillCustomer'

//拼团活动列表
import groupBookingActivityList from '../pages/groupBooking/activity/groupBookingActivityList'
//拼团活动列表-进行中
import groupBookingActivityListUnderway from '../pages/groupBooking/activity/groupBookingActivityListUnderway'
//拼团活动列表-已完成
import groupBookingActivityListFinished from '../pages/groupBooking/activity/groupBookingActivityListFinished'
//拼团活动详情
import groupBookingActivityDetails from '../pages/groupBooking/activity/groupBookingActivityDetails'
//拼团活动详情-已结束
import groupBookingActivityDetailsEnd from '../pages/groupBooking/activity/groupBookingActivityDetailsEnd'
//拼团列表
import groupBookingActivityGroupList from '../pages/groupBooking/activity/groupBookingActivityGroupList'
//拼团发起确认
import groupBookingActivityConfirm from '../pages/groupBooking/activity/groupBookingActivityConfirm'
//拼团支付成功
import groupBookingActivityPaySuccess from '../pages/groupBooking/activity/groupBookingActivityPaySuccess'
//拼团优惠券详情
import groupBookingCouponDetails from '../pages/groupBooking/activity/groupBookingCouponDetails'

//我的拼团列表
import groupBookingMineList from '../pages/groupBooking/mine/groupBookingMineList'
//我的拼团列表-进行中
import groupBookingMineListUnderway from '../pages/groupBooking/mine/groupBookingMineListUnderway'
//我的拼团列表-已完成
import groupBookingMineListFinished from '../pages/groupBooking/mine/groupBookingMineListFinished'
//我的拼团详情
import groupBookingMineDetails from '../pages/groupBooking/mine/details/groupBookingDetails'

// //分享-拼团详情
// import shareGroupBookingActivityDetails from '../pages/groupBookingShare/shareGroupBookingActivityDetails'
// //分享-拼团注册
// import shareGroupBookingRegister from '../pages/groupBookingShare/shareGroupBookingRegister'
// //分享-拼团登录
// import shareGroupBookingLogin from '../pages/groupBookingShare/shareGroupBookingLogin'

/*v1.12.0首页*/
import index from '../pages/index/index'
import quotation from '../pages/index/quotation'//免费报价
import avoidFraud from '../pages/index/avoidFraud'//防骗必看
import sameCity from '../pages/index/sameCity'//同城设计师、同城装饰公司
import register from '../pages/index/register'

/*v1.14.0*/
/*活动详情*/
import greenbeltCommunityActivityDetail from '../pages/greenbeltCommunityActivity/greenbeltCommunityActivityDetail'
/*活动公司详情*/
import greenbeltCommunityCompany from '../pages/greenbeltCommunityActivity/greenbeltCommunityCompany'
import greenActivityContractList from '../pages/greenbeltCommunityActivity/greenActivityContractList'
import greenPrizeHistory from '../pages/greenbeltCommunityActivity/greenPrizeHistory'
import greenPrizeDetail from '../pages/greenbeltCommunityActivity/greenPrizeDetail'


export default new Router({
  // mode:'history',
  routes: [
    {path: '/', redirect: {name: 'index'}},


    /*test*/
    {path: '/use', name: 'use', component: use},
    /*test*/


    {
      path: '/twitterInfo',
      name: 'twitterInfo',
      component: twitterInfo,

      meta: {
        keepAlive: true //需要被缓存
      }
    },
    {path: '/description', name: 'description', component: description},
    {path: '/myCommission', name: 'myCommission', component: myCommission},
    {
      path: '/commissionDetails', name: 'commissionDetails', component: commissionDetails,
      children: [
        {path: "fromRemarkCustomer", name: 'fromRemarkCustomer', component: fromRemarkCustomer},
        {path: "fromTwitter", name: 'fromTwitter', component: fromTwitter},


      ]
    },
    {path: '/commissionRecord', name: 'commissionRecord', component: commissionRecord},
    {path: '/commissionVoucher', name: 'commissionVoucher', component: commissionVoucher},
    {
      path: '/myCustomer',
      name: 'myCustomer',
      component: myCustomer,
      children: [
        {path: "remark", name: 'remark', component: remark},
        {path: "talkOverWith", name: 'talkOverWith', component: talkOverWith},
        {path: "signAContract", name: 'signAContract', component: signAContract}

      ]
    },
    {path: '/customerDetails', name: 'customerDetails', component: customerDetails},
    {path: '/developTwitter', name: 'developTwitter', component: developTwitter},
    {path: '/moneyRule', name: 'moneyRule', component: moneyRule},
    {path: '/inviteCustomerRegister', name: 'inviteCustomerRegister', component: inviteCustomerRegister},

    //订单操作日志
    {path: '/operationLog', "name": "operationLog", component: operationLog},
    //账单付款明细
    {path: '/billPayDetail', "name": "billPayDetail", component: billPayDetail},
    //订单列表及其子路由
    {path: '/orderList', name: 'orderList', component: orderList},
    {
      path: '/orderListE',
      name: 'orderListE',
      component: orderListE,
      children: [
        {path: "orderDesignList", name: 'orderDesignList', component: orderDesignList},
        {path: "orderProjectList", name: 'orderProjectList', component: orderProjectList},
        {path: "orderSupervisorList", name: 'orderSupervisorList', component: orderSupervisorList}
      ]
    },
    //订单详情及其子路由
    {
      path: '/orderDetails',
      name: 'orderDetails',
      component: orderDetails,
      children: [
        {path: "overview", name: 'overview', component: orderOverview},
        {path: "deposit", name: 'deposit', component: orderDeposit},
        {path: "first", name: 'first', component: orderFirst},
        {path: "phase", name: 'phase', component: orderPhase},
        {path: "finalPayment", name: 'finalPayment', component: orderFinalPayment}
      ]
    },
    //订单-支付款项
    {path: '/payList', name: "payList", component: payList},
    {path: '/chooseDiscountCoupon', name: "chooseDiscountCoupon", component: chooseDiscountCoupon},
    {path: '/useDiscountCoupon', name: "useDiscountCoupon", component: useDiscountCoupon},
    {path: '/paySuccess', name: "paySuccess", component: paySuccess},
    {path: '/billInfo', name: "billInfo", component: billInfo},

    //E端创建订单/创建预订单
    {path: '/createOrder', name: "createOrder", component: createOrder},
    //E端 生成二维码
    {path: '/createTwoDimensionCode', name: "createTwoDimensionCode", component: createTwoDimensionCode},
    //E端 打款明细
    {path: '/payDetail', "name": "payDetail", component: payDetail},
    //E端 邀请付款
    {path: '/orderInvite', name: "orderInvite", component: orderInvite},

    //主材补贴
    {
      path: '/materialSubsidy',
      name: "materialSubsidy",
      component: materialSubsidy,
      meta: {
        keepAlive: true //需要被缓存
      }
    },
    {path: '/getSubsidy', name: "getSubsidy", component: getSubsidy},
    {path: '/storeDetails', name: "storeDetails", component: storeDetails},
    {path: '/materialPaySuccess', name: "materialPaySuccess", component: materialPaySuccess},
    {path: '/materialSubsidyE', name: "materialSubsidyE", component: materialSubsidyE},

    //我的客户 及其子路由
    {
      path: '/mineCustomer',
      name: "mineCustomer",
      component: mineCustomer,
      children: [
        {path: 'talking', name: "talking", component: talking},
        {path: 'done', name: "done", component: done},
        {path: 'failure', name: "failure", component: failure},
        {path: 'finishedOrders', name: "finishedOrders", component: finishedOrders}
      ]
    },

    //邀请主材推荐
    {path: '/materialInvite', name: "materialInvite", component: materialInvite},
    //下载鹦鹉美家app页面
    {path: '/download', name: "download", component: download},
    //用户协议页面
    {path: '/userAgreement', name: "userAgreement", component: userAgreement},

    //家居顾问列表
    {
      path: '/consultantList',
      name: "consultantList",
      component: consultantList,
      children: [
        {path: "consultantCanSendList", name: 'consultantCanSendList', component: consultantCanSendList},
        {path: "consultantNotSendList", name: 'consultantNotSendList', component: consultantNotSendList}
      ]
    },
    //家具顾问详情
    {
      path: "/consultantDetail",
      name: "consultantDetail",
      component: consultantDetail,
      children: [
        {path: "consultantOverview", name: "consultantDetailOverview", component: consultantDetailOverview},
        {path: "consultantCustomer", name: "consultantDetailCustomer", component: consultantDetailCustomer},
        {path: "consultantOrder", name: "consultantDetailOrder", component: consultantDetailOrder},
      ]
    },

    // v1.8.0
    //C端-保障-申请保障
    {
      path: '/applyForSecurity',
      name: "applyForSecurity",
      component: applyForSecurity,
      meta: {
        keepAlive: true //需要被缓存
      }
    },
    //C端-保障-监理公司详情
    {path: '/supervisionCompanyDetails', name: "supervisionCompanyDetails", component: supervisionCompanyDetails},
    //C端-保障-支付定金
    {path: '/giveADeposit', name: "giveADeposit", component: giveADeposit},
    {path: '/acceptanceOfDetails', name: "acceptanceOfDetails", component: acceptanceOfDetails},
    //图片上传
    {path: '/upLoader', name: 'upLoader', component: upLoader},
    //图片全屏预览--四方监管协议/监理合同
    {path: '/picPreview', name: 'picPreview', component: picPreview},

    //E端监理订单详情
    {
      path: '/supervisionOrderDetailsForEmployee',
      name: "supervisionOrderDetailsForEmployee",
      component: supervisionOrderDetailsForEmployee,
      children: [
        //总览
        {path: 'overview', name: "supervisionOverviewForEmployee", component: supervisionOverviewForEmployee},
        //支付款项
        {path: 'bill', name: "supervisionBillForEmployee", component: supervisionBillForEmployee},
      ]
    },

    //E端监理订单详情-监理合同
    {
      path: '/supervisionContractForEmployee',
      name: "supervisionContractForEmployee",
      component: supervisionContractForEmployee
    },

    //E端监理订单详情-编辑客户信息
    {path: '/supervisionEditCustomerInfo', name: "supervisionEditCustomerInfo", component: supervisionEditCustomerInfo},

    //C端监理订单详情
    {
      path: '/supervisionOrderDetailsForCustomer',
      name: "supervisionOrderDetailsForCustomer",
      component: supervisionOrderDetailsForCustomer,
      children: [
        //总览
        {
          path: '/supervisionOverviewCustomer',
          name: "supervisionOverviewForCustomer",
          component: supervisionOverviewForCustomer
        },
        //支付款项
        {path: '/supervisionBillCustomer', name: "supervisionBillForCustomer", component: supervisionBillForCustomer},
      ]
    },

    //拼团
    //拼团活动列表
    {
      path: '/groupBookingActivityList', name: 'groupBookingActivityList', component: groupBookingActivityList,
      children: [
        //进行中
        {
          path: '/groupBookingActivityListUnderway',
          name: 'groupBookingActivityListUnderway',
          component: groupBookingActivityListUnderway
        },
        //已结束
        {
          path: '/groupBookingActivityListFinished',
          name: 'groupBookingActivityListFinished',
          component: groupBookingActivityListFinished
        }
      ]
    },
    //拼团活动详情
    {path: "/groupBookingActivityDetails", name: 'groupBookingActivityDetails', component: groupBookingActivityDetails},
    //拼团活动详情-已结束
    {
      path: "/groupBookingActivityDetailsEnd",
      name: 'groupBookingActivityDetailsEnd',
      component: groupBookingActivityDetailsEnd
    },
    //我的拼团列表
    {
      path: "/groupBookingActivityGroupList",
      name: 'groupBookingActivityGroupList',
      component: groupBookingActivityGroupList
    },
    //发起拼团确认
    {path: "/groupBookingActivityConfirm", name: 'groupBookingActivityConfirm', component: groupBookingActivityConfirm},
    //拼团支付成功
    {
      path: "/groupBookingActivityPaySuccess",
      name: 'groupBookingActivityPaySuccess',
      component: groupBookingActivityPaySuccess
    },
    //拼团优惠券详情
    {
      path: "/groupBookingCouponDetails",
      name: 'groupBookingCouponDetails',
      component: groupBookingCouponDetails
    },


    //我的拼团列表
    {
      path: '/groupBookingMineList', name: 'groupBookingMineList', component: groupBookingMineList,
      children: [
        //进行中
        {
          path: '/groupBookingMineListUnderway',
          name: 'groupBookingMineListUnderway',
          component: groupBookingMineListUnderway
        },
        //已结束
        {
          path: '/groupBookingMineListFinished',
          name: 'groupBookingMineListFinished',
          component: groupBookingMineListFinished
        }
      ]
    },
    //我的拼团详情
    {path: "/groupBookingMineDetails", name: 'groupBookingMineDetails', component: groupBookingMineDetails},


    //
    // /*分享拼团*/
    // //分享-拼团详情
    // {path: "/shareGroupBookingActivityDetails", name: 'shareGroupBookingActivityDetails', component: shareGroupBookingActivityDetails},
    // //分享-拼团注册
    // {path: "/shareGroupBookingRegister", name: 'shareGroupBookingRegister', component: shareGroupBookingRegister},
    // //分享-拼团登录
    // {path: "/shareGroupBookingLogin", name: 'shareGroupBookingLogin', component: shareGroupBookingLogin},


    {path: "/index", name: 'index', component: index},
    {path: "/quotation", name: 'quotation', component: quotation},
    {path: "/avoidFraud", name: 'avoidFraud', component: avoidFraud},
    {path: "/sameCity", name: 'sameCity', component: sameCity},
    {path: "/register", name: 'register', component: register},


    //绿地活动详情
    {
      path: '/greenbeltCommunityActivityDetail',
      name: 'greenbeltCommunityActivityDetail',
      component: greenbeltCommunityActivityDetail
    },
    //绿地活动公司详情
    {
      path: '/greenbeltCommunityCompany',
      name: 'greenbeltCommunityCompany',
      component: greenbeltCommunityCompany
    },

    //绿地合同上传
    {
      path: '/greenActivityContractList',
      name: 'greenActivityContractList',
      component: greenActivityContractList
    },

    //绿地合同上传
    {
      path: '/greenPrizeHistory',
      name: 'greenPrizeHistory',
      component: greenPrizeHistory
    },

    //合同富文本
    {
      path: '/greenPrizeDetail',
      name: 'greenPrizeDetail',
      component: greenPrizeDetail
    },

  ]
})
