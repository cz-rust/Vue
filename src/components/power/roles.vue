<template>
  <div>
    <mbx nav1="权限管理" nav2="角色列表"></mbx>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesData" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item, ind1) in scope.row.children" :key="item.id" :class="['colbottom', ind1 == 0 ? 'coltop' : '', 'tag-center']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="closeTag(scope.row, item)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, ind2) in item.children" :key="item2.id" :class="[ind2 !== 0 ? 'coltop' : '', 'tag-center']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="closeTag(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="closeTag(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="taskRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="rightsdialogVisible" width="50%" @close="tresskeysclose">
        <el-tree ref="treeRef" :data="rightsList" :props="defaultProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="treekeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editrights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesData: [],
      rightsList: [],
      treekeys: [],
      roleRightsid: '',
      rightsdialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async getrolesData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.rolesData = res.data
      /*  console.log(this.rolesData) */
    },
    async closeTag(rolesId, righstsid) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => res)
      /* console.log(res) */
      if (res !== 'confirm') return this.$message('取消成功')
      const { data: doc } = await this.$http.delete(`roles/${rolesId.id}/rights/${righstsid}`)
      if (doc.meta.status !== 200) return this.$message('删除失败')
      rolesId.children = doc.data
    },
    async taskRights(roles) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.rightsList = res.data
      this.getkeyTree(roles, this.treekeys)
      /* console.log(this.rightsList) */
      this.roleRightsid = roles.id

      this.rightsdialogVisible = true
    },
    getkeyTree(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getkeyTree(item, arr)
      })
    },
    tresskeysclose() {
      this.treekeys = []
    },
    async editrights() {
      const arr = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()]
      /* console.log(arr) */
      const str = arr.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleRightsid}/rights`, { rids: str })
      if (res.meta.status !== 200) return this.$message('添加失败')
      this.getrolesData()
      this.rightsdialogVisible = false
    }
  },
  created() {
    this.getrolesData()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.colbottom {
  border-bottom: 1px solid #eee;
}
.coltop {
  border-top: 1px solid #eee;
}
.tag-center {
  display: flex;
  align-items: center;
}
</style>
