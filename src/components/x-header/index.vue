<template>
  <div class="vux-header">
    <div class="vux-header-left" @click="onClickBack">
      <div class="left-arrow" v-show="leftOptions.showBack" :transition="transition"></div>
      <!--<a class="vux-header-back" v-show="leftOptions.showBack" :transition="transition" >{{leftOptions.backText}}</a>-->
      <slot name="left"></slot>
    </div>
    <h1 class="vux-header-title" @click="$emit('on-click-title')"><span v-show="title" :transition="transition">{{title}}</span><slot></slot></h1>
    <div class="vux-header-right" @click="$emit('on-click-more')">
      <a class="vux-header-more" v-if="rightOptions.showMore"></a>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftOptions: {
      type: Object,
      default () {
        return {
          showBack: true,
          backText: 'Back',
          preventGoBack: false
        }
      }
    },
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showMore: false
        }
      }
    }
  },
  methods: {
    onClickBack () {
      if (this.leftOptions.preventGoBack) {
        this.$emit('on-click-back')
      } else {
        if (document.body.className === 'is-android') {
          window.location.href = 'goBackToMP'
        } else {
          this.$router ? this.$router.back() : window.history.back()
        }
      }
    }
  }
}
</script>

<style lang="less">
@import '../../styles/variable.less';

.vux-header {
  display: flex;
  align-items: center;
  justify-content:space-between;
  position: relative;
  box-sizing: border-box;
  background-color: @header-background-color;
}
/*iPhone-status */
.is-iPhone {
  .vux-header{
    /*padding: 24px 4px 4px 4px;*/
    padding: 24px 6px 7px;
    .vux-header-right {
      box-sizing: border-box;
      padding-right: 8px;
    }
  }
}
.is-android {
.vux-header{
  /*padding: 24px 4px 4px 4px;*/
  height: 58px;
  padding-left: 20px;
  padding-right: 20px;
}
}
.vux-header .vux-header-title,.vux-header h1 {
  /*margin: 0 70px;*/
  /*line-height: 40px;*/
  /*text-align: center;*/
  /*height: 56px;*/
  font-size: 17dpx; /*px*/
  font-weight: 400;
  /*width: auto;*/
  /*overflow: hidden;*/
  display: flex;
  align-items: center;
  justify-content:center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: @header-title-color;
}
.vux-header .vux-header-title > span {
  display: inline-block;
}
.vux-header .vux-header-left,.vux-header .vux-header-right {
  /*position: absolute;*/
  /*top: 14px;*/
  /*display: block;*/
  font-size: 15dpx; /*px*/
  /*line-height: 21px;*/
  color: @header-text-color;
  display: flex;
  align-items: center;
  min-width: 60px;
}
.vux-header .vux-header-left {
  justify-content: flex-start;
}
.vux-header .vux-header-right {
  justify-content: flex-end;
}
.vux-header .vux-header-left a,.vux-header .vux-header-left button,.vux-header .vux-header-right a,.vux-header .vux-header-right button {
  float: left;
  margin-right: 8px;
  color: @header-text-color;
}
.vux-header .vux-header-left a:active,.vux-header .vux-header-left button:active,.vux-header .vux-header-right a:active,.vux-header .vux-header-right button:active {
  opacity: .5
}
.vux-header .vux-header-left {
  left: 18px
}
.vux-header .vux-header-left .vux-header-back {
  padding-left: 16px
}
.is-iPhone .vux-header .vux-header-left .left-arrow {
  position: relative;
  width: 30px;
  height: 30px;
  /*top: -5px;*/
  /*left: -5px;*/

  &:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1rpx solid @header-arrow-color;
    border-width: 3px 0 0 3px;
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
}
.is-android .vux-header .vux-header-left .left-arrow {
  position: relative;
  width: 30px;
  height: 30px;
  /*top: -4dpx;*/
  /*left: -4dpx;*/
  &:before, &:after{
      content: '';
      position: absolute;
      height: 2px;
      width: 18px;
      top: 50%;
      left: 0;
      background: #fff;
   }
  &:before {
     -webkit-transform: rotate(45deg);
     -moz-transform: rotate(45deg);
     -ms-transform: rotate(45deg);
     -o-transform: rotate(45deg);
     transform: rotate(45deg);
  }
  &:after {
     -webkit-transform: rotate(-45deg);
     -moz-transform: rotate(-45deg);
     -ms-transform: rotate(-45deg);
     -o-transform: rotate(-45deg);
     transform: rotate(-45deg);
  }
}
.vux-header .vux-header-right {
  right: 15px
}
.vux-header .vux-header-right a,.vux-header .vux-header-right button {
  /*margin-left: 8px;*/
  margin-right: 0
}
.vux-header .vux-header-right .vux-header-more:after {
  content: "\2022\0020\2022\0020\2022\0020";
  font-size: 16dpx; /*px*/
}
.vux-header-fade-in-right-enter {
  animation: fadeinR .5s;
}
.vux-header-fade-in-left-enter {
  animation: fadeinL .5s;
}
@keyframes fadeinR{
  0%{opacity:0;transform:translateX(80px);}
  100%{opacity:1;transform:translateX(0);}
}
@keyframes fadeinL{
  0%{opacity:0;transform:translateX(-80px);}
  100%{opacity:1;transform:translateX(0);}
}
</style>
