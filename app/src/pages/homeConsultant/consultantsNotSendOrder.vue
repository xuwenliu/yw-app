<template>
  <div>
    <!--有已洽谈客户-->
    <OrderListTableContent  @refreshTab = "refreshTab"></OrderListTableContent>
  </div>
</template>
<script>
  import OrderListTableContent from './consultsTableView'
  export default {
    name: 'consultantNotSendList',
    methods:{
      refreshTab(){
        this.$emit("refreshTab")
      }
    },
    components:{
      OrderListTableContent
    }
  }
</script>
