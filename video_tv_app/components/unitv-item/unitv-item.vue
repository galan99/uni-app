<template>
	<view :id="id" :class="`${selected?selectClass:''} ${hovered?hoverClass:''}`">
		<slot></slot>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex';
	export default {
		name: "unitvPage",
		inject: ['pageId', 'zoneId', 'zoneState', 'zoneItems'],
		props: {
			item: {
				type: Number
			},
			hoverClass: {
				type: String,
				default: 'item-hover'
			},
			selectClass: {
				type: String,
				default: 'item-active'
			},
			isSelctByClick: {
				type: Boolean,
				default: false
			},
			isSelect: {
				type: Boolean,
				default: false
			}
		},
		updated() {
			this.zoneItems[this.item] = this;
		},
		created() {
			this.zoneItems[this.item] = this;
			this.selected=this.isSelect;
		},
		mounted() {
			if (this.zoneState.curZone && this.zoneState.curItem == this.item) {
				this.handleHover();
				this.refreshScroll();
				this.refreshState();
			}
		},
		data() {
			return {
				selected: false,
				hovered: false
			}
		},
		computed: {
			...mapState(['currentZone', 'currentPage']),
			id: function() {
				return this.zoneId + '_' + this.item;
			}
		},
		methods: {
			clientRect(callback) {
				let view = uni.createSelectorQuery().in(this).select("#" + this.id);
				view.boundingClientRect(data => {
					callback(data);
				}).exec();
			},
			refreshScroll() {
				this.clientRect((clientRect) => {
					this.currentPage.RefreshScrollTop(clientRect);
					if (this.zoneState.curScroll != null) {
						this.zoneState.curScroll.RefreshScrollLeft(clientRect);
					}
				});
			},
			refreshState() {
				if (!this.isSelctByClick) {
					if (!this.zoneState.curZone && this.zoneState.curItem == this.item) {
						this.selected = true;
					} else {
						this.selected = false;
					}
				}
				if (this.zoneState.curZone && this.zoneState.curItem == this.item) {
					this.hovered = true;
				} else {
					this.hovered = false;
				}
			},
			handleHover() {
				this.$emit("hover", this.item);
			},
			handleClick() {
				if (this.isSelctByClick) {
					this.zoneItems.forEach(item => {
						item.selected = false
					})
					this.selected = true
				}
				this.$emit("click", this.item);
			}
		},
		watch: {
			hovered: function(newValue) {
				if (newValue != "") {
					this.handleHover();
					this.refreshScroll();
				}
			}
		}
	}
</script>

<style scoped>
</style>
