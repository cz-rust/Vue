<template>
  <div>
    <mbx nav1="订单管理" nav2="订单列表"></mbx>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column label="#" type="index" width="45px"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="200"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editAddress" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="progressAddress(scope.row.order_id)" size="mini" type="success" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog @close="closeAddress" title="修改地址" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="addressForm" :rules="addressFormrules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader class="addressCas" :props="addressprops" v-model="addressForm.address1" :options="cityData" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流进度" :visible.sync="ProgressdialogVisible" width="30%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressMesg" :key="index" :timestamp="activity.time">
          {{ activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      editDialogVisible: false,
      addressForm: {
        address1: '',
        address2: ''
      },
      addressFormrules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData,
      addressprops: { expandTrigger: 'hover' },
      ProgressdialogVisible: false,
      progressMesg: []
    }
  },
  created() {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderlist()
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getOrderlist()
    },
    editAddress() {
      this.editDialogVisible = true
    },
    closeAddress() {
      this.$refs.addressFormRef.resetFields()
    },
    handleChange(id) {},
    async progressAddress() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.progressMesg = res.data
      this.ProgressdialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.addressCas {
  width: 100%;
}
</style>
