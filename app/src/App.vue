<template>
	<div id="app" v-cloak>
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>

		<router-view v-if="!$route.meta.keepAlive">
			<!-- 这里是不被缓存的视图组件 -->
		</router-view>

	</div>
</template>
<script>
	export default {
		name: 'app',
	}
</script>
<style>
	[v-cloak] {
		display: none;
	}
</style>