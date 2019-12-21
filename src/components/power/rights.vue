<template>
  <div>
    <mbx nav1='权限管理' nav2='权限列表'></mbx>
    <el-card>
      <el-table :data="rightList" stripe style="width: 100%">
        <el-table-column type="index" width="180"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if='scope.row.level==0'>一级</el-tag>
            <el-tag type="success" v-if="scope.row.level==1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level==2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async getlist() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message('获取数据失败')
      this.rightList = res.data
      /*  console.log(this.rightList) */
    }
  },
  created() {
    this.getlist()
  }
}
</script>
<style lang="less" scoped></style>
