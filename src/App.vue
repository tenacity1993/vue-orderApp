<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px-bottom">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评论</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>
        <router-view :seller="seller"></router-view>
    </div>
</template>

<script>
    import header from 'components/header/header.vue'
    import goods from 'components/goods/goods.vue'
    import ratings from 'components/ratings/ratings.vue'
    import seller from 'components/seller/seller.vue'

    const ERR_OK = 0

    export default {
        data () {
            return {
                seller: {}
            }
        },
        components: {
            'v-header': header,
            goods,
            ratings,
            seller
        },
        created () {
            this.$http.get('api/seller').then((response) => {
                if (response.body.errno === ERR_OK) {
                    this.seller = response.body.data
                    // console.log(this.seller)
                }
            }, (response) => {
            })
        },
        mounted () {

        }
    }
</script>

<style lang="less">

    @import 'common/styles/mixin.less';

    #app {
        .tab {
            display: flex;
            width: 100%;
            height: 40px;
            line-height: 40px;
            //border-bottom:1px solid rgba(7, 17, 27, 0.1);
            .border-1px(rgba(7, 17, 27, 0.1));
            .tab-item {
                flex: 1;
                text-align: center;
                & > a {
                    display: block;
                    // text-decoration: none;
                    font-size: 14px;
                    color: rgb(77, 85, 93);
                    &.active {
                        color: rgb(240, 20, 20);
                    }
                }
            }
        }
    }
</style>
