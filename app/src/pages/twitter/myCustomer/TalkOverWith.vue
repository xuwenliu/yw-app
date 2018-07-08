<template>
	<div>
    	<!--有已洽谈客户-->
    	<MyCustomerList></MyCustomerList>
  </div>
</template>
<script>
import MyCustomerList from '../../../components/MyCustomerList'
export default {
  	name: 'talkOverWith',
  	components:{
    	MyCustomerList
  	}
}
</script>