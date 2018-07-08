<template>
	<div class="acceptanceOfDetails">
		<y-header>
			<div class="clickMe" @click="goBack"><span></span></div>
			<div>独立监理验收详情</div>
		</y-header>
		<div class="loading" v-show="showLoading">
			<div class="bgbox">
				<Spinner :size="40"></Spinner>
			</div>
		</div>
		<div class="content">
			<img src="http://osz2pnx97.bkt.clouddn.com/top_title_pic@2x.png" alt="">
			<div class="lunbo">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide v-for="item in slideshowImg" :key="item">
				    <img :src="item" alt="" />
			    </swiper-slide>
			    <div class="swiper-pagination"  slot="pagination"></div>
  				</swiper>
			</div>
			<div id="container" class="showThePicture">
			  <ul>
			    <li v-for="item in showThePicture">
			      <img v-lazy.container="item">
			    </li>
			  </ul>
			</div>
		</div>
	</div>
</template>
<script>
require('swiper/dist/css/swiper.css')
import { swiper,swiperSlide} from 'vue-awesome-swiper'
import yHeader from '../../components/Header'
export default {
	name: 'acceptanceOfDetails',
	components: {
		swiper,
		swiperSlide,
		yHeader
	},
	data() {
		return {
			showLoading:false,
			//轮播图数组
			slideshowImg:[
				`http://osz2pnx97.bkt.clouddn.com/ad_pic_1@2x.png?${window.Host.imgSize_big_750}`,
				`http://osz2pnx97.bkt.clouddn.com/ad_pic_2@2x.png?${window.Host.imgSize_big_750}`,
			],
			//图片列表数组
			showThePicture:[],
			swiperOption: {
	          	autoplay: 3000,
	          	loop:true,
	          	autoplayDisableOnInteraction:false,
	          	pagination : '.swiper-pagination',
	          	paginationClickable :true,
        	},
		}
	},
	created() {
		// invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		this.showLoading=true;
	},
	mounted() {
		for(let index=0;index<=27;index++){
			this.showThePicture.push(`http://osz2pnx97.bkt.clouddn.com/dpart_${index+1}.png?${window.Host.imgSize_big_750}`);
		}
		setTimeout(()=>{
			this.showLoading=false;
		},3000);
		
		console.log(this.showThePicture.length);

		
	},
	methods: {
		goBack(){
           invokeNative({"code":window.jsBridge.CODE_CLOSE});
        },
	},//methods结束
}
</script>

<style scoped lang="less">
.title{
	position: fixed;
}
.lunbo {
	width: 100%;
	height: auto;
}
.acceptanceOfDetails{
	img{
		width: 100%;
        height: auto;
		display: block;
	}
}
.loading{
	width: 100%;
	position: fixed;
	top: 0;left: 0;right: 0;bottom: 0;
	z-index: 2;
	.bgbox{
		position: absolute;
	    top: 50%;
	    left: 50%;
	    width: 2.4rem;
	    height: 2.4rem;
	    background: rgba(0, 0, 0, 0.7);
	    margin-top: -1.2rem;
	    margin-left: -1.2rem;
	    text-align: center;
	    line-height: 2rem;
	    border-radius: 0.16rem;
		span{
			display: inline-block;
    		vertical-align: middle
		}
	}
}
</style>