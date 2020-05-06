<template>
  <el-main>
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
      <el-table-column label="用户">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label>
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <img :src="scope.row.headimgurl" :alt="scope.row.nickname" width="30" height="30">
          </span>
        </template>
      </el-table-column>
      <el-table-column label="价格（元）">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.price/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注时间">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <br>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getData"
    />
  </el-main>
</template>

<script>
import { getFansRecord } from '@/api/statistics'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        created_at: null
      },
      tableData: []
    }
  },
  mounted() {
    this.listQuery.created_at = this.$route.params.created_at
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      getFansRecord(this.listQuery).then(res => {
        if (res.code === 20000) {
          this.total = res.data.total
          this.tableData = res.data.data
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fcfcfc;

  .search {
    width: 60%;
    padding: 0 20px;
    float: right;
  }
}
</style>

