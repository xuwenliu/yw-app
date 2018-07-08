<template>
  <div class="description">
    <TopHeader><span @click="goBack"></span>往期抽奖</TopHeader>
    <div class="content bg7">
      <!--list-->
      <ul>
        <li v-for="(item,index) in listData">
          <div class="prizeHistory-container">
            <img @click="imageClicked(item.id)" :src="item.cover">
            <div class="prizeHistory-bottom">
              <i></i>
              <span>{{item.name}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/Header'
  import {Progress} from 'mint-ui';


  export default {
    name: 'greenPrizeHistory',
    components: {
      TopHeader
    },
    data() {
      return {
        activityId:this.$route.query.activityId,
        listData:[],
      }
    },

    computed: {
      showImage () {
        return this.imageUrl + '&imageView2/1/w/400';
      },
      baseUrl () {
        if (this.$route.query.userType != 'c') {
          return window.Host.employee;
        } else {
          return window.Host.customer;
        }
      },
    },
    created() {
        this.loadPrizeList();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      loadPrizeList() {
        this.$http.get(this.baseUrl+`/activity/${this.activityId}/lotteryList`).then((res)=>{
          console.log(res);
          if(res.body.succ == true){
            this.listData = res.body.data;
          } else  {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        })
      },
      imageClicked (lotteryId) {
        this.$router.push({"name": "greenPrizeDetail", query: {"lotteryId": lotteryId,"userType":this.$route.query.userType,"share":this.$route.query.share}});
      },
      showToast(data){
        invokeNative({"code":window.jsBridge.CODE_TOAST,"data":data});
      },
    }
  }
</script>
<style scoped lang="less">

  .prizeHistory-container {
    background-color: white;
    img {
      width: 100%;
      height: 5.626666666rem;
      display: block;
    }
  }

  .prizeHistory-bottom {
    height: 2.3733333333rem;
    background-color: white;
    padding-top: 0.466666666rem;
    padding-left: 0.82666666666rem;
    i {
      display: inline-block;
      width: 0.0533333333rem;
      height: 0.3066666666rem;
      background-color: #DFAF7D;
    }
    span {
      margin-left: 0.15rem;
      font-size: 0.38666666666rem;
      color: #272828;
    }
  }

</style>
