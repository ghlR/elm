<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h2 class="title">{{seller.name}}</h2>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item,index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="pic-wrapper" ref="pic-wrapper">
          <ul class="pic-list" ref="pic-list">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h2 class="title">商家信息</h2>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {saveToLocal, loadFromLocal} from '../../common/js/store'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    watch: {
      seller() {
        this._initScroll()
        this._initPics()
      }
    },
    mounted() {
      this._initScroll()
      this._initPics()
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.$nextTick(() => {
            this.scroll.refresh()
          })
        }
      },
      _initPics() {
        if (this.seller.pics) {
          let picWidth = 120
          let margin = 6
          let width = (picWidth + margin) * this.seller.pics.length - margin
          this.$refs['pic-list'].style.width = width + 'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs['pic-wrapper'], {
                scrollX: true,
                eventPassthrough: 'vertical'
              })
            } else {
              this.picScroll.refresh()
            }
          })
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return
        }
        this.favorite = !this.favorite
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      }
    },
    components: {
      star,
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
      .desc
        padding-bottom: 18px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          vertical-align: top
          margin-right: 12px
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 18px

      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border-right: none
          h2
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 10px
            margin-bottom: 4px
          .content
            font-size: 10px
            color: rgb(7, 17, 27)
            line-height: 24px
            .stress
              font-size: 24px
      .favorite
        position: absolute
        width: 50px
        right: 11px
        top: 18px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          font-size: 24px
          line-height: 24px
          color: #d6d5de
          &.active
            color: rgb(240, 20, 20)
        .text
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 10px
    .bulletin
      padding: 18px 18px 0
      .title
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
        margin-bottom: 8px
      .content-wrapper
        padding: 0 12px 16px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .content
          font-size: 12px
          color: rgb(240, 20, 20)
          line-height: 24px
      .supports
        .support-item
          padding: 16px 12px
          font-size: 0
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
          .icon
            display: inline-block
            vertical-align: top
            width: 16px
            height: 16px
            margin-right: 6px
            background-size: 16px 16px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 16px
    .pics
      padding: 18px
      .title
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
        margin-bottom: 12px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0

    .info
      padding: 18px 18px 0
      color: rgb(7, 17, 27)
      .title
        font-size: 14px
        line-height: 14px
        margin-bottom: 12px
      .info-item
        padding: 16px 12px
        font-size: 12px
        line-height: 16px
        border-top: 1px solid rgba(7, 17, 27, 0.1)
</style>
