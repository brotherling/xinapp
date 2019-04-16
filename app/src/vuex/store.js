import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    assetadd:{}, //资产新增数据
    applyadd:{}, //领用登记
    applychoose:[], //领用选择资产
    applychooseIds: [], //领用选择资产id
}
const mutations = {
    SET_ASSETDATA_ADD(state,system){
        for(let i in system){
            state.assetadd[i] = system[i]
        } 
    },
    SET_APPLY_ADD(state, system){
        for (let i in system){
            state.applyadd[i] = system[i]
        }
    },
    SET_APPLY_CHOOSE(state, system){
        state.applychoose = system
    },
    SET_APPLY_CHOOSEIDS(state, system) {
        state.applychooseIds = system
    }
}
const actions = {
    setAssetdate({commit},system){
        commit('SET_ASSETDATA_ADD',system)
    },
    setApplyDate({ commit }, system){
        commit('SET_APPLY_ADD', system)
    },
    setApplyChooseDate({ commit }, system){
        commit('SET_APPLY_CHOOSE', system)
    },
    setApplyChooseIds({ commit }, system) {
        commit('SET_APPLY_CHOOSEIDS', system)
    },
}

export default new Vuex.Store({
	state,
    mutations,
    actions,
})