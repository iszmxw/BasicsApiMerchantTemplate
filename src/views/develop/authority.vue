<template>
  <div style="margin:20px">
    <mavon-editor
      v-model="content"
      :toolbars-flag="toolbarsFlag"
      :subfield="false"
      :default-open="defaultOpen"
      style="height: 100%"
    />
  </div>
</template>
<script>
import { getArticel } from '@/api/develop'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  components: {
    mavonEditor
  },
  props: {
    defaultOpen: {
      type: String,
      default: 'preview'
    },
    toolbarsFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: ``
    }
  },
  mounted() {
    this.getArticel()
  },
  methods: {
    getArticel() {
      getArticel().then(res => {
        this.content = res.data
      })
    }
  }
}
</script>
