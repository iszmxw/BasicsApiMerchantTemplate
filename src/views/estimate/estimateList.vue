<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <div class="chart-wrapper">
        <list-table />
      </div>
    </el-row>
  </div>
</template>

<script>
import ListTable from './components/ListTable'

export default {
  components: {
    ListTable
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
