<template>
  <div>
    <!--进行中-->
    <group-booking-list-component></group-booking-list-component>
  </div>
</template>
<script>
  import GroupBookingListComponent from './groupBookingMineListComponent.vue'
  export default {
    name: 'groupBookingMineListUnderway',
    components:{
      GroupBookingListComponent
    }
  }
</script>
