<template>
  <div v-show="showFlag" id="food" transition="move" v-el:show-flag>
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image">
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now" >¥{{food.price}}</span><!--
          --><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
        </div>
        <div class="button-wrapper">
          <div class="button-style" v-show="buttonShow" @click="add($event)" transition="show">
            <div class="button">加入购物车</div>
          </div>
          <cartcontrol :food="food" v-show="food.count > 0" v-ref:cartcontrol class="cartcontrol"></cartcontrol>
        </div>
      </div>
      <div class="description">
        <h1 class="title">商家介绍</h1>
        <div class="info">{{food.info}}</div>
      </div>
      <div class="rating-wrapper">
        <h1 class="title">商品评价</h1>
        <ratinglist :ratings="food.ratings" v-ref:ratinglist></ratinglist>
      </div>
    </div>
    <div class="title-wrapper">
      <div class="back" @click="back($event)">
        <i class="icon-arrow_lift"></i>
      </div>
      <div class="bg" v-show="titleShow" transition="fade">
        <h1>{{food.name}}</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import Vue from 'vue';
  import ratinglist from 'components/food/ratinglist/ratinglist';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartcontrol,
      ratinglist
    },
    data() {
      return {
        showFlag: false,
        titleShow: false,
        scrollY: 0
      };
    },
    events: {
      'creat'() {
        this.$nextTick(() => {
          this.foodScroll.refresh();
        });
      }
    },
    methods: {
      show() {
        this.showFlag = !this.showFlag;
      },
      back(event) {
        if (!event._constructed) {
          return;
        }
        this.showFlag = false;
      },
      add(event) {
        if (!event._constructed) {
          return;
        }

        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
      }
    },
    computed: {
      buttonShow() {
        if (this.food.count === undefined || this.food.count === 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    watch: {
      showFlag() {
        this.foodScroll.refresh();
      },
      scrollY(value) {
        if (value > 50) {
          this.titleShow = true;
        } else if (value <= 50 && value >= 0) {
          this.titleShow = false;
        }
      }
    },
    transitions: {
      move: {
        beforeEnter() {
          this.$refs.ratinglist.init();
        },
        afterLeave() {
          this.foodScroll.scrollTo(0, 0);
          this.scrollY = 0;
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.foodScroll = new BScroll(this.$els.showFlag, {
          click: true,
          probeType: 3
        });

        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = -Math.round(pos.y);
        });
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #food
    position: fixed
    top: 0
    left: 0
    bottom: 46px
    width: 100%
    z-index: 10
    background-color: #f3f5f7
    transition: transform .4s ease-in-out
    &.move-transition
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave
      transform: translate3d(100%, 0, 0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        & > img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .content
        position: relative
        padding: 18px
        margin-bottom: 18px
        background-color: #fff
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .price
          .now
            line-height: 24px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            margin-left: 12px
            line-height: 24px
            font-size: 10px
            font-weight: 700
            text-decoration: line-through
            color: rgb(147, 153, 159)
        .button-wrapper
          position: absolute
          right: 18px
          bottom: 10px
          width: 86px
          height: 36px
          .button-style
            position: absolute
            padding: 6px
            width: 74px
            overflow: hidden
            transition: opacity .2s ease
            .button
              padding: 6px 0
              width: 74px
              height: 24px
              box-sizing: border-box
              font-size: 10px
              line-height: 12px
              text-align: center
              border-radius: 24px
              font-size: 10px
              linehgith: 24px
              background-color: rgb(0, 160, 220)
              color: #f3f5f7
            &.show-transition
              opacity: 1
            &.show-enter, &.show-leave
              opacity: 0
          .cartcontrol
            position: absolute
      .description
        padding: 18px
        margin-bottom: 18px
        background-color: #fff
        & > h1
           margin-bottom: 6px
        .info
          padding: 0 8px
          font-size: 12px
          font-weight: 200
          line-height: 24px
          color: rgb(77, 85, 93)
      .rating-wrapper
        padding: 18px 18px 0 18px
        min-height: 200px
        background-color: #fff
    .title-wrapper
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 60px
      .back
        position: absolute
        top: 5px
        left: 0
        padding: 10px
        z-index: 20
        .icon-arrow_lift
          font-size: 16px
          color: #eee
      .bg
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 45px
        line-height: 45px
        text-align: center
        z-index: 10
        background-color: #00a0dc
        color: #f5f5f5
        transition: opacity .4s ease-out
        &.fade-transition
          opacity: 1
        &.fade-enter, &.fade-leave
          opacity: 0
</style>
