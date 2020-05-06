<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="el-card__header">
        <div class="clearfix">
          <span>结算记录</span>
        </div>
      </div>
      <br>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <el-button
              type="primary"
              @click="showSettlement"
            >结算申请</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>已结算{{ settlemented }}元</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>未结算{{ settlementing }}元</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>余额{{ amount }}元</span>
            <settle-ment
              :show-model="showModel"
              :settlement-info="settlementInfo"
              @hideModel="hideModel"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form>
              <el-form-item label>
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
                <el-col
                  class="line"
                  :span="2"
                >
                  <el-button
                    type="primary"
                    @click="onSubmit"
                  >搜索</el-button>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
      style="width: 100%;"
    >
      <el-table-column
        label="ID"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提现方式"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? '银行卡' : '支付宝' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="银行名称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bankname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开户支行"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="银行卡号"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否结算"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === 0"
            type="warning"
          >待审核</el-tag>
          <el-tag
            v-if="scope.row.status === 1"
            type="success"
          >已审核</el-tag>
          <el-tag
            v-if="scope.row.status === 2"
            type="danger"
          >已拒绝</el-tag>
          <el-tag
            v-if="scope.row.status === 2"
            type="danger"
          >【原因】{{ scope.row.reason }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="status === 2"
        label="原因"
        align="center"
      >
        <template slot-scope="scope">
          <el-alert
            :title="scope.row.reason"
            type="error"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="提现金额"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.price / 100 }} 元</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手续费"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.fee/100 }} 元</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="实际到账金额"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.reality_price / 100 }} 元</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="申请日期"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import SettleMent from './SettleMent'
import { getList, getSettleMentInfo } from '@/api/estimate'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ListTable',
  components: { Pagination, SettleMent },
  data() {
    return {
      settlemented: 0,
      settlementing: 0,
      amount: 0,
      type: '',
      status: '',
      showModel: false,
      settlementInfo: {},
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        str_time: null,
        end_time: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableRowClassName({ row }) {
      // if (row.type === 1) {
      //   return 'warning-row'
      // } else if (row.type === 2) {
      //   return 'success-row'
      // }
      return ''
    },
    onSubmit() {
      this.getList()
    },
    showSettlement() {
      getSettleMentInfo().then(res => {
        if (res.code === 20000) {
          this.settlementInfo = res.data
          this.settlementInfo.amount = this.settlementInfo.amount / 100
          this.showModel = true
        }
        if (res.code === 50000) {
          this.$notify.error({
            title: '错误',
            message: res.message
          })
          this.showModel = false
        }
      })
    },
    hideModel(e) {
      this.showModel = e
      this.getList()
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        this.total = res.data.list.total
        this.list = res.data.list.data
        this.settlemented = res.data.settlemented
        this.settlementing = res.data.settlementing
        this.amount = res.data.amount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-table .warning-row {
  background: #d29292;
}

.el-table .success-row {
  background: #e8f4ff;
}
</style>
