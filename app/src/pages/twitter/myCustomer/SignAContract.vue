<template>
	<div>
	  	<!--有已签约客户-->
	  	<MyCustomerList></MyCustomerList>
  </div>
</template>
<script>
import MyCustomerList from '../../../components/MyCustomerList'
export default {
  	name: 'signAContract',
  	components:{
   		MyCustomerList
  	}
}
</script>