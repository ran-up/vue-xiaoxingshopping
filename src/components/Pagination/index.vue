<template>
  <div class="pagination">
    <button :disabled="pageNo === 1" @click="$emit('getpageno', pageNo - 1)">
      上一页
    </button>
    <!-- 当最小的数为2时显示1，组成1 2 3 4 5 6 -->
    <!-- 1平时是一直显示的，只有当start的值和1一样，那么1就不显示，而是显示start的1 -->
    <button
      v-show="startNumAndEndNum.start > 1"
      @click="$emit('getpageno', 1)"
      :class="{ active: pageNo === 1 }"
    >
      1
    </button>
    <button class="noPainter" v-if="startNumAndEndNum.start > 2">···</button>

    <!-- 遍历startNumAndEndNum中的end，但是要保证page大于等于start -->
    <!-- 如果v-for和v-if同时存在，v-for优先级比v-if要高 -->
    <template v-for="page in startNumAndEndNum.end">
      <button
        :key="page"
        v-if="pageStart(page)"
        @click="$emit('getpageno', page)"
        :class="{ active: pageNo === page }"
      >
        {{ page }}
      </button>
    </template>

    <button v-if="startNumAndEndNum.end < totalPage - 1">···</button>
    <button
      v-if="startNumAndEndNum.end < totalPage"
      @click="$emit('getpageno', totalPage)"
      :class="{ active: pageNo === totalPage }"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo === totalPage"
      @click="$emit('getpageno', pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ totalPage }} 页</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    // 计算将数据分为多少页（分页数）
    totalPage() {
      // 向上取整，防止有小数
      return Math.ceil(this.total / this.pageSize);
    },
    // 计算连续分页的开始和结束
    startNumAndEndNum() {
      let start = 0,
        end = 0;
      const { continues, totalPage, pageNo } = this;
      // 如果设置的连续页页大于了总分页数，则显示全部的总页数
      if (continues > totalPage) {
        start = 1;
        end = totalPage;
      } else {
        // 正常情况下
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
        // 前面出现了start小于等于0的情况，手动改成显示相关连续页
        if (start < 1) {
          start = 1;
          end = continues;
        }
        // 后面出现end大于了最后页的情况，手动改成显示相关连续页
        if (end > totalPage) {
          start = totalPage - continues + 1;
          end = totalPage;
        }
      }
      return { start, end };
    },
  },
  methods: {
    // 当前的页数要大于上面计算出来的start
    pageStart(page) {
      // console.log(this.startNumAndEndNum.start);
      // console.log(page >= this.startNumAndEndNum.start);
      return page >= this.startNumAndEndNum.start;
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
    text-align: center;
    border: 0;
    cursor: pointer;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
  .noPainter {
    cursor: default;
  }
}
</style>