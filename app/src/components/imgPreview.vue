<template>
    <div class="imgPreview">
        <div class="weui-gallery__opr" style="position: fixed;" :style="{'z-index':zIndex}" v-show="isShowDelBtn" @click="deleteImg">
                <a class="weui-gallery__del">
                <i class="weui-icon-delete weui-icon_gallery-delete"></i>
                </a>
        </div>
    <div class="content" :class="{bttom12:isShowBottom12}">
        <ul>
        	<li v-for="(item,index) in dealWithsmallImgArray" @click="showBigImg(item,index)">
        		<img :src="item" alt="">
        	</li>
        </ul>
        <transition name="zoom">
        <div class="fullScreen-box" v-show="showFullScreen" @click="close">
        <div class="currentNum" v-if="dealWithsmallImgArray.length!=1">{{currentNum}}/{{dealWithsmallImgArray.length}}</div>
        <div class="currentNum" v-else></div>

            <div class="slide">
                <swiper :options="swiperOption" ref="mySwiper">
                    <swiper-slide  v-for="item in dealWithBigImgArray" :key="item" >
                        <img style="display: block;margin:0 auto;" :src="item" alt="" :style="{'width':specificValue(item)?(ww+'px'):'auto','height':!specificValue(item)?(hh+'px'):'auto'}" />
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        </transition>
  	</div>
    </div>
</template>

<script>
function getQueryVal(s){
    var s=s||'';
    var arr=(s.split("?")[1]||s||'').split("&");
    var o={};
    if(arr[0]==''){return o}
    arr.forEach(function(x){
        var ar=x.split("=");
        o[ar[0]]=ar[1]
    });
    return o
}

require('swiper/dist/css/swiper.css')
import { swiper,swiperSlide} from 'vue-awesome-swiper'
import weui from '../../static/weui.min.js'
export default {
  	name: 'imgPreview',
    components: {
        swiper,
        swiperSlide
    },
  	data () {
  		return {
            ww:window.innerWidth,
            hh:window.innerHeight-120,
            zIndex:0,
            currentNum:"",//当前选择的小图下标
            showFullScreen:false,
            // smallImgArray:[
            //     'http://covteam.u.qiniudn.com/ka2.jpg?width=375&height=600&imageView2/1/w/250/h/250',
            //    'http://covteam.u.qiniudn.com/poster.png?width=375&height=600&imageView2/1/w/250/h/250',
            //    'http://covteam.u.qiniudn.com/ka2.jpg?width=375&height=600&imageView2/1/w/250/h/250',
            //    'http://covteam.u.qiniudn.com/poster.png?width=375&height=600&imageView2/1/w/250/h/250',
            // ],
            bigImgArray:[
               //  'http://covteam.u.qiniudn.com/ka2.jpg?width=375&height=600&imageView2/2/w/750/h/750',
               // 'http://covteam.u.qiniudn.com/poster.png?width=375&height=600&imageView2/2/w/750/h/750',
               // 'http://covteam.u.qiniudn.com/ka2.jpg?width=375&height=600&imageView2/2/w/750/h/750',
               // 'http://covteam.u.qiniudn.com/poster.png?width=375&height=600&imageView2/2/w/750/h/750',
            ],
            swiperOption: {
                // autoplay: 3000,
                loop:false,
                notNextTick: true,
                autoplayDisableOnInteraction:false,
                pagination : '.swiper-pagination',
                paginationClickable :true,
                paginationType : 'custom',
                onSlideChangeEnd: swiper => {
                    this.currentNum = swiper.realIndex+1;
                }
  		    }
        }
  	},
    props:{
        smallImgArray:{
            type: Array
        },
        isShowDelBtn:{
            type:Boolean,
            required:true
        },
        isShowBottom12:{
            type:Boolean,
            required:true
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper;
        },
        dealWithsmallImgArray(){
            let tempArr=[];
            for(let i in this.smallImgArray){
                tempArr.push(this.smallImgArray[i]+window.Host.imgSize_small_250);
            }
            return tempArr;
        },
        dealWithBigImgArray(){
            let tempArr=[];
            for(let i in this.smallImgArray){
                tempArr.push(this.smallImgArray[i]+`&imageView2/2/w/${window.innerWidth*2}/h/${(window.innerHeight-120)*2}`);
            }
            return tempArr;
        }
    },
  	methods: {
        specificValue(url){
            const val=getQueryVal(url);
            return (val.width/val.height)>=(this.ww/this.hh);
        },
        close(){
            this.showFullScreen=false;
            this.zIndex=0;
        },
        showBigImg(url,index) {
            this.zIndex=9999;
            this.currentNum=index+1;
            this.showFullScreen=true;
            this.swiper.slideTo(this.currentNum-1, 0, false);

        },
        deleteImg(){
            var _this = this;
            weui.confirm('确定删除所选图片?',function(){
                _this.zIndex=0;
                _this.showFullScreen=false;
                _this.smallImgArray.splice(_this.currentNum-1, 1);
                _this.$emit("returnImgArray",_this.smallImgArray);
            })

        }
  	}
}
</script>
<style scoped lang="less">
.bttom12{
    bottom: 1.2rem;
}
.swiper-wrapper{
	    display: flex;
    align-items: center;
}
.imgPreview{
	ul{
		display:flex;
		flex-wrap:wrap;
		justify-content: flex-start;
	}
    li{
        margin-top: 0.04rem;
        width: 33%;
        img{
            width: 100%;
            height: auto;
            vertical-align: middle;
        }
    }
    li:nth-child(3n-1){
        margin-left: 0.04rem;
        margin-right: 0.04rem;
    }

}
.fullScreen-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #000;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .swiper-pagination{
        position: fixed;
        color: #fff;
        text-align: center;
        height: 1.17333rem;
        line-height: 1.17333rem;
    }
    .currentNum{
        top: 0;
        left: 0;
        width: 100%;
        .swiper-pagination;
    }
}
.zoom-enter-active {
  animation: zoomIn .3s;
}
.zoom-leave-active {
  animation: zoomIn .3s reverse;
}
@keyframes zoomIn {
    0% {
        opacity: 0;
        -webkit-transform: scale3d(.3,.3,.3);
        -ms-transform: scale3d(.3,.3,.3);
        transform: scale3d(.3,.3,.3)
    }

    50% {
        opacity: 1
    }
}
</style>
