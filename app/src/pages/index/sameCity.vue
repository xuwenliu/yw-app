<template>
	<div class="sameCity-wraper">
		<div class="topH">
			<y-header>
				<div class="clickMe" @click="goBack"><span></span></div>{{type===1?'同城设计师':'同城装饰公司'}}
			</y-header>
			<div class="clearfix pr bb1">
				<h3 class="city" @click="showSort">
					<span>
						<i class="F4 C1">{{selectSort}}</i>
						<img src="../../assets/img/index/home_open_map_ic.png" :class="{'rotate':up}">
					</span>

				</h3>
				<div class="search fl">
					<div class="search-div">
						<input  type="search" class="F5" :placeholder="type===1?'按姓名搜索':'按公司名搜索'" v-model.trim="name">
						<button @click="search()"><img src="../../assets/img/index/designer_search_ic.png" alt="" /></button>
					</div>
				</div>
			</div>
		</div>

		<!-- 弹出排序选择列表 -->
		<div class="toast-city" @touchmove.prevent v-show="isClickSort" @click="isClickSort=false">
			<ul>
				<i class="sanjiao"></i>
				<i class="line"></i>
				<i class="line" style="top: 2.34666rem;"></i>
				<i v-if="sort.length===4" class="line" style="top: 3.51999rem;"></i>
				<li class="F8 C1"
				:class="{'C6':index==inow}"
				v-for="(item,index) in sort"
				@click="chooseSort(index,item.shortName,item.id)"
				:data-cityId="item.id">{{item.shortName}}</li>
			</ul>
		</div>
		<div class="main">

			<NoFile v-show="!listData.length" :style="{'margin-left':isSearch?'-2.5rem':'-1.72666rem'}">
                <img style="width: 3.44rem;height: 3.44rem;" slot="bgimg" :src="isSearch?noDataArr[2].bgImg:noDataArr[type-1].bgImg">
                <span slot="info">{{isSearch?noDataArr[2].desc:noDataArr[type-1].desc}}</span>
            </NoFile>

			<div class="page-loadmore" v-show="listData.length">
	            <div class="page-loadmore-wrapper" ref="wrapper">
	                <mt-loadmore
	                :top-method="loadTop"
	                :bottom-method="loadBottom"
	                :bottom-all-loaded="allLoaded"
	                @bottom-status-change="handleBottomChange"
	                @top-status-change="handleTopChange"
	                ref="loadmore"
	                :auto-fill="false"
	                :max-distance="80"
	                bottomPullText="加载更多"
	                bottomDropText="释放加载"
	                topDropText="释放刷新"
	                topLoadingText="刷新中..."
	                >
	                  <div class="sameCity-list">
							<ul>
								<li v-for="(item,index) in listData" :key="index">
									<div class="sameCity-list-box bb1">
										<div class="left">
											<img :src="item.designerPic||item.companyPic" alt="" />
										</div>
										<div class="center">
											<h1 v-show="type===1"><span class="F4 fwb C1">{{item.name}}</span><i class="F6" v-show="!(item.start==0&&item.end==0)">￥{{item.start}}-{{item.end}}/㎡</i></h1>
											<h2 class="F5" :class="{'fwb':type===2,'F3':type===2,'C1':type===2,'C4':type===1}">{{item.companyName}}</h2>
											<h3 class="F7 C1">
												<span><img src="../../assets/img/index/designer_work_ic.png" alt="" /><i>作品&nbsp;{{item.caseCount}}</i></span>
												<span><img src="../../assets/img/index/designer_view_ic.png" alt="" /><i>浏览&nbsp;{{item.viewCount}}</i></span>
												<span><img src="../../assets/img/index/designer_talk_ic.png" alt="" /><i>咨询&nbsp;{{item.sessionCount}}</i></span>
											</h3>
										</div>
										<div class="right" @click="goDetails(type,item.id,item.userId)">
											<img src="../../assets/img/index/designer_more_ic.png" alt="" />
										</div>
									</div>
								</li>

							</ul>
						</div>
	                </mt-loadmore>
	            </div>
	        </div>

		</div>
	</div>
</template>

<script>
	/*mint-ui*/
