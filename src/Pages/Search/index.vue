<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 展示三级列表的选择数据 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 展示关键字 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 展示选择的品牌 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}
              <i @click="removeTrademark">×</i>
            </li>
            <!-- 展示点击的属性 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}
              <i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <!-- 绑定自定义事件:实现儿子给父组件传递数据 -->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <!-- 排序 -->
            <div class="navbar-inner filter">
              <!-- 排序 -->
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changetype(1)">
                  <a
                    >综合
                    <span
                      v-show="isOne"
                      class="iconfont"
                      :class="{
                        'icon-shangjiantou': isAsc,
                        'icon-xiajiantou': isDesc,
                      }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="changetype(2)">
                  <a
                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{
                        'icon-shangjiantou': isAsc,
                        'icon-xiajiantou': isDesc,
                      }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页 -->
          <!-- pageNo当前页  pageSize每页数量 total总数据条数 continues连续页数量-->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getpageno="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  components: { SearchSelector },
  data() {
    return {
      searchParams: {
        // 一级分类的id
        category1Id: "",
        // 二级分类的id
        category2Id: "",
        // 三级分类的id
        category3Id: "",
        // 分类名称
        categoryName: "",
        // 搜索关键字
        keyword: "",
        // 排序
        order: "1:desc",
        // 当前第一页
        pageNo: 1,
        // 每一页显示个数
        pageSize: 10,
        // 平台售卖属性操作带的参数
        props: [],
        // 品牌
        trademark: "",
      },
    };
  },
  beforeMount() {
    // 在请求数据之前先将用户查询的数据整理好
    /*  this.searchParams.category1Id = this.$route.query.category1Id;
    this.searchParams.category2Id = this.$route.query.category2Id;
    this.searchParams.category3Id = this.$route.query.category3Id;
    this.searchParams.categoryName = this.$route.query.categoryName;
    this.searchParams.keyword = this.$route.params.keyword;
    console.log(this.searchParams); */
    // 使用es6新增的Object.assign
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    // 点击相应的品牌显示相应的标签和数据 -- 自定义事件
    // this.$bus.$on("trademarkInfo", (trademark) => {});
  },
  mounted() {
    this.getDate();
  },
  computed: {
    // ...mapState({attrsList: attrsList()})
    // 获取搜索页面数据
    ...mapGetters(["goodsList"]),
    // 动态显示【综合】的背景样式
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    // 动态显示【价格】的背景样式
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    // 动态显示【上箭头】
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    // 动态显示【下箭头】
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    // 获取总共的条数
    ...mapState({ total: (state) => state.search.searchList.total }),
  },
  methods: {
    // 请求搜索页面数据
    getDate() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    // 删除选择的分类
    removeCategoryName() {
      // 将其内容设置为空，设置为""还是会上传服务器，设置undefined不会
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.searchParams.categoryName = undefined;
      // 清空选中品牌的数据，使其显示完整的品牌种类
      // this.searchParams.trademark = undefined;
      // 再次请求数据
      this.getDate();
      // 取消掉导航中的query参数，但是params参数不能省略
      if (this.$route.params) {
        this.$router.push({ name: "Search", params: this.$route.params });
      }
    },
    // 删除搜索框中的关键词
    removeKeyword() {
      this.searchParams.keyword = undefined;
      // 想兄弟组件Header传递关键词已被清空
      this.$bus.$emit("clean");
      // 再次请求数据
      this.getDate();
      // 保留query参数，删除params参数
      if (this.$route.query) {
        this.$router.push({ name: "Search", query: this.$route.query });
      }
    },
    // 将品牌数据添加到searchParams--自定义事件
    trademarkInfo(trademark) {
      // console.log(trademark);
      // 将发过来的数据的id和商品分类名字赋值给搜索数据
      // 整理品牌参数：id:数据
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 将发过来的数据的id和商品分类名字赋值给显示的搜索数据
      // this.searchParams.categoryName = trademark.tmName;
      // this.searchParams.category1Id = trademark.tmId;
      this.getDate();
    },
    // 删除选中的品牌
    removeTrademark() {
      this.searchParams.trademark = undefined;
      this.getDate();
    },
    // 显示相应选中的商品属性--自定义事件
    attrInfo(attrs, attrValue) {
      // console.log(attrs, attrValue);
      // 整理数据：["属性ID:属性值:属性名"]
      let props = `${attrs.attrId}:${attrValue}:${attrs.attrName}`;
      if (this.searchParams.props.indexOf(props) == -1)
        this.searchParams.props.push(props);
      this.getDate();
    },
    // 删除选中的属性
    removeAttr(index) {
      console.log(index);
      // this.searchParams.props.pop(index);
      this.searchParams.props.splice(index, 1);
      this.getDate();
    },
    // 切换【综合】【价格】和箭头方向
    changetype(flag) {
      let originOrder = this.searchParams.order.split(":")[1];
      let nowOrder = null;
      if (flag === 1) {
        nowOrder = originOrder === "desc" ? "asc" : "desc";
        this.searchParams.order = `${flag}:${nowOrder}`;
      } else {
        nowOrder = originOrder === "desc" ? "asc" : "desc";
        this.searchParams.order = `${flag}:${nowOrder}`;
      }
      this.getDate();
    },
    // 点击切换显示页--自定义事件
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo;
      this.getDate();
    },
  },
  watch: {
    $route(newValue, oldValue) {
      // 搜索页面的数据整理
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      // 再次调用，请求数据
      this.getDate();
      // 将上一次的id清空
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>