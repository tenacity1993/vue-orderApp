<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" alt="" width="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name"> {{ seller.name }} </span>
                </div>
                <div class="description">{{ seller.description }}/{{ seller.deliveryTime }}分钟送达
                </div>
                <div class="support" v-if="seller.supports">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{ seller.supports[0].description }}</span>
                </div>
            </div>
            <div class="support-count" v-if="seller.supports" @click="showDetail">
                <span class="count">{{ seller.supports.length }}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" >
            <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
            <i class="icon-keyboard_arrow_right" @click="showDetail"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" alt="background-image" width="100%" height="100%">
        </div>
        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul class="supports" v-if="seller.supports">
                            <li class="support-item" v-for="(item, index) in seller.supports" :key="index">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{ seller.bulletin }}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>

    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../../components/star/star.vue'
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data () {
            return {
                // 变量在data中定义修改后会触发视图更新，如果没有写在data中就不会被vue实例代理，就不会触发视图更新。
                 classMap: [],
                 detailShow: false
            }
        },
        created () {
            this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
             setTimeout(() => {
                this.$set(this.classMap, 0, 'special')
                // console.log(this.classMap, '123')
            }, 1000)
        },
        components: {
            star
        },
        methods: {
            showDetail () {
                this.detailShow = true
            },
            hideDetail () {
                this.detailShow = false
            }
        }

    }
</script>

<style lang="less">
    @import "../../common/styles/mixin.less";

    .header {
        position: relative;
        overflow: hidden;
        color: #ffffff;
        background-color: rgba(7, 17, 27, 0.5);
        .content-wrapper {
            position: relative;
            padding: 24px 12px 18px 24px;
            font-size: 0px;
            .avatar {
                display: inline-block;
                vertical-align: top;
                img {
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                }
            }
            .content {
                display: inline-block;
                /*font-size: 14px;*/
                margin-left: 16px;
                .title {
                    margin: 2px 0 8px 0;
                    .brand {
                        // span 尺寸靠内容撑开  设置成block 才能占位
                        display: inline-block;
                        vertical-align: top;
                        width: 30px;
                        height: 18px;
                        //background-image: url("./brand@2x.png");
                        .bg-img('header/brand');
                        -webkit-background-size: 30px 18px;
                        background-size: 30px 18px;
                        background-repeat: no-repeat;
                    }
                    .name {
                        margin-left: 6px;
                        font-size: 16px;
                        line-height: 18px;
                        font-weight: bold;
                    }
                }
                .description {
                    margin-bottom: 10px;
                    line-height: 12px;
                    font-size: 12px;
                }
                .support {
                    .icon {
                        display: inline-block;
                        vertical-align: top;
                        height: 12px;
                        width: 12px;
                        margin-right: 4px;
                        -webkit-background-size: 12px;
                        background-size: 12px;
                        background-repeat: no-repeat;
                        &.decrease {
                            .bg-img('header/decrease_1')
                        }
                        &.discount {
                            .bg-img('header/discount_1')
                        }
                        &.guarantee {
                            .bg-img('header/guarantee_1')
                        }
                        &.invoice {
                            .bg-img('header/invoice_1')
                        }
                        &.special {
                            .bg-img('header/special_1')
                        }
                    }
                    .text {
                        line-height: 12px;
                        font-size: 10px;
                        color: #ffffff;
                    }
                }
            }
            .support-count {
                position: absolute;
                right: 12px;
                bottom: 14px;
                padding: 0 8px;
                height: 24px;
                line-height: 24px;
                border-radius: 14px;
                background: rgba(0, 0, 0, 0.2);
                text-align: center;
                .count {
                    vertical-align: top;
                    font-size: 10px
                }
                .icon-keyboard_arrow_right {
                    margin-left: 2px;
                    line-height: 24px;
                    font-size: 10px
                }
            }
  
        }
        .bulletin-wrapper {
            position: relative;
            height: 28px;
            line-height: 28px;
            padding: 0 22px 0 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background-color: rgba(7, 17, 27, 0.2);
            // font-size: 0;
            .bulletin-title {
                display: inline-block;
                vertical-align: top;
                margin-top: 8px;
                width: 22px;
                height: 12px;
                .bg-img('header/bulletin');
                background-size: 22px 12px;
                background-repeat: no-repeat;
            }
            .bulletin-text {
                vertical-align: top;
                margin: 0 4px;
                font-size: 10px;
            }
            .icon-keyboard_arrow_right {
                position: absolute;
                font-size: 10px;
                right: 12px;
                top: 8px
            }

        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            filter: blur(10px)
        }
        .detail {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(7, 17, 27, 0.8);
            font-size: 0;
            opacity: 1;
            backdrop-filter: blur(10px);
            &.fade-enter-active, &.fade-leave-active {
                transition: all 0.5s
            }
            &.fade-enter, &.fade-leave-active {
                opacity: 0;
                background:rgba(7, 17, 27, 0)
            }
            // filter: blur(10px);
            .detail-wrapper {
                width: 100%;
                min-height: 100%;
                .detail-main {
                    margin-top: 64px;
                    padding-bottom: 64px;
                    font-size: 12px;
                    line-height: 12px;
                    color: #ffffff;
                    .name {
                        line-height: 16px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 700;
                    }
                    .star-wrapper {
                        margin-top: 18px;
                        padding: 2px 0;
                        text-align: center;
                    }
                    .title {
                        display: flex;
                        width: 80%;
                        margin: 28px auto 24px auto;
                        .line {
                            flex: 1;
                            position: relative;
                            top: -6px;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
                        }
                        .text {
                            padding: 0 12px;
                            font-size: 14px;
                            font-weight: 700
                        }
                    }
                    .supports {
                        width: 80%;
                        margin: 0 auto;
                        .support-item {
                            padding: 0 12px;
                            margin-bottom: 12px;
                            font-size: 0;
                            &:last-child {
                                margin-bottom: 0
                            }
                            .icon {
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                vertical-align: top;
                                margin-right: 6px;
                                background-size: 16px 16px;
                                background-repeat: no-repeat;
                                &.decrease {
                                    .bg-img('header/decrease_2')
                                }
                                &.discount {
                                    .bg-img('header/discount_2')
                                }
                                &.guarantee {
                                    .bg-img('header/guarantee_2')
                                }
                                &.invoice {
                                    .bg-img('header/invoice_2')
                                }
                                &.special {
                                    .bg-img('header/special_2')
                                }
                            }
                            .text {
                                line-height: 16px;
                                font-size: 12px
                            }
                        }
                    }
                    .bulletin {
                        width: 80%;
                        margin: 0 auto;
                        .content {
                            padding: 0 12px;
                            line-height: 24px;
                            font-size: 12px
                        }
                    }
                }
            }
            .detail-close {
                position: relative;
                width: 32px;
                height: 32px;
                margin: -64px auto 0 auto;
                clear: both;
                font-size: 32px;
            }
        }
    }
</style>
