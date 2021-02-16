import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    folderHierarchy: state => state.folders
  },
  state: {
    folders: [
      {
        name: 'Root',
        parentId: -1,
        id: -1
      }
    ]
  },
  mutations: {
    addFolder (state, folder) {
      state.folders.push(folder)
    },
    removeFolders (state, folder) {
      const index = state.folders.findIndex(item => item.id === folder.id)
      state.folders.splice(index + 1)
    }
  },
  actions: {
    openFolder ({ commit }, folder) {
      commit('addFolder', folder)
    },
    goToFolder ({ commit }, folder) {
      commit('removeFolders', folder)
    }
  },
  modules: {
  }
})
