<template>
  <div id="goods">
    <div class="list-wrapper">
      <!-- menu -->
      <div class="menu-wrapper" v-el:menu-wrapper>
        <ul>
          <li v-for="item in goods" class="menu-item menu-item-hook" :class="{'current': currentIndex === $index}" @click="selectMenu($index, $event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!-- foods -->
      <div class="foods-wrapper" v-el:foods-wrapper>
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food, $event)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售价{{food.sellCount}}份</span><!--
                    --><span>好评率{{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="now" >¥{{food.price}}</span><!--
                    --><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="shopcart-wrapper">
      <shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food v-ref:food :food="selectedFood"></food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  import Vue from 'vue';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    events: {
      'cart.add'(target) {
        this._drop(target);
      }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$els.menuWrapper, {
          click: true
        });

        this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
          click: true,
          probeType: 3
        });

        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });

        this.menuClientHeight = this.$els.menuWrapper.clientHeight;
      },
      _calculateFoodHeight() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);

        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _calculateMenuHeight() {
        this.menuItems = this.$els.menuWrapper.getElementsByClassName('menu-item-hook');
        let height = 0;
        this.menuHeight.push(height);

        for (let i = 0; i < this.menuItems.length; i++) {
          let item = this.menuItems[i];
          height += item.clientHeight;
          this.menuHeight.push(height);
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 100);
      },
      _drop(target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.selectedFood.ratings.forEach((rating) => {
          if (!rating.isShow) {
            Vue.set(rating, 'isShow', true);
          }
        });
        this.$refs.food.show();
      }
    },
    watch: {
      currentIndex() {
        let staticScroll = this.menuScroll.y;
        let selfHeight = this.menuHeight[this.currentIndex + 1] - this.menuHeight[this.currentIndex];
        let visiableHeight = this.menuHeight[this.currentIndex + 1] - (-staticScroll);
        let isScroll = visiableHeight < selfHeight || visiableHeight > this.menuClientHeight;
        let scrollType = visiableHeight < selfHeight ? 'top' : 'bottom';
        let scrollY = 0;

        if (isScroll) {
          switch (scrollType) {
            case 'top' :
              scrollY = -this.menuHeight[this.currentIndex];
              break;
            case 'bottom' :
              scrollY = -(this.menuHeight[this.currentIndex + 1] - this.menuClientHeight);
              break;
          }
          this.menuScroll.scrollTo(0, scrollY);
        }
      },
      goods: {
        handler() {
          window.localStorage.setItem('v_goods', JSON.stringify(this.goods));
        },
        deep: true
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
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
      }
    },
    data() {
      return {
        goods: [],
        menuScroll: null,
        foodsScroll: null,
        listHeight: [],
        menuHeight: [],
        selectedFood: {},
        scrollY: 0
      };
    },
    created() {
      let isExisits = window.localStorage.getItem('v_goods');
      if (!isExisits) {
        this.$http.get('/api/goods').then((response) => {
          let result = response.body;
          if (result.errno === ERR_OK) {
            this.goods = result.data;
            this.$nextTick(() => {
              this._initScroll();
              this._calculateFoodHeight();
              this._calculateMenuHeight();
            });
          }
        });
      } else {
        this.goods = JSON.parse(window.localStorage.getItem('v_goods'));
        this.$nextTick(() => {
          this._initScroll();
          this._calculateFoodHeight();
          this._calculateMenuHeight();
        });
      }
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  #goods
    .list-wrapper
      display: flex
      position: absolute
      top: 174px
      bottom: 46px
      width: 100%
      overflow: hidden
      .menu-wrapper
        flex: 0 0 80px
        width: 80px
        background-color: #f3f5f7
        .menu-item
          display: table
          padding: 0 13px
          height: 54px
          width: 56px
          line-height: 14px
          &:last-child > .text
            border-none()
          &.current
            position: relative
            margin-top: -1px
            font-weight: 700
            background-color: #fff
            .text
              border-none()
          .icon
            display: inline-block
            margin-right: 2px
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            vertical-align: middle
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
          .text
            display: table-cell
            width: 56px
            vertical-align: middle
            border-1px(rgba(7,17, 27, .1))
            font-size: 12px
      .foods-wrapper
        flex: 1
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          color: rgb(147, 153, 159)
          background-color: #f3f5f7
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7,17, 27, .1))
          &:last-child
            border-none()
            margin: 18px 18px 0 18px
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              line-height: 14px
              font-size: 14px
              color: rgb(7, 17, 27)
            .desc, .extra
              line-height: 10px
              font-size: 10px
              color: rgb(147, 153, 159)
            .desc
              margin-bottom: 8px
              line-height: 12px
            .extra
                .count
                  margin-right: 12px
            .price
              font-weight: 700
              line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240, 20, 20)
              .old
                text-decoration: line-through
                font-size: 10px
                color: rgb(147, 153, 159)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 5px
    .shopcart-wrapper
      position: fixed
      left: 0
      bottom: 0
      z-index: 20
      width: 100%
      height: 46px
</style>
