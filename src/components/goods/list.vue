<template>
  <div>
    <mbx nav1="商品管理" nav2="商品列表"></mbx>
    <el-card>
      <el-row>
        <el-col :span="8" class="inputMag">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getListdata">
            <el-button slot="append" icon="el-icon-search" @click="getListdata"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goRouter">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="getList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="45px"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="removeGoods(scope.row.goods_id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      getList: [],
      total: 0
    }
  },
  created() {
    this.getListdata()
  },
  methods: {
    async getListdata() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryParams
      })
      /* console.log(res) */
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.total = res.data.total
      this.getList = res.data.goods
    },
    handleSizeChange(newsize) {
      this.queryParams.pagesize = newsize
      this.getListdata()
    },
    handleCurrentChange(newnum) {
      this.queryParams.pagenum = newnum
      this.getListdata()
    },
    async removeGoods(id) {
      const doc = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (doc !== 'confirm') return this.$message('已取消')
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getListdata()
    },
    goRouter() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
.inputMag {
  margin-right: 15px;
}
</style>
