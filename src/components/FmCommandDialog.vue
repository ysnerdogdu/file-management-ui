<template>
  <el-dialog
    :title="'COMMAND'"
    :visible.sync="pShowDialog"
    width="35%"
    append-to-body
    class="fm-command-dialog"
    center
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <h3>Supported Commands</h3>
    <div>
      <span class="command">cd-></span>
      <span class="command-example">cd folder-name</span>
    </div>
    <div>
      <span class="command">mv-></span>
      <span class="command-example">mv folder-name or file-name</span>
    </div>
    <div>
      <span class="command">rm-></span>
      <span class="command-example">rm (folder-name or file-name) folder-name</span>
    </div>
    <div class="command-input">
      <el-col :span="6">
        <span class="input-label">Command</span>
      </el-col>
      <el-col :span="18">
        <el-input v-model="command"/>
      </el-col>
    </div>

    <span slot="footer">
      <el-button
        :loading="loading"
        type="success"
        size="large"
        :disabled="deleteComponentInProgress"
        @click="runCommand"
      >
        Run
      </el-button>
    </span>
  </el-dialog>

</template>

<script>
import FolderDataService from '@/services/FolderDataService'
import FileDataService from '@/services/FileDataService'

import { mapGetters } from 'vuex'

export default {
  name: 'FmCommandDialog',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    FolderDataService,
    // eslint-disable-next-line vue/no-unused-components
    FileDataService
  },
  props: {
    showDialog: { type: Boolean, default: false },
    folderComponents: { type: Array }
  },
  data () {
    return {
      loading: false,
      pShowDialog: false,
      command: null,
      deleteComponentInProgress: false,
      componentUpdateInProgress: false
    }
  },
  computed: {
    ...mapGetters(['folderHierarchy']),
    currentFolderId () {
      return this.folderHierarchy[this.folderHierarchy].id
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:showDialog', false)
    },
    updateComponent (value) {
      this.componentUpdateInProgress = true
      let promise
      if (value.type === 'FILE') {
        promise = FileDataService.updateFile(value.id, value)
      } else {
        promise = FolderDataService.updateFolder(value.id, value.name, value.parentFolderId)
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
          this.$emit('refresh-components')
        })
    },
    runCommand () {
      // eslint-disable-next-line no-debugger
      debugger
      if (!this.command) {
        this.$message.error('Command is empty')
        return
      }
      const words = this.command.split(' ')
      if (words.length < 2 || words.length > 3) {
        this.$message.error('Command length is not proper')
        return
      }
      const commands = ['cd', 'rm', 'mv']
      if (!commands.includes(words[0])) {
        this.$message.error('Command not recognized: ' + words[0])
        return
      }

      const tokens = words[1].split('.')
      const componentName = tokens[0]

      const component = this.folderComponents.find(component => component.name === componentName)
      if (component === undefined) {
        this.$message.error('Component is not found by name: ' + words[1])
        return
      }
      this.handleCommand(component, words)
    },
    handleCommand (component, words) {
      const command = words[0]

      if (command === 'cd' && words.length === 2) {
        if (component.type === 'FOLDER') {
          this.$emit('open-folder', component)
        } else {
          this.$message.error('Cannot open file component')
        }
      } else if (command === 'rm' && words.length === 2) {
        this.$emit('delete-component', component)
      } else if (command === 'mv' && words.length === 3) {
        const siblingComponent = this.folderComponents.find(sibling => sibling.name === words[2])
        const ancestorFolder = this.folderHierarchy.find(folder => folder.name === words[2])

        if ((siblingComponent && siblingComponent.type === 'FOLDER') || ancestorFolder) {
          component.parentFolderId = siblingComponent !== undefined ? siblingComponent.id : ancestorFolder.id
          this.updateComponent(component)
        } else {
          this.$message.error('Destination parent component is not found by name: ' + words[2])
        }
      } else {
        this.$message.error('Command format is wrong. {cd (folder-name)}, {rm (component-name)} or {mv (component-name) (folder-name)}')
      }
    }
  },
  watch: {
    showDialog (value) {
      this.pShowDialog = value
      this.command = null
    }
  }
}
</script>

<style>

.fm-command-dialog .el-dialog__header {
  background-color: #bcc8d2;
  border-bottom: 1px solid #D6E0EA;
}

.fm-command-dialog .el-dialog .el-dialog__body {
  padding-top: 0;
}
.fm-command-dialog .command {
  font-weight: bold;
  font-size: 15px;
}

.fm-command-dialog .command-input {
  margin-top: 25px;
}

.fm-command-dialog .command-input .input-label {
  font-weight: bold;
  font-size: 16px;
}

.fm-command-dialog .command-example {
  font-family: monospace;
  padding-left: 15px;
}

</style>
