<template>
  <el-container class="home-Container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <el-container>
      <!-- 导航栏 -->
      <el-aside :width="toggleCollapse ? '65px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#4091ff"
          :unique-opened="true"
          :collapse="toggleCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="defaultActive"
        >
          <!-- router开启路由模式 -->
          <!-- default-active点击高亮显示 -->
          <div class="toggle" @click="toggleButton">|||</div>
          <!-- 一级导航 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item :index="'/' + item.path + ''" v-for="item in item.children" :key="item.id" @click="activeState('/' + item.path + '')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      toggleCollapse: false,
      defaultActive: ''
    }
  },
  created() {
    this.getMenulist()
    this.defaultActive = window.sessionStorage.getItem('path')
    /* 高亮操作，在页面刷新的时候同时保持所记录的路由的按钮保持高亮 */
  },
  methods: {
    out() { /* 退出登录 */
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenulist() { /* 列表数据 */
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.menuList = res.data
    },
    toggleButton() { /* 折叠列表 */
      this.toggleCollapse = !this.toggleCollapse
    },
    activeState(val) { /* 按钮高亮 */
      window.sessionStorage.setItem('path', val)
      this.defaultActive = val
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  color: #fff;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    > span {
      font-size: 20px;
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: 0px; /* 去除多出的边框线 */
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-Container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  font-size: 10px;
  line-height: 24px;
}
</style>
