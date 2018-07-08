<template>
	<div class="citySelect" @click="returnPopupVisible">
		<mt-popup :closeOnClickModal="false" :position="position" v-model="popupVisible"  style="width: 100%;z-index: 2003;">
    		<mt-picker :slots="slots" @change="onValuesChange" :visible-item-count="5" ></mt-picker>
		</mt-popup>
	</div>
</template>

<script>
const addressJson = require('../assets/js/address.js');//城市列表json数据
export default {
	props:{
		popupVisible:{
			type: Boolean,
      		required: true
		},
		position:{
			type:String,
			default:"bottom"
		}
	},
	data() {
    	return {
    		showResult:"",
    		province:"",//省份
    		city:'',//市
    		countryside:"",//区、乡、镇
    		cityArr:[],//市数组
      		slots: [
		        {
		            flex: 1,
		            defaultIndex: 1,
		            values: [],
		            className: 'slot1',
		            textAlign: 'center'
		        }, 
		        {
		            divider: true,
		            content: '-',
		            className: 'slot2'
		        }, 
		        {
		            flex: 1,
		            values: [],
		            className: 'slot3',
		            textAlign: 'center'
		        }, 
		        {
		            divider: true,
		            content: '-',
		            className: 'slot4'
		        }, 
		        {
		            flex: 1,
		            values: [],
		            className: 'slot5',
		            textAlign: 'center'
		        }
	    	],
    	}
  	},
  	methods: {
    	onValuesChange(picker, values) {
    	  	this.province=picker.getValues()[0];//选中的省份
    	  	this.city=picker.getValues()[1];//选择的城市
    	  	this.countryside=picker.getValues()[2];//选择的区、乡、镇
    	  	var cityData = {
    	  		"province":this.province,
    	  		"city":this.city,
    	  		"countryside":this.countryside
    	  	}
    	  	this.$emit("retrunCity",cityData);
    	},
    	returnPopupVisible(){
    		this.$emit("returnPopupVisible");
    	}
  	},
  	mounted() {
  		addressJson.forEach((value,index)=>{
  			this.slots[0].values.push(value.name);
  		})
  		this.$nextTick(() => {
	        setInterval(() => {//这个是一个初始化默认值的一个技巧
	          	this.slots[0].defaultIndex = 0;
	     	}, 1000);
	    })
  		
  	},
	watch:{
		province:function(newVal,oldVal){
    	  	addressJson.forEach((value,index)=>{
    	  		if(newVal==value.name){
	  				this.cityArr = value.city;
	  			}
    	  	})
    	  	let currentCityArr = this.cityArr.map(({name})=>name);
    	  	this.slots[2].values = currentCityArr;
		},
		city:function(newVal,oldVal){
    	  	this.cityArr.forEach((value,index)=>{
    	  		if(newVal==value.name){
	  				this.slots[4].values = value.area;
	  			}
    	  	})
		}
	},	
}
</script>

<style scoped lang="less">

</style>