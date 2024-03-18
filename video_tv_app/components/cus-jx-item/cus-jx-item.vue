<template>
	<view :class="'jx_item_box bg_'+index" @click="clickFun">
		<view class="image_box">
			<image :src="item.params.image_url" mode="scaleToFill"></image>
		</view>
		<view class="title ellipsis">
			{{item.params.title}}
		</view>
		<view class="desc ellipsis">
			{{item.params.sub_title}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "cus-jx-item",
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			};
		},
		created() {

		},
		methods: {
			clickFun() {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${this.item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.jx_item_box {
		width: 120rpx;
		height: 140rpx;
		color: #fff;
		overflow: hidden;
		border-radius: 8rpx;

		.image_box {
			width: 120rpx;
			height:80rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				background-image: url("../../static/loading400.gif");
				background-repeat: no-repeat;
				background-position: center;
				background-size: cover;
			}
		}

		.title {
			font-size: 14rpx;
			font-weight: bold;
			margin: 10px 5rpx 0rpx;
		}

		.desc {
			font-size: 12rpx;
			margin-top: 6rpx;
			margin: 4px 5rpx;
		}
	}

	.bg_0 {
		background: linear-gradient(to bottom right, rgba(#fc0091, 100%), rgba(#fc0007, 100%));
	}


	.bg_1 {
		background: linear-gradient(to bottom right, rgba(#118eff, 100%), rgba(#21ffd2, 100%));
	}

	.bg_2 {
		background: linear-gradient(to bottom right, rgba(#5300ff, 100%), rgba(#b300ff, 100%));

	}


	.bg_3 {
		background: linear-gradient(to bottom right, rgba(#fc4507, 100%), rgba(#fd6909, 100%));
	}
	
	.bg_4 {
		background: linear-gradient(to bottom right, rgba(#2fff08, 100%), rgba(#a6ff08, 100%));
	}

</style>
