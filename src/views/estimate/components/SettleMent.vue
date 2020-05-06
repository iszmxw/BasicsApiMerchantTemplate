<template>
  <el-dialog title="结算" :visible="showModel" :show-close="false" width="30%">
    <el-form :model="settlementInfo" label-width="100px" label-position="left">
      <el-form-item label="银行名称">
        <el-input
          v-model="settlementInfo.bankname"
          :disabled="true"
          placeholder="银行名称"
        />
      </el-form-item>
      <el-form-item label="开户支行">
        <el-input
          v-model="settlementInfo.remarks"
          :disabled="true"
          placeholder="开户支行"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          v-model="settlementInfo.name"
          :disabled="true"
          placeholder="姓名"
        />
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input
          v-model="settlementInfo.number"
          :disabled="true"
          placeholder="银行卡号"
        />
      </el-form-item>
      <el-form-item label="账户余额">
        <el-input v-model="settlementInfo.amount" :disabled="true" placeholder="账户余额" />
      </el-form-item>
      <el-form-item label="手续费">
        <el-input v-model="settlementInfo.fee" placeholder="手续费" type="number" disabled>
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="提现金额">
        <el-input v-model="data.price" placeholder="提现金额" type="number">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCanle">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { applyWithdraw } from '@/api/estimate'
export default {
  name: 'SettleMent',
  props: {
    'showModel': {
      type: Boolean,
      default: false
    },
    'settlementInfo': {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      data: {
        price: ''
      }
    }
  },
  methods: {
    handleCanle(event) {
      this.$emit('hideModel', !this.showModel)
    },
    handleOk() {
      applyWithdraw(this.data).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success'
          })
          this.handleCanle()
        }
      })
    }
  }
}
</script>

