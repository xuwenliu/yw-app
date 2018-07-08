<!--status-->
<template>
  <div class="content overview-root-content">
    <ul style="margin-bottom: 0.266666rem">
      <li class="overview-li">
        <div class="overview-li-item">
          <span>谈单总数</span><span>{{overViewData.customerCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>谈单中</span><span>{{overViewData.customerChattingCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>已成单</span><span>{{overViewData.customerSignedCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>已飞单</span><span>{{overViewData.customerNotCommonCount}}</span>
        </div>
      </li>
      <li class="overview-li">
        <div class="overview-li-item">
          <span>聊天总数</span><span>{{overViewData.imSessionCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>未关闭</span><span>{{overViewData.imSessionOpenCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>已关闭</span><span>{{overViewData.imSessionCloseCount}}</span>
        </div>
      </li>
      <li class="overview-li">
        <div class="overview-li-item">
          <span>订单总数</span><span>{{overViewData.orderCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>待付款</span><span>{{overViewData.orderUnpaidCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>进行中</span><span>{{overViewData.orderGoingCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>已完成</span><span>{{overViewData.orderFinishedCount}}</span>
        </div>
        <div class="overview-li-item">
          <span>已关闭</span><span>{{overViewData.orderTerminatedCount}}</span>
        </div>
      </li>
      <li class="overview-li">
        <div class="overview-li-item">
          <span>所属推客</span><span>{{overViewData.twitterCount}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import '../../../assets/css/consultant-detail.css'
  export default{
    name: "consultDetailOverview",
    data(){
      return {
        userId:0,
        overViewData: {
          "userId": 0,
          "customerChattingCount": 0,
          "customerSignedCount": 0,
          "customerNotCommonCount": 0,
          "imSessionOpenCount": 0,
          "imSessionCloseCount": 0,
          "orderUnpaidCount": 0,
          "orderGoingCount": 0,
          "orderFinishedCount": 0,
          "orderTerminatedCount": 0,
          "twitterCount": 0,
          "customerCount": 0,
          "orderCount": 0,
          "imSessionCount": 0
        },
      }
    },
    methods:{
        getConsultOverview() {
          this.$http.get(window.Host.employee+`/advisor/${this.userId}/statistics`).then((res)=>{
            console.log(res);
            if(res.body.succ == true){
              this.overViewData = res.body.data;
            }
          },(res)=>{
            invokeNative({
              "code": window.jsBridge.CODE_TOAST,
              "data": res.body.message
            });
          })
        }
    },
    created() {
      console.log(this.$route.query.userId);
      this.userId = this.$route.query.userId;
      this.getConsultOverview();
    }
  }
</script>

