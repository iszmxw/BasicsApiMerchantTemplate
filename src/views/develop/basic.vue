<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <div class="chart-wrapper">
        <div class="app-container">
          <div class="filter-container">
            <div class="el-card__header">
              <div class="clearfix">
                <span>九瓣花开发信息</span>
              </div>
            </div>
            <br>
          </div>
        </div>

        <el-form ref="form" label-width="165px">
          <el-row :gutter="10">
            <el-col :lg="15">
              <el-form-item label="开发者ID(AppId)">
                <el-input v-model="basic.develop_appid" :disabled="true" />
                <el-alert
                  title="开发者ID是九瓣花开发识别码，配合开发者密码可调用九瓣花的接口能力。"
                  type="error"
                  :closable="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-form-item label="开发者密钥(AppSecret)">
              <el-col :lg="24">
                <el-col :lg="14">
                  <el-input v-model="basic.develop_appsecret" :type="type" :disabled="true" />
                </el-col>
                <el-col :lg="10">
                  <el-button v-show="is_appsecret" type="primary" @click="handleType">{{ title }}</el-button>
                  <el-button
                    v-if="basic.develop_appsecret != ''"
                    type="primary"
                    @click="dialogVisible = true"
                  >重置</el-button>
                  <el-button v-else type="primary" @click="initAppsecret">初始化</el-button>
                </el-col>
              </el-col>
              <el-col :lg="24">
                <el-alert
                  title="开发者密钥是校验九瓣花开发者身份的密钥，具有极高的安全性。切记勿把密码直接交给第三方开发者或直接存储在代码中。"
                  type="error"
                  :closable="false"
                />
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="10">
            <el-form-item label="服务器地址(URL)">
              <el-col :lg="24">
                <el-col :lg="14">
                  <el-input
                    v-model="basic.develop_url"
                    placeholder="服务器地址(URL)"
                    type="text"
                    :disabled="disabled"
                  />
                </el-col>
                <el-col :lg="10">
                  <el-button v-if="disabled" type="primary" @click="editUrlVisible = true">编辑</el-button>
                </el-col>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" title="重置秘钥" width="30%">
      <el-form label-width="100px" label-position="left">
        <el-form-item label="验证手机号">
          <el-col :lg="24">
            <el-col :lg="12">
              <el-input v-model="code" placeholder="请输入验证码" type="number" @mousewheel.native.prevent />
            </el-col>
            <el-col :lg="12">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <el-button v-if="showCode" type="primary" @click="getOldSmsCode">获取验证码</el-button>
              <el-button v-else type="primary" disabled="disabled">{{ tips }}</el-button>
            </el-col>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleOk">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editUrlVisible" title="编辑服务器地址" width="35%">
      <el-form label-width="140px" label-position="left">
        <el-form-item label="服务器地址(URL)">
          <el-input
            v-model="basic.develop_url"
            type="text"
            placeholder="服务器地址(URL)"
          />
        </el-form-item>
        <el-form-item label="验证手机号">
          <el-col :lg="24">
            <el-col :lg="12">
              <el-input v-model="code" placeholder="请输入验证码" type="number" @mousewheel.native.prevent />
            </el-col>
            <el-col :lg="12">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <el-button v-if="showCode" type="primary" @click="getOldSmsCode">获取验证码</el-button>
              <el-button v-else type="primary" disabled="disabled">{{ tips }}</el-button>
            </el-col>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="editUrlVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { basic, init_appsecret, editDevelopUrl } from '@/api/develop'
import { getOldSmsCode } from '@/api/merchant'

export default {
  data() {
    return {
      title: '显示',
      type: 'password',
      tips: '',
      time: 60,
      code: null,
      showCode: true,
      dialogVisible: false,
      editUrlVisible: false,
      basic: {
        id: '',
        develop_appid: '',
        develop_appsecret: '',
        develop_url: ''
      },
      disabled: true
    }
  },
  computed: {
    is_appsecret() {
      if (this.basic.develop_appsecret) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      basic().then(res => {
        this.basic.id = res.develop_info.id
        this.basic.develop_appid = res.develop_info.develop_appid
        this.basic.develop_appsecret = res.develop_info.develop_appsecret
        this.basic.develop_url = res.develop_info.develop_url
      })
    },
    initAppsecret() {
      init_appsecret().then(res => {
        this.toMessage(res)
      })
    },
    handleType() {
      if (this.type === 'password') {
        this.title = '隐藏'
        this.type = 'text'
      } else {
        this.title = '显示'
        this.type = 'password'
      }
    },
    handleSave() {
      this.disabled = true
      editDevelopUrl({
        develop_url: this.basic.develop_url,
        code: this.code
      }).then(res => {
        this.toMessage(res)
        this.fetchData()
        this.editUrlVisible = false
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
      init_appsecret({
        code: this.code
      }).then(res => {
        this.toMessage(res)
        this.dialogVisible = false
        this.fetchData()
      })
    },
    toMessage(res) {
      if (res.code === 20000) {
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success'
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: res.message
        })
      }
    }
  }
}
</script>

<style>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
