<template>
  <div>
    <!-- 三级联动--全局样式，不需要再引用 -->
    <TypeNav />
    <!-- 轮播图 -->
    <List />
    <!-- 今日推荐 -->
    <Recommend />
    <!-- 商品排行 -->
    <Rank />
    <!-- 猜你喜欢 -->
    <Like />
    <!-- 家用家电 -->
    <!-- :list="floor" 组件通信 props -->
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor" />
  </div>
</template>

<script>
// 轮播图
import List from "@/Pages/Home/List";
// 今日推荐
import Recommend from "@/Pages/Home/Recommend";
// 商品排行
import Rank from "@/Pages/Home/Rank";
// 猜你喜欢
import Like from "@/Pages/Home/Like";
// 家用家电
import Floor from "@/Pages/Home/Floor";
import { mapState } from "vuex";
export default {
  name: "",
  components: {
    List,
    Recommend,
    Rank,
    Like,
    Floor,
  },
  mounted() {
    // 将floor数据写在这里的原因是需要遍历两次floor，如果写在floor组件中，则不能进行遍历
    this.$store.dispatch("getFloorList");
    this.$store.dispatch("getUserInfo");
  },
  computed: {
    ...mapState({ floorList: (state) => state.home.floorList }),
  },
};
</script>

<style scoped>
</style>