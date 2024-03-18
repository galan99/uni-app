<template>
	<scroll-view scroll-x="true" :scroll-left="scrollLeft" @scroll="scroll">
		<slot></slot>
	</scroll-view>
</template>

<script>
	export default {
		inject: ['pageId', 'zoneId', 'zoneState'],
		watch: {

		},
		data() {
			return {
				scrollLeft: 0,
				old: {
					scrollLeft: 0
				},
				windowWidth: null
			};
		},
		created() {
			this.zoneState.curScroll = this;
			uni.getSystemInfo({
				success: (res) => {
					this.windowWidth = res.windowWidth;
				}
			});
		},
		methods: {
			scroll: function(e) {
				this.$emit("scroll", {
					oldLeft: this.old.scrollLeft,
					left: e.detail.scrollLeft,
				})
				this.old.scrollLeft = e.detail.scrollLeft;

			},
			RefreshScrollLeft(clientRect) {
				var left = clientRect.left;
				if (left > 0) {
					left = clientRect.right;
				}
				if (left > this.windowWidth) {
					var left1 = this.old.scrollLeft + (left - this.windowWidth + 360);
					this.scrollLeft = left1
				} else if (left < 0) {
					this.scrollLeft = this.old.scrollLeft + (left - 380);
				}

			}
		}
	}
</script>

<style>

</style>
