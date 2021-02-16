<template>
  <el-dialog
    :title="'UPDATE'"
    :visible.sync="pShowDialog"
    width="30%"
    append-to-body
    class="fm-component-edit-dialog"
    center
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="createForm"
      v-loading="loading"
      :model="editForm"
      label-width="130px"
      label-position="left"
    >

      <el-form-item label="Name" prop="name">
        <el-col :span="17">
          <el-input v-model="editForm.name"/>
        </el-col>
        <el-col v-if="editForm.type === 'FILE'" :span="1">.</el-col>
        <el-col v-if="editForm.type === 'FILE'" :span="6">
          <el-input v-model="editForm.extension"/>
        </el-col>
      </el-form-item>

      <el-form-item label="Size" prop="size" >
        <el-col :span="10">
          <el-input :disabled="editForm.type === 'FOLDER'" v-model="editForm.size"/>
        </el-col>
        <el-col :span="7">
          <span>Kilobytes</span>
        </el-col>
      </el-form-item>

      <el-form-item v-if="editForm.type === 'FILE'" label="Content" prop="content">
        <el-input
          type="textarea"
          :rows="2"
          autosize
          placeholder="Please input"
          v-model="editForm.content">
        </el-input>
      </el-form-item>

      <el-form-item label="Parent Folder" prop="parentFolderId">
        <el-select v-model="currentParent">
          <el-option-group
            v-if="folderHierarchy[0].id !== editForm.parentFolderId"
            key="ancestor"
            label="Ancestors"
          >
            <el-option
              v-for="folder in ancestorFolders"
              :key="folder.id"
              :label="folder.name"
              :value="folder.id"
            />
          </el-option-group>
          <el-option-group
            v-if="siblingFolders"
            key="sibling"
            label="Siblings"
          >
            <el-option
              v-for="folder in siblingFolders"
              :key="folder.id"
              :label="folder.name"
              :value="folder.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
            <el-button
              :loading="componentUpdateInProgress"
              type="success"
              size="large"
              @click="updateComponent"
            >
                Update
            </el-button>
        </span>
  </el-dialog>
</template>

<script>

import FolderDataService from '@/services/FolderDataService'
import FileDataService from '@/services/FileDataService'

import { mapGetters } from 'vuex'

export default {
  name: 'FmEditDialog',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    FolderDataService,
    // eslint-disable-next-line vue/no-unused-components
    FileDataService
  },
  props: {
    showDialog: { type: Boolean, default: false },
    componentData: { type: Object }
  },
  data () {
    return {
      loading: false,
      componentUpdateInProgress: false,
      pShowDialog: false,
      editForm: {
        id: null,
        name: null,
        extension: null,
        content: null,
        size: null,
        type: null,
        parentFolderId: null
      },
      siblingFolders: [],
      ancestorFolders: [],
      currentParent: null
    }
  },
  computed: {
    ...mapGetters(['folderHierarchy'])
  },
  methods: {
    updateComponent () {
      this.componentUpdateInProgress = true
      let promise
      if (this.editForm.type === 'FILE') {
        promise = FileDataService.updateFile(this.editForm.id, this.editForm)
      } else {
        promise = FolderDataService.updateFolder(this.editForm.id, this.editForm.name, this.editForm.parentFolderId)
      }

      promise
        .then(() => {
          this.$message.success('Updated component')
          console.log('Component is updated successfully')
        })
        .catch((e) => {
          this.$message.error('Failed to update component ' + e)
          console.error('Failed to update component ' + e)
        })
        .finally(() => {
          this.componentUpdateInProgress = false
          this.closeDialog()
          this.$emit('refresh-components')
        })
    },
    closeDialog () {
      this.$emit('update:showDialog', false)
    },
    fetchSiblingFolders (parentId) {
      FolderDataService.getFolder(parentId)
        .then(result => {
          this.siblingFolders = result.data.folders.slice().filter((folder) => folder.id !== this.componentData.id).sort((a, b) => a.name.localeCompare(b.name))
          this.currentParent = parentId === -1 ? 'Root' : result.data.name
        })
        .catch(e => console.error('Failed to get parent folder:', e))
    },
    fetchComponentDetailedInfo (id) {
      let promise
      if (this.componentData.type === 'FILE') {
        promise = FileDataService.getFile(id)
      } else {
        promise = FolderDataService.getFolder(id)
      }
      promise
        .then(result => {
          this.editForm = result.data
        })
        .catch((e) => console.error('Failed to fetch component detailed info' + e))
    }
  },
  watch: {
    showDialog (value) {
      this.pShowDialog = value
    },
    componentData () {
      this.ancestorFolders = this.folderHierarchy.filter(folder => folder.id !== this.componentData.parentFolderId)
      this.fetchComponentDetailedInfo(this.componentData.id)
      this.fetchSiblingFolders(this.componentData.parentFolderId)
    },
    currentParent () {
      this.editForm.parentFolderId = this.currentParent
    }
  }
}
</script>

<style>

.fm-component-edit-dialog .el-dialog__header {
  background-color: #bcc8d2;
  border-bottom: 1px solid #D6E0EA;
}
.fm-component-edit-dialog .el-form-item__label {
  font-weight: bold;
  width: 120px;
}
</style>
