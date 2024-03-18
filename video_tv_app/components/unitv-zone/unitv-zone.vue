<template>
	<view :id="id">
		<slot></slot>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		name: "unitvPage",
		inject: ['pageId', 'pageState'],
		props: {
			id: { // Zone Id
				type: String,
				required: true
			},
			up: { // Zone切换时上一Zone Id
				type: String
			},
			down: { // Zone切换时下一Zone Id
				type: String
			},
			left: { // Zone切换时左一Zone Id
				type: String
			},
			right: { // Zone切换时右一Zone Id
				type: String
			},
			item: { // Zone当前焦点item索引
				type: Number,
				default: 0
			},
			prevZone: { // Zone改变后的上一个Zone Id
				type: String
			},
			row: { // Zone的item总行数
				type: Number,
				default: 1
			},
			column: { // Zone的item总列数
				type: Number,
				default: 1
			},
			defaultBehavior: {
				type: Boolean,
				default: true
			},
			autoFous: {
				type: Boolean,
				default: false
			},
			values: {
				type: Array,
				default: () => []
			},
			count: {
				type: Number,
				default: 0
			}
		},
		provide() {
			return {
				zoneId: this.id,
				zoneState: this.zoneState,
				zoneItems: this.items
			}
		},
		created() {
			//console.log(this.pageId)
			if (this.autoFous) {
				this.pageState.curZoneId = this.id;
				this.zoneState.curZone = true;
				this.focus = true;
				this.switchZone(this);
			}
			this._switchItem(this.item);
			this.currentPage.pushZone(this);
		},
		mounted() {

		},
		computed: {
			...mapState(['currentZone', 'currentPage']),
			size: function() {
				if (this.count != 0) {
					return this.count;
				} else if (this.values.length != 0) {
					return this.values.length;
				} else {
					return this.items.length;
				}
			},
			rows: function() {
				if (this.row > 1) {
					return this.row;
				}
				return Math.ceil(this.size / this.column)
			}
		},
		data() {
			return {
				citem: 0,
				crow: 0, // Zone的当前行
				prevItem: 0, // item改变后的上一item索引
				focus: false,
				items: [], // Zone的所有item数组集合
				zoneState: {
					curItem: this.citem,
					curZone: this.focus,
					curScroll: null
				},
				StepSeq: 0
			}
		},
		methods: {
			...mapMutations(['switchZone']),
			_switchItem: function(item, oldItem) {
				this.citem = item;
				this.zoneState.curItem = item;
				try {
					this.refreshItem();
					if (oldItem != undefined) {
						this.items[oldItem].refreshState();
					}
				} catch (e) {}
			},
			refreshItem: function() {
				this.items[this.citem].refreshState();
			},
			evtArrow: function(Arrow) {
				var self = this;
				//this._switchItem(this.citem+1);
				var oldItem = this.citem || 0;
				var item = this.citem || 0;
				var steps = this.rows * this.column;
				var Row = Math.floor(item / this.column);
				var Border = this[Arrow];
				var cRow = this.crow;
				switch (Arrow) {
					case 'left':
						item -= 1;
						if (Math.floor(item / this.column) != Row) {
						    item = item - steps;
						}
						break;
					case 'right':
						item += 1;
						if (Math.floor(item / this.column) != Row) {
						    item = item + steps;
						}
						break;
					case 'up':
						item -= this.column;
						this.crow = cRow - 1;
						break;
					case 'down':
						item += this.column
						this.crow = cRow + 1;
						if (item >= this.size - 1 && this.crow === this.rows - 1) {
							item = this.size - 1
						}

						break;
				};
				if (item >= 0 && item <= this.size - 1) {
					if (item + this.StepSeq * steps + 1 > this.size) {
						item = this.size - this.StepSeq * steps - 1;
					}
					this.citem = item;
					this._switchItem(this.citem, oldItem);
					if (this.crow === (this.rows - 1)) {
						this.$emit("scrolltolower");
					}
				} else {
					this.crow = cRow;
					OverBorder();
				};

				function OverBorder() {
					if (Border) {
						if (Border === self.id) {
							ScrollItem();
						} else {
							ChangeZone();
						}
					};

					function ScrollItem() {
						switch (Arrow) {
							case 'up':
								item = self.citem + self.column * (self.rows - 1);
								self.crow = self.rows - 1;
								break
							case 'down':
								item = self.citem - self.column * (self.rows - 1);
								self.crow = 0;
								break
							case 'left':
								item = (Row + 1) * self.column - 1;
								break
							case 'right':
								item = Row * self.column;
								break
						};
						//当前焦点区域对应的数值的个数超过一屏的显示个数，产生翻页效果
						if (self.size > steps) {
							self.StepSeq = self.StepSeq || 0;
							var MaxSeq = Math.ceil(self.size / steps) - 1;
							if ((Arrow === 'left') || (Arrow === 'up')) {
								//左键或者上键，往前翻
								self.StepSeq = (self.StepSeq > 0) ? self.StepSeq - 1 : MaxSeq;
							} else if ((Arrow === 'right') || (Arrow === 'down')) {
								//右键或者下键，往后翻
								self.StepSeq = (self.StepSeq < MaxSeq) ? self.StepSeq + 1 : 0;
							};
						};
						//数值个数不够时，光标定位在第一个上面
						if (item + self.StepSeq * steps + 1 > self.size) {
							item = 0;
						}
						self.citem = item;
						//执行用户定义函数
						self._switchItem(self.citem, oldItem);
					};

					function ChangeZone() {
						self.currentPage.ChangeZone(Border);
						self.refreshItem();
						self.$emit("swtichZone", self.zoneState)
					};

				};

			},
			evtEnter: function() {
				var itemObj = this.items[this.citem];
				if (itemObj) {
					itemObj.handleClick();
				}
			}
		},
		watch: {
			values: function(newVal, oldVal) {

			}
		}
	}
</script>

<style scoped>
</style>
