<template>
	<view class="inde_page">
		<unitv-page id="indexPage" :show='true' ref="indexPage" @back="pageBack">
			<view class="today_box">{{today}}</view>
			<view class="nav_box">
				<unitv-zone id="zoneSearch" down="zoneBanner" right="zoneNav">
					<unitv-item hoverClass="search_hover" @click="clickSearch" :item="0" class="search">
						<image src="../../static/search.png" mode="aspectFit"></image>
					</unitv-item>
				</unitv-zone>
				<unitv-zone id="zoneNav" down="zoneBanner" right="zoneBanner" left="zoneSearch" :values="tabDataList"
					:column="tabDataList.length" :autoFous="true" class="zone0">
					<unitv-scroll>
						<unitv-item v-for="(item,index) in tabDataList" :item="index" :key="index" @hover="swtichTab"
							class="zone0_item" selectClass="zone0_item_select" hoverClass="zone0_item_hover"
							:isSelctByClick="false">
							{{item.name}}
						</unitv-item>
					</unitv-scroll>
				</unitv-zone>
			</view>
			<view class="loading" v-if="isShowloading">
				<image src="../../static/loading1000.gif" mode="aspectFit"></image>
			</view>
			<!-- banner -->
			<cus-home-banner :homeBannerData="pc_carousel" v-if="pc_carousel.length>0"
				:zoneDownName="pc_hot_filter.length>0?'zoneClass':'zone0'">
			</cus-home-banner>
			<!-- 分类 -->
			<unitv-zone id="zoneClass" down="zone0" left="zone0" up="zoneBanner" right="zoneBanner"
				:values="pc_hot_filter" :column="pc_hot_filter.length" class="zone4" v-if="pc_hot_filter.length>0">
				<unitv-scroll>
					<unitv-item v-for="(item,index) in pc_hot_filter" :item="index" :key="index" class="zone4_item"
						hoverClass="zone4_item_hover" @click="clickClassItem(item)">
						{{item.label_title}}
					</unitv-item>
				</unitv-scroll>
			</unitv-zone>
			<view class="list_box" v-for="(item,index) in dataList">
				<!-- 为你推荐 -->
				<view class="title">{{item.name}}</view>
				<unitv-zone :id="'zone'+index" :values="item.list" :column="5" class="zone3"
					:up="index===0&&pc_hot_filter.length>0?'zoneClass':index===0&&pc_hot_filter.length===0?'zoneBanner':'zone'+(index-1)"
					:down="'zone'+(index+1)" @scrolltolower="loadMoreFun" @swtichZone="swtichZoneFun">
					<unitv-item v-for="(ele,number) in item.list" :item="number" :key="number" @click="clickItem(ele)"
						class="item_recom" hoverClass="item_recom_hover" @hover="zone3Hover">
						<cus-wntj-item :item="ele" :index="number" :hoverIndex="zoneItemSelectIndex"></cus-wntj-item>
					</unitv-item>
				</unitv-zone>
			</view>
		</unitv-page>

	</view>
</template>

