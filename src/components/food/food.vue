<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide()">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h2 class="title">{{food.name}}</h2>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @_addFirst="_addFirst"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst(food,$event)" v-show="!food.count||food.count === 0">加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h2 class="title">商品信息</h2>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h2 class="title">商品评价</h2>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"
                        @select="_selectType" @toggle="_toggleContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings" v-show="needShow(rating.rateType,rating.text)"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{rating.rateTime | formateDate}}</div>
                <div class="text">
                  <span class="icon"
                        :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  <span>{{rating.text}}</span>
                </div>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import {formateDate} from '../../common/js/date'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  const ALL = 2
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs['food'], {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      addFirst(food, event) {
        if (!event._constructed) {
          return
        }
        Vue.set(food, 'count', 1)
        this.$emit('_drop', event.target)
      },
      _addFirst(target) {
        this.$emit('_drop', target)
      },
      _selectType(type) {
        if (!event._constructed) {
          return
        }
        this.selectType = type
        // 解决onlyContent为true时无法下拉
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      _toggleContent(val) {
        if (!event._constructed) {
          return
        }
        this.onlyContent = !val
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    filters: {
      formateDate(time) {
        let date = new Date(time)
        return formateDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    .image-header
      position: relative
      width: 100%
      height: 0
      /*padding-top此时的100%与width的100%一致*/
      padding-top: 100%
      img
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
      .back
        position: fixed
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #ffffff
    .content
      padding: 18px
      position: relative
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
        font-weight: 700
      .detail
        margin-bottom: 18px
        color: rgb(147, 153, 159)
        font-size: 10px
        line-height: 10px
        height: 10px
        .sell-count
          margin-right: 12px
      .price
        .now
          margin-right: 8px
          font-weight: 700
          font-size: 16px
          color: rgb(240, 20, 20)
          line-height: 24px
        .old
          text-decoration: line-through
          font-weight: 700
          line-height: 24px
          font-size: 12px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        font-size: 10px
        color: #fff
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        background: rgb(0, 160, 220)
    .info
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        margin-bottom: 6px
        color: rgb(7, 17, 27)
      .text
        font-size: 12px
        font-weight: 200
        color: rgb(77, 85, 93)
        line-height: 24px
        padding: 0 8px
    .rating
      padding-top: 18px
      .title
        font-size: 14px
        line-height: 14px
        margin-left: 18px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 10px
            top: 16px
            line-height: 12px
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%

          .time
            margin-bottom: 6px
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px
          .text
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 16px
            .icon
              font-size: 12px
              line-height: 16px
              margin-right: 4px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
    .fade-enter-active, .fade-leave-active
      transition: all .2s linear
    .fade-enter, .fade-leave-active
      opacity: 0

  .move-enter-active, .move-leave-active
    transition: all .2s linear

  .move-enter, .move-leave-active
    transform: translate3d(100%, 0, 0)
</style>
