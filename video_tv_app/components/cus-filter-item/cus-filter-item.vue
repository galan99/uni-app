<template>
	<view class="wntj_item_box">
		<view class="word_box">
			<view class="title ellipsis">
				{{item.g_title||""}}
			</view>
			<view class="desc ellipsis">
				{{item.desc||""}}
			</view>
		</view>
		<image :src="item.g_img" mode="scaleToFill" v-if="item.g_img"></image>
	</view>
</template>

<script>
	export default {
		name: "cus-filter-item",
		props: {
			item: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				isHover: false
			};
		},
		mounted() {
			console.log(this.item)
		},
		methods: {
			clicfun() {}
		}
	}
</script>

<style lang="scss">
	.wntj_item_box {
		width: 120rpx;
		height: 160rpx;
		color: #fff;
		overflow: hidden;
		border-radius: 8rpx;
		position: relative;
		margin: 10rpx;
		display: inline-block;

		image {
			width: 100%;
			height: 100%;
			background-image: url("../../static/loading500.gif");
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
		}

		.title {
			font-size: 14rpx;
			font-weight: bold;
			margin: 10px 5rpx 0rpx;
			width: 110rpx;
		}

		.desc {
			font-size: 12rpx;
			margin-top: 6rpx;
			margin: 4px 5rpx;
			width: 110rpx;
		}

		.word_box {
			position: absolute;
			top: 100rpx;
			left: 0rpx;
			width: 160rpx;
			height: 100rpx;
			background-color: rgba(#716dff, 0.3);
			z-index: 10;
		}
	}

	.list_hover {
		.wntj_item_box {
			transform: scale(1.1);
			border: 2rpx solid $uni-color-theme;
		}

		.word_box {
			background-color: $uni-color-theme;
			;
		}
	}
</style>
