<template>
  <div>
    <!--有已洽谈客户-->
    <consultantsTableView @refreshTab = "refreshTab"></consultantsTableView>
  </div>
</template>
<script>
  import consultantsTableView from './consultsTableView'
  export default {
    name: 'consultantCanSendList',
    methods:{
      refreshTab(){
        this.$emit("refreshTab")
      }
    },
    components:{
      consultantsTableView
    }
  }
</script>
