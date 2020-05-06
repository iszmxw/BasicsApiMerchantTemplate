<template>
  <div class="app-container">
    <el-form ref="form" label-width="80px" class="search">
      <el-form-item label="搜索">
        <el-col :span="11">
          <el-date-picker
            v-model="listQuery.str_time"
            type="date"
            placeholder="开始时间"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="listQuery.end_time"
            type="date"
            placeholder="结束时间"
            style="width: 100%;"
          />
        </el-col>
        <el-col class="line" :span="2">
          <el-button type="primary" @click="getData()">搜索</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="日期">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粉丝数（个）">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益（元）">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.price/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row.created_at)">粉丝</el-button>
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
  </div>
</template>

<script>
import { getFansDayChart } from '@/api/statistics'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        str_time: null,
        end_time: null
      },
      tableData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getFansDayChart(this.listQuery).then(res => {
        if (res.code === 20000) {
          this.total = res.data.total
          this.tableData = res.data.data
        }
      })
    },
    detail(time) {
      this.$router.push({
        name: 'fansRecord',
        params: {
          created_at: time
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

