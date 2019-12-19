<template>
  <div class="login-contain">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="img-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormres" :model="loginForm" label-width="0px" class="login_form" :rules="rules">
        <!-- 用户 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      /* 利用ref获取标签的引用信息调用方法对表单进行重置 */
      this.$refs.loginFormres.resetFields()
    },
    login () {
      this.$refs.loginFormres.validate(async vali => {
        if (!vali) return false
        const { data } = await this.$http.post('login', this.loginForm)
        if (data.meta.status !== 200) {
          this.$message.error('登录失败')
          return false
        }
        this.$message.success('登录成功')
        /* 将服务器传递的token保存到sessionStorage中来验证是否登录 */
        window.sessionStorage.setItem('token', data.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-contain {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.img-box {
  width: 130px;
  height: 130px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  box-shadow: 0 0 10px #ddd;
}
.img-box img {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
