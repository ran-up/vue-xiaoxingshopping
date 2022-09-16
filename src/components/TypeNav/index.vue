<!-- 三级联动，在Search、Home、Deail页面都有所以注册为全局组件 -->
<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派|事件代理 -->
      <!-- 鼠标离开一级菜单区域改变背景颜色 -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="sort">
          <!-- 三级联动 -->
          <div class="sort" v-show="isShow">
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item bo"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
              >
                <!--  :class="{ cur: currentIndex === index }" 动态切换类 -->
                <h3
                  @mouseenter="enterChangeBackground(index)"
                  :class="{ cur: currentIndex === index }"
                >
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                  >
                    {{ c1.categoryName }}
                  </a>
                </h3>
                <!-- 二级、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex === index ? 'block' : 'none',
                  }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                        >
                          {{ c2.categoryName }}
                        </a>
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                          >
                            {{ c3.categoryName }}
                          </a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">小星超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { throttle } from "lodash";
export default {
  name: "TypeNav",
  data() {
    return {
      // 当用户缓慢进入一级菜单不会出现意外
      // 当用户很快的经过一级菜单，会出现二三级菜单显示不完全的情况
      // 这个时候就需要使用节流和防抖了
      // 一级菜单当前的索引参数
      currentIndex: -1,
      // 以及菜单是否显示
      isShow: true,
    };
  },
  // 组件挂载完毕，向服务器发起请求
  mounted() {
    // 通知vuex发起请求，将数据存储于仓库中，在app.vue中，这样优化性能，只进行一次数据请求
    // console.log(this.$router);
    if (this.$route.path != "/home") {
      this.isShow = false;
    }
  },
  computed: {
    // 获取数据
    ...mapState({ categoryList: (state) => state.home.categoryList }),
  },
  methods: {
    // 鼠标移入一级菜单改变背景颜色
    enterChangeBackground: throttle(function (index) {
      this.currentIndex = index;
    }, 20),
    // 当鼠标移入的时候，商品列表显示
    enterShow() {
      this.isShow = true;
    },
    // 鼠标离开,隐藏分类区域和改变背景
    leaveShow() {
      this.currentIndex = -1;
      if (this.$route.path != "/home") {
        this.isShow = false;
      }
    },
    // 进行路由跳转
    goSearch(event) {
      // 当点击a标签时才进行跳转，在a标签上添加上自定义属性data-categoryname
      // 节点有一个属性dataset属性，可以获取节点的自定义属性与属性值
      let targetNode = event.target;
      let { categoryname, category1id, category2id, category3id } =
        targetNode.dataset;
      // 如果标签身上有categoryname，则一定是a标签
      if (categoryname) {
        let locations = { name: "Search" };
        let query = { categoryName: categoryname };
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        // 路由跳转
        if (this.$route.params) {
          locations.params = this.$route.params;
          locations.query = query;
          this.$router.push(locations);
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 28px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background: skyblue;
        }
      }
    }
    .sort-enter {
      height: 0;
    }
    .sort-enter-to {
      overflow: hidden;
      height: 461px;
    }
    .sort-enter-active {
      transition: all 0.5s linear;
    }
    .sort-leave {
      height: 461px;
    }
    .sort-leave-to {
      overflow: hidden;
      height: 0;
    }
    .sort-leave-active {
      transition: all 0.5s linear;
    }
  }
}
</style>