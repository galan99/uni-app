<template>
	<view class="wntj_item_box">
		<view class="word_box" v-if="hoverIndex===index">
			<view class="title ellipsis">
				{{item.title}}
			</view>
			<view class="desc ellipsis">
				{{item.desc}}
			</view>
		</view>
		<image :src="item.image_url" mode="scaleToFill"></image>
	</view>
</template>

<script>
	export default {
		name: "wntj_item",
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			},
			hoverIndex: {
				type: Number,
				default: null
			}
		},
		data() {
			return {

			};
		},
		mounted() {},
		methods: {

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
			background-color: $uni-color-theme;
			z-index: 10;
		}
	}
</style>
