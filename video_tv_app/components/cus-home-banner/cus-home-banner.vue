<template>
	<view>
		<view class="uni-margin-wrap">
			<view class="word_box">
				<image :src="selectData.logo_url" mode="aspectFit" class="logo" v-if="selectData.logo_url"></image>
				<view class="word_title">
					{{selectData.title}}
				</view>
				<view class="word_desc" v-if="selectData.desc">
					{{selectData.desc}}
				</view>
				<view class="topic_label" v-if="selectData.label">
					{{selectData.label}}
				</view>
			</view>
			<unitv-zone id="zoneBanner" class="zone1" :down="zoneDownName" :right="zoneDownName" left="zoneNav"
				up="zoneNav" :item="0" :values="homeBannerData" :column="homeBannerData.length">
				<unitv-scroll>
					<unitv-item v-for="(item,index) in homeBannerData" :item="index" :key="index" class="banner_list"
						hoverClass="banner_list_hover" @hover="hoverItem" selectClass="banner_list_select"
						@click="listClickFun(item)">
						<image :src="item.image_url" mode="aspectFit"></image>
					</unitv-item>
				</unitv-scroll>
			</unitv-zone>
			<view class="mask_left"></view>
			<view class="mask_bottom"></view>
			<swiper class="swiper" circular :indicator-dots="false" :autoplay="false" :current="current">
				<swiper-item v-for="(item , index) in homeBannerData" :key="index">
					<view class="swiper-item">
						<image :src="item.image_url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		name: "cus-home-banner",
		props: {
			homeBannerData: {
				type: Array,
				default: () => []
			},
			zoneDownName: {
				type: String,
				default: "zone2"
			}
		},
		data() {
			return {
				current: 0,
				selectData: {
					logo_url: "",
					title: "",
					desc: ""
				}
			};
		},
		created() {
			this.selectData = this.homeBannerData[0];
		},
		methods: {
			listClickFun(item) {
				uni.navigateTo({
					url: `/pages/player/player`,
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('playerPageData', {
							data: {
								cid: item.cid,
								vid: item.vid,
								data: null
							}
						})
					}
				})
			},
			hoverItem(index) {
				this.selectData = this.homeBannerData[index];
				this.current = index;
			}
		}
	}
</script>

<style scoped lang="scss">
	.uni-margin-wrap {
		width: 100vw;
		height: 320rpx;
		position: relative;

		.swiper {
			position: relative;
			z-index: 1;
		}

		.word_box {
			color: #fff;
			position: absolute;
			z-index: 10;
			top: 100rpx;
			left: 30rpx;

			.logo {
				width: 120rpx;
				height: 40rpx;
			}

			.word_title {
				font-size: 24rpx;
				margin-top: 5rpx;
				font-weight: bold;
				letter-spacing: 2rpx;
			}

			.word_desc {
				font-size: 13rpx;
				margin-top: 5rpx;
				opacity: 0.8;
				letter-spacing: 2rpx;
			}

			.topic_label {
				font-size: 10rpx;
				margin-top: 5rpx;
				opacity: 0.5;
				letter-spacing: 2rpx;
			}
		}

		.swiper,
		.swiper-item {
			width: 100vw;
			height: 320rpx;
			color: #fff;
			background-image: url("../../static/loading1000.gif");
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
		}

		.zone1 {
			height: 60rpx;
			width: 95%;
			white-space: nowrap;
			align-items: center;
			position: absolute;
			bottom: 10rpx;
			left: 0rpx;
			z-index: 10;
			margin: 0rpx 35rpx;
			box-sizing: border-box;
		}

		.banner_list_hover image {
			border: 2rpx solid $uni-color-theme;
			transform: scale(1.1);
			border-radius: 12rpx;
		}

		.banner_list_select {
			padding: 0rpx !important;
			border-radius: 6rpx;
			background-color: $uni-color-theme;

			image {
				opacity: 0.8;
				border: 0rpx;
				width: 100%;
				height: 100%;
			}
		}

		.banner_list {
			width: 100rpx;
			height: 57rpx;
			display: inline-block;
			margin: 10rpx;
			box-sizing: border-box;

			image {
				border-radius: 6rpx;
				width: 100%;
				height: 100%;
				background-image: url("../../static/loading400.gif");
				background-repeat: no-repeat;
				background-position: center;
				background-size: cover;
			}
		}


		image {
			width: 100%;
			height: 100%;
		}

		.mask_left {
			position: absolute;
			width: 100vw;
			height: 320rpx;
			top: 0px;
			left: 0px;
			z-index: 2;
			background: linear-gradient(to top left, rgba(#080922, 0%), rgba(#080922, 100%));
		}

		.mask_bottom {
			position: absolute;
			width: 100vw;
			height: 320rpx;
			top: 0px;
			left: 0px;
			z-index: 3;
			background: linear-gradient(to bottom, rgba(#080922, 0%), rgba(#080922, 100%));
		}
	}

	.banner_list:last-child {
		margin-right: 150rpx;
	}
</style>
