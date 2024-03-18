<template>
	
	<scroll-view v-show="current" scroll-y="true" :style="{height:windowHeight+'px'}" ref="page" :scroll-top="scrollTop" @scroll="scroll">
		<view @click="whole.onClick" id="onClick"></view>
		<slot></slot>
	</scroll-view>
	<!-- <unitv-transition :duration="500" :mode-class="['fade']" :styles="transfromClass" :show="current">
	</unitv-transition> -->
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';
	export default {
		name: "unitvPage",
		props: {
			id: {
				type: String,
				required: true
			},
			prePageId: {
				type: String
			},
			show:{
				type:Boolean,
				default:false
			},
			handleEvent:{
				type:Boolean,
				default:false
			}
		},
		provide() {
			return {
				pageId: this.id,
				pageState: this.pageState
			}
		},
		created() {
			if(this.show){
			this.switchPage(this);
			}
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight;
				}
			});
			
		},
		mounted() {
			this.pushPage(this);
		},
		computed: {
			...mapState(['currentZone','currentPage','allPages']),
			current:function(){
				return this.currentPage==this;
			}
		},
		data() {
			return {
				key: '',
				windowHeight: null,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				Zone: [],
				pageState: {
					curZoneId: "",
					handleEvent:this.handleEvent
				},
				transfromClass: {
					'position': 'fixed',
					'bottom': 0,
					'top': 0,
					'left': 0,
					'right': 0,
					/* #ifndef APP-NVUE */
					'display': 'flex',
					/* #endif */
					'justify-content': 'center',
					'align-items': 'center'
				}
			}
		},
		methods: {
			...mapMutations(['switchPage', 'switchZone','pushPage']),
			showPage(){
				this.switchPage(this);
				this.switchZone(this.Zone[this.pageState.curZoneId]);
				this.Zone[this.pageState.curZoneId].refreshItem();
				return true;
			},
			pushZone(zone) {
				this.Zone[zone.id] = zone;
			},
			keyCodeClick(keyCode) {
				this.key = keyCode;
				if(this.pageState.handleEvent){
					uni.$emit("keyDown",keyCode);
				}else{
				//根据按键，调用相应函数
				switch (keyCode) {
					case 'KeyUp':
						this.evtArrow('up');
						break;
					case 'KeyDown':
						this.evtArrow('down');
						break;
					case 'KeyLeft':
						this.evtArrow('left');
						break;
					case 'KeyRight':
						this.evtArrow('right');
						break;
					case 'KeyEnter':
						this.evtEnter();
						break;
					case 'KeyBack':
						this.evtBack();
						break;
				};
				}
			},
			evtArrow:function(Arrow){
				var zone = this.currentZone;
				zone.evtArrow(Arrow);
			},
			evtEnter:function(){
				this.currentZone.evtEnter();
			},
			evtBack:function(){
				this.$emit("back");
				this.key = "KeyBack";
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			ChangeZone(zoneId) {
				var zone = this.Zone[zoneId];
				if (zone) {
					this.currentZone.zoneState.curZone = false;
					this.pageState.curZoneId = zoneId;
					zone.zoneState.curZone = true;
					this.switchZone(this.Zone[zoneId]);
					this.Zone[zoneId].refreshItem();
				}
			},
			RefreshScrollTop(clientRect) {
				var top = clientRect.top;
				if (top > 0) {
					top = clientRect.bottom;
				}
				if (top > this.windowHeight) {
					var top1=this.old.scrollTop + (top - this.windowHeight + 10);
					this.scrollTop = top1
				} else if (top < 0) {
					this.scrollTop = this.old.scrollTop + (top - 20);
				}

			}
		},
		watch: {
			handleEvent:function(val){
				this.pageState.handleEvent=val;
			}
			
		}
	}
</script>
<script module="whole" lang="renderjs">
	let code;
	let KeyName = {
		19: 'KeyUp',
		38: 'KeyUp', //Keyboard
		20: 'KeyDown',
		40: 'KeyDown', //Keyboard
		21: 'KeyLeft',
		37: 'KeyLeft', //Keyboard
		22: 'KeyRight',
		39: 'KeyRight', //Keyboard
		23: 'KeyEnter',
		13: 'KeyEnter', //Keyboard
		4: 'KeyBack',
		18: 'KeyBack', //Keyboard Alt键
		27: 'KeyBack', //Keyboard ESC
		24: 'KeyBack', //Keyboard ESC
		66: 'KeyEnter',
		111: 'KeyBack'
	};
	export default {
		mounted() {
			//全局监听按键输入
			window.document.onkeydown = function(evt) {
				evt = evt || window.event;
				
				var KeyCode = evt.which || evt.keyCode;
				//document.getElementById("onClick").click();
				code = KeyName[KeyCode];
				if(code!='KeyBack'){
					evt.preventDefault();
				}
				if(code!=undefined){
				document.getElementById("onClick").click();
				}
			}

		},
		methods: {
			onClick(event, ownerInstance) {
				// 调用 service 层的方法
				ownerInstance.callMethod('keyCodeClick', code);

			}
		}
	}
</script>
<style scoped>
	.log-key-view {
		position: fixed;
		right: 0;
		color: #FFFFFF;
		font-size: 20rpx;
		background: #007AFF;
		top: 0;
		z-index: 999;
	}
</style>
