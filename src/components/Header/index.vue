<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>小星商城欢迎您！</p>
          <p v-show="!$store.state.user.nickName">
            <span>请</span>
            <!-- 声明式导航 -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-show="$store.state.user.nickName">
            <!-- 声明式导航 -->
            <a>{{ $store.state.user.nickName }} </a>
            <span>|</span>
            <a style="cursor: pointer" @click="outLogin"> 退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <router-link to="/home">我的小星</router-link>
          <a href="###">小星会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注小星</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      keyword: "",
    };
  },
  beforeCreate() {
    this.$bus.$on("clean", () => (this.keyword = ""));
  },
  methods: {
    // 搜索跳转功能
    goSearch() {
      if (this.$route.query) {
        this.$router.push({
          name: "Search",
          params: { keyword: this.keyword || undefined },
          query: this.$route.query,
        });
      }
      // 这种方式不能清除组件中传递的keyword，只是将输入框中的内容清除了
      // this.keyword = "";
    },
    mounted() {
      this.$store.dispatch("getUserInfo");
    },
    // 退出登录
    outLogin() {
      try {
        this.$store.dispatch("outLogin");
        // 退出登录后跳转到登录页面，但是因为设置了全局守卫路由，跳转不到登录页面（跳转前还没有清空用户的信息和token）
        // 所以给它设置了一个定时器，让其清空用户相关信息之后再执行
        setTimeout(() => {
          // console.log(this.$store.state.user);
          this.$router.push("/login");
        }, 1000);
      } catch (error) {
        alert("退出登陆失败");
      }
    },
  },
  mounted() {
    this.$store.dispatch("getUserInfo");
  },
};
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>