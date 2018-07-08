<template>
<div>
    <NoFile v-show="noDetails">
        <img slot="bgimg" src="../assets/img/twitter/tk_no_customer_ic@2x.png">
        <span slot="info">{{title}}</span>
    </NoFile>

	<div class="haveReportedCustomer" v-show="!noDetails&&infoNum.count!=0">
        <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
            <div class="reportedCustomer">
              <span class="F6 C5" v-show="infoNum.code==0">报备客户数 {{infoNum.count}}</span>
              <span class="F6 C5" v-show="infoNum.code==1">已洽谈信息数 {{infoNum.count}}</span>
              <span class="F6 C5" v-show="infoNum.code==2">已签约订单数 {{infoNum.count}}</span>
              <span class="F6 C5" v-show="infoNum.code==3">已结佣订单数 {{infoNum.count}}</span>
            </div>
            <ul>
                <li class="bb1" v-for="(item,index) in listData" @click="goCustomerDetails(item.twitterCustomerId)">
                    <div class="lcr">
                        <div class="left">
                            <!-- 显示小红点 -->
                            <!-- <div class="dot" v-show="item.dot"></div> -->
                            <img :src="item.customerHead">
                        </div>
                        <div class="center">
                            <p class="F4 C1">{{item.customerName}}</p>
                            <!-- 显示下面的状态 -->
                            <p class="F5 C4">
                            <span v-show="item.chattingCount">已洽谈*{{item.chattingCount}} </span>
                            <span v-show="item.signedCount">已签约*{{item.signedCount}} </span>
                            <span v-show="item.settledCount">已结佣*{{item.settledCount}}</span></p>
                        </div>
                        <div class="right">
                            <img src="../assets/img/twitter/more_ico@2x.png">
                        </div>
                    </div>
                </li>
            </ul>
        </v-scroll>
    </div>
</div>
</template>
<script>
import NoFile from './NoFile'
import VScroll from "../components/pull-refresh"
export default {
    name: 'mycustomerlist',
    data(){
        return {
            noDetails:false,
            type:0,           //报备，已洽谈，已签约，已结佣切换
            title:"",         //显示当前暂无报备客户，当前暂无已洽谈客户。。。
            infoNum:[],       //报备客户数/已洽谈信息数/已签约订单数/已结佣订单数
            page:1,           //当前页数
            pageSize:10,      //每页请求的条数
            totalPage:0,      //总页数
            listData: [],     //数据列表
            scrollData: {
                noFlag: false //暂无更多数据显示
            }
        }
    },
    components: {
        'v-scroll': VScroll,
        NoFile,
    },
    methods:{
        getinfoNum(type){
            this.$http.get(window.Host.customer+"/twitter/customer/statistics").then((res)=>{
                if(res.data.succ){
                    if(res.data.data){
                        console.log(res.data.data);
                        this.infoNum=res.data.data[type];
                    }
                }else{
                    if(res.data.stateCode != 312 && res.data.stateCode != 317) {
                        invokeNative({"code": window.jsBridge.CODE_TOAST,"data":res.data.message});
                    }
                }
            })
        },
        getList(progress){
            this.$http.get(window.Host.customer+`/twitter/customer?progress=${progress}&pageNum=${this.page}&pageSize=${this.pageSize}`).then((res)=>{
                if(res.data.succ){
                    console.log(res);
                    if(!res.data.data.totalCount){
                        this.noDetails=true;
                    }else{
                        this.noDetails=false;
                        this.totalPage=res.data.data.totalPageNum;
                        if(res.data.data.result){
                           this.onResponseList(res.data.data.result); 
                        }
                        
                    }
                }else{
                    this.noDetails=true;
                }
            })
        },
        onResponseList(result){
            if (this.page == 1) {
                this.listData = result;
            }else{
                if(this.totalPage>1) {
                    this.listData=this.listData.concat(result);
                }
            }
        },
        goCustomerDetails(id){
            this.$router.push({"name":"customerDetails",query:{id:id}});
        },
        onRefresh(done) {
            this.page=1;
            this.getList(this.type);
            done();
        },
        onInfinite(done) {
            this.page++;
            if(this.page >= this.totalPage) {
                this.$el.querySelector('.load-more').style.display="none";
                this.scrollData.noFlag = true;
            }
            this.getList(this.type);
            this.$el.querySelector('.load-more').style.display="none";
            done();
        }
    },
    created(){
        let routeName=this.$route.name;
        if(routeName=="remark"){
            this.type=0;
            this.title="当前暂无报备客户";
        }else if(routeName=="talkOverWith"){
            this.type=1;
            this.title="当前暂无已洽谈客户";
        }else if(routeName=="signAContract"){
            this.type=2;
            this.title="当前暂无已签约客户";
        }else{
            this.type=3;
            this.title="当前暂无已结佣客户";
        }
        this.getinfoNum(this.type);
        this.getList(this.type);
    },
}
</script>
<style lang="less">
/* 有客户 */
.reportedCustomer{
  margin-left: 0.58666rem;
  line-height: 0.90666rem;
  height: 0.90666rem;
}
.haveReportedCustomer{
  padding-top: 1.2rem;
}
.haveReportedCustomer ul{
  background-color: #fff;
  width: 100%;
    li .lcr{
    margin-left: 0.53333rem;
    height: 1.89333rem;
    .left,.center{
      float: left;
      margin-top: 0.4rem;
    }
    .left{
        margin-right: 0.53333rem;
        width: 1.06666rem;
        height: 1.06666rem;
        border-radius: 0.53333rem;
        position: relative;
        img{
          width: 1.06666rem;
          height: 1.06666rem;
          vertical-align: middle;
        }
    }
    .center{
      p:first-child{
        margin-bottom: 0.24rem;
      }
    }
    .right{
      float: right;
      margin-right: 0.53333rem;
      img{
        height: 0.32rem;
        margin-top: 0.76rem;
      }
    }
  }
}
.dot{
  width: 0.2rem;
  height: 0.2rem;
  background-color: #ed316b;
  border-radius: 0.1rem;
  position: absolute;
  top: 0;
  right: -0.13333rem;
}
</style>
