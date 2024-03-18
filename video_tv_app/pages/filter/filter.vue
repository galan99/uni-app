<template>
	<view>
		<unitv-page id="filterPage" :show='true' ref="filterPage">
			<unitv-zone :id="'zone'+index" :up="'zone'+(index-1)" :left="'zone'+(index-1)"
				:down="index===filterKeys.length-1?'zonelist':'zone'+(index+1)" :values="filterObj[item]"
				:right="index===filterKeys.length-1?'zonelist':'zone'+(index+1)" :column="filterObj[item].length"
				class="filter_box" v-for="(item,index) in filterKeys" :autoFous="index===0">
				<unitv-scroll>
					<unitv-item v-for="(ele,num) in filterObj[item]" :item="num" :key="num" class="filter_box_text"
						hoverClass="filter_box_text_hover" selectClass="select" @click="filterFun(item,num)"
						:isSelctByClick="true" :isSelect="ele.isSelect">
						{{ele.option_name}}
					</unitv-item>
				</unitv-scroll>
			</unitv-zone>
			<view class="empty" v-if="channel_list_poster.length===0">
				<image src="../../static/empty.png" mode="aspectFit"></image>
				<view>暂无相关影片</view>
			</view>
			<unitv-zone id="zonelist" :up="'zone'+(filterKeys.length-1)" :left="'zone'+(filterKeys.length-1)"
				class="list_box" :values="channel_list_poster" :column="5" @swtichZone="zoneItemSelectIndex=null"
				@scrolltolower="loadMoreFun">
				<unitv-item v-for="(item,index) in channel_list_poster" :item="index" :key="index"
					@hover="zonelistHover" hoverClass="item_hover" @click="clickItem(item)">
					<cus-wntj-item :item="item" :hoverIndex="zoneItemSelectIndex" :index="index"></cus-wntj-item>
				</unitv-item>
			</unitv-zone>
		</unitv-page>
	</view>
</template>

<script>
	import {
		getFilterList,
		getFilterVideo
	} from "@/api/index.js"
	export default {
		data() {
			return {
				channel_id: "",
				filter_params: "",
				page_index: 0,
				page_id: "",
				filterObj: {},
				filterKeys: [],
				channel_list_poster: [],
				has_next_page: true,
				zoneItemSelectIndex: null
			}
		},
		onLoad(params) {
			this.channel_id = params.channel_id;
			this.filter_params = params.filter_value;
			this.page_id = params.page_id;
			this.getFilterCondition()
		},
		onShow() {
			if (this.$refs.filterPage) {
				this.$refs.filterPage.showPage()
			}
		},
		onReachBottom() {
			if (this.has_next_page) {
				this.page_index++;
				this.getDataList()
			} else {
				uni.showToast({
					title: "没有更多内容了",
					duration: 2000
				});
			}
		},
		methods: {
			getFilterCondition() {
				getFilterList({
					page_index: this.page_index,
					channel_id: this.channel_id,
					page_id: this.page_id,
					filter_params: this.filter_params,
				}).then(res => {
					if (res.code == 200) {
						let list = res.data
						list.forEach(item => {
							if (!this.filterObj[item.filter_key]) {
								this.filterObj[item.filter_key] = [{
									option_name: item.option_name,
									filter_key: item.filter_key,
									option_value: item.option_value,
									isSelect: false
								}]
							} else {
								this.filterObj[item.filter_key].push({
									option_name: item.option_name,
									filter_key: item.filter_key,
									option_value: item.option_value,
									isSelect: false
								})
								this.filterObj[item.filter_key][0].isSelect = true;
							}

						})
						this.filterKeys = Object.keys(this.filterObj)
						let paramList = this.filter_params.split("=");
						if (Array.isArray(paramList) && paramList.length === 2) {
							let index = this.filterObj[paramList[0]] && this.filterObj[paramList[0]].findIndex(
								item =>
								item.option_value == paramList[1])
							if (index > -1) {
								this.filterFun(paramList[0], index)
							} else {
								this.getDataList()
							}
						} else {
							this.getDataList()
						}
					}
				})
			},
			filterFun(type, index) {
				this.filterObj[type].forEach((item, index) => {
					this.filterObj[type][index].isSelect = false;
				})
				this.filterObj[type][index].isSelect = true;
				this.$forceUpdate()
				let filter_params = ""
				this.filterKeys.forEach(item => {
					let isSelectData = this.filterObj[item].find(child => child.isSelect)
					filter_params += `${item}=${isSelectData.option_value}&`
				})
				this.filter_params = filter_params;
				this.channel_list_poster = []
				this.page_index = 0;
				this.getDataList()
			},
			getDataList() {
				getFilterVideo({
					page_index: this.page_index,
					page_id: this.page_id,
					channel_id: this.channel_id,
					filter_params: this.filter_params
				}).then(res => {
					if (res.code === 200) {
						this.channel_list_poster.push(...res.data.list);
						this.has_next_page = res.data.has_next_page
					}
				})
			},
			zonelistHover(index) {
				this.zoneItemSelectIndex = index
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
			loadMoreFun() {
				if (this.has_next_page) {
					this.page_index++
					this.getDataList();
				} else {
					uni.showToast({
						title: "没有更多数据了！",
						duration: 2000
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">
	.filter_box {
		// display: flex;
		// flex-wrap: wrap;
		width: 100%;
		white-space: nowrap;
		margin-top: 10rpx;

		.filter_box_text {
			display: inline-block;
			font-size: 12rpx;
			color: #fff;
			margin: 3rpx 10rpx;
			padding: 2rpx 10rpx;
			outline: none;
			border-radius: 20rpx;
		}

		.filter_box_text_hover {
			background-color: #ec2224 !important;
			color: #fff !important;
		}

		.select {
			background-color: rgba(#ec2224, 0.2);
			color: #ec2224;
		}
	}

	.list_box {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
	}

	.tip {
		margin-top: 6rpx;
		margin-bottom: 20rpx;
		color: rgba(255, 255, 255, 0.5);
		font-size: 14rpx;
		text-align: center;
	}

	.item_hover {
		.wntj_item_box {
			transform: scale(1.1);
			border: 2rpx solid $uni-color-theme;
		}

	}

	.empty {
		margin: 60rpx auto;
		text-align: center;
		color: #fff;
		font-size: 14rpx;
		opacity: 0.9;

		image {
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
