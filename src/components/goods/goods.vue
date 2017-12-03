<template>
    <div class="goods">
        <!-- ref  需要使用驼峰的写法 -->
        <div class="menu-wrapper" ref='menuWrapper'>
            <ul>
                <li class="menu-item" v-for="(item, index) in goods" :key="index" 
                :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
                    <span class="text border-1px">
                        <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref='foodWrapper'>
            <ul>
                <li class="food-list" v-for="(item, index) in goods" :key="index" ref="foodList">
                    <h1 class="title">{{ item.name }}</h1>
                    <ul>
                        <li class="food-item border-1px" v-for="(food, index) in item.foods" :key="index">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" alt="" >
                            </div>
                            <div class="content">
                                <h2 class="name">{{ food.name }}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    const ERR_OK = 0
    export default {
        data () {
            return {
                goods: [],
                listHeight: [],
                scrollY: 0
            }
        },
        computed: {
            currentIndex () {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i]
                    let height2 = this.listHeight[i + 1]
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i
                    }
                }
                return 0
            }
        },
        props: {
            seller: {
                type: Object
            }
        },
        created () {
            this.$http.get('/api/goods').then((response) => {
                if (response.body.errno === ERR_OK) {
                    this.goods = response.body.data
                    this.$nextTick(() => {
                        this._initScroll()
                        this._calculateHeight()
                    })
                }
            })
            this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
        },
        methods: {
            _initScroll () {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                })
                this.foodScroll = new BScroll(this.$refs.foodWrapper, {
                    click: true,
                    probeType: 3
                })
                // 实时获取竖直方向滚动高度
                this.foodScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y))
                })
            },
            _calculateHeight () {
                let foodList = this.$refs.foodList // 获取每一个food的dom对象
                let height = 0
                this.listHeight.push(height)
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            selectMenu (index, event) {
                // chrome 中不添加这段代码也只产生一次点击事件
                if (!event._constructed) { // 自定义派发click为true  避免pc端发生两次点击事件
                    return 0
                }
                console.log(index, event)
            }
        }
    }
</script>

<style lang="less">
    @import "../../common/styles/mixin.less";
    .goods {
        display: flex;
        position: absolute;
        top: 174px;
        bottom: 46px;
        width: 100%;
        overflow: hidden;
        .menu-wrapper{
            flex: 0 0  80px;
            width: 80px; // 解决安卓兼容性问题
            background-color: #f3f5f7;
            .menu-item {
                display: table; // 垂直居中布局 小技巧
                height: 54px;
                width: 56px;
                padding: 0 12px;
                line-height: 14px;
                &.current {
                    position: relative;
                    margin-top: -1px;
                    z-index: 10;
                    background-color: #fff;
                    font-weight: 700;
                    .text {
                        .border-none()
                    }
                }
                .icon {
                    display: inline-block;
                    vertical-align: top;
                    height: 12px;
                    width: 12px;
                    margin-right: 2px;
                    -webkit-background-size: 12px;
                    background-size: 12px;
                    background-repeat: no-repeat;
                    &.decrease {
                        .bg-img('goods/decrease_3')
                    }
                    &.discount {
                        .bg-img('goods/discount_3')
                    }
                    &.guarantee {
                        .bg-img('goods/guarantee_3')
                    }
                    &.invoice {
                        .bg-img('goods/invoice_3')
                    }
                    &.special {
                        .bg-img('goods/special_3')
                    }
                }
                .text {
                    display: table-cell;
                    font-size: 12px;
                    vertical-align: middle;
                    .border-1px(rgba(7, 17, 27, 0.1));
                }
            }
        }
        .foods-wrapper{
            flex: 1;
            .food-list {
                .title {
                    padding-left: 14px;
                    height: 26px;
                    line-height: 26px;
                    border-left: 2px solid #d9dde1;
                    font-size: 12px;
                    color: rgb(147, 153, 159);
                    background-color: #f3f5f7;
                }
                .food-item {
                    display: flex;
                    padding: 18px;
                    .border-1px(rgba(7, 17, 27, 0.1));
                    &:last-child {
                        .border-none;
                        margin-bottom: 0
                    }
                    .icon {
                        flex: 0 0 57px;
                        margin-right: 10px;
                    }
                    .content {
                        flex: 1;
                        .name {
                            margin: 2px 0 8px 0;
                            height: 14px;
                            font-size: 14px;
                            line-height: 14px;
                            color: rgb(7, 17, 27);
                        }
                        .desc, .extra {
                            font-size: 10px;
                            line-height: 10px;
                            color: rgb(147, 153, 159);
                        }
                        .desc {
                            margin-bottom: 8px;
                            line-height: 12px;
                        }
                        .extra {
                            .count {
                                margin-right: 12px
                            }
                        }
                        .price {
                            font-weight: 700;
                            line-height: 24px;
                            .now {
                                margin-right: 8px;
                                font-size: 14px;
                                color: rgb(240, 20, 20);
                            }
                            .old {
                                text-decoration: line-through;
                                font-size: 10px;
                                color: rgb(147, 153, 159)
                            }
                        }
                    }
                }
            }
        }
    }
</style>

