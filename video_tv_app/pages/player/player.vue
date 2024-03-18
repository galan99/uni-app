<template>
	<view>
		<unitv-page id="playPage" :show="true" ref="playPage" class="page_box">
			<view class="movie-contain">
				<unitv-video id="player" class="player" :src="playVideoUrl" :autoplay="true" @ended="endedFun"
					:isSHowLoading="isSHowLoading" :pauseImg="coverInfo.image_url" :failStatus="failStatus">
				</unitv-video>
				<view class="movie-inter">
					<view class="movie-title">{{coverInfo.title}}</view>
					<view class="label_box" v-html="coverInfo.detail_info">

					</view>
					<view class="movie-content" v-if="coverInfo.desc">
						{{coverInfo.desc | getStringLen}}
					</view>
					<view>
						<unitv-zone id="btn-zone" :autoFous="true" :column="2" down="list-zone" :item="0"
							:values="[0,1]" class="btn-zone">
							<unitv-item :item="0" class="fullscreen-btn" @click="switchFullScreen"
								hoverClass="btn-hover">
								<view class="btn btn_play">全屏播放</view>
							</unitv-item>
							<unitv-item :item="1" class="favicon-btn" hoverClass="btn-hover" @click="swtichLine">
								<view class="btn btn_swtich">切换路线</view>
							</unitv-item>
						</unitv-zone>
					</view>
				</view>
			</view>
			<unitv-zone id="list-zone" class="list-zone" up="btn-zone" :values="video_ids" :column="video_ids.length"
				v-if="video_ids.length>1">
				<view class="jj_title">
					剧集与更新
				</view>
				<unitv-scroll @scroll="scrollFun">
					<unitv-item v-for="(item,index) in video_ids" :item="index" :key="index"
						:class="playIndex===index?'play_select':'list' " hoverClass="list-hover"
						@click="openVideo(index)">
						<image src="../../static/play.png" mode="aspectFit" v-if="playIndex===index"></image> <text
							v-else>{{index | add}}</text>
					</unitv-item>
				</unitv-scroll>
			</unitv-zone>
		</unitv-page>
	</view>
</template>

