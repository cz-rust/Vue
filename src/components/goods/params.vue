<template>
  <div>
    <mbx nav1="商品管理" nav2="商品分类"></mbx>
    <el-card>
      <el-alert :show-icon="true" title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"> </el-alert>
      <el-row class="row_opt">
        <el-col>
          <span> 选择商品分类：</span>
          <el-cascader v-model="goodsValue" :options="goodsList" :props="goodProp" @change="goodsHandleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="paramsdialogVisible = true" type="primary" size="mini" :disabled="isflag">动态参数</el-button>
          <el-table :data="manyTab" stripe border style="width: 100%">
            <el-table-column label="" type="expand" width="45">
              <template slot-scope="scope">
                <el-tag @close="closeTag(id, scope.row)" v-for="(item, id) in scope.row.attr_vals" :key="id" closable>
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="45"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                <el-button @click="removeParams(scope.row.attr_id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button @click="paramsdialogVisible = true" type="primary" size="mini" :disabled="isflag">静态属性</el-button>
          <el-table :data="onlyTab" stripe border style="width: 100%">
            <el-table-column label="" type="expand" width="45">
              <template slot-scope="scope">
                <el-tag @close="closeTag(id, scope.row)" v-for="(item, id) in scope.row.attr_vals" :key="id" closable>
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="45"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加！！！！！！！！！ -->
    <el-dialog @close="closeParams" :title="'添加' + ismanyonly" :visible.sync="paramsdialogVisible" width="50%">
      <el-form :model="paramsForm" :rules="paramsrules" ref="paramsFormrule" label-width="100px">
        <el-form-item :label="ismanyonly" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改！！！！！！！！！！！！ -->
    <el-dialog @close="closeeditParams" :title="'修改' + ismanyonly" :visible.sync="paramsEdit" width="50%">
      <el-form :model="paramsEditForm" :rules="paramsEditrules" ref="paramsEditFormrule" label-width="100px">
        <el-form-item :label="ismanyonly" prop="attr_name">
          <el-input v-model="paramsEditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsEdit = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputValue: '',
      inputVisible: false,
      paramsEdit: false,
      paramsId: 0,
      paramsEditForm: {
        attr_name: ''
      },
      paramsEditrules: {
        attr_name: [{ required: true, message: '请输入登录名', trigger: 'blur' }]
      },

      paramsForm: {
        attr_name: ''
      },
      paramsdialogVisible: false,
      activeName: 'many',
      goodsList: [],
      goodsValue: [],
      goodProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTab: [],
      onlyTab: [],
      paramsrules: {
        attr_name: [{ required: true, message: '请输入登录名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getgoodsList()
  },
  methods: {
    async getgoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.goodsList = res.data
      /* console.log(this.goodsList) */
    },
    goodsHandleChange() {
      console.log(this.goodsValue)
      if (this.goodsValue.length < 3) {
        this.manyTab = []
        this.onlyTab = []
        return false
      }
      this.tabgoodsChange()
      /*  console.log(this.goodsValue) */
    },
    tabChange() {
      this.tabgoodsChange()
      /*  console.log(this.activeName) */
    },
    async tabgoodsChange() {
      const { data: res } = await this.$http.get(`categories/${this.islength}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      /*  console.log(res.data) */
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTab = res.data
      } else {
        this.onlyTab = res.data
      }
    },
    addParams() {
      this.$refs.paramsFormrule.validate(async vali => {
        if (!vali) return false
        const { data: res } = await this.$http.post(`categories/${this.islength}/attributes`, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })
        /* console.log(res) */
        if (res.meta.status !== 201) return this.$message.error('数据添加失败')
        this.tabgoodsChange()
      })
      this.paramsdialogVisible = false
    },
    closeParams() {
      this.$refs.paramsFormrule.resetFields()
    },
    editParams() {
      this.$refs.paramsEditFormrule.validate(async vali => {
        if (!vali) return false
        const { data: res } = await this.$http.put(`categories/${this.islength}/attributes/${this.paramsId}`, {
          attr_name: this.paramsEditForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('更新错误')
        this.tabgoodsChange()
        this.paramsEdit = false
      })
    },
    async showEdit(val) {
      this.paramsId = val
      const { data: res } = await this.$http.get(`categories/${this.islength}/attributes/${val}`, {
        params: { attr_sel: this.activeName }
      })
      this.paramsEditForm.attr_name = res.data.attr_name

      this.paramsEdit = true
    },
    closeeditParams() {},
    async removeParams(val) {
      const doc = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => res)
      if (doc !== 'confirm') return this.$message('已取消')
      const { data: res } = await this.$http.delete(`categories/${this.islength}/attributes/${val}`)
      if (res.meta.status !== 200) return this.$message.error('删除数据失败')
      this.tabgoodsChange()
    },
    async handleInputConfirm(row) {
      /*  console.log(this.goodsValue) */
      /* console.log(row) */
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$http.put(`categories/${this.islength}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加失败')
    },
    showInput(row) {
      /* $nextTick当页面的元素（input元素被渲染）被渲染才会调用回调函数 */
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async closeTag(id, row) {
      row.attr_vals.splice(id, 1)
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$http.put(`categories/${this.islength}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('删除失败')
    }
  },
  computed: {
    isflag() {
      if (this.goodsValue.length > 2) {
        return false
      } else {
        return true
      }
    },
    islength() {
      if (this.goodsValue.length > 2) {
        return this.goodsValue[this.goodsValue.length - 1]
      } else {
        return null
      }
    },
    ismanyonly() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.row_opt {
  margin: 10px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 100px;
}
</style>
