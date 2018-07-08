<template>

  <div class="create-order">
    <TopHeader>
      <div class="clickMe" @click="goBack"><span></span></div>
      创建订单
    </TopHeader>
    <BottomFooter>
      <div class="F3 C0" @click="goTwoDimensionCode">确定</div>
    </BottomFooter>
    <div class="content btm">
      <div class="paylist-title bg0">
        <div class="img-box">
          <img :src="companyLogo">
          <h1 class="F8 C1">{{companyName}}</h1>
        </div>
      </div>
      <div class="paylist-list bg0 mg">
        <ul>
          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>项目名称</span></p>
              <input type="text" placeholder="限20字" size="20" v-model.trim="projectName">
            </div>
          </li>

          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <!-- A.若是设计师/商务经理创建订单，默认显示“设计订单”，可以切换为“施工订单” -->
              <!-- 若是项目经理创建订单，默认显示“施工订单”，可以切换为“设计订单” -->
              <p><span>订单类型</span></p>
              <p>
                <select v-model="selectedOrderType">
                  <option v-for="item in orderType" :value="item.value">{{item.text}}
                  </option>
                </select>
                <img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
              </p>
            </div>
          </li>

          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>付款用途</span></p>
              <p>
                <select v-model="selectPayUse">
                  <option v-for="item in payUse" :value="item.value">{{item.text}}</option>
                </select>
                <img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
              </p>
            </div>
          </li>

          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>账单金额</span></p>
              <input type="text" placeholder="请输入账单金额" v-model.trim="amount" maxlength="8">
            </div>
          </li>

          <li class="bb1" v-show="userName">
            <div class="div-box F4 C1 clearfix">
              <p><span>客户姓名</span></p>
              <p class="textcut">{{userName}}</p>
            </div>
          </li>


          <li class="bb1" v-show="selectedOrderType==2">
            <div class="div-box F4 C1 clearfix">
              <p><span>项目经理</span></p>
              <p v-if="projectConductor.length!=0">
                <select v-model="selectProjectConductorId">
                  <option v-for="item in projectConductor" :value="item.employeeUserId">{{item.name}}</option>
                </select>
                <img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
              </p>
              <p v-else>无</p>
            </div>
          </li>

          <li class="bb1" v-show="selectedOrderType==1">
            <div class="div-box F4 C1 clearfix">
              <p><span>设计师</span></p>
              <p v-if="designer.length!=0">
                <select v-model="selectDesignerId">
                  <option v-for="item in designer" :value="item.employeeUserId">{{item.name}}</option>
                </select>
                <img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
              </p>
              <p v-else>无</p>
            </div>
          </li>

          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>商务代表</span></p>
              <p v-if="businessRepTat.length!=0">
                <select v-model="selectBusinessRepTatId">
                  <option v-for="item in businessRepTat" :value="item.employeeUserId">{{item.name}}</option>
                </select>
                <img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
              </p>
              <p v-else>无</p>
            </div>
          </li>

          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>说明&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
              <input type="text" placeholder="请输入用途的详细说明" v-model.trim="postscript">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../../components/Header'
  import BottomFooter from '../../../../components/Footer'
  import '../../../../assets/css/orderE-create-order.css'
  export default{
    name: "createOrder",
    components: {
      TopHeader,
      BottomFooter
    },
    data(){

      return {
        companyLogo: '',//公司logo
        companyName: '',//公司名称
        userName: '',//客户姓名

        sessionId: '',//会话id
        userId: '',	//客户id
        caseId: '',//作品id

        caseCompanyId: '',//当前会话作品公司id
        createdCompanyId: '',//创建者所属公司id

        oneselfRole: '',//我自己的角色 1=设计师 2=项目经理 3=商务代表

        designer: [],//存放设计师人员
        selectDesignerId: '',//选中的设计师Id

        projectConductor: [],//存放项目经理
        selectProjectConductorId: '',//选中的项目经理id

        businessRepTat: [],//存放商务代表
        selectBusinessRepTatId: '',//选中的商务代表id


        projectName: '',//项目名称
        orderType: [{'text': '设计订单', value: 1}, {'text': '施工订单', value: 2}],//订单类型
        selectedOrderType: 1,//默认选中设计订单


        payUse: [{'text': '定金', value: 8}, {'text': '首款', value: 9}],//定金、首款
        selectPayUse: 8,//默认选中定金

        amount: '',//账单金额
        postscript: '',//说明
      }
    },//data结束

    methods:{
      	//订单创建成功后返回订单ID
      	didOrderCreated(data){
	        invokeNative({"code":window.jsBridge.CODE_ORDER_PAY_MESSAGE,"data":data});
      	},
      	//显示加载圈
      	showDialog(){
      		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
      	},
      	//关闭加载圈
      	hideDialog(){
      		invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE })
      	},
      	//关闭页面
      	closePage(){
      		invokeNative({"code": window.jsBridge.CODE_CLOSE});
      	},
      	//消息提示
      	messageHint(data){
      		invokeNative({"code":window.jsBridge.CODE_TOAST,"data":data});
      	},
      	goBack(){
	        if(this.$route.query.type==2){
	          	this.$router.go(-1);
	        }else{
	          	//当前页面是创建订单 调用原生方法返回至聊天会话群
          		this.closePage();
        	}
      	},


      	createOrder(tp){
      		//获取公司logo/name
			this.$http.get(window.Host.employee+`/company/`).then((res)=>{
				if(res.data.succ){
					this.companyLogo=res.data.data.companyHeadImage;
					this.companyName=res.data.data.companyName;
					//1.获取会话Id
					this.sessionId = this.$route.query.sessionId;
					//2.获取客户姓名/id
					this.getUserIdName(tp);

				}else{
					if(res.data.stateCode!=312){
						this.messageHint(res.data.message);
					}
				}

			});
      	},
      	createPreOrder(tp){
      		this.$http.get(window.Host.employee+`/company/`).then((res)=>{
				if(res.data.succ){
					this.companyLogo=res.data.data.companyHeadImage;
					this.companyName=res.data.data.companyName;
					//1.获取公司所有的设计师/项目经理/商务代表
					this.getDataInfo(1,1,100,tp);
					this.getDataInfo(2,1,100,tp);
					this.getDataInfo(3,1,100,tp);
				}else{
					if(res.data.stateCode!=312){
						this.messageHint(res.data.message);
					}
				}

			});
      	},


      	//获取客户id/客户姓名
      	getUserIdName(tp){
			this.$http.get(window.Host.employee+`/im/session/${this.sessionId}`).then((res)=>{
				if(res.data.succ){
					this.userId=res.data.data.sessionInfo.userId;
					var data=res.data.data.sessionInfo.members;
					for(var i=0;i<data.length;i++){
						if(this.userId==data[i].userId){
							this.userName=data[i].realName || data[i].showName;
						}
					}
					//3.获取公司所有的设计师/项目经理/商务代表
					this.getDataInfo(1,1,100,tp);
					this.getDataInfo(2,1,100,tp);
					this.getDataInfo(3,1,100,tp);
				}else{
					this.messageHint(res.data.message);
				}
			});
      	},
      	//获取设计师/项目经理/商务代表人员
      	getDataInfo(type,pageNum,pageSize,tp){
      		this.$http.get(window.Host.employee+`/company/employees?employeeType=${type}&pageNum=${pageNum}&pageSize=${pageSize}`).then((res)=>{
      			if(res.data.succ){
      				switch(type){
						case 1:
							if(res.data.data.result){
								this.designer=res.data.data.result;
							    this.selectDesignerId=res.data.data.result[0].employeeUserId;
							}else{
								this.designer=[];
							}
								break;
						case 2:
							if(res.data.data.result){
								this.projectConductor=res.data.data.result;
						   		this.selectProjectConductorId=res.data.data.result[0].employeeUserId;
						   }else{
						   		this.projectConductor=[];
						   }
							break;
						case 3:
							if(res.data.data.result){
								this.businessRepTat=res.data.data.result;
						   		this.selectBusinessRepTatId=res.data.data.result[0].employeeUserId;
							}else{
								this.businessRepTat=[];
							}
							break;
						}
						if(tp==1){
							//4.获取自我角色
							this.$http.get(window.Host.employee+"/employee/getEmployeeDetail").then((res)=>{
								if(res.data.succ){
									var role=res.data.data.employeeDto;
									this.oneselfRole=role.userDetailType;
									//我自己是设计师
									if(this.oneselfRole==1){
										//选中设计订单
										this.selectedOrderType=1;
										//A.关联自己
										if(role.id){
											for(var i in this.designer){
												if(role.id==this.designer[i].employeeUserId){
													this.selectDesignerId=role.id;
													break;
												}
											}
										}
									//关联商务代表
									this.relevanceBusinessRepTat(this.sessionId);
									//我自己是项目经理
									}else if(this.oneselfRole==2){
										//选中施工订单
										this.selectedOrderType=2;
										if(role.id){//A.关联自己
											for(var i in this.projectConductor){
												if(role.id==this.projectConductor[i].employeeUserId){
													this.selectProjectConductorId=role.id;
													break;
												}
											}
										}
									//关联商务代表
									this.relevanceBusinessRepTat(this.sessionId);
									//我自己商务代表
									}else if(this.oneselfRole==3){
										//选中设计订单
										this.selectedOrderType=1;
										var temp = 0;//1表示自己关联成功
										if(role.id){//A.关联自己
											for(var i in this.businessRepTat){
												if(role.id==this.businessRepTat[i].employeeUserId){
													this.selectBusinessRepTatId=role.id;
													break;
												}
											}
										}
										this.relevanceHardSoft(this.sessionId);
									}

								}else{
									this.messageHint(res.data.message);
								}
							});
						}
					//创建预订单
					if(tp==2){
					//2.创建预订单---获取自我角色
					this.$http.get(window.Host.employee+"/employee/getEmployeeDetail").then((res)=>{
						if(res.data.succ){
							var role=res.data.data.employeeDto;
							this.oneselfRole=role.userDetailType;
							if(this.oneselfRole==1){
								this.selectedOrderType=1;//选中设计订单
								if(role.id){//1.关联自己
									for(var i in this.designer){
										if(role.id==this.designer[i].employeeUserId){
											this.selectProjectConductorId=role.id;break;
										}
									}
								}
							}else if(this.oneselfRole==2){
								this.selectedOrderType=2;//选中施工订单
								if(role.id){//1.关联自己
									for(var i in this.projectConductor){
										if(role.id==this.projectConductor[i].employeeUserId){
											this.selectDesignerId=role.id;break;
										}
									}
								}
							}else if(this.oneselfRole==3){
								this.selectedOrderType=1;//选中设计订单
								if(role.id){//1.关联自己
									for(var i in this.businessRepTat){
										if(role.id==this.businessRepTat[i].employeeUserId){
											this.selectBusinessRepTatId=role.id;break;
										}
									}
								}
							}
						}else{
							this.messageHint(res.data.message);
						}
					});
					}
      			}else{
      				this.messageHint(res.data.message);
      			}

			})
      	},


      	//关联设计师 硬装设计师/软装设计师
      	relevanceHardSoft(sessionId){
      		this.$http.get(window.Host.employee+`/im/session/${sessionId}`).then((res)=>{
      			if(res.data.succ){
      				this.caseId=res.data.data.relatedCaseInfo.id;
					this.$http.get(window.Host.employee+`/case/employee/detail/team/${this.caseId}`)
					.then((res)=>{
							var userIdY=0;
							var userIdR=0;
						if(res.data.succ){
							var resData=res.data.data.employees;

							for(var i in resData){
								if(resData[i].employeeDetailType=="软装设计师"){
									userIdR=resData[i].userId;
									break;
								}
							}
							for(var i in resData){
								if(resData[i].employeeDetailType=="硬装设计师"){
									userIdY=resData[i].userId;
									break;
								}
							}
							if(userIdR!=0){
								for(var j in this.designer){
									if(this.designer[j].employeeUserId==userIdR){
										this.selectDesignerId=userIdR;
										break;
									}
								}
							}
							if(userIdY!=0){
								for(var j in this.designer){
									if(this.designer[j].employeeUserId==userIdY){
										this.selectDesignerId=userIdY;
										break;
									}
								}
							}
							if(userIdY==0&&userIdR==0){
								this.selectDesignerId=this.designer[0].employeeUserId;
							}

						}else{
							this.messageHint(res.data.message);
						}
					})
      			}else{
      				this.messageHint(res.data.message);
      			}
      		})
      	},
      	//关联作品中的项目经理
      	relevanceProjectConductor(sessionId){
      		this.$http.get(window.Host.employee+`/im/session/${sessionId}`).then((res)=>{
      			if(res.data.succ){
      				this.caseId=res.data.data.relatedCaseInfo.id;
					this.$http.get(window.Host.employee+`/case/employee/detail/team/${this.caseId}`)
					.then((res)=>{
						if(res.data.succ){
							var resData=res.data.data.employees;
							for(var i in resData){
								if(resData[i].employeeDetailType=="项目经理"){
									this.selectProjectConductorId=resData[i].userId;
									break;
								}else{//作品中没有项目经理
									this.selectProjectConductorId=this.projectConductor[0].employeeUserId;
									break;
								}
							}
						}else{
							this.messageHint(res.data.message);
						}
					})
      			}else{
      				this.messageHint(res.data.message);
      			}
      		})
      	},
      	//关联作品中的商务代表
      	relevanceBusinessRepTat(sessionId){
      		this.$http.get(window.Host.employee+`/im/session/${sessionId}`).then((res)=>{
      			if(res.data.succ){
      				this.caseId=res.data.data.relatedCaseInfo.id;
					this.$http.get(window.Host.employee+`/case/employee/detail/team/${this.caseId}`)
					.then((res)=>{

						if(res.data.succ){
							var resData=res.data.data.employees;
							for(var i in resData){
								if(resData[i].employeeDetailType==="商务代表"){
									this.selectBusinessRepTatId=resData[i].userId;
									break;
								}else{//作品中没有商务代表
									this.selectBusinessRepTatId=this.businessRepTat[0].employeeUserId;
									break;
								}
							}
						}else{
							this.messageHint(res.data.message);
						}
					})
      			}else{
      				this.messageHint(res.data.message);
      			}
      		})
      	},


      	//创建订单时发送的post请求
      	sendCreadOrder(){
      		//如果是设计订单
      		this.showDialog();//显示加载圈
      		let dataObj={};
      		this.selectedOrderType==1 ? dataObj={//设计订单
      			"orderName": this.projectName,
	            "orderType": this.selectedOrderType,
	            "customerUserId": this.userId,
	            "designerUserId": this.selectDesignerId,
	            "advisorUserId": this.selectBusinessRepTatId,
	            "imSessionId": this.sessionId,
	            "billInfo": {
	              	"billContentType":this.selectPayUse,
	              	"amount": this.amount,
	              	"postscript": this.postscript
	            }
      		} : dataObj={//施工订单
      			"orderName": this.projectName,
	            "orderType": this.selectedOrderType,
	            "customerUserId": this.userId,
	            "pmUserId": this.selectProjectConductorId,
	            "advisorUserId": this.selectBusinessRepTatId,
	            "imSessionId": this.sessionId,
	            "billInfo": {
	              	"billContentType":this.selectPayUse,
	              	"amount": this.amount,
	              	"postscript": this.postscript
	            }
      		}
      		this.$http.post(window.Host.employee+`/order`,dataObj).then((res) =>{
      			if(res.data.succ){
        			this.hideDialog();//关闭加载圈
          			//调用原生接口传订单id过去。
          			let resData=res.data.data;
	          		this.didOrderCreated({
			            orderId:resData.orderId,			//订单Id
			            billId:resData.billId ,				//账单ID
			            billTypeStr:this.orderType[this.selectedOrderType-1].text,	//设计订单
			            billAmount:resData.amount,			//账单金额
			            content:"支付"+this.payUse[this.selectPayUse-8].text	//付款用途
	          		});
	        	}else{
	        		this.messageHint(res.data.message);
	        	}
      		})

      		/*
      		if(this.selectedOrderType==1){
      			this.$http.post(window.Host.employee+`/order`,{
		            "orderName": this.projectName,
		            "orderType": this.selectedOrderType,
		            "customerUserId": this.userId,
		            "designerUserId": this.selectDesignerId,
		            "advisorUserId": this.selectBusinessRepTatId,
		            "imSessionId": this.sessionId,
		            "billInfo": {
		              	"billContentType":this.selectPayUse,
		              	"amount": this.amount,
		              	"postscript": this.postscript
		            }
        		}).then((res)=>{
	        		if(res.data.succ){
	        			this.hideDialog();//关闭加载圈
	          			//调用原生接口传订单id过去。
	          			var resData=res.data.data;
		          		this.didOrderCreated({
				            orderId:resData.orderId,			//订单Id
				            billId:resData.billId ,				//账单ID
				            billTypeStr:this.orderType[this.selectedOrderType-1].text,	//设计订单
				            billAmount:resData.amount,			//账单金额
				            content:"支付"+this.payUse[this.selectPayUse-8].text	//付款用途
		          		});
		        	}else{
		        		this.messageHint(res.data.message);
		        	}
      			});
      		}else{
      			//施工订单
      			this.$http.post(window.Host.employee+`/order`,{
		            "orderName": this.projectName,
		            "orderType": this.selectedOrderType,
		            "customerUserId": this.userId,
		            "pmUserId": this.selectProjectConductorId,
		            "advisorUserId": this.selectBusinessRepTatId,
		            "imSessionId": this.sessionId,
		            "billInfo": {
		              	"billContentType":this.selectPayUse,
		              	"amount": this.amount,
		              	"postscript": this.postscript
		            }
        		}).then((res)=>{
	        		if(res.data.succ){
	        			this.hideDialog();//关闭加载圈
	          			//调用原生接口传订单id过去。
	          			var resData=res.data.data;
		          		this.didOrderCreated({
				            orderId:resData.orderId,			//订单Id
				            billId:resData.billId ,				//账单ID
				            billTypeStr:this.orderType[this.selectedOrderType-1].text,	//施工订单
				            billAmount:resData.amount,			//账单金额
				            content:"支付"+this.payUse[this.selectPayUse-8].text	//付款用途
		          		});

		        	}else{
			          	this.messageHint(res.data.message);
		        	}
      			});
      		}
      		*/
        },
    	//创建预订单发送的post请求
    	sendCreadPreOrder(){
    		//如果是设计订单
    		this.showDialog();//显示加载圈
    		let dataObj={};
    		this.selectedOrderType==1 ? dataObj={//设计订单
    			"orderName": this.projectName,
			  	"orderType": this.selectedOrderType,
			  	"designerUserId": this.selectDesignerId,
			  	"advisorUserId": this.selectBusinessRepTatId,
			  	"billInfo": {
			    	"billContentType": this.selectPayUse,
			    	"amount": this.amount,
			    	"postscript": this.postscript
			  	}
    		} : dataObj={//施工订单
    			"orderName": this.projectName,
			  	"orderType": this.selectedOrderType,
			  	"pmUserId": this.selectProjectConductorId,
			  	"advisorUserId": this.selectBusinessRepTatId,
			  	"billInfo": {
			    	"billContentType": this.selectPayUse,
			    	"amount": this.amount,
			    	"postscript": this.postscript
			  	}
    		}
    		this.$http.post(window.Host.employee+`/order/predict`,dataObj).then((res) => {
    			if(res.data.succ){
					// 点击确定去生成二维码
					this.hideDialog();//关闭加载圈
					this.$router.push({"name":"createTwoDimensionCode",
						query:{
							"qrcode":res.data.data,
							"payuse":this.selectPayUse,
							"money":this.amount
						}
					});
				}else{
					this.messageHint(res.data.message);
				}
    		})
    		/*
      		if(this.selectedOrderType==1){
    			this.$http.post(window.Host.employee+`/order/predict`,{
				  	"orderName": this.projectName,
				  	"orderType": this.selectedOrderType,
				  	"designerUserId": this.selectDesignerId,
				  	"advisorUserId": this.selectBusinessRepTatId,
				  	"billInfo": {
				    	"billContentType": this.selectPayUse,
				    	"amount": this.amount,
				    	"postscript": this.postscript
				  	},
				}).then((res)=>{
					if(res.data.succ){
						// 点击确定去生成二维码
						this.hideDialog();//关闭加载圈
						this.$router.push({"name":"createTwoDimensionCode",
							query:{
								"qrcode":res.data.data,
								"payuse":this.selectPayUse,
								"money":this.amount
							}
						});
					}else{
						this.messageHint(res.data.message);
					}
				});
			}else{//如果是施工订单
				this.$http.post(window.Host.employee+`/order/predict`,{
				  	"orderName": this.projectName,
				  	"orderType": this.selectedOrderType,
				  	"pmUserId": this.selectProjectConductorId,
				  	"advisorUserId": this.selectBusinessRepTatId,
				  	"billInfo": {
				    	"billContentType": this.selectPayUse,
				    	"amount": this.amount,
				    	"postscript": this.postscript
				  	},
				}).then((res)=>{
					if(res.data.succ){
						// 点击确定去生成二维码
						this.hideDialog();//关闭加载圈
						this.$router.push({"name":"createTwoDimensionCode",
							query:{
								"qrcode":res.data.data,
								"payuse":this.selectPayUse,
								"money":this.amount
							}
						});
					}else{
						this.messageHint(res.data.message);
					}
				});
			}
			*/
    	},

    	//校验项目名称
    	checkProjectName(name){
      		if(name===""||name==" "){
      			this.messageHint("项目名称不能为空");
			    return false;
      		}else if(name.length>20){
      			this.messageHint("项目名称不能超过20个字");
			    return false;
      		}else{
      			return true;
      		}
    	},
    	//校验账单金额
    	checkAmount(amount){
    		var reg=/^\d{1,12}(\.\d{1,2})?$/;
    		if(amount==""||amount==0 || amount==" "){
    			this.messageHint("账单金额不能为0或空");
			    return false;
      		}else if(amount*1>10000000){
      			this.messageHint("账单金额不能超过10000000元");
			    return false;
      		}else if(!reg.test(amount)){
      			this.messageHint("账单金额格式不正确");
      			return false;
      		}else{
      			return true;
      		}
    	},
    	//校验说明
    	checkPostScript(postscript){
    		if(postscript.length>150){
    			this.messageHint("说明内容不能超过150个字");
    			return false;
    		}else{
    			return true;
    		}
    	},

    	//点击确定
      	goTwoDimensionCode(){
      		if(this.checkProjectName(this.projectName) && this.checkAmount(this.amount) && this.checkPostScript(this.postscript)){
				if(this.$route.query.type==2){
					this.sendCreadPreOrder();//创建预订单
				}else{
					//1.获取会话Id
					this.sessionId = this.$route.query.sessionId;
					//2.获取创建者所属公司id/当前会话作品公司id
					this.$http.get(window.Host.employee+"/employee/getEmployeeDetail").then((res)=>{
						if(res.data.succ){
							var role=res.data.data.employeeDto;
							this.createdCompanyId=role.companyId;
		      					this.$http.get(window.Host.employee+`/im/session/${this.sessionId}`).then((res)=>{
								//获取当前会话作品公司id
								if(res.data.succ){
									this.caseCompanyId=res.data.data.relatedCaseInfo.companyId
								}else{
									this.messageHint(res.data.message);
								}

			      				if(this.createdCompanyId!==this.caseCompanyId){
			      					this.messageHint("非本公司业者不能创建订单");
			      				}else{
			      					this.sendCreadOrder();//创建订单
			      				}
							});
	      				}else{
							this.messageHint(res.data.message);
						}
					});
				}
      		}
		}
	},//methods结束
	created(){
			if(this.$route.query.type==2 && localStorage.accessToken){
				this.createPreOrder(2);//创建预订单
			}else if(localStorage.accessToken){
				this.createOrder(1);//创建订单
			}
		},
	watch:{
		selectedOrderType(newVal,oldVal){
			if(this.$route.query.type==2){
				if(this.oneselfRole==1){
					if(newVal==2){
						this.selectProjectConductorId=this.projectConductor[0].employeeUserId;
					}
				}else if(this.oneselfRole==2){
					if(newVal==1){
						this.selectDesignerId=this.designer[0].employeeUserId;
					}
				}else{
					if(newVal==2){
						this.selectProjectConductorId=this.projectConductor[0].employeeUserId;
					}
				}

			}else{
				if(this.oneselfRole==1){
					if(newVal==2){
						//关联项目经理
						this.relevanceProjectConductor(this.sessionId);
						//关联商务代表
						this.relevanceBusinessRepTat(this.sessionId);
					}
				}else if(this.oneselfRole==2){
					if(newVal==1){
						this.relevanceHardSoft(this.sessionId);
						this.relevanceBusinessRepTat(this.sessionId);
					}
				}else{
					if(newVal==2){
						this.relevanceBusinessRepTat(this.sessionId);
						this.relevanceProjectConductor(this.sessionId);
					}
				}
			}

		}
	}
}
</script>
