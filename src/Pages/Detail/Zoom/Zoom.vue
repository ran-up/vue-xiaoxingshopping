<template>
  <div class="spec-preview">
    <!-- 这时没有数据，为空，所以找不到数据 -->
    <!-- <img :src="skuImageList.imgUrl" /> -->
    <img :src="imgList.imgUrl" />
    <!-- 大框框 -->
    <div class="event" @mousemove="changePosition"></div>
    <div class="big">
      <img :src="imgList.imgUrl" ref="big" />
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ["skuImageList"],
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    imgList() {
      return this.skuImageList[this.currentIndex] || {};
    },
  },
  mounted() {
    // 接收兄弟组件传过来的索引值
    this.$bus.$on("getCurrentIndex", (index) => {
      // console.log(index);
      this.currentIndex = index;
    });
  },
  methods: {
    changePosition() {
      // console.log("123");
      let mask = this.$refs.mask;
      let big = this.$refs.big;
      // console.log(event.offsetX, mask.offsetWidth);
      let left = event.offsetX - mask.offsetWidth / 2;
      let top = event.offsetY - mask.offsetHeight / 2;

      if (left <= 0) left = 0;
      if (left >= 200) left = 200;
      if (top <= 0) top = 0;
      if (top >= 200) top = 200;

      mask.style.left = left + "px";
      mask.style.top = top + "px";

      big.style.left = -left * 2 + "px";
      big.style.top = -top * 2 + "px";
    },
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>