<script>
	import {
		getVideoDetail,
		getVideoList,
		getVideoUrl
	} from "@/api/index.js";
	export default {
		data() {
			return {
				status: 0,
				category_map: [],
				coverInfo: {},
				video_ids: [],
				isSHowLoading: true,
				playIndex: 0,
				htmlPath: "",
				htmlUrl: "",
				cid: "",
				lineIndex: 0,
				playVideoUrl: "",
				failStatus: 0,
				page_context: ""
			}
		},
		onLoad(params) {
			let that = this;
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('playerPageData', function(data) {
				let param = data.data;
				that.cid = param.cid;
				that.vid = param.vid || "";
				if (param.data) {
					if (param.data.g_main_link) {
						that.htmlUrl = param.data.g_main_link
					} else {
						that.htmlUrl = param.data.video_ids[0].playUrl
					}
					that.coverInfo = param.data;
					that.video_ids = param.data.video_ids;
					that.isSHowLoading = false;
				} else {
					if (param.cid) {
						that.htmlPath = "https://v.qq.com/x/cover/"
						that.htmlUrl = that.htmlPath + param.cid + ".html"
					} else {
						that.htmlPath = "https://v.qq.com/x/page/"
						that.htmlUrl = that.htmlPath + param.vid + ".html"
					}

					that.getDetail();
					that.getVideoList();
				}
				that.getPlayUrlFun()
			})
		},
		onReady() {
			this.viderContext = uni.createVideoContext("player");
		},
		filters: {
			getStringLen(text, length = 80) {
				if (text.length <= length) {
					return text
				} else {
					return text.substr(0, length) + "..."
				}

			},
			add(text) {
				return text++
			}
		},
		methods: {
			getDetail() {
				this.failStatus = 0
				getVideoDetail({
					cid: this.cid,
					vid: this.vid
				}).then(res => {
					this.isSHowLoading = false;
					if (res.code === 200) {
						this.coverInfo = res.data
					} else {
						this.failStatus = 2
					}
				}).catch(res => {
					this.isSHowLoading = false;
					this.failStatus = 2
				})
			},
			getVideoList() {
				getVideoList({
					cid: this.cid,
					page_context: this.page_context
				}).then(res => {
					if (res.code == 200) {
						let list = res.data.list;
						list.forEach(item => {
							this.video_ids.push({
								...item,
								playUrl: this.htmlPath + this.cid + "/" + item.vid + ".html"
							})
						})
						this.page_context = res.data.page_context;
					}
				})
			},
			switchFullScreen() {
				this.viderContext.requestFullScreen();
			},
			scrollFun(data) {
				if (data.left - data.oldLeft >= 0 && this.page_context != "") {
					this.getVideoList()
				}
			},
			getPlayUrlFun() {
				this.failStatus = 0;
				this.playVideoUrl = ""
				uni.showLoading({
					title: '加载中'
				});
				getVideoUrl({
					url: this.htmlUrl,
					line: this.lineIndex
				}).then(res => {
					if (res.code == 200) {
						this.playVideoUrl = res.data;
					} else {
						uni.showToast({
							title: res.message,
							duration: 2000
						});
						this.failStatus = 1
					}
					uni.hideLoading();
				}).catch(res => {
					uni.hideLoading();
					this.failStatus = 1
				})
			},
			swtichLine() {
				this.lineIndex++
				this.openVideo(this.playIndex)
			},
			openVideo(index) {
				this.playIndex = index;
				if (this.video_ids.length > 0) {
					this.htmlUrl = this.video_ids[index].playUrl;
				}
				this.getPlayUrlFun()
			},
			endedFun() {
				if (this.playIndex >= this.video_ids.length - 1) {
					uni.showToast({
						title: "已经是最后一集了！",
						duration: 2000
					});
				} else {
					this.playIndex++;
					this.openVideo(this.playIndex)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.page_box {
		margin: 20rpx;

	}

	.movie-contain {
		display: flex;
		flex-direction: row;

	}

	.player {
		width: 50%;
		height: 200rpx;
	}

	.label_box {
		color: #fff;
		font-size: 12rpx;
	}

	.movie-title {
		font-size: 20rpx;
		font-weight: bold;
		color: #fff;
		margin: 5rpx 0rpx 6rpx;
	}

	.movie-year {
		padding-left: 5rpx;
	}

	.movie-inter {
		width: 50%;
		margin-left: 30rpx;
	}

	.movie-year,
	.movie-info,
	.movie-content {
		margin-bottom: 10rpx;
		font-size: 12rpx;
		color: #999;
		margin-top: 10rpx;
		height: 60rpx;
	}

	.btn-zone {
		display: flex;
		flex-direction: row;
	}

	.btn {
		width: 100rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		font-size: 14rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		color: #fff;
		margin-right: 30rpx;
		border-radius: 6rpx;
	}

	.jj_title {
		font-size: 16rpx;
		color: #fff;
	}

	.btn_play {
		background: linear-gradient(to bottom right, rgba(#fc4507, 100%), rgba(#fd6909, 100%));
	}

	.btn_swtich {
		background: linear-gradient(to bottom right, rgba(#118eff, 100%), rgba(#21ffd2, 100%));
	}

	.btn-hover .btn {
		background: $uni-color-theme;
		transform: scale(1.2);
	}

	.list-zone {
		width: 95%;
		white-space: nowrap;
		margin-top: 30rpx;
		outline: none;
	}

	.list {
		width: 30rpx;
		height: 30rpx;
		font-size: 14rpx;
		font-weight: bold;
		text-align: center;
		line-height: 30rpx;
		border: 1rpx solid rgba($color: #fff, $alpha: 0.4);
		color: rgba($color: #fff, $alpha: 1);
		border-radius: 4rpx;
		margin-right: 10rpx;
		margin-top: 10rpx;
		background-color: rgba($color: #fff, $alpha: 0.1);
		display: inline-block;
		box-sizing: border-box;
	}

	.play_select {
		width: 30rpx;
		height: 30rpx;
		text-align: center;
		line-height: 30rpx;
		border: 1rpx solid $uni-color-theme;
		border-radius: 4rpx;
		margin-right: 10rpx;
		margin-top: 10rpx;
		color: rgba($color: #fff, $alpha: 1);
		background-color: rgba($color: #ec2224, $alpha: 0.1);
		display: inline-block;
		box-sizing: border-box;

		image {
			width: 10rpx;
			height: 10rpx;
		}
	}

	.list-hover {
		background-color: $uni-color-theme;
		border: 1rpx solid $uni-color-theme;
	}

	.list:last-child {
		margin-right: 50rpx;
	}

	.item {
		width: 82rpx;
		height: 30rpx;
		margin: 5rpx;
		text-align: center;
		background-color: #6b6b6b;
		border-radius: 5rpx;
		align-items: center;
		display: flex;
		justify-content: center;
		font-size: 12rpx;
	}

	.item-hover {
		zoom: 0;
		background: #DD524D
	}
</style>