<script>
	import {
		getHomeDataList,
		getDetail
	} from "../../api/index.js";
	import tabDataList from "@/utils/navData.js"
	import { dateFormt } from "@/utils/tool.js"
	export default {
		data() {
			return {
				page_context: null,
				has_next_page: false,
				zoneItemSelectIndex: null,
				tabDataList: tabDataList,
				tabData: {},
				tabIndex: 0,
				page_id: "",
				dataList: [],
				pc_carousel: [],
				pc_hot_filter: [],
				isShowloading: true,
				today: ''
			}
		},
		onReady() {
			this.tabData = this.tabDataList[this.tabIndex];
			this.page_id = this.tabData.unChannelId
			this.getData()
		},
		onShow() {
			if (this.$refs.indexPage) {
				this.$refs.indexPage.showPage()
			}

			this.today = dateFormt()
		},
		methods: {
			getData() {
				this.isShowloading = true
				getHomeDataList({
					page_context: this.page_context,
					page_id: this.page_id
				}).then(res => {
					this.isShowloading = false
					if (res.code == 200) {
						if (!this.page_context) {
							this.dataList = res.data.list || [];
							this.pc_carousel = res.data.pc_carousel || [];
							this.pc_hot_filter = res.data.pc_hot_filter || [];
						} else {
							this.dataList[this.dataList.length - 1].list.push(...res.data.list)
						}
						this.has_next_page = res.data.has_next_page;
						this.page_context = res.data.page_context;
					}
				}).catch(res => {
					this.isShowloading = false
				})
			},
			clickItem(item) {
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
			clickSearch() {
				uni.navigateTo({
					url: "/pages/search/search"
				})
			},
			pageBack(e) {
				uni.showModal({
					title: '提示',
					content: '是否退出',
					success: function(res) {
						if (res.confirm) {
							plus.runtime.quit();
						} else if (res.cancel) {

						}
					}
				});
				return false;
			},
			zone3Hover(index) {
				this.zoneItemSelectIndex = index
			},
			clickClassItem(item) {
				uni.navigateTo({
					url: `/pages/filter/filter?filter_value=${item.filter_value}&page_id=${item.page_id||"channel_list_second_page"}&channel_id=${this.page_id}`
				})
			},
			swtichTab(index) {
				if (this.tabIndex === index) return
				this.tabIndex = index;
				this.tabData = this.tabDataList[index];
				this.page_id = this.tabData.unChannelId;
				this.dataList = [];
				this.pc_carousel = [];
				this.pc_hot_filter = [];
				this.page_context = null;
				this.getData();
			},
			loadMoreFun() {
				if (this.has_next_page) {
					this.getData()
				} else {
					uni.showToast({
						title: "没有更多数据了！",
						duration: 2000
					})
				}

			},
			swtichZoneFun(data) {
				this.zoneItemSelectIndex = null
			}
		}
	}
</script>


<style lang="scss">
	.loading {
		image {
			width: 100vw;
			height: 100vh;
			position: fixed;
			z-index: 10;
			top: 0px;
			left: 0px;
			background-color: #1d1c37;
		}
	}

	.inde_page {
		paddidng-bottom: 50rpx;
		position: relative;

		.loading {
			width: 100vw;
			height: 100vh;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.list_box {
			padding: 0rpx 20rpx;
		}

		.nav_box {
			display: flex;
			position: absolute;
			top: 0rpx;
			left: 0px;
			padding: 20rpx;
			z-index: 130;

			.zone0_item {
				margin: 0px 20rpx;
				color: #fff;
				font-size: 18rpx;
				display: inline-block;
				padding: 2rpx 20rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 50rpx;
			}

			.zone0_item_select {
				color: $uni-color-theme;
				background: rgba(#ec2224, 0.2);

			}

			.zone0_item_hover {
				background: $uni-color-theme;
			}

			.zone0 {
				width: 50%;
				display: flex;
				white-space: nowrap;
				align-items: center;

				.zone0_item:nth-child(1) {
					margin: 0rpx;
				}

			}

			.search {
				width: 20rpx;
				height: 20rpx;
				margin: 0px 20rpx;
				color: #fff;
				font-size: 18rpx;
				padding: 4rpx 10rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 50rpx;

				image {
					width: 20rpx;
					height: 20rpx;
				}
			}

			.search_hover {
				background: $uni-color-theme;
				transform: scale(1.1);
			}

		}

		.zone2 {
			margin: 5rpx;

			.item_hot {
				display: inline-block;
				margin: 10rpx;
			}

			.item_hot_hover {
				transform: scale(1.1);
				border-radius: 12rpx;

				.bg_0 {
					border: 2rpx solid #fc0091;
				}

				.bg_1 {
					border: 2rpx solid #118eff;
				}

				.bg_2 {
					border: 2rpx solid #5300ff;
				}

				.bg_3 {
					border: 2rpx solid #fc4507;
				}

				.bg_4 {
					border: 2rpx solid #2fff08;
				}
			}
		}

		.zone3 {
			width: 100vw;
			margin-left: 10rpx;
		}

		.zone4 {
			width: 100%;
			white-space: nowrap;
			align-items: center;
			margin-left: 10rpx;
			margin-top: 20rpx;

			.zone4_item {
				width: 120rpx;
				height: 80rpx;
				line-height: 80rpx;
				margin: 10rpx;
				background: linear-gradient(to bottom right, rgba(#1eaeeb, 10%), rgba(#213aff, 20%));
				color: #fff;
				font-size: 20rpx;
				text-align: center;
				display: inline-block;
				border-radius: 8rpx;
			}

			.zone4_item_hover {
				transform: scale(1.1);
				background: linear-gradient(to bottom right, rgba(#e80e11, 100%), rgba(#fd7608, 100%));
			}
		}

		.item_recom {
			display: inline-block;
		}

		.item_recom_hover {
			.wntj_item_box {
				transform: scale(1.1);
				border: 2rpx solid $uni-color-theme;
			}

		}
		
		.today_box {
			position: absolute;
			z-index: 100;
			right: 10rpx;
			top: 10rpx;
			color: #fff;
			font-size: 14rpx;
		}

	}
	
</style>
