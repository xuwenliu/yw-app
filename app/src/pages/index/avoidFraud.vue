<template>
	<div class="">
		<y-header>
			<div class="clickMe" @click="goBack"><span></span></div>XXX必看
			
		</y-header>
	</div>
</template>

<script>
import yHeader from '../../components/Header'
export default {
	name: 'avoidFraud',
	components: {
		yHeader
	},
	data() {
		return {
		
		}
	},
	created() {
		
	},
	methods: {
		goBack() {
			invokeNative({"code": window.jsBridge.CODE_CLOSE});
		}
	},//methods结束
}
</script>

<style scoped lang="less">
	
</style>