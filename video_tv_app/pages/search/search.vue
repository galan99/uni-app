<template>
	<view>
		<unitv-page id="searchPageRes" :show='true' ref="searchPageRes">
			<view class="box">
				<view class="left">
					<view class="input_box ellipsis">
						<view class="search_default" v-if="searchKey===''">
							<image src="../../static/search.png" mode="aspectFit" class="search_icon"></image>
							搜索
						</view>
						{{searchKey}}
					</view>
					<unitv-zone id="keyZone" class="key_box" :count="28" :column="6" :autoFous="true" up="keyZone"
						down="keyZone" :right="rightZone">
						<unitv-item :class="index>=26?'key_item opt':'key_item'" v-for="(item,index) in keys"
							:item="index" :key="index" hoverClass="key_item_hover" @click="clickKey(index)">
							<view class="">
								{{item}}
							</view>
						</unitv-item>
					</unitv-zone>
				</view>
				<view class="right">
					<view class="word_box" v-if="rightZone==='wordZone'">
						<unitv-zone id="wordZone" :count="wordList.length" :column="1" left="keyZone">
							<view v-if="wordList.length===0" class="res_search">
								<image src="../../static/res_search.png" mode="aspectFit"></image>
								<view>未搜索到相关提示</view>
							</view>
							<unitv-item v-for="(item,index) in wordList" class="word_list" :item="index" :key="index"
								hoverClass="word_hover" @click="getSearchList(item)">
								{{item}}
							</unitv-item>
						</unitv-zone>
					</view>
					<view v-if="videoList.length===0" class="res_search">
						<image src="../../static/empty.png" mode="aspectFit"></image>
						<view>暂无相关影片</view>
					</view>
					<view v-if="rightZone==='listZone'">
						<view class="res_title" v-if="resultNum>0">
							搜索到{{resultNum}}个与“<text>{{searchName}}</text>”相关到结果
						</view>
						<unitv-zone id="listZone" :count="videoList.length" :column="3" left="keyZone"
							@scrolltolower="loadMoreFun" :autoFous="true">
							<unitv-item v-for="(item,index) in videoList" class="list_box" :item="index" :key="index"
								hoverClass="list_hover" @click="clickFun(item)">
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
							</unitv-item>
						</unitv-zone>
					</view>
				</view>
			</view>
		</unitv-page>
	</view>
</template>

<script>
	import {
		getVideoWord,
		getVideoSearchList
	} from "@/api/index.js"
	export default {
		data() {
			return {
				pageNum: 0,
				pageSize: 10,
				searchKey: "",
				keys: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
					"U", "V", "W", 'X', "Y", "Z", "退格", "清除"
				],
				wordList: [],
				rightZone: "",
				videoList: [],
				resultNum: 0,
				searchName: ""
			}
		},
		created() {

		},
		onShow() {
			if (this.$refs.searchPageRes) {
				this.$refs.searchPageRes.showPage()
			}
		},
		methods: {
			clickKey(index) {
				if (index < 26) {
					this.searchKey += this.keys[index];
				} else if (index === 26) {
					this.searchKey = this.searchKey.substr(0, this.searchKey.length - 1)
				} else {
					this.searchKey = "";
					this.wordList = []
				}
				if (this.searchKey !== "") {
					this.rightZone = "wordZone"
					this.getKeyWordList()
				} else {
					this.wordList = [];
					this.rightZone = ""
				}
				this.videoList = []
				this.resultNum = 0
			},
			getKeyWordList() {
				getVideoWord({
					rltnum: 10,
					key: this.searchKey
				}).then(res => {
					this.wordList = res.data || [];
				})
			},
			getSearchList(name) {
				this.searchName = name;
				this.rightZone = "listZone"
				uni.showLoading({
					title: "加载中..."
				})
				getVideoSearchList({
					pageNum: this.pageNum,
					key: this.searchName
				}).then(res => {
					uni.hideLoading()
					let videoList = res.data && res.data.list || [];
					this.videoList.push(...videoList)
					this.resultNum = res.data.resultNum || 0;

				}).catch(res => {
					uni.hideLoading()
				})
			},
			loadMoreFun() {
				if (this.pageNum <= Math.floor(this.resultNum / 20)) {
					this.pageNum++
					this.getSearchList()
				} else {
					uni.showToast({
						title: "已经到底部了！",
						duration: 2000
					});
				}
			},
			clickFun(item) {
				let video_ids = []
				if (item.videoinfos && Array.isArray(item.videoinfos) && item.videoinfos.length > 0) {
					video_ids = item.videoinfos.map((item, index) => {
						return {
							image_url: item.g_img,
							play_title: item.name,
							index: index,
							playUrl: item.url
						}
					})
				}
				uni.navigateTo({
					url: `/pages/player/player`,
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('playerPageData', {
							data: {
								cid: "",
								vid: "",
								data: {
									title: item.g_title,
									desc: item.desc,
									detail_info: item.g_meta + " . " + item.siteName ? item.siteName :
										"",
									g_main_link: item.g_main_link,
									video_ids: video_ids
								}
							}
						})
					}
				})
			}
		}
	}
