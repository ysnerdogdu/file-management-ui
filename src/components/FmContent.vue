<template>
  <div class="fm-content">
    <h2 v-if="sortedCurrentData.length === 0">Empty</h2>

    <el-row :gutter="20">
      <el-col :span="6" v-for="(item) in sortedCurrentData" :key="item.id">
        <el-card :body-style="{ padding: '0px' }" class="folder-card">
          <i v-if="item.type === 'FOLDER'" class="el-icon-folder"></i>
          <i v-else-if="item.type === 'FILE'" class="el-icon-document"></i>

          <div style="padding: 14px;">
            <span class="component-name">{{ item.name }}</span>
            <span class="component-name" v-if="item.type === 'FILE'">.{{ item.extension }}</span>

            <div class="bottom cleafix">
              <div>
                <span class="component-property">Size: </span>
                <span>{{ item.size }} kb</span>
              </div>
              <div>
                <span class="component-property">Created At: </span>
                <time class="time">{{ item.creationDate }}</time>
              </div>
              <div>
                <span class="component-property">Last Modification: </span>
                <time class="time">{{ item.lastModificationDate }}</time>
              </div>
            </div>

            <el-popover class="popup-menu" width="40" trigger="click" placement="right">
              <div>
                <el-row v-if="item.type === 'FOLDER'">
                  <el-button
                    type="text"
                    icon="el-icon-folder-opened"
                    @click="goInsideFolder(item)"
                  >
                    Open Folder
                  </el-button>
                </el-row>

                <el-row>
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="openEditDialog(item)"
                  >
                    Edit
                  </el-button>
                </el-row>

                <el-row>
                  <el-button
                    type="text"
                    class="text-danger"
                    icon="el-icon-delete"
                    @click="deleteComponent(item)"
                  >
                    Delete
                  </el-button>
                </el-row>
                <div>
                </div>
              </div>
              <el-button slot="reference" type="text" icon="" class="button">Options</el-button>
            </el-popover>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <FmEditDialog
      :show-dialog.sync="componentEditDialog.shown"
      :component-data="selectedComponent"
      @refresh-components="fetchFolderComponents"
    />
  </div>
</template>

<script>
import FileDataService from '@/services/FileDataService'
import FolderDataService from '@/services/FolderDataService'
import FmEditDialog from '@/components/FmEditDialog'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FmContent',
  components: {
    FmEditDialog,
    // eslint-disable-next-line vue/no-unused-components
    FileDataService,
    // eslint-disable-next-line vue/no-unused-components
    FolderDataService
  },
  data () {
    return {
      loading: false,
      selectedComponent: null,
      currentData: [],
      currentFolderId: -1,
      componentEditDialog: {
        shown: false
      },
      deleteComponentInProgress: false,
      rootComponents: null
    }
  },
  computed: {
    ...mapGetters(['folderHierarchy']),
    ...mapActions(['openFolder']),
    sortedCurrentData () {
      return this.currentData.slice().sort((a, b) => b.type.localeCompare(a.type) || a.name.localeCompare(b.name))
    }
  },
  methods: {
    goInsideFolder (value) {
      const simpleFolderData = { id: value.id, name: value.name, parentFolderId: value.parentFolderId }
      this.$store.dispatch('openFolder', simpleFolderData)
    },
    openEditDialog (value) {
      if (this.deleteComponentInProgress) {
        return
      }
      this.selectedComponent = value
      this.componentEditDialog.shown = true
    },
    fetchFolderComponents () {
      if (this.loading) {
        return
      }

      this.loading = true
      FolderDataService.getFolder(this.currentFolderId)
        .then(result => {
          this.currentData = [...result.data.folders, ...result.data.files]
        })
        .catch((e) => {
          console.error('Failed to fetch folder components' + e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteComponent (value) {
      this.deleteComponentInProgress = true

      let promise
      if (value.type === 'FILE') {
        promise = FileDataService.deleteFile(value.id)
      } else if (value.type === 'FOLDER') {
        promise = FolderDataService.deleteFolder(value.id)
      }

      promise
        .then(() => {
          this.$message.success('Deleted component')
        })
        .catch((e) => {
          console.error('Failed to delete component', e)
          this.$message.error('Failed to delete component ' + e)
        })
        .finally(() => {
          this.deleteComponentInProgress = false
          this.fetchFolderComponents()
        })
    }
  },
  mounted () {
    this.fetchFolderComponents()
  },
  watch: {
    folderHierarchy () {
      if (this.folderHierarchy.length === 1) {
        this.currentFolderId = -1
      } else {
        this.currentFolderId = this.folderHierarchy[this.folderHierarchy.length - 1].id
      }
      this.fetchFolderComponents()
    }
  }
}
</script>

<style scoped>

.fm-content h2 {
  text-align: center;
  font-size: 32px;
  font-family: "Apple Chancery", sans-serif;
}

.fm-content {
  height: calc(100vh - 120px);
  overflow: scroll;
}

.fm-content .el-row {
  padding: 20px;
}

.fm-content .el-row .el-col {
  margin-bottom: 20px;
}

.fm-content .el-icon-folder,
.fm-content .el-icon-document{
  font-size: 90px;
  position: relative;
  left: 35%;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  font-size: 13px;
  color: #999;
}

.button {
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.fm-content .component-property {
  font-size: 12px;
  font-weight: bold;
}

.fm-content .component-name {
  font-size: 16px;
  font-weight: bold;
}

.fm-content .folder-card {
  background-color: #f8fab5;
}

.el-button:hover {
  border-bottom: 1px solid;
}

.text-danger {
  color: #ff0000;
}
.text-danger:hover {
  color: #ea5252;
}

</style>
