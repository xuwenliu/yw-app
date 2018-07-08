<template>
  <div>
    <!--进行中-->
    <group-booking-list-component></group-booking-list-component>
  </div>
</template>
<script>
  import GroupBookingListComponent from './groupBookingActivityListComponent.vue'
  export default {
    name: 'groupBookingActivityListUnderway',
    components:{
      GroupBookingListComponent
    }
  }
</script>
