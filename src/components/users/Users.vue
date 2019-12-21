<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryParams.query" clearable @clear="getData">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe style="width: 100%" border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"> </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"> </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope"
            ><!-- z作用域插槽 -->
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- z作用域插槽 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShow(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUsers(scope.row.id)"></el-button>
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top-start">
              <el-button @click="usersRole(scope.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
        <!-- current-page当前显示第几页 -->
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="flag" width="50%" @close="closeForm">
        <el-form :model="addForm" :rules="addrules" ref="addref" label-width="70px">
          <!-- 用户 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <!-- 手机 -->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="flag = false">取 消</el-button>
          <el-button type="primary" @click="increUsers">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editUsers" width="50%" @close="editReste">
        <el-form :model="getEdit" :rules="editrules" ref="editruleForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="getEdit.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="getEdit.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="getEdit.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUsers = false">取 消</el-button>
          <el-button type="primary" @click="editUsersinfo">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="userdialogVisible" width="50%">
        <div>
          <p>当前的用户：{{ rolesUser.username }}</p>
          <p>当前的角色：{{ rolesUser.role_name }}</p>
          <p>
            分配新角色：
            <el-select v-model="roleValue" placeholder="请选择">
              <el-option v-for="item in chanceRole" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer">
          <el-button @click="userdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback('请输入正确的邮箱')
    }
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback('请输入正确的邮箱')
    }
    return {
      editUsers: false,
      roleValue: '',
      chanceRole: {},
      userdialogVisible: false,
      rolesUser: [],
      queryParams: {
        query: '',
        pagenum: 1 /* 当前页面 */,
        pagesize: 2 /* 每页显示的条数 */
      },
      userList: [],
      totalNum: 0,
      flag: false,
      /* 提交数据对象 */
      addForm: {
        username: '',
        email: '',
        password: '',
        mobile: ''
      },
      /* 添加规则 */
      addrules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      },
      /* 表单信息 */
      addref: {},
      getEdit: {},
      editrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      },
      editruleForm: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data: res } = await this.$http.get('users', { params: this.queryParams })
      /* console.log(res) */
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      this.userList = res.data.users
      this.totalNum = res.data.total
    },
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getData()
    },
    async stateChange(val) {
      console.log(val)
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status !== 200) {
        this.$message.error('操作失败')
        val.mg_state = !val.mg_state
        return false
      }
      this.$message.success('操作成功')
    },
    addUsers() {
      this.flag = true
    },
    closeForm() {
      this.$refs.addref.resetFields() /* 表单重置 */
    },
    increUsers() {
      this.$refs.addref.validate(async vail => {
        if (!vail) return false
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('用户创建成功')
        this.flag = false
        this.getData()
      })
    },
    async editShow(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      this.$message.success('获取用户成功')
      this.getEdit = res.data
      console.log(this.getEdit)
      this.editUsers = true
    },
    editReste() {
      /*  console.log(this.$refs.editruleForm) */
      this.$refs.editruleForm.resetFields() /* 表单重置 */
    },
    editUsersinfo() {
      this.$refs.editruleForm.validate(async vail => {
        if (!vail) return
        const { data: res } = await this.$http.put('users/' + this.getEdit.id, {
          mobile: this.getEdit.mobile,
          email: this.getEdit.email
        })
        if (res.meta.status !== 200) return this.$message.error('编辑失败')
        this.$message.success('编辑成功')
        this.getData()
        this.editUsers = false
      })
    },
    async removeUsers(id) {
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) //当点击取消时候打印错误信息
      if (res !== 'confirm') return this.$message.info('取消成功')
      const { data: doc } = await this.$http.delete('users/' + id)
      if (doc.meta.status !== 200) return this.$message('操作失败')
      this.$message.success('删除用户成功')
      this.getData()
    },
    async usersRole(val) {
      this.rolesUser = val
      const { data: res } = await this.$http('roles')
      if (res.meta.status !== 200) return this.$message('获取数据失败')
      console.log(res.data)
      this.chanceRole = res.data
      this.userdialogVisible = true
    },
    async changeRole() {
      console.log(this.rolesUser.id)

      if (!this.roleValue) return this.$message('请选择角色')
      const { data: res } = await this.$http.put(`users/${this.rolesUser.id}/role`, { rid: this.roleValue })
      if (res.meta.status !== 200) return this.$message.error('操作失败')
      this.userdialogVisible = false
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped></style>
