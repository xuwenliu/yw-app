<template>
	<div class="footer">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'footer'
	}
</script>
<style scoped>
	.footer {
		width: 100%;
		height: 1.2rem;
		background-color: #282828;
		line-height: 1.2rem;
		text-align: center;
		position: fixed;
		bottom: 0;
		z-index: 999;	
	}
</style>