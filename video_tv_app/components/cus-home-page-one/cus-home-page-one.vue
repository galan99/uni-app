<template>
	<view class="inde_page">
		<unitv-page id="indexPage" :show='true'>
			<!-- banner -->
			<cus-home-banner :homeBannerData="homeBannerData" v-if="homeBannerData.length>0"></cus-home-banner>
			<!-- 重磅热播 -->
			<view class="title">重磅热播</view>
			<unitv-zone id="zone2" up="zone1" down="zone3" left="zone1" right="zone3" :values="zbHotPlayList"
				:column="5" class="zone2">
				<unitv-item v-for="(item,index) in zbHotPlayList" :item="index" :key="index" @click="clickItem(item)"
					class="item_hot" hoverClass="item_hot_hover">
					<cus-jx-item :item="item" :index="index"></cus-jx-item>
				</unitv-item>
			</unitv-zone>
			<!-- 为你推荐 -->
			<view class="title">为你推荐</view>
			<unitv-zone id="zone3" up="zone2" left="zone2" right="zone3" :values="recommentForYouList" :column="5"
				class="zone3" @scrolltolower="loadMoreFun">
				<unitv-item v-for="(item,index) in recommentForYouList" :item="index" :key="index"
					@click="clickItem(item)" class="item_recom" hoverClass="item_recom_hover" @hover="zone3Hover">
					<cus-wntj-item :item="item" :index="index" :hoverIndex="zoneItemSelectIndex"></cus-wntj-item>
				</unitv-item>
			</unitv-zone>
		</unitv-page>

	</view>
</template>

<script>
	import {
		getHomeBanner
	} from "../../api/index.js";
	export default {
		data() {
			return {
				homeBannerData: [],
				zbHotPlayList: [],
				page_id: "100101",
				page_context: null,
				has_next_page: false,
				recommentForYouList: [],
				zoneItemSelectIndex: null
			}
		},
		mounted() {
			this.getHomeData().then(res=>{
				this.loadMoreFun()
			})
		},
		methods: {
			async getHomeData() {
				let resOne = await getHomeBanner({
					page_id: this.page_id,
					page_context: null
				})
				if (resOne.data) {
					let CardList = resOne.data.CardList;
					let pcSshelves = Array.isArray(CardList) && CardList[0];
					this.page_context = resOne.data.page_context;
					this.has_next_page = resOne.data.has_next_page
					this.homeBannerData = pcSshelves && pcSshelves.children_list && pcSshelves
						.children_list
						.list &&
						pcSshelves.children_list.list.cards || []
					let zbHotPlay = Array.isArray(CardList) && CardList[1];
					this.zbHotPlayList = zbHotPlay && zbHotPlay.children_list && zbHotPlay.children_list
						.list && zbHotPlay.children_list.list.cards || [];
					this.zbHotPlayList = this.zbHotPlayList.length > 5 ? this.zbHotPlayList.splice(0, 5) : this
						.zbHotPlayList
				}

			},
			clickItem(item) {

			},
			zone3Hover(index) {
				this.zoneItemSelectIndex = index
			},
			loadMoreFun() {
				getHomeBanner({
					page_id: this.page_id,
					page_context: this.page_context
				}).then(res => {
					if (res.data) {
						this.page_context = res.data.page_context;
						res.data.CardList.map(item => {
							if (item.children_list && item
								.children_list.list && item.children_list.list.cards && Array.isArray(item
									.children_list.list.cards) && item.type === "pc_video") {
								this.recommentForYouList.push(item.children_list.list
									.cards[0])
							}
						})
					}
				})

			}
		}
	}
</script>


<style lang="scss">
	.zone2 {
		margin: 5rpx;

		.item_hot {
			display: inline-block;
			margin: 11rpx;
		}

		.item_hot_hover {
			transform: scale(1.2);
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

	.inde_page {
		paddidng-bottom: 50rpx;

		.zone3 {
			width: 100vw;
			margin-left: 10rpx;
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
	}
</style>
