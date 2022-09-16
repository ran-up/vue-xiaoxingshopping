<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info"
            >订单提交成功，请您及时付款，以便尽快为您发货~~</span
          >
        </h4>
        <div class="paymark">
          <span class="fl">
            请您在提交订单
            <!-- <em class="orange time">4小时</em> -->
            <em class="orange time">{{ count }}</em>
            之内完成支付，超时订单会自动取消。订单号：
            <em>{{ payInfo.orderId }}</em>
          </span>
          <span class="fr"
            ><em class="lead">应付金额：</em
            ><em class="orange money">￥{{ payInfo.totalFee }}</em></span
          >
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>
            小星商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。
          </li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>
          支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）
        </h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg" /></li>
            <li><img src="./images/pay3.jpg" /></li>
          </ul>
        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg" /></li>
              <li><img src="./images/pay11.jpg" /></li>
              <li><img src="./images/pay12.jpg" /></li>
              <li><img src="./images/pay13.jpg" /></li>
              <li><img src="./images/pay14.jpg" /></li>
              <li><img src="./images/pay15.jpg" /></li>
              <li><img src="./images/pay16.jpg" /></li>
              <li><img src="./images/pay17.jpg" /></li>
              <li><img src="./images/pay18.jpg" /></li>
              <li><img src="./images/pay19.jpg" /></li>
              <li><img src="./images/pay20.jpg" /></li>
              <li><img src="./images/pay21.jpg" /></li>
              <li><img src="./images/pay22.jpg" /></li>
            </ul>
          </div>
        </div>
        <div class="hr"></div>

        <div class="submit">
          <el-button class="btn" @click="open">立即支付</el-button>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  name: "Pay",
  data() {
    return {
      // 订单信息
      payInfo: {},
      // 倒计时
      count: "",
      // 4h倒计时秒数
      seconds: 14400,
      // 支付代码
      code: "",
      timer: null,
    };
  },
  mounted() {
    //获取支付信息
    this.getPayInfo();
    this.getDate();
  },
  methods: {
    // 获取订单支付信息
    async getPayInfo() {
      let result = await this.$api.reqPayInfo(this.$route.query.orderId);
      // console.log(result);
      if (result.code == 200) {
        this.payInfo = result.data;
      }
    },
    // 倒计时
    getDate() {
      setInterval(() => {
        this.seconds -= 1;
        //计算小时数 转化为整数
        var h = parseInt((this.seconds / 60 / 60) % 24);
        //如果小时数小于 10，要变成 0 + 数字的形式 赋值给盒子
        h = h < 10 ? "0" + h : h;
        //计算分钟数 转化为整数
        var m = parseInt((this.seconds / 60) % 60);
        //如果分钟数小于 10，要变成 0 + 数字的形式 赋值给盒子
        m = m < 10 ? "0" + m : m;
        //计算描述 转化为整数
        var s = parseInt(this.seconds % 60);
        //如果秒钟数小于 10，要变成 0 + 数字的形式 赋值给盒子
        s = s < 10 ? "0" + s : s;
        this.count = h + "时" + m + "分" + s + "秒";
      }, 1000);
    },
    // 弹出支付弹出框
    async open() {
      let url = await QRCode.toDataURL(this.payInfo.codeUrl);
      this.$alert(`<img src=${url} />`, "请您微信支付", {
        confirmButtonText: "确定",
        center: true, //居中
        showClose: false, //右上角的关闭按钮不显示
        dangerouslyUseHTMLString: true, //将字符串转换为标签
        confirmButtonText: "支付成功", //确定按钮的文本
        showCancelButton: true, //显示取消按钮
        cancelButtonText: "支付遇见问题", //取消按钮的文本
        closeOnClickModal: true, //点击遮罩层关闭messagebox
        //#region
        /* 
        action 的值为'confirm', 'cancel'或'close'；
        instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法；
        done 用于关闭 MessageBox 实例
        */
        //#endregion
        beforeClose: (action, instance, done) => {
          console.log(action);
          if (action == "cancel") {
            //清除定时器
            clearInterval(this.timer);
            //关闭盒子
            done();
            this.$message.error("支付遇见问题请联系客服");
          } else if (action == "confirm") {
            //清除定时器
            clearInterval(this.timer);
            done();
            this.$router.push("/paysuccess");
          }
        },
      });
      // 支付结果查询
      this.timer = setInterval(async () => {
        let results = await this.$api.reqPayResult(this.$route.query.orderId);
        // console.log(results);
        if (results.code == 200) {
          this.code = results.code;
          //清除定时器
          clearInterval(this.timer);
          //关闭messagebox
          this.$msgbox.close();
          //在路由跳转
          this.$router.push("/paySuccess");
        } else {
          this.code = results.code;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;

        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            line-height: 18px;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
</style>