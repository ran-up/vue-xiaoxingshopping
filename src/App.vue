<template>
  <div>
    <Header />
    <!-- 三级联动 -->
    <router-view></router-view>
    <Footer v-show="$route.meta.isShow" />
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 派发一个action|获取商品分类的三级列表的数据
    this.$store.dispatch("categoryList");
    // this.$store.dispatch("getUserInfo");
  },
};
</script>

<style>
</style>
