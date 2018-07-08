<template>
  <div>
    <mineCustomerList @refreshTab = "refreshTab"></mineCustomerList>
  </div>

</template>
<script>

  import mineCustomerList from '../../components/mineCustomerList'

  export default{
    name: 'done',
    methods:{
      refreshTab(){
        this.$emit("refreshTab")
      }
    },
    components: {
      mineCustomerList
    }
  }

</script>
