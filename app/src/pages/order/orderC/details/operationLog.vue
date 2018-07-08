
<!--/#/operationLog?orderId=xxx&appType=e-->
  <template>
	<div>
    <TopHeader><div class="clickMe" @click="goBack"><span></span></div>操作记录 </TopHeader>
		<div class="content btm">
      <NoFile v-if=!getLogListData.length> <span slot="info" >没有操作记录！</span></NoFile>
      <div class="box-time-line pr" v-if=getLogListData.length>
        <ul>
          <div class="line pa"></div>
          <li v-for="(g,i) in getLogListData">
            <i class="icon-time-point fl block"></i>
            <span v-show="!isNewLogPage" class="F4 C5 cut-txt">
            {{g.operatorType=="c"&&appType=="c"?"您":g.operatorDetailTypeDesc}}
            {{g.operatorType=="c"&&appType=="c"?"":g.operatorName}}
            {{g.operateContent}}
            <em class="block time">{{g.operateTime |setTime}}</em>
            </span>
            <span v-show="isNewLogPage" class="F4 C5 cut-txt">
              {{g.formattedOperateContent}}
              <em class="block time">{{g.operateTime |setTime}}</em>
            </span>
          </li>
        </ul>
      </div>

		</div>
	</div>
</template>
<script>
import TopHeader from '../../../../components/Header'
import NoFile from '../../../../components/NoFile'
export default{
	name:"operationLog",
	components:{
		TopHeader,
    NoFile
	},
  data(){
    return {
      isNewLogPage:true,
      getLogListData:[]
    }

  },
  created(){
    let newpage=this.$route.query.isNewLogPage;
    let orderId=this.$route.query.orderId;
    let appType=this.$route.query.appType||"c";
    if (newpage == 1) {
        this.isNewLogPage = true;
    } else {
      this.isNewLogPage = false;
    }
    if(!(appType==="c"||appType==="e")){
      return  false
    }
    orderId?this.getLogList(orderId,appType):"";
  },
	methods:{
		goBack(){
      this.$router.go(-1);
		},

    getLogList(id,ty){
      this.appType=ty;

      this.$http.get((ty=="c"?window.Host.customer:window.Host.employee)+`/order/${id}/operationLog`).then((res)=>{
        if(res.data.stateCode===0){
          this.getLogListData=res.data.data;
        }else{
          invokeNative({"code":1004,data:res.data.message});
        }
      })
    }
	}
}
</script>
<style scoped lang="less">

  .box-time-line {
    padding: 0.4rem 0.53rem 0.4rem 0.58rem;
    background: #fff;
  }

  .box-time-line li {
    border-bottom: 1px solid #e6e6e6;
    margin: 0.4rem 0 0 0.7rem;
    padding-bottom: 0.4rem;
    line-height: 0.53333rem;
    min-height: 2.50667rem;
    box-sizing: border-box;
  }

  .box-time-line li:nth-child(2) span {
    color: #ed316b !important;
  }

  .box-time-line li:nth-child(2) .icon-time-point {
    background:#ed316b;
  }

  .box-time-line li span em.time {
    line-height: 0.8rem;
  }

  .icon-time-point {
    height: 0.29333rem;
    width: 0.29333rem;
    background: #ddd;
    border-radius: 50%;
    border: 0.1rem solid #fff;
    margin-left: -0.75rem;
    position: relative;
  }

  .box-time-line div.line {
    width: 2px;
    top: 0.9rem;
    bottom: 2.5rem;
    border-left: 1px solid #e6e6e6;
    left: 0.76rem;
  }

</style>
