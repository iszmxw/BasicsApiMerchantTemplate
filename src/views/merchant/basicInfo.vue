<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="info"
      label-width="80px"
    >
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="名称">
            <el-input
              v-model="info.name"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="账号">
            <el-input
              v-model="info.username"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="12">
          <el-form-item label="手机号码">
            <el-input
              v-model="info.old_mobile"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-form-item>
          <el-button
            type="primary"
            @click="dialogFormVisible = true"
          >修改手机号码</el-button>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          @click="dialogRePassword = true"
        >重置登录密码</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="确认信息"
      :visible.sync="dialogFormVisible"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="true"
        :model="info"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="原手机号码">
          <el-input
            v-model="info.old_mobile"
            type="number"
            placeholder="原手机号码"
            :disabled="disabled"
            @mousewheel.native.prevent
          />
        </el-form-item>
        <br>
        <el-form-item label="验     证      码">
          <el-input
            v-model="info.old_code"
            type="number"
            placeholder="验证码"
            @mousewheel.native.prevent
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="showCode"
            type="primary"
            @click="getOldSmsCode"
          >获取</el-button>
          <el-button
            v-else
            type="primary"
            :disabled="disabled"
          >{{ tips }}</el-button>
        </el-form-item>
        <br>
        <el-form-item label="新手机号码">
          <el-input
            v-model="info.new_mobile"
            type="number"
            placeholder="新手机号码"
            @mousewheel.native.prevent
          />
        </el-form-item>
        <br>
        <el-form-item label="验     证      码">
          <el-input
            v-model="info.new_code"
            type="number"
            placeholder="验证码"
            @mousewheel.native.prevent
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="showCode2"
            type="primary"
            @click="getNewSmsCode"
          >获取</el-button>
          <el-button
            v-else
            type="primary"
            :disabled="disabled"
          >{{ tips }}</el-button>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleOk"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="重置登录密码"
      :visible.sync="dialogRePassword"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="true"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="验     证      码">
          <el-input
            v-model="repass.code"
            type="number"
            placeholder="验证码"
            @mousewheel.native.prevent
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="showCode"
            type="primary"
            @click="getOldSmsCode"
          >获取</el-button>
          <el-button
            v-else
            type="primary"
            :disabled="disabled"
          >{{ tips }}</el-button>
        </el-form-item>
        <br>
        <el-form-item label="新的登录密码">
          <el-input
            v-model="repass.password"
            type="text"
            placeholder="新的登录密码"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogRePassword = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleRePassword"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { basicInfo, getOldSmsCode, getNewSmsCode, editMobile, rePassword } from '@/api/merchant'

export default {
  data() {
    return {
      tips: '',
      time: 60,
      showCode: true,
      showCode2: true,
      disabled: true,
      info: {
        name: '',
        username: '',
        old_mobile: null,
        new_mobile: null,
        old_code: null,
        new_code: null
      },
      repass: {
        code: null,
        password: null
      },
      dialogFormVisible: false,
      dialogRePassword: false,
      listLoading: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      basicInfo().then(response => {
        this.info.name = response.data.company
        this.info.username = response.data.username
        this.info.old_mobile = response.data.mobile
        this.listLoading = false
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
    getNewSmsCode() {
      getNewSmsCode({
        mobile: this.info.new_mobile
      }).then(res => {
        this.toMessage(res)
        if (res.code === 20000) {
          this.time = 60 // 默认60秒过期
          const timer = setInterval(() => {
            this.tips = (this.time) + '秒'
            this.showCode2 = false
            this.time--
            if (this.time <= 0) {
              this.showCode2 = true
              clearInterval(timer)
            }
          }, 1000)
        }
      })
    },
    handleOk() {
      editMobile(this.info).then(res => {
        this.toMessage(res)
        this.fetchData()
        this.dialogFormVisible = false
      })
    },
    handleRePassword() {
      rePassword(this.repass).then(res => {
        this.toMessage(res)
        this.fetchData()
        this.dialogRePassword = false
      })
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

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
