<template>
  <div class="contentTopMoreSpace content">
    <div class="consultant-list-backguround">
      <!-- 没有订单 -->
      <NoFile v-if="isEmptyList">
        <img slot="bgimg" :src="imgNoData">
        <span slot="info">暂无团队成员</span>
      </NoFile>
      <!-- 有订单 -->
      <div v-else style="margin-bottom: 0.266666rem">
        <ul>
          <li  v-for="(item,index) in listArray">
            <div class="consult-cell-flex">
              <div class="consult-cell-first-part">
                <img :src="item.headImage"/>
                <div class="consult-cell-first-part-right">
                  <div>
                    <div class="consult-cell-first-part-right-title" v-show="item.homeAdvisorManager">{{item.name}} （客服经理）</div>
                    <div class="consult-cell-first-part-right-title" v-show="!item.homeAdvisorManager">{{item.name}}</div>
                    <div class="consult-cell-first-part-right-subtitle">
                      <div class="consult-cell-first-part-right-subtitle-item"><div class="customer-dot"></div><span>专属客户 {{item.customerCount}}</span></div>
                      <div class="consult-cell-first-part-right-subtitle-item"><div class="customer-dot"></div><span>未关闭聊天 {{item.imSessionOpenCount}}</span></div>
                      <div class="consult-cell-first-part-right-subtitle-item"><div class="customer-dot"></div><span>未结束订单 {{item.orderGoingCount}}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="consult-cell-second-part consult-cell-second-part-center" v-show="item.homeAdvisorManager">
                <div class="consult-cell-second-part-item" @click="checkDetail(index)">
                  <img src="../../assets/img/consultantsList/look_more_ic@2x.png"/>
                  <span>查看详情</span>
                </div>
              </div>
              <div class="consult-cell-second-part consult-cell-second-part-two-item" v-show="!item.homeAdvisorManager">
                <div class="consult-cell-second-part-item" @click="callHim(index)">
                  <img src="../../assets/img/consultantsList/contact_phone_ic@2x.png"/>
                  <span>联系TA</span>
                </div>
                <div class="consult-cell-second-part-item" @click="checkDetail(index)">
                  <img src="../../assets/img/consultantsList/look_more_ic@2x.png"/>
                  <span>查看详情</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import NoFile from '../../components/NoFile'
  import '../../assets/css/consultant-list.css'

  export default {
    name: 'consultantsTableView',
    components:{
      NoFile,
    },
    data () {
      return {
        isAccepted:false,
        imgNoData:require("../../assets/img/consultantsList/my_team_no_one_ic@2x.png"),
        isEmptyList:true,
        listArray:[
//          {
//            "userId": 1,
//            "name": "翠花",
//            "headImage": require("../../assets/img/share/register_ywmj_logo@2x.png"),
//            "userPhone": "13608090909",
//            "customerCount": 100,
//            "imSessionOpenCount": 101,
//            "orderGoingCount": 102,
//            "homeAdvisorManager": true
//          },
//          {
//            "userId": 1,
//            "name": "翠花",
//            "headImage": require("../../assets/img/share/register_ywmj_logo@2x.png"),
//            "userPhone": "13608090909",
//            "customerCount": 100,
//            "imSessionOpenCount": 101,
//            "orderGoingCount": 102,
//            "homeAdvisorManager": false
//          }
          ],
      }
    },
    methods: {
      goBack(){
        invokeNative({
          "code": window.jsBridge.CODE_CLOSE
        });
      },
      callHim(index){
        if (validRule.phone.test(this.listArray[index].userPhone)){
            invokeNative ({
              "code": window.jsBridge.CODE_CALL_PHONE_NUMBER,
              "data": this.listArray[index].userPhone
            });
        } else {
          this.showToast("电话号码不正确");
        }
      },
      checkDetail(index){
        console.log(this.listArray);
        this.$router.push({"name": "consultantDetail", query: {"userId": this.listArray[index].userId,"userName":this.listArray[index].name}});
      },
      getConsultList() {
        this.$http.get(window.Host.employee+`/advisor`,
          {
            params:{
              "distributionStatus": this.isAccepted
            }
          }).then((res)=>{

          /*请求成功后根据返回值弹出对应的框*/
          if(res.body.succ){
            console.log(res);
            if(res.body.data){
              this.isEmptyList=false;
              this.listArray = res.body.data;
            }else{
              this.isEmptyList=true;
            }

          }  else  {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        });
      },
      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
          "data": message
        });
      }
    },
    created(){
        if (this.$route.query.isAccepted) {
          this.isAccepted = true;
        } else {
          this.isAccepted = false;
        }
        this.getConsultList();
    }
  }
</script>
