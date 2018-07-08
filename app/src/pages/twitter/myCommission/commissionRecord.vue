<!--结佣记录页面-->
<template>
	<div class="commissionDetails">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>结佣记录</y-header>
        <div class="content">
            <!-- 没有结佣记录 -->
            <NoFile v-show="!listData.length">
                <img slot="bgimg" src="../../../assets/img/twitter/no_details_ic@2x.png">
                <span slot="info">您还没有结佣记录</span>
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
	                <div class="commissionDetails-have">
		            	<div class="commissionDetails-desc">根据国家法律规定，给您的结佣金额已扣除了个人所得税</div>
		            </div>
		            <dl class="commissionDetails-list" v-for="(item,index) in listData" :key="index">
		            	<dt v-show="item.monthDate">{{item.monthDate}}</dt>
		            	<dd v-for="(i,index) in item.transferItemDtos" :key="index"  class="bb1 clearfix">
		            		<div class="commissionDetails-list-left">
		            			<div>
		            				<h2>{{i.transferTime | setDate}}</h2>
		            				<p>{{i.payTool}}</p>
		            			</div>
		            		</div>
		            		<router-link tag="div" :to="{'name':'commissionVoucher',query:{'credential':i.credential}}" class="commissionDetails-list-right">
		            			<span class="F2 C1 fwb">{{item.transferAmount}}</span>
								<img src="../../../assets/img/twitter/more_ico@2x.png" alt="">
		            		</router-link>
		            	</dd>
		            </dl>		            
	                </mt-loadmore>
	            </div>
	        </div>
            
        </div>
	</div>
</template>
<script>
import yHeader from '../../../components/Header'
import NoFile from '../../../components/NoFile'
import $ from 'jquery'
export default {
    name: 'commissionDetails',
    data() {
        return {
        	allLoaded: false,
        	bottomStatus: '',
        	topStatus:"",
        	page:1,					//当前页数
			pageSize:20,			//每页请求的条数
			totalPage:0,			//总页数
			
            noDetails:false,
            listData:[]
        }
    },
    components:{
        yHeader,
        NoFile
    },
    created() {
    	/*模拟数据start*/
		/*this.dataList = [
			{
		        "transferTime": 1511161428000,
		        "transferAmount": 200.36,
		        "payTool": "微信支付",
		        "credential": "http://img2.imgtn.bdimg.com/it/u=3572193526,2017625270&fm=11&gp=0.jpg",
		        "postscript": ""
		    },
		    {
		        "transferTime": 1511161428045,
		        "transferAmount": 10.86,
		        "payTool": "网银转账",
		        "credential": "http://img2.imgtn.bdimg.com/it/u=3572193526,2017625270&fm=11&gp=0.jpg",
		        "postscript": ""
		    }
		]
		/*模拟数据end*/
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		this.getDataList();
    },
    mounted() {
		this.$nextTick(function () {  
			console.log(this.$refs.wrapper.getBoundingClientRect().top)
			$(".mint-loadmore").css({
				"overflow":"visible"
			})
            $(".mint-loadmore-top").css({
            	"font-size":"0.37333rem"
            });
            $(".mint-loadmore-bottom").css({
            	"font-size":"0.37333rem"
            }).hide();
			
        });  

	},
    methods:{
      	goBack(){
            this.$router.go(-1);
       	},
        getDataList(){
        	//https://devcustomer.yingwumeijia.com:443/{version}/twitter/transfers?pageNum=1&pageSize=20
            this.$http.get(window.Host.customer+`/twitter/transfers?pageNum=${this.page}&pageSize=${this.pageSize}`).then((res)=>{
            	console.log(res)
                if(res.data.succ){
                    invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
                    
                    this.onResponseList(res.data.data.transferItemDtoMap);
                    
                }else{
                    invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
                    didApiError(res);
                }
            })
        },
        onResponseList(result) {
			if (this.page == 1) {
				this.listData = result || [];
			}else{
				if(result){
					$(".mint-loadmore-bottom").hide();
					var lastMonth = this.listData[this.listData.length-1].monthDate;
					var firstMonth = result[0].monthDate;
					if(lastMonth==firstMonth){
						delete result[0].monthDate;
					}
					this.listData=this.listData.concat(result);
					this.allLoaded = false;
					
				}else {
					$(".mint-loadmore-bottom").hide();
					this.allLoaded = true;
				}
			}
		},
        loadTop() {
        	this.page = 1;
          	setTimeout(() => {
          		this.getDataList();
                this.$refs.loadmore.onTopLoaded();
                $(".mint-loadmore-bottom").hide();
                this.allLoaded = false;
            }, 1500);

        },
		handleTopChange(status) {
			this.topStatus = status;
		},
		handleBottomChange(status) {
        	this.bottomStatus = status;
        	$(".mint-loadmore-bottom").show();
    	},
    	loadBottom() {
	        this.page += 1;
            setTimeout(() => {
          		this.getDataList();
                this.$refs.loadmore.onBottomLoaded();
            }, 1500);
    	}
    },
}
</script>
<style scoped lang="less">
/* 没有结佣记录 */
.nocommissiondetails{
    position: absolute;
    left: 50%;
    margin: 2.26666rem 0 0 -1.72666rem; 
    img{
        width: 3.45333rem;
        height: 3.45333rem;
    }
}
/* 有结佣记录*/
.commissionDetails-have {
	.commissionDetails-desc {
		line-height: 1.17333rem;
		text-align: center;
		font-size: 0.32rem;
		color:rgba(115,115,115,1);
		
	}
}
.commissionDetails-list {
	dt{
		height: 0.65333rem;
		line-height: 0.65333rem;
		padding-left: 0.65333rem;
		background-color: #9E9E9E;
		font-size: 0.37333rem;
		color:rgba(255,255,255,1);
	}
	dd {
		background-color: #fff;
		padding:0 0.52rem 0 0.68rem;
		.commissionDetails-list-left{
			float: left;
			display: table;
			height:1.6rem;
			div{
				display: table-cell;
				vertical-align: middle;
				h2{
					color: #282828;
					font-size: 0.4rem;
				}
				p{
					color: #737373;
					font-size: 0.32rem;
				}
			}
			
			
		}
		.commissionDetails-list-right {
			float: right;
			line-height: 1.6rem;
			img{
				margin-left: 0.28rem;
				width: 0.18667rem;
				height: 0.34667rem;
			}
		}
	}
}
</style>