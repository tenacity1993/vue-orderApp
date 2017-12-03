<template>
  <div id="ratings">
    <div class="list-wrapper" v-el:ratings-wrapper>
      <div class="list">
        <div class="info-wrapper">
          <div class="score-wrapper">
            <div class="score">{{seller.score}}</div>
            <div class="title">综合得分</div>
            <div class="per">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="star-wrapper">
            <div class="star-items">
              <span class="title">服务态度</span>
              <span class="star">
                <star :size="36" :score="seller.score"></star>
              </span>
              <span class="score">{{seller.score}}</span>
            </div>
            <div class="star-items">
              <span class="title">服务态度</span>
              <span class="star">
                <star :size="36" :score="seller.score"></star>
              </span>
              <span class="score">{{seller.score}}</span>
            </div>
            <div class="star-items">
              <span class="title">送达时间</span>
              <span class="time">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <div class="ratings-wrapper">
          <div class="button-wrapper border-1px">
            <span class="button total" @click="showType('total', $event)">全部<span class="count">{{totalCount}}</span></span><!--
            --><span class="button recommend" @click="showType('recommend', $event)">推荐<span class="count">{{recommendCount}}</span></span><!--
            --><span class="button disgusted" @click="showType('disgusted', $event)">吐槽<span class="count">{{disgustedCount}}</span></span>
          </div>
          <div class="choice-wrapper">
            <span class="choice-icon" @click="showContent($event)">
              <i class="icon-check_circle" :class="{'active': hasContent}"></i>
            </span><!--
            --><span class="content">只看有内容的评价</span>
          </div>
          <div class="line"></div>
          <div class="ratinglist">
            <ul>
              <li v-show="isShow(rating.rateType, rating.text)" v-for="rating in ratings" class="rating-item border-1px">
                <div class="avatar">
                  <img width="28" height="28" :src="rating.avatar">
                </div>
                <div class="content">
                  <div class="info clearfix">
                    <span classs="username">{{rating.username}}</span>
                    <div class="time-wrapper">
                      <span class="date">{{timeString[$index].date}}</span>
                      <span class="time">{{timeString[$index].time}}</span>
                    </div>
                  </div>
                  <div class="score-wrapper">
                    <star :size="24" :score="rating.score"></star>
                    <span v-show="rating.deliveryTime" class="deliveryTime">{{rating.deliveryTime}}分钟后到达</span>
                  </div>
                  <div v-show="rating.text" class="text">{{rating.text}}</div>
                  <div v-show="rating.recommend.length" class="recommends">
                    <i :class="[rating.rateType === 0 ? 'icon-thumb_up' : 'icon-thumb_down', {'isUp': rating.rateType === 0 ? true : false}]"></i>
                    <span v-for="food in rating.recommend" class="food-item">{{food}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="shopcart-wrapper">
      <shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
  </div>
</template>

<script>
  import star from 'components/seller/star/star';
  import shopcart from 'components/shopcart/shopcart';
  import BScroll from 'better-scroll';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {},
        goods: [],
        ratingsScroll: {},
        ratings: [],
        selectType: 2,
        hasContent: false
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
      totalCount() {
        if (this.ratings) {
          return this.ratings.length;
        } else {
          return 0;
        }
      },
      recommendCount() {
        let recommends = [];

        if (this.ratings) {
          this.ratings.forEach((rating) => {
            if (rating.rateType === 0) {
              recommends.push(rating);
            }
          });

          this.recommends = recommends;
          return recommends.length;
        } else {
          return 0;
        }
      },
      disgustedCount() {
        let disgusteds = [];

        if (this.ratings) {
          this.ratings.forEach((rating) => {
            if (rating.rateType !== 0) {
              disgusteds.push(rating);
            }
          });

          this.disgusteds = disgusteds;
          return disgusteds.length;
        } else {
          return 0;
        }
      },
      timeString() {
        let timeStringArray = [];
        this.ratings.forEach((rating) => {
          let time = new Date(rating.rateTime);
          let year = time.getFullYear();
          let month = time.getMonth();
          let day = time.getDate();
          let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
          let min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
          let timeString = {};

          timeString.date = year + '-' + month + '-' + day;
          timeString.time = hour + ':' + min;
          timeStringArray.push(timeString);
        });
        return timeStringArray;
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
        this.ratingsScroll = new BScroll(this.$els.ratingsWrapper, {
          click: true
        });
      },
      showContent(event) {
        if (!event._constructed) {
          return;
        }
        this.hasContent = !this.hasContent;
        this.$nextTick(() => {
          this.ratingsScroll.refresh();
        });
      },
      showType(type, event) {
        if (!event._constructed) {
          return;
        }
        switch (type) {
          case 'total' :
            this.selectType = 2;
            break;
          case 'recommend' :
            this.selectType = 0;
            break;
          case 'disgusted' :
            this.selectType = 1;
            break;
        }
        this.$nextTick(() => {
          this.ratingsScroll.refresh();
        });
      },
      isShow(type, content) {
        if (this.hasContent) {
          return content === '' ? false : this.selectType === 2 ? true : type === this.selectType;
        } else {
          return this.selectType === 2 ? true : type === this.selectType;
        }
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

      this.$http.get('/api/ratings').then((response) => {
        let result = response.body;

        if (result.errno === ERR_OK) {
          this.ratings = result.data;

          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  #ratings
    .list-wrapper
      position: absolute
      top: 174px
      bottom: 46px
      width: 100%
      overflow: hidden
      background-color: #f3f5f7
      .list
        .info-wrapper
          display: flex
          padding: 18px 0
          margin-bottom: 16px
          border-top: 1px solid rgba(7, 17, 27, .1)
          border-bottom: 1px solid rgba(7, 17, 27, .1)
          background-color: #fff
          .score-wrapper
            flex: 0 0 137px
            text-align: center
            border-right: 1px solid rgba(7, 17, 27, .1)
            .score
              margin-bottom: 6px
              font-size: 24px
              line-height: 28px
              color: rgb(255, 153, 0)
            .title
              margin-bottom: 8px
              font-size: 12px
              line-height: 12px
              color: rgb(7, 17, 27)
            .per
              font-size: 10px
              line-height: 10px
              color: rgba(7, 17, 27, .5)
          .star-wrapper
            flex: 3
            padding: 0 0px
            .star-items
              margin-bottom: 8px
              padding: 0 0 0 24px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .title
                display: inline-block
                font-size: 12px
                line-height: 18px
                vertical-align: top
              .star
                display: inline-block
                margin-left: 12px
                height: 20px
                line-hegiht: 20px
              .score
                display: inline-block
                margin-left: 12px
                font-size: 12px
                line-height: 18px
                vertical-align: top
                color: rgb(250, 153, 0)
              .time
                display: inline-block
                margin-left: 12px
                font-size: 12px
                line-height: 18px
        .ratings-wrapper
          padding: 18px 18px 0 18px
          background-color: #fff
          .button-wrapper
            width: 100%
            padding-bottom: 18px
            border-1px(rgba(7, 17, 27, .1))
            .button
              display: inline-block
              margin-right: 8px
              padding: 8px 12px
              height: 12px
              font-size: 12px
              lint-height: 12px
              text-align: center
              border-radius: 2px
              background-color: #eee
              &.total
                color: #fff
                background-color: rgb(0, 160, 220)
              &.recommend
                color: rgb(77, 85, 93)
                background-color: rgb(193, 231, 247)
              &.disgusted
                color: rgb(77, 85, 93)
                background-color: rgba(77, 85, 93, .2)
              .count
                margin-left: 4px
                font-size: 10px
          .line
            position: absolute
            left: 0
            width: 100%
            border-bottom: 1px solid rgba(7, 17, 27, .1)
          .choice-wrapper
            padding: 12px 0
            .choice-icon
              display: inline-block
              margin-right: 4px
              vertical-align: middle
              .icon-check_circle
                font-size: 24px
                line-height: 24px
                color: rgb(147, 153, 159)
                &.active
                  color: #00b43c
            .content
              padding: 0
              font-size: 12px
              lint-height: 24px
              color: rgb(147, 153, 159)
              vertical-align: middle
          .ratinglist
            .rating-item
              display: flex
              padding: 18px
              border-1px(rgba(7, 17, 27, .1))
            .avatar
              flex: 0 0 28px
              width: 28px
              & > img
                border-radius: 14px
            .content
              flex: 1
              margin-left: 12px
              .info
                font-size: 10px
                line-height: 12px
                .username
                  float: left
                .time-wrapper
                  float: right
                  font-weight: 200
                  color: rgb(147, 153, 159)
                  .date
                    margin-right: 6px
              .score-wrapper
                margin-bottom: 6px
                .deliveryTime
                  font-size: 10px
                  line-height: 12px
                  color: rgb(143, 153, 159)
              .text
                margin-bottom: 8px
                font-size: 12px
                line-height: 16px
                color: rgb(7, 17, 27)
              .recommends
                width: 100%
                height: 16px
                font-size: 0
                overflow: hidden
                .icon-thumb_up, .icon-thumb_down
                  font-size: 12px
                  line-height: 16px
                  color: rgb(147, 153, 159)
                  vertical-align: middle
                .icon-thumb_up
                  &.isUp
                    color: #00a0dc
                .food-item
                  display: inline-block
                  margin-left: 8px
                  padding: 0 6px
                  width: 70px
                  height: 16px
                  font-size: 9px
                  line-height: 16px
                  box-sizing: border-box
                  border: 1px solid rgba(7, 17, 27, .1)
                  overflow: hidden
                  white-space: nowrap
                  text-overflow: ellipsis
                  text-align: center
                  color: rgb(147, 153, 159)
                  vertical-align: middle
  .shopcart-wrapper
    position: fixed
    left: 0
    bottom: 0
    z-index: 40
    width: 100%
    height: 46px
</style>
