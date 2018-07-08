<template>
  <div>
    <!--已结束-->
    <group-booking-list-component></group-booking-list-component>
  </div>
</template>
<script>
  import GroupBookingListComponent from './groupBookingActivityListComponent.vue'
  export default {
    name: 'groupBookingActivityListFinished',
    components:{
      GroupBookingListComponent
    }
  }
</script>
