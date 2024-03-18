import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		currentPage: null,
		currentZone: null,
		allPages:[]
	},
	mutations: {
		pushPage(state,page){
			state.allPages[page.id]=page;
		},
		switchZone(state, zone) {
			state.currentZone = zone
		},
		switchPage(state,page){
			state.currentPage=page;
		},
		showPage(state,pageId){
			var page=state.allPages[pageId];
			page.showPage();
		}
	},
	actions: {
		
	}
})

export default store
