<template>
    <div class="developTwitter">
        <y-header class="noBorder">
            <div class="clickMe" @click="goBack"><span></span></div>发展下线推客
        </y-header>
        <y-footer v-show="inow==0">
            <div @click="share" class="F3 C0">立即分享</div>
        </y-footer>
        <input-reason v-show="showWriteMemorandum">
            <div class="show-input-box" style="z-index: 9999;">
                <div class="inputBox">
                    <div class="F2 C1 inputBox-title">备忘录</div>
                    <div class="textarea-border">
                        <textarea placeholder="请输入备注，30字以内" maxlength="30" v-model.trim="memorandumContent" rows="30" cols="4" class="inputBox-input F4"></textarea>
                    </div>
                    <div class="inputBox-btn C6 F3">
                        <div style="border-right:1px solid #737373" @click="callOff">取消</div>
                        <div @click="sure">确定</div>
                    </div>
                </div>
            </div>
        </input-reason>
        <div class="status bb1">
            <ul>
                <li v-for="(item,index) in status" @click="inow=index"><span class="F4 C1 fwb" :class="{'active':inow==index}">{{item}}</span></li>

            </ul>
        </div>

        <!-- 发展推客 -->
        <div class="devTwitter content" v-show="inow==0">
            <img :src="img[0]">
            <img class="posimg" :src="img[1]" @click="goMoneyRule">
        </div>
        <!-- 我的奖金 -->
        <div class="myMoney content" v-show="inow==1">
            <!-- 累计获得奖励 -->
            <div>
                <div class="getMoney-top bg0 bb1">
                    <p class="F3 C1">累计获得奖励</p>
                    <h1 class="C1 fwb">{{money.commissionTotal | currency("",2)}}</h1>
                </div>
                <ul class="getMoney-bottom bb1 bg0">
                    <li class="getMoney-bottom-left">
                        <h1 class="F1 C1 fwb">{{money.childrenCount}}人</h1>
                        <p class="F5 C5">累计推广</p>
                    </li>
                    <li>
                        <div>
                            <h1 class="F1 C1 fwb">{{money.noLoginCount}}人</h1>
                            <p class="F5 C5">未登录APP</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <h1 class="F1 C1 fwb">{{money.signCount}}单</h1>
                            <p class="F5 C5">累计签约</p>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 推广列表 -->
            <div class="generalizeList bg0 bb1" v-show="list.length!=0">
                <div class="generalizeList-title">
                    <h1 class="F3 C1 fwb bb1">我的推广列表</h1>
                </div>
                <ul class="generalize-list">
                    <li v-for="item in list">
                        <div class="generalize-top">
                            <div class="generalize-left">
                                <img :src="item.headImage">
                            </div>
                            <div class="generalize-right">
                                <h1 class="F4 C1">{{item.twitterName}}
                                    <p class="F7 C0" :class="[item.childLevel==1?'bg1':'bg2']">{{item.childLevel}}级</p>
                                    <p>我的奖金: <span class="F4 C6">{{item.totalAward | currency("",2)}}</span></p>
                                    
                                </h1>
                                <h1 class="F6 C4">
                                    <span v-if="item.lastLogin">最近登录：{{item.lastLogin | setDate}}</span>
                                    <span v-else>该推客从未登录APP</span>
                                    <p>已签约: {{item.signCount}}</p> 
                               </h1>
                            </div>
                        </div>
                        <div class="memorandum F6">
                            <div class="bt1" v-if="item.remarks" @click="showWritememorandum(item.id,item.childLevel,item.remarks)"><span class="C2"><i class="C4">备忘录:</i>&nbsp;{{item.remarks}}</span><img class="more" src="../../../assets/img/twitter/more_ico@2x.png"></div>

                            <div class="bt1" v-else @click="showWritememorandum(item.id,item.childLevel,item.remarks)">
                                <span class="C2"><i class="C4">备忘录:</i>&nbsp;点击填写备忘录</span>
                                <img class="more" src="../../../assets/img/twitter/more_ico@2x.png">
                            </div>
                            <p @click="callPhone(item.phone)"><img src="../../../assets/img/twitter/phone_contact@2x.png"></p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import yHeader from '../../../components/Header'
    import yFooter from '../../../components/Footer'
    import InputReason from '../../../components/InputReason'
    export default {
        name: 'developTwitter',
        data() {
            return {
                status: ['发展推客', '我的奖金'],
                showWriteMemorandum: false, //是否显示填写备忘录弹窗
                memorandumContent: "", //备忘录内容
                twitterId: 0,
                inow: 0,
                money: [],
                list: [
                       // {
                       //  "id": 25,
                       //  "childLevel": 1,
                       //  "twitterName": "这是啥",
                       //  "headImage": "http://o8nljewkg.bkt.clouddn.com/o_1ao3jmbhk11qj1q031k9s10685qac.png?width=256&height=256",
                       //  "signCount": 0,
                       //  "auditTime": 1502681571000,
                       //  "lastLogin": 1504513455000,
                       //  "totalAward": 0,
                       //  "phone": "18581869048",
                       //  "remarks": "我的好1616"
                       // },
                       // {
                       //   "id": 23,
                       //   "childLevel": 2,
                       //   "twitterName": "战四",
                       //   "headImage": "http://o8nljewkg.bkt.clouddn.com/FtfCMBQIfLEeIaV5hmGZEHoCrkO4?width=1080&height=1080",
                       //   "signCount": 4,
                       //   "auditTime": 1494233020000,
                       //   "lastLogin": 1504513612000,
                       //   "totalAward": 0,
                       //   "phone": "13550000004",
                       //   "remarks": "我的"
                       // },
                       // {
                       //   "id": 22,
                       //   "childLevel": 1,
                       //   "twitterName": "战三",
                       //   "headImage": "http://o8nljewkg.bkt.clouddn.com/o_1ao3jmbhk11qj1q031k9s10685qac.png?width=256&height=256",
                       //   "signCount": 0,
                       //   "auditTime": 1493866159000,
                       //   "lastLogin": 1504522306000,
                       //   "totalAward": 0,
                       //   "phone": "13550000001",
                       //   "remarks": "达到兰桂坊拉伽古拉防盗门福美来了结构啊大家几个垃圾刘罗锅酒了"
                       // },
                       // {
                       //   "id": 3,
                       //   "childLevel": 2,
                       //   "twitterName": "qweqwe",
                       //   "headImage": "width=1440&height=1440",
                       //   "signCount": 0,
                       //   "auditTime": 1491995717000,
                       //   "lastLogin": 1504667471000,
                       //   "totalAward": 100,
                       //   "phone": "13500000001"
                       // },
                       // {
                       //   "id": 2,
                       //   "childLevel": 1,
                       //   "twitterName": "啦啦啦",
                       //   "headImage": "http://o8nljewkg.bkt.clouddn.com/o_1ao3jmbhk11qj1q031k9s10685qac.png?width=256&height=256",
                       //   "signCount": 0,
                       //   "auditTime": 1491995674000,
                       //   "totalAward": 0,
                       //   "phone": "18683561837"
                       // }
                    ],
                img: [
                    require("../../../assets/img/twitter/tk_pic.png"),
                    require("../../../assets/img/twitter/money_rules.png")
                ],
            }
        },
        components: {
            yHeader,
            yFooter,
            InputReason
        },
        methods: {
            goBack() {
                if(getHashString("type")*1===1){
                    this.$router.go(-1);
                }else {
                    invokeNative({"code": window.jsBridge.CODE_CLOSE});
                } 
            },
            goMoneyRule() {
                this.$router.push({ "name": "moneyRule"});
            },
            callPhone(phone) {
                console.log(phone)
                invokeNative({
                    "code": window.jsBridge.CODE_CALL_PHONE_NUMBER,
                    "data": phone
                });
            },
            share() {
                this.$http.get(window.Host.customer + "/twitter/url?shareType=1").then((res) => {
                    var url = res.data.data
                    var finalUrl = url.replace(".com/", ".com/"+version+"/");
                    if(res.data.succ) {
                        invokeNative({
                            "code": window.jsBridge.CODE_SHARE,
                            "data": {
                                "mShareUrl": finalUrl,
                                "mShareImg": "http://o7zlnyltf.bkt.clouddn.com/html_share_pic.png" + "?imageView2/1/w/100",
                                "mDescription": "不影响本职工作，收入轻松破万!",
                                "mShareTitle": "加入鹦鹉美家，安全轻松赚钱，快来加入吧！"
                            }
                        });
                    }
                })
            },
            getMyMoney() {
                this.$http.get(window.Host.customer + "/twitter/award").then((res) => {
                    if(res.data.succ) {
                        invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE});
                        if(res.data.data) {
                            this.money = res.data.data;
                        }
                    }else{
                        invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
                        didApiError(res);
                    }
                })
            },
            getList() {
                let pageSize = this.money.childrenCount;//页数是累计推广人数
                this.$http.get(window.Host.customer + `/twitter/children?pageNum=1&pageSize=${pageSize}`).then((res) => {
                    console.log(res);
                    if(res.data.succ) {
                        if(res.data.data.result) {
                            this.list = res.data.data.result;
                        }
                    }
                })
            },
            showWritememorandum(twitterId,childLevel,remarks) {
                console.log(remarks);
                if(remarks!=undefined) {
                    this.memorandumContent = remarks;
                }
                this.childLevel=childLevel;
                this.twitterId = twitterId;
                this.showWriteMemorandum = true;
            },
            callOff() {
                this.showWriteMemorandum=false;
                this.memorandumContent="";
            },
            sure() {
                //将用户填写的备忘录信息发送到服务端
                if(this.memorandumContent.length == 0 || this.memorandumContent == "") {
                    this.showToast("输入不能为空");
                    return false;
                }
                invokeNative({ "code": window.jsBridge.CODE_DIALOG_SHOW });
                this.$http.post(window.Host.customer + "/twitter/remarks", {
                    "twitterId": this.twitterId,
                    "childLevel":this.childLevel,
                    "remarks": this.memorandumContent
                }).then((res) => {
                    console.log(res);
                    invokeNative({ "code": window.jsBridge.CODE_DIALOG_HIDE });
                    if(res.data.succ) {
                        this.getList();
                        this.callOff();
                        this.showToast("操作成功");
                    } else {
                        this.showToast(res.data.message);
                    }
                }, (err) => {
                    invokeNative({ "code": window.jsBridge.CODE_DIALOG_HIDE });
                    this.showToast("网络异常");
                })
            },

            /**
             * 弹Toast信息
             * @param msg
             */
            showToast(msg) {
                console.log(msg);
                invokeNative({ code: window.jsBridge.CODE_TOAST, data: msg })
            }
        },
        created() {
            invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
            this.getMyMoney();
        },
        watch:{
            inow(newVal,oldVal){
                if(newVal===1){
                    this.getList();
                }
            }
        }
    }
