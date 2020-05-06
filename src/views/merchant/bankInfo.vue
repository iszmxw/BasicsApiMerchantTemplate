<template>
  <div class="app-container">
    <aside>
      开票信息 （普通发票）
      <br>公司名称：深圳海粉传媒广告有限公司
      <br>统一信用代码：914403000812591523
      <br>
    </aside>
    <aside>
      您当前签约的提现手续费为 <font style="color:#f00">{{ fee }} %</font>
    </aside>
    <el-form label-width="100px">
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="提现方式">
            <el-input
              value="银行卡"
              :disabled="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="姓名">
            <el-input
              v-model="form.name"
              :disabled="form.disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="银行卡号">
            <el-input
              v-model="form.number"
              :disabled="form.disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="银行名称">
            <el-input
              v-model="form.bankname"
              :disabled="form.disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="开户支行">
            <el-input
              v-model="form.remarks"
              :disabled="form.disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label>
            <el-button
              type="primary"
              @click="dialogVisible=true"
            >重新设置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      title="重置提现信息"
      width="30%"
    >
      <el-form
        :model="form"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="提现方式">
          <el-input
            placeholder="银行卡"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="form.name"
            placeholder="姓名"
          />
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input
            v-model="form.number"
            placeholder="银行卡号"
          />
        </el-form-item>
        <el-form-item label="银行名称">
          <el-input
            v-model="form.bankname"
            placeholder="银行名称"
          />
        </el-form-item>
        <el-form-item label="开户支行">
          <el-input
            v-model="form.remarks"
            placeholder="开户支行"
          />
        </el-form-item>
        <el-form-item label="验证手机号">
          <el-col :lg="24">
            <el-col :lg="12">
              <el-input
                v-model="form.code"
                placeholder="请输入验证码"
              />
            </el-col>
            <el-col :lg="12">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <el-button
                v-if="showCode"
                type="primary"
                @click="getOldSmsCode"
              >获取验证码</el-button>
              <el-button
                v-else
                type="primary"
                disabled="disabled"
              >{{ tips }}</el-button>
            </el-col>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="handleCancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleOk"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { bankInfo, getOldSmsCode, setBankInfo } from '@/api/merchant'

export default {
  data() {
    return {
      tips: '',
      time: 60,
      showCode: true,
      dialogVisible: false,
      fee: null,
      form: {
        name: '',
        number: '',
        bankname: '',
        remarks: '',
        disabled: true,
        code: null
      },
      options: [{
        type: 1,
        name: '银行卡'
      }]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      bankInfo().then(response => {
        if (response.code === 20000) {
          this.fee = response.data.fee
          this.form.name = response.data.bank_info.name
          this.form.number = response.data.bank_info.number
          this.form.bankname = response.data.bank_info.bankname
          this.form.remarks = response.data.bank_info.remarks
        }
      })
    },
    getOldSmsCode() {
      getOldSmsCode().then(res => {
        this.toMessage(res)
        if (res.code === 20000) {
          this.time = 60 // 默认60秒过期
          const timer = setInterval(() => {
            this.tips = (this.time) + '秒'
            this.showCode = false
            this.time--
            if (this.time <= 0) {
              this.showCode = true
              clearInterval(timer)
            }
          }, 1000)
        }
      })
    },
    handleOk() {
      setBankInfo(this.form).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success'
          })
          this.dialogVisible = false
          this.getData()
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          })
        }
      })
    },
    handleCancel() {
      location.reload()
    },
    toMessage(res) {
      if (res.code === 20000) {
        this.$message({
          showClose: true,
          message: res.message,
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: res.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
