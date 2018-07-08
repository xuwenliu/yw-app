<template>
	<div>
		<!-- 城市三级联动 -->
		<!-- <input type="text" readonly="readonly" @click="returnPopupVisible" placeholder="请选择城市" v-model="showResult" />
		<city-select :popupVisible="popupVisible" @retrunCity="retrunCity" @returnPopupVisible="returnPopupVisible"></city-select> -->

		<!-- 图片预览 -->
		<!-- <div class="picPreview">
	        <imgView :smallImgArray="listImg" :isShowDelBtn="isShowDelBtn" :isShowBottom12="false"></imgView>
	    </div> -->

		<!-- <div class="turntable-bg">
	       	<img src="../assets/img/test/turntable-bg2.png" alt="">
	        <div class="pointer" @click="turn"><img src="../assets/img/test/pointer.png" alt="pointer"/></div>
	        <div class="rotate" >
				<transition  name="bounce"

				v-on:before-enter="beforeEnter"
				v-on:leave="leave"
				>
				<img v-if="show"  src="../assets/img/test/turntable2.png" alt="turntable"/>
				</transition>


			</div>

	    </div> -->
		<div class="turntable-bg">

	        <!--<div class="mask"><img src="images/award_01.png"/></div>-->
			<img src="../assets/img/test/turntable-bg2.png" alt="">
	        <div class="pointer"><img src="../assets/img/test/pointer.png" alt="pointer"/></div>
	        <div class="rotate" ><img id="rotate" src="../assets/img/test/turntable2.png" alt="turntable"/></div>

	    </div>


	</div>
</template>

<script>
	import $ from "jquery"
	import "../../static/awardRotate.js"
	import imgView from '../components/imgPreview'
	import yHeader from '../components/Header'
	import citySelect from "./citySelect"
	export default {
		name: "use",
		components: {
			citySelect,
			imgView
		},
		data() {
			return {
				popupVisible: false,
				showResult: "",

				listImg: [
                   'http://covteam.u.qiniudn.com/ka2.jpg?width=650&height=424',
                   'http://covteam.u.qiniudn.com/poster.png?width=1902&height=706',
                   'http://covteam.u.qiniudn.com/ka2.jpg?width=650&height=424',
                   'http://covteam.u.qiniudn.com/poster.png?width=1902&height=706',
                   "http://o8nljewkg.bkt.clouddn.com/o_1c1u35vclmojldgk8s16cqu7ai.jpg?width=640&height=3603"
            	],

            	isShowDelBtn:false,
				// turnDeg:"rotate(50deg)",
					// show:false,

			}
		},
		methods: {
			/**
			 * [retrunCity description]
			 * @param  {[type]} cityData [description]
			 * @return {[type]}          [description]
			 */
			retrunCity(cityData) {
				this.showResult = `${cityData.province}-${cityData.city}-${cityData.countryside}`
				console.log(cityData)
			},
			/**
			 * [returnPopupVisible description]
			 * @return {[type]} [description]
			 */
			returnPopupVisible() {
				this.popupVisible = !this.popupVisible;
			},
			// turn(){
			// 	this.show = true;
			// 	var m = 0;
			// 	var n = 360
			// 	var v = Math.floor(Math.random()*(m-n+1)+n)
            //
			// 			// this.turnDeg=`rotate(${v}deg)`
            //
            //
            //
            //
			// },
			// beforeEnter(el){
			// 	var m = 0;
			// 	var n = 360
			// 	var v = Math.floor(Math.random()*(m-n+1)+n)
			// 	el.style.transform=`rotate(${v}deg)`;
            //
			// },
			// leave(el) {
			//     this.show=false;
			// },
		},
		mounted(){
			$(function (){



				var rotateTimeOut = function (){

					$('#rotate').rotate({

						angle:0,

						animateTo:2160,

						duration:8000,

						callback:function (){

							alert('网络超时，请检查您的网络设置！');

						}

					});

				};

				var bRotate = false;



				var rotateFn = function (awards, angles, txt){

					bRotate = !bRotate;

					$('#rotate').stopRotate();

					$('#rotate').rotate({

						angle:0,

						animateTo:angles+1800,

						duration:3000,

						callback:function (){

							alert(txt);

							bRotate = !bRotate;

						}

					})

				};



				$('.pointer').click(function (){



					if(bRotate)return;

					var item = rnd(0,7);



					switch (item) {

						case 0:

							//var angle = [26, 88, 137, 185, 235, 287, 337];

							rotateFn(0, 337, '未中奖');

							break;

						case 1:

							//var angle = [88, 137, 185, 235, 287];

							rotateFn(1, 26, '一等奖');

							break;

						case 2:

							//var angle = [137, 185, 235, 287];

							rotateFn(2, 88, '二等奖');

							break;

						case 3:

							//var angle = [137, 185, 235, 287];

							rotateFn(3, 137, '三等奖');

							break;

						case 4:

							//var angle = [185, 235, 287];

							rotateFn(4, 185, '四等奖');

							break;

						case 5:

							//var angle = [235, 287];

							rotateFn(5, 235, '五等奖');

							break;

						case 6:

							//var angle = [287];

							rotateFn(6, 287, '安慰奖');

							break;

					}



					console.log(item);

				});

			});

			function rnd(n, m){

				return Math.floor(Math.random()*(m-n+1)+n)

			}

		}
	}
</script>

<style>
/* .bounce-enter-active {
  animation: bounce-in 1s ease-in-out;
}
@keyframes bounce-in {
  0% {
    transform: rotate(0);
  }
} */
.turntable-bg {
  margin-top:50px;
  margin-left:55px;
  width: 531px;
  height: 531px;
  position: relative;
}
.turntable-bg .mask {
  width: 454px;
  height: 451px;
  position: absolute;
  left: 116px;
  top: 60px;
  /*z-index:9;*/
}
.turntable-bg .pointer {
  width: 174px;
  height: 228px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -94px;
  margin-top: -130px;
  z-index: 8;
}
.turntable-bg .rotate {
  width: 450px;
  height: 450px;
  position: absolute;
  left: 40px;
  top: 38px;
}
</style>
