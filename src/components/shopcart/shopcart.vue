<template>
<div class="shopcart">
    <div class="content">
        <div class="content-left">
            <div class="logo-wrapper">
                <div class="logo" :class="{'highlight':totalCount>0}">
                    <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                </div>
                <div class="num" v-show="totalCount>0">{{totalCount}}</div>
            </div>
            <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
            <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
            <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        sellectFoods: {
            type: Array,
            // 传数组的话，要以函数的形式写default
            default () {
                return [{
                    price: 10,
                    count: 1
                }]
                // return []
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    computed: {
        // 计算商品的总价
        totalPrice () {
            let total = 0
            this.sellectFoods.forEach((food) => {
                total += food.price * food.count
            })
            return total
        },
        totalCount () {
            let count = 0
            this.sellectFoods.forEach((food) => {
                count += food.count
            })
            return count
        },
        payDesc () {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice
                return `还差￥${diff}元起送`
            } else {
                return '去结算'
            }
        },
        payClass () {
            if (this.totalPrice < this.minPrice) {
                return 'not-enough'
            } else {
                return 'enough'
            }
        }
    }
}
</script>

<style lang="less" scoped>
.shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 48px;
    width: 100%;
    z-index: 50;
    .content {
        display: flex;
        background-color: #141d27;
        font-size: 0;
        color: rgba(255, 255, 255, 0.4);
        .content-left {
            flex: 1;
            .logo-wrapper {
                display:inline-block;
                position: relative;
                top: -10px; // 超出父元素
                margin: 0 12px;
                padding: 6px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                vertical-align: top;
                border-radius: 50%;
                background-color: #141d27;
                .logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    text-align: center;                        
                    background-color: #2b343c;
                    &.highlight {
                        background-color: rgb(0, 160, 220);
                    }
                    .icon-shopping_cart {
                        font-size: 24px;
                        color: #80858a;
                        line-height: 44px;
                        &.highlight {
                            color: #ffffff
                        }
                    }
                }
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 16px;
                    width: 24px;
                    line-height: 16px;
                    text-align: center;
                    border-radius: 16px;
                    font-size: 9px;
                    font-weight: 700;
                    color: #fff;
                    background-color: rgb(240, 20, 20);
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                }
            }
            .price {
                display:inline-block;
                vertical-align: top;
                line-height: 24px;
                margin-top: 12px;
                padding-right: 12px;
                box-sizing: border-box;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 16px;
                font-weight: 700;
                &.highlight {
                    color: #ffffff
                }
            }
            .desc {
                display:inline-block;
                vertical-align: top;
                margin: 12px 0 0 12px;
                line-height: 24px;
                font-size: 10px;
            }

        }
        .content-right {
            flex:0 0 105px;
            width: 105px;
            .pay {
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 12px;
                font-weight: 700;
                &.not-enough {
                    background-color: #2b333b;
                }
                &.enough {
                    background-color: #00b34c;
                    color: #ffffff
                }
            }
        }
    }

}

</style>
