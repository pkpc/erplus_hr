<template>
  <div class="weui-descs" @click="onClick">
    <div class="weui-descs__title" v-if="title" :style="{color:titleColor}" v-html="title"></div>
    <div class="weui-cells" :class="{'vux-no-group-title':!title}" :style="{marginTop: gutter}">
      <slot name="after-title"></slot>
      <slot></slot>
    </div>
    <div class="weui-desc">
      <slot name="desc-title"></slot>
      <slot name="desc-body"></slot>
    </div>
  </div>
</template>

<script>
  import {go} from '../../libs/router'
  export default {
    props: {
      title: String,
      labelWidth: String,
      labelAlign: String,
      labelMarginRight: String,
      gutter: String,
      link: {
        type: [String, Object]
      }
    },
    methods: {
      onClick () {
        go(this.link, this.$router)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../styles/variable.less';
  @import '../../styles/weui/widget/weui_cell/weui_access';
  @import '../../styles/weui/widget/weui_cell/weui_cell_global';

  .vux-no-group-title {
    margin-top: @group-title-margin-top;
  }

  .weui-cells > a {
    color: #000;
  }

  .weui-descs__title {
    padding: @weuiCellGapV @weuiCellGapH;
    position: relative; //这个是为了兼容cells容器onepx方案被before挡住而做的
    display: flex;
    align-items: center;
  }

  .weui-descs .weui-cells:after {
    border-bottom: 1px dashed #efefef;
  }

  .weui-desc {
    padding-left: @weuiCellGapH;
    padding-right: @weuiCellGapH;
    display: flex;
    align-items: center;
    background-color: #fff;
    & .weui-desc_hd {
      margin-right: 18px;
    }
    & .weui-desc_bd {
      flex: 1;
    }
  }

</style>
