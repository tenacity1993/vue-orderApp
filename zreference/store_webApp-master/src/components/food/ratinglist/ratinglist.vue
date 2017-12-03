<template>
  <div id="ratinglist">
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
    <div class="ratings">
      <ul>
        <li v-for="rating in ratings" class="rating border-1px" v-show="isShow(rating.rateType, rating.text)">
          <div class="info-wrapper clearfix">
            <span class="date">{{timeString[$index].date}}</span><!--
            --><span class="time">{{timeString[$index].time}}</span>
            <div class="user">
              <span class="username">{{rating.username}}</span><!--
              --><span class="avatar">
                <img :src="rating.avatar" width="24" height="24">
              </span>
            </div>
          </div>
          <div class="rating-content">
            <i :class="[rating.rateType === 0 ? 'icon-thumb_up' : 'icon-thumb_down',{'isUp': rating.rateType === 0 ? true : false}]"></i><!--
            --><span class="text">{{rating.text}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      ratings: {
        type: Array
      }
    },
    data() {
      return {
        selectType: 2,
        hasContent: false
      };
    },
    methods: {
      init() {
        this.selectType = 2;
        this.hasContent = false;
      },
      showContent(event) {
        if (!event._constructed) {
          return;
        }
        this.hasContent = !this.hasContent;
        this.$nextTick(() => {
          this.$dispatch('creat');
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
          this.$dispatch('creat');
        });
      },
      isShow(type, text) {
        if (this.hasContent) {
          return text === '' ? false : this.selectType === 2 ? true : type === this.selectType;
        } else {
          return this.selectType === 2 ? true : type === this.selectType;
        }
      }
    },
    computed: {
      timeString() {
        let timeStringArray = [];
        this.ratings.forEach((rating) => {
          let time = new Date(rating.rateTime);
          let year = time.getFullYear();
          let month = time.getMonth();
          let day = time.getDate();
          let hour = time.getHours();
          let min = time.getMinutes();
          let sec = time.getSeconds();
          let timeString = {};

          timeString.date = year + '-' + month + '-' + day;
          timeString.time = hour + ':' + min + ':' + sec;
          timeStringArray.push(timeString);
        });
        return timeStringArray;
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
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../common/stylus/mixin.styl'

  #ratinglist
    padding-top: 18px
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
    .ratings
      .rating
        padding: 16px 0
        border-1px(rgba(7, 17, 27, .1))
        .info-wrapper
          margin-bottom: 6px
          width: 100%
          height: 24px
          .date, .time
            float: left
            font-size: 10px
            line-height: 24px
            color: rgb(143, 153, 159)
          .date
            margin-right: 12px
          .user
            float: right
            font-size: 0
            .username
              font-size: 10px
              line-height: 24px
              color: rgb(147, 153, 159)
              vertical-align: top
            .avatar
              margin-left: 6px
              & > img
                border-radius: 12px
        .rating-content
          font-size: 16px
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            font-size: 12px
            line-height: 24px
            color: rgb(147, 153, 159)
          .isUp
            color: #00a0dc
          .text
            font-size: 12px
            line-height: 16px
            color: rgb(7, 17, 27)
</style>
