<template>
  <div id="app">
    <el-row class="fm-header" >
      <FmNavbar/>
    </el-row>
    <el-row>
      <el-col :span="6">
        <FmSidebar/>
      </el-col>
      <el-col :span="18">
        <FmContent/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FmNavbar from '@/components/FmNavbar'
import FmSidebar from '@/components/FmSidebar'
import FmContent from '@/components/FmContent'
export default {
  components: {
    FmNavbar,
    FmSidebar,
    FmContent
  }
}
</script>

<style>

body {
  margin: 0;
  padding: 0;
}
</style>
