<template>
<div class="star" :class="starType">
    <span class="star-item" :class="itemClass" v-for="(itemClass, index) in itemClasses" :key="index">
    </span>
    <!-- <div class="star star-48 star-item half" v-for="(n, index) in 5" :key="index"></div> -->
</div>
  
</template>

<script>

const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
    // data () {
    //     return {
    //         starType: ''
    //     }
    // },
    // created () {
    //     this.starType = 'star-' + this.size
    // },
    computed: {
        starType () {
            return 'star-' + this.size
        },
        itemClasses () {
            let result = []
            let score = Math.floor(this.score * 2) / 2
            let hasDecimal = score % 1 !== 0
            let integer = Math.floor(score)  // 整星的个数
            for (let i = 0; i < integer; i++) {
                result.push(CLS_ON)
            }
            if (hasDecimal) {
                result.push(CLS_HALF)
            }
            while (result.length < LENGTH) {
                result.push(CLS_OFF)
            }
            return result
        }
    },
    props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        }
    }
}
</script>

<style lang="less">

@import "../../common/styles/mixin.less";

.star {
    font-size: 0;
    .star-item {
        display: inline-block;
        background-repeat: no-repeat;
    }
    &.star-48 {
        .star-item {
            width: 20px;
            height: 20px;
            margin-right: 22px;
            background-size: 20px 20px;
            &:last-child {
                margin-right: 0
            }
            &.on {
                .bg-img('star/star48_on')
            }
            &.half {
                .bg-img('star/star48_half')
            }
            &.off {
                .bg-img('star/star48_off')
            }
        }
    }
    &.star-36 {
        .star-item {
            width: 15px;
            height: 15px;
            margin-right: 16px;
            background-size: 15px 15px;
            &:last-child {
                margin-right: 0
            }
            &.on {
                .bg-img('star/star36_on')
            }
            &.half {
                .bg-img('star/star36_half')
            }
            &.off {
                .bg-img('star/star36_off')
            }
        }

    }
    &.star-24 {
        .star-item {
            width: 10px;
            height: 10px;
            margin-right: 3px;
            background-size: 10px 10px;
            &:last-child {
                margin-right: 0
            }
            &.on {
                .bg-img('star/star24_on')
            }
            &.half {
                .bg-img('star/star24_half')
            }
            &.off {
                .bg-img('star/star24_off')
            }
        }
    }
    
}

</style>