import {MessageBox} from 'mint-ui';
import {Indicator} from 'mint-ui';
import {Toast} from 'mint-ui';
import yHeader from '../../components/Header'
import NoFile from '../../components/NoFile'
export default {
	name: 'sameCity',
	components: {
		yHeader,
		NoFile

	},
	data() {
		return {
			type:this.$route.query.type*1,
			cityId:this.$route.query.cityId*1,
			selectSort:"浏览次数",      //默认浏览次数
			sort:[{"shortName":"浏览次数","id":1},{"shortName":"作品数量","id":2},{"shortName":"咨询次数","id":3}],
			up:false,         		//箭头是否旋转
			isClickSort:false,		//控制选择

			sortId:1,            	//排序id 默认浏览次数
			inow:0,           		//排序列表切换

			allLoaded: false,
        	bottomStatus: '',
        	topStatus:"",
        	page:1,					//当前页数
			pageSize:20,			//每页请求的条数
			totalPage:0,			//总页数

			isSearch:false,//是否搜索
			name:"",//搜索文本
            listData:[],
            noDataArr:[
            	{"bgImg":require('../../assets/img/index/no_design_ic.png'),"desc":"当前暂无设计师"},
            	{"bgImg":require('../../assets/img/index/no_company_ic.png'),"desc":"当前暂无装饰公司"},
            	{"bgImg":require('../../assets/img/index/no_search_ic.png'),"desc":"当前暂无搜索结果，请重新搜索"}
            ]
		}
	},
	created() {
		/*模拟数据-start-*/
		/*if(this.type===1){
			this.listData = [
				{
			      	"id": 0,
			      	"userId": 0,
			      	"name": "刘德华",
			      	"start": 160,
			      	"end": 300,
			      	"designerPic": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
			      	"companyName": "中国宏福樘国际装饰装修合资有限公司成都分公司",
			      	"caseCount": 10345,
			      	"viewCount": 66666,
			      	"sessionCount": 99999
			    }
			]
		}else {
			this.listData = [
				{
			      	"id": 0,
			      	"designerPic": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
			      	"companyName": "哈哈哈公司",
			      	"caseCount": 65431,
			      	"viewCount": 12345,
			      	"sessionCount": 998877
			    }
			]
		}

		/*模拟数据-end-*/
		//同城装饰公司
		if(this.type===2){
			this.selectSort="智能排序";
			this.sort=[{"shortName":"智能排序","id":0},{"shortName":"浏览次数","id":1},{"shortName":"作品数量","id":2},{"shortName":"咨询次数","id":3}];
			this.inow = 0;
			this.sortId =0;
		}
		if(this.$route.query.sortId ==2){
			this.sortId =2;
			this.inow = 2;
			this.selectSort="作品数量";
		}
		this.getDataList();
	},
	mounted(){
		this.$nextTick(()=> {
			document.querySelector(".mint-loadmore-top").style.fontSize="0.37333rem";
			document.querySelector(".mint-loadmore-bottom").style.fontSize="0.37333rem";
        });
    },
	methods: {
		goBack() {
			invokeNative({"code": window.jsBridge.CODE_CLOSE});
		},
		//点击显示城市列表
		showSort() {
			this.up=!this.up;
			this.isClickSort=!this.isClickSort;
		},
		chooseSort(idx,text,sortId) {
			this.isClickSort=!this.isClickSort;
			this.up=!this.up;
			this.inow=idx;
			this.selectSort=text;
			this.sortId=sortId;
			console.log('切换'+this.sortId)
			this.getDataList();
		},
		getDataList(){
			Indicator.open();
			if(this.type===1){
				//https://devcustomer.yingwumeijia.com:443/{version}/case/app/getDesigner?cityId=2252&pageNum=1&pageSize=20&orderBy=1
				var api = window.Host.customer+`/case/app/getDesigner?cityId=${this.cityId}&name=${this.name}&pageNum=${this.page}&pageSize=${this.pageSize}&orderBy=${this.sortId}`;
			}else {
				//https://devcustomer.yingwumeijia.com:443/{version}/company/getCompany?cityId=2252&pageNum=1&pageSize=20&orderBy=2
				var api = window.Host.customer+`/company/getCompany?cityId=${this.cityId}&name=${this.name}&pageNum=${this.page}&pageSize=${this.pageSize}&orderBy=${this.sortId}`;
			}

			console.log(api)
        	this.$http.get(api).then((res) => {
				if(res.data.succ){
					Indicator.close();
					console.log(res);
					this.onResponseList(res.data.data);
				}else{
					Indicator.close();
					didApiError(res);
				}
			})
        },
        onResponseList(result) {
			if (this.page == 1) {
				this.listData = result || [];
			}else{
				if(result){
					this.listData=this.listData.concat(result);
				}
			}
		},
        loadTop() {
        	this.page = 1;
          	setTimeout(() => {
          		this.getDataList();
                this.$refs.loadmore.onTopLoaded();
                this.allLoaded = false;
            }, 1500);

        },
		handleTopChange(status) {
			this.topStatus = status;
		},
		handleBottomChange(status) {
        	this.bottomStatus = status;
    	},
    	loadBottom() {
	        this.page += 1;
            setTimeout(() => {
          		this.getDataList();
                this.$refs.loadmore.onBottomLoaded();
            }, 1500);
    	},
    	search() {
    		this.isSearch = true;
    		this.getDataList();
    	},
    	goDetails(type,id,userId) {
    		if(type===1){//同城设计师需要userId
    			invokeNative({
					"code":window.jsBridge.CODE_GO_DESIGNER_DETAIL,
					"data":userId
				});
    		}else {//同城装饰公司需要id
    			invokeNative({
					"code":window.jsBridge.CODE_GO_COMPANY_DETAIL,
					"data":id
				});
    		}

    	}
	},//methods结束
}
</script>

