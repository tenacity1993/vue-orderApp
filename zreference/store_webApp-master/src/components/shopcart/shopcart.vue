<template>
  <div id="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList($event)">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <span class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></span>
          </div>
          <div class="number" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">¥{{totalPrice}}元</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="{'highlight': this.totalPrice >= this.minPrice}">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls" v-show="ball.show" transition="drop" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcart-list" v-show="listShow" transition="fold">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="clean">清空</span>
      </div>
      <div class="list-content" v-el:list-wrapper>
        <ul>
          <li v-for="food in selectFoods" class="food border-1px">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>¥{{food.price * food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="bg-wrapper" v-show="listShow" @click="toggleList">
      <div class="bg-filter"></div>
    </div>
  </div>
</template>

<script>
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number
      },
      minPrice: {
        type: Number
      }
    },
    components: {cartcontrol},
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList(event) {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;

        if (this.fold) {
          this.$nextTick(() => {
            this.listScroll.scrollTo(0, 0);
          });
        }
      },
      clean() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元`;
        } else {
          return '去结算';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }

        let show = !this.fold;

        this.$nextTick(() => {
          if (show) {
            if (this.listScroll) {
              this.listScroll.refresh();
            }
          }
        });

        return show;
      }
    },
    transitions: {
      drop: {
        beforeEnter(el) {
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left - 40;
              let y = -(window.innerHeight - rect.top - 30);
              el.style.display = '';
              el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
              el.style.transform = `translate3d(0, ${y}px, 0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
              inner.style.transform = `translate3d(${x}px, 0, 0)`;
            }
          }
        },
        enter(el) {
          /* eslint-disable no-unused-vars */
          let rf = el.offsetHeight;
          this.$nextTick(() => {
              el.style.webkitTransform = 'translate3d(0, 0, 0)';
              el.style.transform = 'translate3d(0, 0, 0)';
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = 'translate3d(0, 0, 0)';
              inner.style.transform = 'translate3d(0, 0, 0)';
          });
        },
        afterEnter(el) {
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    created() {
      this.$nextTick(() => {
        this.listScroll = new BScroll(this.$els.listWrapper, {
          click: true
        });
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  #shopcart
    .content
      display: flex
      height: 46px
      background-color: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          position: relative
          top: -10px
          display: inline-block
          margin: 0 8px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 28px
          background-color: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background-color: #2b343c
            text-align: center
            &.highlight
              background-color: rgb(0, 160, 220)
            .icon-shopping_cart
              width: 100%
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .number
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 8px
            font-size: 9px
            font-weight: 700
            color: #fff
            background-color: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          padding-right: 12px
          font-size: 16px
          font-weight: 700
          line-height: 24px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, .1)
          color: rgba(255, 255, 255, .4)
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
          color: rgba(255, 255, 255, .4)
      .content-right
        flex: 0 0 105px
        .pay
          width: 105px
          line-height: 46px
          text-align: center
          font-weight: 700
          color: rgba(255, 255, 255, .4)
          background-color: #2b343c
          &.highlight
            background-color: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-transition
          transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 8px
            background-color: rgb(0, 160, 220)
            transition: all .4s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transition: all .5s ease
      &.fold-transition
        transform: translate3d(0, -100%, 0)
      &.fold-enter
        transform: translate3d(0 , 0, 0)
      &.fold-leave
        transform: translate3d(0 , 0, 0)
        transition: all 500ms ease
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background-color: #f4f5f7
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 216px
        overflow: hidden
        background-color: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, .1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
    .bg-wrapper
      position: fixed
      left: 0
      bottom: 0
      z-index: -2
      width: 100%
      height: 100%
      .bg-filter
        width: 100%
        height: 100%
        background-color: rgba(7, 17, 27, .6)
        backdrop-filter: blur(10px)
</style>
