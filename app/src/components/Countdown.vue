<template>
	<div class="getInfobtn">
		<button>{{time | change}}</button>
	</div>
</template>
<script>
	let flag = false
	export default {
		data() {
			return {
				time: '发送验证码',
			}
		},
		props: {
			start: {
				type: Boolean
			}
		},
		watch: {
			start(value, oldvalue) {
				if(value == true) {
					this.countDown();
				}
			}
		},
		created() {
			if(this.start == true) {
				this.countDown();
			}
		},
		methods: {
			countDown() {
				this.time = 60;
				let time = setInterval(() => {
					this.time--;
					if(this.time == 0) {
						this.$emit('countDown');
						this.time = '重新发送';
						flag = true;
						clearInterval(time);
					}
				}, 1000)
			}
		},
		filters: {
			change(value) {
				if(!value) return "";
				if(!isNaN(value)) {
					if(flag == true) {
						return `${value}s`;
					}
					return value + 's';
				} else {
					return value;
				}
			}
		}
	}
</script>