<style scoped lang="less">
.sameCity-wraper {
	.topH{
		position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    z-index: 1;
	    background: #fff;
	}
}
.main {
	padding-top: 2.46rem;;
}
.city{
	height: 1.2rem;
	line-height: 1.2rem;
	float: left;
	margin-left: 0.64rem;
	span{
		display: flex;
		justify-content: center;
		align-items: center;
		img{
			width: 0.22666rem;
			height: 0.12rem;
			margin-left: 0.22666rem;
			vertical-align:middle;
		}
		img.rotate{
			transform: rotateZ(180deg);
			transition: all .5s;
		}
	}

}
/*弹框的城市列表*/
.toast-city{
	position: fixed;
	top: 2.4rem;left: 0;right: 0;bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 999999999999999;
	ul{
		position: absolute;
		top: 0.4rem;
		left: 0.32rem;
		width:3.94666rem;
		background-color: #fff;
		border-radius: 6px;
		li{
			height: 1.17333rem;
			line-height: 1.17333rem;
			text-align: center;
		}
		.sanjiao{
		    width:0;
		    height:0;
		    overflow:hidden;
		    border-width:10px;
		    border-color:transparent transparent #fff transparent;
		    border-style: dashed dashed solid dashed;
			position: absolute;
			top: -20px;
			left: 0.4rem;

		}
		.line{
			width:3.25333rem;
			height: 1px;
			background-color: #e6e6e6;
			position: absolute;
			top: 1.17333rem;
			left: 0.26667rem;
		}
	}
}
/*头部搜索框样式*/
.search {
	width: 60%;
	position: absolute;
	right:0.45333rem;
	top: 50%;
	margin-top: -0.34666rem;
	.search-div  {
		position: relative;
		width:100%;
		input {
			display: block;
			width: 100%;
			height: 0.7rem;
			padding-left: 0.4rem;
			border: 1px solid rgba(168,168,168,0.5);
			border-radius: 0.08rem;
			box-sizing: border-box;
		}

		button {
			width: 0.9rem;
			height: 0.7rem;
			cursor: pointer;
			position: absolute;
			top: 0;
			right: 0;
			background: #ff293c;
			border-radius: 0 0.08rem 0.08rem 0;
			border:1px solid  #ff293c;
			img{
				width: 0.32rem;
				height: 0.32rem;
				vertical-align: middle;
			}
		}
	}
}
.sameCity-list {
	ul {
		li{
			padding-left: 0.57333rem;
			background-color: #fff;
			.sameCity-list-box {
				display:flex;
				padding-top:0.45333rem;
				padding-bottom:0.49333rem;
				.left{
					display: flex;
					align-items: center;
					img{
						width: 1.30666rem;
						height: 1.30666rem;
						display: block;
						border-radius: 50%;
					}
				}
				.center {
					flex: 1;
					margin-left: 0.34666rem;
					h1{
						span{
							margin-right: 0.29333rem;
						}
						i{
							color: #ED316B;
							border:1px solid #ED316B;
							border-radius: 0.24rem;
							height: 0.45333rem;
							display: inline-block;
							padding: 0 0.22666rem 0 0.14666rem;
							vertical-align: text-bottom;
						}
					}
					h2{
						width: 86%;
						margin: 0.16rem 0 0.18rem;
					}
					h3 {
						span {
							margin-left:0.25333rem;
							img{
								width: 0.32rem;
								height: 0.29333rem;
								vertical-align: middle;
								margin-right: 0.14666rem;
							}
						}
						span:first-child{
							margin-left: 0;
						}
						span:nth-child(2) {
							img{
								width: 0.42666rem;
								height: 0.24rem;
							}
						}
					}
				}
				.right{
					display: flex;
					align-items: center;
					img{
						width: 0.18666rem;
						height: 0.34666rem;
						vertical-align: middle;
						margin: 0 0.5rem;
					}
				}
			}

		}
		li:last-child{
			border-bottom: 1px solid #e6e6e6;
			.sameCity-list-box{
				border-bottom: none;
			}
		}

	}
}
</style>
