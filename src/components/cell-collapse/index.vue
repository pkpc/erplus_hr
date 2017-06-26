<template>
  <div class="cell-collapse">
    <div class="weui-cells" @click="toggleCollapse"
         :class="{'vux-no-group-title':!title, 'vux-tap-active': isLink || !!link, 'weui-cell_access': isLink || !!link}" :style="{marginTop: gutter}">
      <div class="weui-cell__bd" :class="{'weui-cell_primary':primary==='title', 'weui-cell_static':primary==='static'}">
        <p>
          {{title}}
          <slot name="after-title"></slot>
        </p>
      </div>
      <div style="color: #CCC" class="weui-cell__ft"
           :class="{'weui-cell_primary':primary==='content', 'weui-cell_static':primary==='static','transform_down':isCollapse}">
        {{collapseValue}}
      </div>
    </div>
    <div class="mp_cell_details" v-if="collapseType==='form'" v-show="isCollapse">
      <div class="mp_cell_detail_list" v-for="item in items">
        <div class="mp_detail_hd">{{item.label}}</div>
        <div class="mp_detail_bd">{{item.value}}</div>
      </div>
    </div>
    <div class="mp_cell_more" v-show="isCollapse && collapseType==='gallery'">
      <slot name="cell-more"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  /*
   * collapseType: String 'form':显示文字（列表模式）[默认]，'gallery':图片模式
   * */
  export default {
    props: {
      gutter: String,
      title: String,
      value: [String, Number, Array],
      isLink: Boolean,
      inlineDesc: [String, Number],
      primary: {
        type: String,
        default: 'title'
      },
      link: {
        type: [String, Object]
      },
      items: Array,
      collapse: {
        type: Boolean,
        default: false
      },
      collapseDesc: {
        type: Object,
        default () {
          return {
            open: '收起',
            close: '展开'
          }
        }
      },
      collapseType: {
        type: String,
        default: 'form'
      }
    },
    data () {
      return {
        isCollapse: this.collapse
      }
    },
    computed: {
      collapseValue () {
        return this.isCollapse ? this.collapseDesc.open : this.collapseDesc.close
      }
    },
    methods: {
      toggleCollapse () {
        if (this.collapseDesc.open !== '') {
          this.isCollapse = !this.isCollapse
        } else {

        }
      },
      previewImage (index) {
        this.$emit('previewImage', index)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../styles/weui/widget/weui_cell/weui_access';
  @import '../../styles/weui/widget/weui_cell/weui_cell_global';
  @import '../../styles/variable.less';
  @import '../../styles/tap.less';

  .vux-no-group-title {
    margin-top: 15px;
  }

  .weui-cells > a {
    color: #000;
  }

  .mp_cell_detail_list {
    display: flex;
    align-items: center;
  }

  .cell-collapse .weui-cells {
    padding: 10px 15px;
    margin-top: 12px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .cell-collapse + .cell-collapse .weui-cells {
    margin-top: 0
  }
  .cell-collapse .weui-cells:before {
    border-top-color: #fff;
  }
  .cell-collapse .weui-cells:after {
    border-bottom-color: #fff;
  }
  .cell-collapse + .cell-collapse {
    /*border-top: 1rpx solid #D9D9D9;*/
  }
  .cell-collapse .weui-cells {
    border-bottom: 1rpx solid #D9D9D9;
  }
  .cell-collapse {
    .mp_cell_details {
      background-color: #fff;
      padding: 11px 15px 13px;
      margin-bottom: 12px;
    }
    .mp_cell_gallery {
      height: 160px;
      overflow: auto;
      position: relative;
      display: flex;
      align-items: center;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      .mp_cell_gallery_photo {
        width: 100px;
      }
      .mp_cell_gallery_photo + .mp_cell_gallery_photo {
        margin-left: 10px;
      }
    }
    .mp_cell_detail_list {
      display: flex;
      align-items: center;
      padding: 3px 0;
      color: #333;
      font-size: 13px; /*px*/
      .mp_detail_hd {
        flex: 1;
      }
      .mp_detail_bd {
        flex: 2;
      }
    }
    .weui_cell_ft {
      color: #ccc;
    }
    .weui-cell_access .weui-cell__ft.transform_down:after {
      transform: rotate(135deg);
    }
    .weui-cell_access .weui-cell__ft:after {
      transition-duration: 0.30s;
    }
    .mp_cell_more {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      padding: 10px 15px 13px;
      margin-bottom: 12px;
    }
  }
</style>
