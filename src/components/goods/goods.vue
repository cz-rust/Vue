<template>
  <div>
    <mbx nav1="商品管理" nav2="商品分类"></mbx>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-Table class="treeTable" :data="goodsList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="isyes" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template slot="isno">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-Table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="dialogVisibleCate" width="50%" @close="closeForm">
      <el-form :model="catruleForm" :rules="catrules" ref="catruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="catruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader :change-on-select="true" :clearable="true" v-model="cascadevalue" :options="parentList" :props="cascaderProp" @change="parentCatChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCate = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cascadevalue: [],
      /* 级联选择器配置选 */
      cascaderProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      parentList: [],
      catruleForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      catrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      dialogVisibleCate: false,
      queryParams: {
        type: 3,
        /*当前页码值  */
        pagenum: 1,
        /* 每页显示多少数据 */
        pagesize: 5
      },
      /*商品数据*/
      goodsList: [],
      /* 数据总数 */
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          /* 第二列需要操作数据所以需要作用域插槽， */
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'isyes'
        },
        {
          label: '操作',
          type: 'template',
          template: 'isno'
        }
      ]
    }
  },
  created() {
    this.getgoodsList()
  },
  methods: {
    async getgoodsList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newpageSize) {
      /* 监听每页数据变化变化 */
      this.queryParams.pagesize = newpageSize
      this.getgoodsList()
    },
    handleCurrentChange(newPagenum) {
      this.queryParams.pagenum = newPagenum
      this.getgoodsList()
    },
    addCate() {
      this.getparentList()
      this.dialogVisibleCate = true
    },
    async getparentList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.parentList = res.data
      console.log(this.parentList)
    },
    parentCatChange() {
      /* console.log(this.cascadevalue) */
      if (this.cascadevalue.length > 0) {
        this.catruleForm.cat_pid = this.cascadevalue[this.cascadevalue.length - 1]
        this.catruleForm.cat_level = this.cascadevalue.length
      } else {
        this.catruleForm.cat_pid = 0
        this.catruleForm.cat_level = 0
      }
    },
    addConfirm() {
      /*  console.log(this.catruleForm) */
      this.$refs.catruleForm.validate(async vali => {
        if (!vali) return this.$message('请输入')
        console.log(this.catruleForm)
        const { data: res } = await this.$http.post('categories', this.catruleForm)
        if (res.meta.status !== 201) return this.$message.error('获取数据失败')
        this.getgoodsList()
        this.dialogVisibleCate = false
      })
    },
    closeForm() {
      this.$refs.catruleForm.resetFields()
      this.cascadevalue = []
      this.cascadevalue.cat_pid = 0
      this.cascadevalue.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
