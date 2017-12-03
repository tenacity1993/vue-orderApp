<template>
  <div id="seller">
    <div v-el:list-wrapper class="list-wrapper">
      <div class="list">
        <div class="info-wrapper">
          <h1 class="title">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="36" :score="seller.score"></star>
            <span class="ratingCount">({{seller.ratingCount}})</span>
            <span class="sellCount">月售{{seller.sellCount}}单</span>
          </div>
          <div class="info">
            <div class="info-item">
              <h2 class="title">起送价</h2>
              <span class="minPrice">{{seller.minPrice}}<em class="smallText">元</em></span>
            </div>
            <div class="info-item">
              <h2 class="title">商家配送价</h2>
              <span class="deliveryPrice">{{seller.deliveryPrice}}<em class="smallText">元</em></span>
            </div>
            <div class="info-item">
              <h2 class="title">平均送达时间</h2>
              <span class="deliveryTime">{{seller.deliveryTime}}<em class="smallText">分钟</em></span>
            </div>
          </div>
          <div class="heart">
            <i class="icon-favorite" :class="{'isUp': isClick}" @click="heartUp($event)"></i>
            <p class="text">{{heartString}}</p>
          </div>
        </div>
        <div class="active-wrapper">
          <h2 class="title">公告与活动</h2>
          <div class="bulletin">{{seller.bulletin}}</div>
          <ul>
            <li v-for="active in seller.supports" class="active-item">
              <i :class="classMap[active.type]" class="icon"></i>
              <span class="text">{{active.description}}</span>
            </li>
          </ul>
        </div>
        <div class="picture-wrapper">
          <h2 class="title">商家实景</h2>
          <div class="pictures" v-el:picture-wrapper>
            <ul class="pics pics-hook">
              <li v-for="pic in seller.pics" class="pic">
                <img :src="pic">
              </li>
            </ul>
          </div>
        </div>
        <div class="info-group">
          <h2 class="title">商家信息</h2>
          <ul class="infos">
            <li v-for="info in seller.infos" class="info-item">{{info}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="shopcart-wrapper">
      <shopcart v-ref:shopcart :select-foods="selectFoods" :min-price="seller.minPrice" :delivery-price="seller.deliveryPrice"></shopcart>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import star from 'components/seller/star/star';
  import shopcart from 'components/shopcart/shopcart';

  export default {
    data() {
      return {
        seller: {},
        goods: {},
        sellerScroll: {},
        isClick: null
      };
    },
    components: {
      star,
      shopcart
    },
    computed: {
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      },
      heartString() {
        return this.isClick ? '已收藏' : '收藏';
      }
    },
    watch: {
      goods: {
        handler() {
          window.localStorage.setItem('v_goods', JSON.stringify(this.goods));
        },
        deep: true
      }
    },
    methods: {
      _initScroll() {
        this.$els.pictureWrapper.querySelector('.pics-hook').style.width = this.seller.pics.length * 120 + (this.seller.pics.length - 1) * 6 + 'px';
        this.sellerScroll = new BScroll(this.$els.listWrapper, {
          click: true
        });
        this.picScroll = new BScroll(this.$els.pictureWrapper, {
          scrollX: true
        });
      },
      heartUp(event) {
        if (!event._constructed) {
          return;
        }
        this.isClick = !this.isClick;
        window.localStorage.setItem('isClick', this.isClick);
      }
    },
    events: {
      'cart.add'(target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      }
    },
    created() {
      this.seller = JSON.parse(window.localStorage.getItem('v_seller'));
      this.goods = JSON.parse(window.localStorage.getItem('v_goods'));
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.isClick = window.localStorage.getItem('isClick') === 'true';
      this.$nextTick(() => {
        this._initScroll();
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  #seller
    .list-wrapper
      position: absolute
      top: 174px
      bottom: 46px
      width: 100%
      background-color: #f3f5f7
      overflow: hidden
      .list
        .info-wrapper
          position: relative
          padding: 18px
          margin-bottom: 18px
          background-color: #fff
          border-top: 1px solid rgba(7, 17, 27, .1)
          border-bottom: 1px solid rgba(7, 17, 27, .1)
          .title
            margin-bottom: 8px
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 18px
            .ratingCount
              margin-left: 8px
              font-size: 10px
              line-height: 18px
              vertical-align: top
            .sellCount
              margin-left: 12px
              font-size: 10px
              line-height: 18px
              vertical-align: top
          .info
            display: flex
            padding: 18px 0
            border-top: 1px solid rgba(7, 17, 27, .1)
            .info-item
              flex: 1
              border-right: 1px solid rgba(7, 17, 27, .1)
              text-align: center
              .title
                font-size: 10px
                line-height: 10px
                color: rgb(147, 153, 159)
              .minPrice, .deliveryPrice, .deliveryTime
                font-size: 24px
                font-weight: 200
                line-height: 24px
                color: rgb(7, 17, 27)
                .smallText
                  font-size: 10px
                  font-weight: 200
                  font-style: normal
                  line-height: 12px
              &:last-child
                border-right: 0px
          .heart
            position: absolute
            right: 24px
            top: 18px
            width: 36px
            height: 24px
            text-align: center
            .icon-favorite
              margin-bottom: 4px
              font-size: 24px
              line-height: 24px
              color: rgba(7, 17, 27, .1)
              &.isUp
                color: rgb(240, 20, 20)
            .text
              font-size: 10px
              line-height: 10px
              color: rgb(77, 85, 93)
        .active-wrapper
          padding: 18px
          margin-bottom: 18px
          background-color: #fff
          .title
            margin-bottom: 8px
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .bulletin
            padding: 0 12px
            margin-bottom: 16px
            font-size: 12px
            font-weight: 200
            line-height: 24px
            color: rgb(240, 20, 20)
          .active-item
            padding: 18px 12px
            border-top: 1px solid rgba(7, 17, 27, .1)
            &:last-child
              padding-bottom: 0
            .icon
              display: inline-block
              width: 18px
              height: 18px
              background-size: 18px 18px
              background-repeat: no-repeat
              vertical-align: middle
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.special
                bg-image('special_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
            .text
              font-size: 12px
              font-weight: 200
              line-height: 16px
              color: rgb(7, 17, 27)
        .picture-wrapper
          padding: 18px
          margin-bottom: 18px
          font-size: 0
          background-color: #fff
          .title
            margin-bottom: 8px
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .pictures
            width: 100%
            height: 90px
            overflow: hidden
            .pics
              height: 90px
              .pic
                display: inline-block
                margin-right: 6px
                width: 120px
                height: 90px
                &:last-child
                  margin-right: 0
                & > img
                  width: 100%
                  height: 100%
        .info-group
          padding: 18px
          background-color: #fff
          .title
            margin-bottom: 12px
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .info-item
            padding: 18px 12px
            border-top: 1px solid rgba(7, 17, 27, .1)
            font-size: 12px
            font-weight: 200
            line-height: 16px
            color: rgb(7, 17, 27)
            &:last-child
              padding-bottom: 0
    .shopcart-wrapper
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 46px
</style>
