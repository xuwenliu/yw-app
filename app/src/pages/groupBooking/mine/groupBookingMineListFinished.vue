<template>
  <div>
    <!--已结束-->
    <group-booking-list-component></group-booking-list-component>
  </div>
</template>
<script>
  import GroupBookingListComponent from './groupBookingMineListComponent.vue'
  export default {
    name: 'groupBookingMineListFinished',
    components:{
      GroupBookingListComponent
    }
  }
</script>