</script>
<style>
	page {
		background: linear-gradient(to bottom right, rgba(#0a1c66, 10%), rgba(#0a0f32, 20%));
	}
</style>

<style scoped lang="scss">
	.box {
		display: flex;
		height: 100vh;
	}

	.input_box {
		width: 35vw;
		height: 35rpx;
		color: #fff;
		font-size: 14rpx;
		line-height: 35rpx;
		padding: 0rpx 10rpx;
		box-sizing: border-box;
		border-radius: 4rpx;
		margin: 30rpx auto 20rpx;
		background-color: rgba(#716dff, 0.3);

		.search_icon {
			width: 16rpx;
			height: 16rpx;
			margin-right: 2rpx;
		}

		.search_default {
			height: 35rpx;
			display: flex;
			font-size: 12rpx;
			align-items: center;
			opacity: 0.6;
		}
	}

	.left {
		width: 40vw;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
	}

	.right {
		width: 60vw;
		margin-left: 40vw;
		border-radius: 4rpx;
		position: relative;

		.word_box {
			width: 60vw;
			position: absolute;
			z-index: 2;
			top: 0rpx;
			left: 0px;
			height: 100vh;
			background: #3f3d8f;
		}

		.word_list {
			font-size: 14rpx;
			line-height: 25rpx;
			color: #fff;
			padding: 0rpx 20rpx;
			margin-top: 5rpx;

		}

		.word_hover {
			background: #fc5207;
		}

		.res_search {
			margin-top: 80rpx;
			text-align: center;
			font-size: 14rpx;
			color: #fff;
			opacity: 0.5;

			image {
				width: 90rpx;
				height: 90rpx;
			}
		}
	}

	.key_box {
		width: 36vw;
		margin: 10rpx auto;

		.key_item {
			width: 6vw;
			height: 6vw;
			display: inline-block;

			view {
				width: 5vw;
				height: 5vw;
				font-size: 14rpx;
				color: #fff;
				margin: auto;
				text-align: center;
				line-height: 5vw;
				border-radius: 4rpx;
				background-color: rgba(#716dff, 0.3);
			}
		}

		.opt {
			width: 12vw;
			height: 6vw;

			view {
				width: 11vw;
				height: 5vw;
			}
		}

		.key_item_hover {
			view {
				background: rgba(#ec2224, 1);
			}
		}


	}

	.res_title {
		font-size: 12rpx;
		color: #fff;
		margin: 20rpx;

		text {
			color: #fc001e;
		}
	}

	.list_box {
		display: inline-block;
	}

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
			transform: scale(1.1) !important;
			border: 2rpx solid $uni-color-theme !important;
		}

		.word_box {
			background-color: $uni-color-theme !important;
		}
	}
</style>
