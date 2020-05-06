<template>
  <div class="app-container">
    <div class="app-wrapper">
      <el-button
        type="primary"
        @click="handleAddRole"
      >添加设备</el-button>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />
        <el-table-column
          prop="name"
          label="名设备称"
        />
        <el-table-column label="设备类型">
          <template slot-scope="scope">
            <span>{{ scope.row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="key"
          label="设备key"
        />
        <el-table-column label="粉丝底价">
          <template slot-scope="scope">
            <span>{{ scope.row.price/100 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="info"
              @click="handleDetail(scope.row.id)"
            >模板详情</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getData"
      />

      <el-dialog
        :visible.sync="dialogVisible"
        title="编辑模板"
        width="350px"
      >
        <el-form
          :model="template"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="标题">
            <el-input
              v-model="template.title"
              placeholder="标题"
            />
          </el-form-item>
          <el-form-item label="*消息类型">
            <el-select
              v-model="template.type"
              placeholder="请选择消息类型"
            >
              <el-option
                v-for="item in options"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              >{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息描述">
            <el-input
              v-model="template.desc"
              placeholder="消息描述"
            />
          </el-form-item>
          <el-form-item label="图片链接地址">
            <el-input
              v-model="template.thumb"
              placeholder="图片链接地址"
            />
          </el-form-item>
          <el-form-item label="跳转URL">
            <el-input
              v-model="template.url"
              placeholder="跳转URL"
            />
          </el-form-item>
          <el-form-item label="文本内容">
            <el-input
              v-model="template.content"
              placeholder="文本内容"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button
            type="danger"
            @click="dialogVisible=false"
          >取消</el-button>
          <el-button
            type="primary"
            @click="handleOk"
          >确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { get_device, get_template, edit_template } from '@/api/device'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total: 0,
      dialogVisible: false,
      options: [{
        type: 1,
        name: '文本消息'
      }, {
        type: 2,
        name: '空消息'
      }, {
        type: 3,
        name: '图文消息'
      }],
      template: {
        id: '',
        device_id: '',
        title: '',
        type: '',
        desc: '',
        thumb: '',
        url: '',
        content: ''
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      tableData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      get_device(this.listQuery).then(response => {
        this.tableData = response.data.data
        this.total = response.data.total
      })
    },
    handleAddRole() {
      this.$router.push({ path: '/device/add' })
    },
    handleEdit(id) {
      this.$router.push({
        path: `/device/edit/${id}`
      })
    },
    handleDetail(id) {
      // 将要编辑的模板id
      this.template.device_id = id
      get_template(id).then(response => {
        if (response.code === 20000) {
          if (response.template) {
            this.template.id = response.template.id
            this.template.title = response.template.title
            this.template.type = parseFloat(response.template.type)
            this.template.desc = response.template.desc
            this.template.thumb = response.template.thumb
            this.template.url = response.template.url
            this.template.content = response.template.content
          } else {
            this.template.id = ''
            this.template.title = ''
            this.template.type = ''
            this.template.desc = ''
            this.template.thumb = ''
            this.template.url = ''
            this.template.content = ''
          }
        }
      })
      this.dialogVisible = true
    },
    handleOk() {
      if (this.template.title === '') {
        this.$notify.error({
          title: '错误',
          message: '模板标题不能为空'
        })
        return false
      }
      if (this.template.type === '') {
        this.$notify.error({
          title: '错误',
          message: '请选择消息类型'
        })
        return false
      }
      edit_template(this.template).then(res => {
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
        this.dialogVisible = false
      })
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  padding: 32px;
  background: rgb(240, 242, 245);

  .app-container {
    background-color: rgb(240, 242, 245);
    position: relative;

    .app-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
}
</style>