</script>
<style scoped lang="less">
    .noBorder {
        border-bottom: 0;
    }
    
    .status {
        background-color: #fff;
        height: 1.17333rem;
        position: relative;
        ul {
            margin: 0 0.68rem;
            display: flex;
            text-align: center;
            li {
                flex: 1;
                line-height: 1.17333rem;
            }
        }
        .active {
            color: #ed316b;
            border-bottom: 2px solid #ed316b;
            padding-bottom: 0.18666rem;
        }
    }
    
    .devTwitter {
        top: 2.38333rem;
        bottom: 1.2rem;
        width: 100%;
        text-align: center;
        background-color: #fff;
        img {
            width: 100%;
        }
        .posimg {
            width: 85.86666%;
            position: absolute;
            top: 4.5rem;
            left: 7.066666%;
        }
    }
    
    .myMoney {
        top: 2.37333rem;
    }
    
    .getMoney-top {
        text-align: center;
        height: 2.85333rem;
        padding-top: 0.61333rem;
        h1 {
            font-size: 0.98666rem;
            margin-top: 0.42666rem;
        }
    }
    
    .getMoney-bottom {
        display: flex;
        text-align: center;
        height: 1.94666rem;
        li {
            flex: 1;
            padding-top: 0.4rem;
            div {
                border-left: 1px solid #e6e6e6;
            }
        }
    }
    
    .generalizeList {
        margin-top: 0.26666rem;
        .generalizeList-title {
            height: 1.33333rem;
            line-height: 1.33333rem;
            text-align: center;
            h1 {
                width: 89.33333%;
                margin: 0 auto;
            }
        }
    }
    
    .generalize-list {
        padding: 0 0.53333rem;
        li {
            border-bottom: 1px solid #e6e6e6;
            .generalize-top {
                display: flex;
                margin-bottom:0.26666rem;
                .generalize-left {
                    margin-right: 0.53333rem;
                    padding-top: 0.48rem;
                    img {
                        width: 1.06667rem;
                        height: 1.06667rem;
                        border-radius: 50%;
                    }
                }
                .generalize-right {
                    flex: 1;
                    padding-top: 0.48rem;
                    h1:first-child {
                        p {
                            display: inline-block;
                        }
                        p:first-child {
                            width: 0.72rem;
                            text-align: center;
                            margin-left: 0.18667rem;
                        }
                        p:last-child {
                            float: right;
                        }
                    }
                    h1:last-child {
                        margin-top: 0.14667rem;
                        p {
                            float: right;
                        }
                    }
                }
            }
            .memorandum {
                height:1.36rem ;
                display: flex;
                /*align-items: center;*/
                justify-content: space-between;
                div {
                    height: 1.36rem;
                    display: table;
                    width: 75%;
                    position: relative;
                    span {
                        display: table-cell;
                        vertical-align: middle;
                    }
                }
                .more {
                    width: 0.13333rem;
                    height: 0.25333rem;
                    position: absolute;
                    
                    right: 0;
                    top: 50%;
                    margin-top: -0.125rem;
                }
                p {
                    img {
                        width: 1.89333rem;
                        vertical-align: middle;
                    }
                }
            }
        }
        li:last-child {
            margin-bottom: 0.4rem;
        }
    }
    
    .bg1 {
        background-color: #feb7ce;
    }
    
    .bg2 {
        background-color: #ecceed;
    }
    
    .show-input-box .inputBox {
        text-align: center;
        background: #fff;
    }
    
     .textarea-border{
        width: 70%;
        border:1px solid #737373;
        text-align: start;
        padding: 0.13333rem;
        box-sizing: border-box;
        margin:0 auto;
        margin-bottom: 0.53333rem;
    }
    .inputBox-input {
        width: 100%;
        height: 2rem;
        resize: none;
    }
    .inputBox-btn {
        border-top: 1px solid #737373;
        height: 1.2rem;
        position: relative;
    }
    
    .inputBox-btn div {
        float: left;
        width: 49.5%;
        height: 1.2rem;
        line-height: 1.2rem;
    }
</style>