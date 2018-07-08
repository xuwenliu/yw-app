<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'ShowImages'
}
</script>
<style scoped>
.show-images-box{
  display: flex;
  background:rgba(0,0,0,0.9);
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  flex-direction:column;
  align-items: center;
}

.show-images-box img{
  width: 100%;
}
</style>
