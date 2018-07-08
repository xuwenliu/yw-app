<template>
  <div>
    <!--有已洽谈客户-->
    <OrderListTableContent></OrderListTableContent>
  </div>
</template>
<script>
  import OrderListTableContent from './orderListTableContent'
  export default {
    name: 'orderSupervisorList',
    components: {
      OrderListTableContent
    }
  }
</script>
