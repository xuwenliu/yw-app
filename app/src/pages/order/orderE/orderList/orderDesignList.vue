<template>
  <div>
    <!--有已洽谈客户-->
    <OrderListTableContent></OrderListTableContent>
  </div>
</template>
<script>
  import OrderListTableContent from './orderListTableContent'
  export default {
    name: 'orderDesignList',
    components:{
      OrderListTableContent
    }
  }
</script>
