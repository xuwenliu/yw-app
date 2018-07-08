<template>
    <div class="storeDetails">
        <y-header><div class="clickMe" @click="goBack"><span></span></div>门店详情</y-header>
        <div class="content bg0">
            <div v-if="storeDetailsData.pathOf720" class="storeDetails-720" @click="look720">
                <img class="storeDetails-720-bg" :src="storeDetailsData.storeCover">
                <a><img class="storeDetails-720-btn" src="../../../assets/img/material/720_play_ico@2x.png"></a>
            </div>
            <div v-if="storeDetailsData.storeImg">
                <img :src="storeDetailsData.storeImg" alt="" style="width:100%;display:block;">
            </div>
            <div class="storeDetails-addr">
                <h1 class="textcut"><img src="../../../assets/img/material/map_ic@2x.png" alt="">{{storeDetailsData.storeName}}</h1>
                <p>{{storeDetailsData.storeAddr}}</p>
            </div>
            <div class="map-box">
                <div class="map" id="allmap"></div>
            </div>
        </div>
    </div>
</template>
<script>
import yHeader from '../../../components/Header'
export default {
    name: 'storeDetails',
    components: {
        yHeader
    },
    data() {
        return {
            storeId:this.$route.query.storeId,
            storeDetailsData:{},
            pathOf720:"",
        }
    },
    created() {
        /*模拟数据-start*/
        /*this.storeDetailsData = {
		    "storeId": 0,
		    "storeName": "瑞士卢森地板北富森店瑞士卢森地板北富森店瑞士卢森地板北富森店",
            // "storeImg":"http://o8nljewkg.bkt.clouddn.com/o_1c41c4dus706rrb7ff19258ooc.jpg?width=1024&height=768",
		    "materialId": 0,
		    "storeAddr": "蓉都大道将军碑路富森美家居建材馆银杏厅4楼A4051号铺,瑞士卢森地板（北富森店）",
            "storeCover":"http://pic35.photophoto.cn/20150529/0014026744554538_b.jpg",
		    "pathOf720": "https://customer.yingwumeijia.com/images/common/index.html?type=720&directory=3719ce0dea8e4cc49d74e934c8d46fa0&subDirectory=LYFc&caseId=1457&appe=null&uid=4020&type=c&twitter=false",
		    "available": false,
		    "pointDto": {
		      	"longitude": "116.297478",
		      	"latitude": "39.854476"
		    }
		}
        /*模拟数据-end*/
    },
    mounted() {
         //https://devcustomer.yingwumeijia.com:443/{version}/material/storeInfo?storeId=41
        this.$http.get(window.Host.customer+`/material/storeInfo?storeId=${this.storeId}`).then((res) => {
            // console.log(res)
            if(res.data.succ) {
                invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
                this.storeDetailsData = res.data.data;
//             	alert(JSON.stringify(this.storeDetailsData));
                    // 百度地图API功能
                    var map = new BMap.Map("allmap");
                    var point = new BMap.Point(this.storeDetailsData.pointDto.longitude, this.storeDetailsData.pointDto.latitude);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point);  // 创建标注
                    map.addOverlay(marker);               // 将标注添加到地图中

                    var url = window.Host.customer.split("/v")[0];
                	this.pathOf720 = url+ JSON.parse(this.storeDetailsData.pathOf720).path;

            }else{
                invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
                didApiError(res);
            }
        })

    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        messageHint(data){
            invokeNative({"code":window.jsBridge.CODE_TOAST,"data":data});
        },
        look720(){
           	invokeNative({
                "code":window.jsBridge.CODE_OPEN,
                "data":{
                    "url":this.pathOf720,
                    "title":"720°观赏"
                }
            });
        }

    }
}
</script>
<style scoped lang="less">
    .storeDetails-720{
        position: relative;
        .storeDetails-720-bg{
            width: 100%;
            display: block;
        }
        .storeDetails-720-btn{
            width: 2.48rem;
            height: 0.76rem;
            display: block;
            position: absolute;
            right: 0.54667rem;
            bottom: 0.33333rem;

        }
    }
    .storeDetails-addr{
        padding:0.4rem 0.62667rem 0.68rem  0.46667rem;
        h1{
            font-size: 0.4rem; /* 30/75 */
            color:rgba(40,40,40,1);
            line-height: 1.17333rem /* 88/75 */;
            width: 100%;
            img{
                width: 0.33333rem;
                height: 0.45333rem;
                vertical-align: middle;
                margin-right: 0.28rem;
            }
        }
        p{
            color:#737373;
            font-size: 0.32rem; /* 24/75 */
        }
    }
    .map-box{
    	box-sizing: border-box;
        width: 89%;
        height: 5.04rem /* 378/75 */;
        margin: 0 auto 0.42667rem /* 32/75 */;
        border-top:2px solid #e6e6e6;
        padding-top: 0.45333rem /* 34/75 */;
        .map{
            height: 100%;
        }
    }


</style>
