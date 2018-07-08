<!--  	/#/upLoader?picMaxCount=50&uploadToken=

		picMaxCount上传图片最大数量，
		uploadToken上传七牛的token

		获取上传图片后的url数组：
		let imgList = JSON.parse(localStorage.successImgList);
-->
<template>
	<div>
		<yHeader>
			<div class="clickMe" @click="goBack()"><span></span></div>上传图片</yHeader>

		<div class="weui-cells weui-cells_form" id="uploader">
			<div class="weui-cell">
				<div class="weui-cell__bd">
					<div class="weui-uploader">
						<div class="weui-uploader__hd">
							<p class="weui-uploader__title">选择图片</p>
							<div class="weui-uploader__info"><span id="uploadCount">0</span>/{{this.$route.query.picMaxCount}}</div>
						</div>
						<div class="weui-uploader__bd">
							<ul class="weui-uploader__files" id="uploaderFiles" @click="handleClickUploadList"></ul>
							<div class="weui-uploader__input-box">
								<input name="file" id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="weui-btn-area"> <a id="uploaderCustomBtn" href="javascript:" class="weui-btn weui-btn_primary">上传</a> </div> -->
		<yFooter id="uploaderCustomBtn" style="z-index: 0;" class="C0 F2">点我上传</yFooter>
	</div>
</template>

<script>
	import weui from '../../static/weui.min.js'
	import yHeader from './Header'
	import yFooter from "./Footer"
	import $ from 'jquery'
	import { Indicator } from 'mint-ui';
	//初始化
	var uploadCount = 0 //上传图片的数量
	var uploadCountDom = null //显示上传图片数量的dom元素
	var uploadList = [] //选择的图片列表
	var successImgList = [] //上传成功的图片列表，用于存储七牛返回的图片url
	var uploadToken = '' //上传七牛需要的token
	var picMaxCount = 50 //上传的图片最大数量
	export default {
		name: 'upLoader',
		components: {
			yHeader,
			yFooter
		},
		data() {
			return {
				dialogImageUrl: "",
				dialogVisible: false,
			}
		},
		mounted() {
			uploadList = [];
			uploadCount = 0;
			var _this = this;
			picMaxCount = this.$route.query.picMaxCount;
			uploadToken = this.$route.query.uploadToken;
			uploadCountDom = document.getElementById('uploadCount');
			weui.uploader('#uploader', {
				url: 'https://upload.qbox.me',
				auto: false,
				type: 'file',
				compress: {
					width: 1600,
					height: 1600,
					quality: 0.8
				},
				onBeforeQueued: function(files) {
					console.log(uploadList)
					// if(['image/jpg','image/jpeg','/image/png','image/gif'].indexOf(this.type)<0){
					// 	weui.alert("请选择图片");
					// 	return false;
					// }
					if(this.size > 10 * 1024 * 1024) {
						weui.alert("请上传不超过10M的图片");
						return false;
					}
					if(files.length > picMaxCount) { //防止一下子选中过多文件
						weui.alert(`最多只能上传${picMaxCount}张图片，请重新选择`);
						return false;
					}
					if(uploadCount + 1 > picMaxCount) {
						weui.alert(`最多只能上传${picMaxCount}张图片`);
						return false;
					}
					++uploadCount;
					uploadCountDom.innerHTML = uploadCount;

					console.log(uploadCount)
				},
				onQueued: function() {
					console.log(this);
					console.log(this.url);
					uploadList.push(this);
					//文件添加成功后，先获取七牛的token再手动执行上传
					// let file = this;
					// console.log("请求的token"+uploadToken);
					// file.upload();//异步获取到七牛token后，调用upload手动上传图片

				},
				onBeforeSend: function(data, headers) {
					console.log('onBeforeSend：----' + uploadToken);
					$.extend(data, { token: uploadToken }); //在上传的参数中使用jquery扩展一个token字段，用来传递七牛所需的token
				},
				onProgress: function(procent) {
					console.log(this, procent);
				},
				onSuccess: function(ret) {
					var img_url = 'http://o8nljewkg.bkt.clouddn.com/' + ret.key;
					var img = new Image();
					var resImg = "";
					img.src = img_url;
					console.log("=========onload之前");
					img.onload = function() {
						resImg = "http://o8nljewkg.bkt.clouddn.com/" + ret.key + `?width=${img.width}&height=${img.height}`;
						successImgList.push(resImg)
						localStorage.successImgList = JSON.stringify(successImgList);
						console.log("-----------------"+JSON.stringify(successImgList));
						console.log("uploadCount:----"+uploadCount+"successImgList.length:---"+successImgList.length);
						//此回调每上传成功一张图片到七牛就会执行一次，所选的图片数量和放在七牛返回的图片数组长度相等时，返回。
						if(successImgList.length == uploadCount) {
							console.log("===============上传成功");
							Indicator.close();
							invokeNative({ "code": window.jsBridge.CODE_TOAST, "data": "上传成功" });
							successImgList = [];
							_this.goBack();
						}else {
							console.log("===============长度不相等");
						}
					}
				},
				onError: function(err) {
					console.log(this, err);
					console.log("===============上传失败");
					Indicator.close();
					invokeNative({ "code": window.jsBridge.CODE_TOAST, "data": "上传失败" });
				}
			});
			// 手动上传按钮
			$("#uploaderCustomBtn").on("click",function(){
				if(uploadList.length < 1) {
					weui.alert("请选择图片");
				}
				weui.confirm('确定上传所选图片?', function() {
					uploadList.forEach(function(file) {
						file.upload();
					});
					Indicator.open({
					  	text: '上传中...',
					  	// spinnerType: 'fading-circle'
					});
				})
			})
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//图片删除与预览
			handleClickUploadList(e) {
				var target = e.target;
				while(!target.classList.contains('weui-uploader__file') && target) {
					target = target.parentNode;
				}
				if(!target) return
				var url = target.getAttribute('style') || "";
				var id = target.getAttribute('data-id');
				if(url) {
					url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '');
				}
				var gallery = weui.gallery(url, {
					className: 'custom-name',
					onDelete: function() {
						weui.confirm('确定删除所选图片？', function() {
							--uploadCount;
							uploadCountDom.innerHTML = uploadCount;
							var info = JSON.parse(localStorage.getItem("name"));
							for(let i = 0, len = uploadList.length; i < len; ++i) {
								var file = uploadList[i];
								if(file.id + '' === id) {
									uploadList.splice(i, 1); //删除数组中当前元素
									// file.stop();
									break;
								}
							}
							target.remove();
							gallery.hide();
						})
					}
				})
			},
		}, //methods结束
	}
</script>

<style scoped lang="less">
	.weui-cells {
		margin-top: 0;
	}
</style>
