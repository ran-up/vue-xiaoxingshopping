<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go">
          <!-- 我有账号，去 <a href="login.html" target="_blank">登陆</a> -->
          我有账号，去 <router-link to="/login">登陆</router-link>
        </span>
      </h3>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
        class="forms"
      >
        <el-form-item label="电话号码" label-width="150px" prop="phone">
          <el-input v-model="ruleForm.phone" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="验证码" label-width="150px" prop="code">
          <el-input v-model="ruleForm.code" style="width: 300px"></el-input>
          <img
            ref="code"
            src="../../assets/code.jpg"
            alt="code"
            @click="getCode"
            style="width: 60px"
          />
        </el-form-item>
        <el-form-item label="密码" label-width="150px" prop="password">
          <el-input
            :placeholder="ruleForm.password"
            v-model="ruleForm.password"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="150px" prop="password1">
          <el-input
            :placeholder="ruleForm.password1"
            v-model="ruleForm.password1"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="协议" label-width="150px" prop="phone">
          <el-checkbox v-model="ruleForm.agree">
            <span>同意协议并注册《小星商城用户协议》</span>
          </el-checkbox>
        </el-form-item>
        <el-form-item class="btn">
          <!-- 关闭默认事件，让点击按钮之后调用方法 -->
          <button @click.prevent="register">完成注册</button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>小星新品</li>
        <li>销售联盟</li>
        <li>小星社区</li>
      </ul>
      <div class="address">地址：中国重庆</div>
      <div class="beian">京ICP备xxxxxxx号</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    // 电话号码验证
    const checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    // 验证两次密码是否相同
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
        // password 是表单上绑定的字段
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        //手机号
        phone: "",
        //存储验证码
        code: "",
        //登录密码
        password: "",
        //确认密码
        password1: "",
        //协议
        agree: true,
      },
      rules: {
        phone: [
          { validator: checkPhone, message: "请输入电话号码", trigger: "blur" },
        ],
        code: [{ required: true, message: "验证码", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern:
              // ?![a-zA-Z]: 零宽断言，表示断言之后的内容不能是英文字母，就是匹配数字
              /^(?![a-zA-Z]+$)((?![A-Z0-9]+$)|(?![a-z0-9]+$))[(a-zA-Z0-9)|(a-z0-9)|(A-Z0-9)]{6,18}$/,
            message: "密码为数字,字母，长度为 6 - 18位",
          },
        ],
        password1: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        agree: [{ required: true, trigger: "change" }],
      },
    };
  },
  methods: {
    // 获取验证码
    async getCode() {
      let { phone } = this.ruleForm;
      try {
        if (phone) {
          // console.log(phone);
          await this.$store.dispatch("getCode", phone);
          // console.log(this.$store);
          this.ruleForm.code = this.$store.state.user.code;
        } else {
        }
      } catch (error) {
        alert("验证码获取失败");
      }
    },
    // 向服务器传递数据
    async register() {
      let { phone, password, code } = this.ruleForm;
      try {
        if (code) {
          await this.$store.dispatch("registerInfo", {
            phone,
            password,
            code,
          });
          this.$router.push("/login");
        } else {
          code.length <= 0 ? alert("请输入验证码") : alert("验证码输入错误");
        }
      } catch (error) {
        alert("注册失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
  .register {
    position: relative;
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }
    .forms {
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>