<template>
	<video id="player" :class="clazz" :src="src" :autoplay="autoplay" :enable-play-gesture="false"
		:enable-progress-gesture="false" :show-center-play-btn="false" :show-progress="true" @play="status=1"
		@pause="status=0" @timeupdate="timeupdate" @fullscreenchange="fullscreenchange" :poster="pauseImg"
		@ended="$emit('ended')" @error="errorFun">
		<cover-image src="../../static/loading_1920.gif" class="loading_box" v-if="isSHowLoading"></cover-image>
		<!-- <cover-image src="../../static/fail_01.png" class="fail_img" v-if="failStatus===1"></cover-image>
		<cover-image src="../../static/fail_02.png" class="fail_img" v-if="failStatus===2"></cover-image>
		<cover-image src="../../static/fail_03.png" class="fail_img" v-if="failStatus===3"></cover-image> -->
	</video>
</template>

<script>
	export default {
		inject: ['pageId', 'pageState'],
		watch: {

		},
		props: {
			clazz: {
				type: String
			},
			src: {
				type: String
			},
			autoplay: {
				type: Boolean,
				default: true
			},
			showProgress: {
				type: Boolean,
				default: false
			},
			isSHowLoading: {
				type: Boolean,
				default: false
			},
			pauseImg: {
				type: String,
				default: "../../static/pause_img.jpg"
			},
			failStatus: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				status: 0,
				currentTime: 0,
				fullScreen: false,
			};
		},
		created() {
			this.viderContext = uni.createVideoContext("player");
			uni.$on('keyDown', (data) => {
				this.keyDown(data);
			});
		},
		methods: {
			keyDown(Arrow) {
				console.log("监测到按键：" + Arrow)
				switch (Arrow) {
					case 'KeyLeft': {
						var time = parseInt(this.currentTime - 15, 10);
						this.viderContext.seek(time < 0 ? 0 : time)
					}
					break;
				case 'KeyRight': {
					var time = parseInt(this.currentTime + 15, 10);
					this.viderContext.seek(time);
				}
				break;
				case 'KeyEnter': {
					this.clickVideo();
				}
				break;
				};
			},
			clickVideo() {
				if (this.status) {
					this.viderContext.pause();
					this.viderContext.showStatusBar();
				} else {
					this.viderContext.play();
					this.viderContext.hideStatusBar();
				}
			},
			timeupdate: function(e) {
				this.currentTime = e.detail.currentTime;
			},
			fullscreenchange: function(e) {
				this.fullScreen = e.detail.fullScreen;
				this.pageState.handleEvent = e.detail.fullScreen;
				if (this.fullScreen) {
					this.viderContext.play();
				}
			},
			errorFun() {
				this.$emit("errorFun")
			},
		}
	}
</script>

<style>
	.controls-play.img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 50%;
		left: 0%;
		transform: translateY(-50%);
	}

	.loading_box {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0px;
		top: 0px;
		z-index: 100;

	}

	.fail_img {
		width: 100%;
		height: 100%;
	}
</style>
