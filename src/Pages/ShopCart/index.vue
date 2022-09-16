<template>
  <div class="cart">
    <h4>全部商品</h4>
    <!-- 上区域 -->
    <div class="cart-main">
      <!-- 表格头 -->
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <!-- 表格内容 -->
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="shopCart in cartInfoList"
          :key="shopCart.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="shopCart.isChecked == 1"
              @click="changeCheck(shopCart.skuId, $event.target.checked)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="shopCart.imgUrl" />
            <div class="item-msg">{{ shopCart.skuName }}</div>
          </li>
          <!-- 商品单价 -->
          <li class="cart-list-con4">
            <span class="price">{{ shopCart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a class="mins" @click="handler('mins', -1, shopCart)">-</a>
            <!-- 
              v-model="shopCart.skuNum" 不使用这种形式是因为，后面给服务器传输数据时需要取现在的数和之前的数的差
             -->
            <input
              autocomplete="off"
              type="text"
              :value="shopCart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value, shopCart)"
            />
            <a class="plus" @click="handler('plus', 1, shopCart)">+</a>
          </li>
          <!-- 商品总价 -->
          <li class="cart-list-con6">
            <span class="sum"
              >{{ shopCart.skuNum * shopCart.skuPrice }}.00</span
            >
          </li>
          <li class="cart-list-con7">
            <a
              href="#none"
              class="sindelet"
              @click="deleteShopCart(shopCart.skuId)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 下区域 -->
    <div class="cart-tool">
      <div class="select-all">
        <input
          id="checkAll"
          class="chooseAll"
          type="checkbox"
          :checked="isCheckAll && cartInfoList.length > 0"
          @click="checkAllCart($event.target.checked)"
        />
        <label for="checkAll"> 全选</label>
      </div>
      <div class="option">
        <a @click="deleteAllCheckCart()">删除选中的商品</a>
        <a>移到我的关注</a>
        <a>清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          已选择 <span>{{ isCheckedSum }} </span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <!-- 路由跳转:没有任何业务逻辑,声明式、编程式导航都可以 -->
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "@/utils/debounce";
import { mapGetters } from "vuex";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["shopCartList"]),
    // 商品数据
    cartInfoList() {
      return this.shopCartList.cartInfoList || [];
    },
    // 商品总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((item) => {
        // 商品选中才计入总价格中
        sum += item.isChecked === 1 ? item.skuNum * item.skuPrice : 0;
      });
      return sum;
    },
    // 是否勾选全选
    isCheckAll() {
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
    // 选中了多少个商品
    isCheckedSum() {
      let arr = [];
      this.cartInfoList.forEach((item) => {
        // item.isChecked===1 ? 'ture':'false'
        if (item.isChecked) arr.push(item);
      });
      return arr.length;
    },
  },
  methods: {
    // 获取数据
    getData() {
      return this.$store.dispatch("getShopCartList");
    },
    // 判断购物车中的数量操作
    handler(type, disNum, shopCart) {
      switch (type) {
        case "add":
          disNum = 1;
          break;
        case "mins":
          // 商品数等于0个，就删除该商品
          disNum =
            shopCart.skuNum > 1 ? -1 : this.deleteShopCart(shopCart.skuId);
          break;
        case "change":
          disNum =
            isNaN(disNum) || disNum < 1
              ? 1
              : parseInt(disNum) - shopCart.skuNum;
          break;
      }
      // 提交数据到服务器中
      try {
        this.$store.dispatch("addOrUpdateShopCart", {
          skuId: shopCart.skuId,
          skuNum: disNum,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 删除数据
    deleteShopCart(skuId) {
      try {
        this.$store.dispatch("getDeleteShopCart", { skuId: skuId });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 切换商品的选中状态
    async changeCheck(skuId, isChecked) {
      isChecked = isChecked === true ? 1 : 0;
      try {
        await this.$store.dispatch("isCheckeds", { skuID: skuId, isChecked });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 删除所有选中的商品
    async deleteAllCheckCart() {
      try {
        await this.$store.dispatch("getDeleteAllCheckCart");
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 对【全选】进行操作
    async checkAllCart(isChecked) {
      // console.log(event);
      isChecked = isChecked === true ? 1 : 0;
      // console.log(isChecked);
      try {
        await this.$store.dispatch("getCheckAllCart", isChecked);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;
  label {
    cursor: pointer;
  }

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 15%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 14.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 11%;
        }

        .cart-list-con2 {
          width: 28.5%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 12%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 14.5%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        margin: 0 10px;
        color: #666;
        cursor: pointer;
      }
      a:hover {
        text-decoration: underline;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>