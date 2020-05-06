<template>
  <div class="app-container">
    <el-steps :active="active" process-status="wait" finish-status="finish">
      <el-step title="基本信息" />
      <el-step title="选择城市" />
      <el-step title="选择场景" />
      <el-step title="设置底价" />
    </el-steps>
    <div v-if="active === 1">
      <br>
      <br>
      <br>
      <el-form ref="form" :model="device" label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model="device.name" style="width:200px;" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="device.category_id" placeholder="请选择设备类型">
            <el-option
              v-for="(item) in steps.category"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div v-else-if="active === 2">
      <br>
      <br>
      <br>
      <el-tree
        ref="tree"
        :data="steps.address_data"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultChecked"
        :props="defaultProps"
      />
      <br>
      <br>
      <br>
    </div>
    <div v-else-if="active === 3">
      <br>
      <br>
      <br>
      <el-checkbox-group v-model="device.scene">
        <el-checkbox
          v-for="(item) in steps.scene"
          :key="item.id"
          :value="item.id"
          :label="item.id"
          border
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <br>
      <br>
      <br>
    </div>
    <div v-else-if="active === 4">
      <br>
      <br>
      <br>
      <el-form ref="form" label-width="80px">
        <el-alert title="温馨提示" type="success" description="底价是保证系统粉丝最低的出价，低于当前价格系统将不分配公众号" />
        <br>
        <el-form-item label="设置底价">
          <el-input v-model="device.price" style="width:300px;" />
        </el-form-item>
        <el-alert title="评估" type="info" description="九瓣花系统数据评估，共享设备粉丝价格在0.5~2.0元" show-icon />
      </el-form>
    </div>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>
</template>

<script>
import { get_category, get_address, get_scene, edit_device } from '@/api/device'

export default {
  data() {
    return {
      query: {
        id: ''
      },
      defaultChecked: [],
      active: 1,
      device: {
        id: '',
        name: '',
        category_id: '',
        address: [],
        scene: [],
        price: null
      },
      steps: {
        category: [],
        address_data: [],
        scene: []
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.query.id = this.$route.params.id
    this.device.id = this.$route.params.id
    this.getCategory()
    this.getAddress()
  },
  methods: {
    getCategory() {
      get_category(this.query).then(response => {
        this.steps.category = response.data.category
        this.device.name = response.data.edit_data.name
        this.device.category_id = response.data.edit_data.category_id
      })
    },
    getAddress() {
      get_address(this.query).then(response => {
        // 获取所有地址
        this.steps.address_data = response.data.address
        // 设置选中状态的样式
        this.defaultChecked = response.data.defaultChecked.split(',')
        // 初始化已经选中的值
        this.device.address = response.data.defaultChecked.split(',')
      })
    },
    getScene() {
      get_scene(this.query).then(response => {
        this.steps.scene = response.data.list
        this.device.price = response.data.price / 100
        // 转换为数组
        this.device.scene = response.data.scene.split(',')
        // 将数组里面的值转换为数字类型
        this.device.scene = this.device.scene.map(parseFloat)
      })
    },
    next() {
      switch (this.active) {
        case 1:
          if (!this.checkDataOne()) {
            if (this.active++ > 3) this.active = 1
          }
          break
        case 2:
          if (this.active++ > 3) this.active = 1
          this.getScene()
          break
        case 3:
          console.log(this.device.scene)
          if (this.active++ > 3) this.active = 1
          break
        case 4:
          this.SubmitForm()
          break
      }
    },
    checkDataOne() {
      if (this.device.name === '' || this.device.name === undefined || this.device.name == null) {
        this.$message.error('请填写设备名称')
        return true
      }
      if (this.device.category_id === '' || this.device.category_id === undefined || this.device.category_id == null) {
        this.$message.error('请选择设备类型')
        return true
      }
    },
    // 地区选择操作
    handleCheckChange(data, checked, indeterminate) {
      if (data.province_id) { // 子节点处理
        if (checked) { // 将选中的子节点添加到数组中
          this.device.address.push(data.id)
        } else { // 从数组中删除取消的子节点
          const array = this.deletedValue(this.device.address, data.id)
          this.device.address = array
        }
      }
      if (data.children) { // 父节点处理
        if (checked) { // 将选中的子节点添加到数组中
          data.children.forEach(element => {
            this.device.address.push(element.id)
          })
        } else { // 从数组中删除取消的子节点
          data.children.forEach(element => {
            this.device.address.push(element.id)
            const array = this.deletedValue(this.device.address, element.id)
            this.device.address = array
          })
        }
      }
    },
    // 删除数组中的元素
    deletedValue(array, value) {
      var index = array.indexOf(value)
      if (index > -1) {
        array.splice(index, 1)
      }
      return array
    },
    SubmitForm() {
      edit_device(this.device).then(response => {
        if (response.code === 20000) {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: response.message
          })
        }
        this.$router.push({
          path: '/device/list'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox-group .el-checkbox {
  margin: 5px;
}
</style>
