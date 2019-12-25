<template>
  <div>
    <mbx nav1="商品管理" nav2="添加商品"></mbx>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <el-steps :space="200" :active="activeInd - 0" finish-status="success" align-center="">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- v-model与name值相关 -->
        <el-tabs v-model="activeInd" tab-position="left" :before-leave="beforeTab" @tab-click="tabChange(activeInd)">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="addCate" :props="addCas" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in ManyParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border size="mini" :label="item1" v-for="(item1, ind) in item.attr_vals" :key="ind"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" :headers="reqHeaders" list-type="picture" :on-success="uploadSuc">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addbnt" @click="addform">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="imgPreview" width="50%">
      <img :src="this.filePreview" alt="" class="imgPre" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      imgPreview: false,
      reqHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      filePreview: '',
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      activeInd: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addCate: [],
      addFormrules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      addCas: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      ManyParams: [],
      onlyParams: []
    }
  },
  created() {
    this.getaddCate()
  },
  methods: {
    async getaddCate() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.addCate = res.data
    },
    handleChange() {
      /* console.log(this.addForm.goods_cat) */
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return false
      }
    },
    beforeTab(activeName, oldActiveName) {
      /*  console.log(activeName, oldActiveName) */
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabChange(ind) {
      if (ind === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
        /* console.log(res.data) */
        if (res.meta.status !== 200) return this.$message.error('获取参数失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : ''
        })
        this.ManyParams = res.data
        /* console.log(this.ManyParams) */
      }
      if (ind === '2') {
        const { data: doc } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
        /* console.log(res.data) */
        if (doc.meta.status !== 200) return this.$message.error('获取参数失败')
        this.onlyParams = doc.data
        /* console.log(this.onlyParams) */
      }
    },
    handlePreview(file) {
      console.log(file)
      this.filePreview = file.response.data.url
      this.imgPreview = true
    },
    handleRemove(file) {
      const filepath = file.response.data.tmp_path
      let ind = this.addForm.pics.findIndex(x => x.pic === filepath)
      this.addForm.pics.splice(ind, 1)
    },
    uploadSuc(response) {
      /*  console.log(response.data.tmp_path) */
      const obj = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(obj)
      /*  console.log(this.addForm) */
    },
    addform() {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return this.$message.error('请填写完整数据')
        const formCopy = _.cloneDeep(this.addForm)
        /* 级联选择器需要数组，而请求需要字符串，所以拷贝一份数据 */
        formCopy.goods_cat = formCopy.goods_cat.join(',')
        console.log(formCopy.goods_cat)
        /* console.log(formCopy) */
        this.ManyParams.forEach(item => {
          const Manyattrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join('')
          }
          this.addForm.attrs.push(Manyattrs)
        })
        this.onlyParams.forEach(item => {
          const onlyattrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(onlyattrs)
        })
        formCopy.attrs = this.addForm.attrs
        console.log(formCopy)
        const { data: res } = await this.$http.post('goods', formCopy)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
        console.log(this.addForm.attrs)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-scrollbar {
  bottom: 10px;
}
.el-checkbox {
  margin-right: 10px !important;
}
.imgPre {
  width: 100%;
  height: 100%;
}
.addbnt {
  margin-top: 10px;
}
</style>
