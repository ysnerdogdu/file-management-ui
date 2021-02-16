<template>
  <ul class="fm-sidebar">
    <li v-for="(item, index) in folderHierarchy" :key="item.id" class="folder-item">
        <i v-if="index === 0" class="el-icon-s-home"></i>
        <i v-else-if="index !== folderHierarchy.length-1" class="el-icon-folder"></i>
        <i v-else class="el-icon-folder-opened"></i>
        <el-button type="text" class="folder-button" @click="goToFolder(item)">{{ item.name }}</el-button>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FmSidebar',
  data () {
    return {
      loading: false,
      selectedFolder: null
    }
  },
  computed: {
    ...mapGetters(['folderHierarchy'])
  },
  methods: {
    goToFolder (value) {
      this.$store.dispatch('goToFolder', value)
    }
  }
}
</script>

<style scoped>

.fm-sidebar {
  height: calc(100vh - 120px);
  list-style-type: none;
  background-color: #22292f;
  margin: 0;
  padding: 0;
}

.fm-sidebar .folder-item {
  display: flex;
  align-items: center;
  height: 64px;
  padding-left: 30px;
}

.fm-sidebar .folder-item:last-child {
  background-color: #1b232d;
}

.fm-sidebar .folder-item:hover {
  background-color: #1b232d;
}
.fm-sidebar .el-icon-s-home,
.el-icon-folder,
.el-icon-folder-opened{
  font-size: 32px;
  color: #409EFF;
}
.fm-sidebar .folder-button {
  font-size: 20px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  margin-left: 4px;
  margin-top: 8px;
  color: #F4F6F9;
}

</style>
