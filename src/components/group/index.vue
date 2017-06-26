<template>
  <div>
    <div class="weui-cells__title" v-if="title" :style="{color:titleColor, background:titleBackground}" v-html="title"></div>
    <div class="weui-cells" :class="{'vux-no-group-title':!title, 'mp-no-border': noBorder}" :style="{marginTop: gutter}">
      <slot name="after-title"></slot>
      <slot></slot>
    </div>
    <div class="weui-cells__title weui-cells_ft__title" v-if="titleFooter" :style="{color:titleFooterColor}" v-html="titleFooter"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    titleColor: String,
    titleFooter: String,
    titleFooterColor: String,
    labelWidth: String,
    labelAlign: String,
    labelMarginRight: String,
    gutter: String,
    titleBackground: {
      type: String,
      default: 'transparent'
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
@import '../../styles/variable.less';
@import '../../styles/weui/widget/weui_cell/weui_access';
@import '../../styles/weui/widget/weui_cell/weui_cell_global';

@import '../../styles/blank.less';

.vux-no-group-title {
  margin-top: @group-title-margin-top;
}
.weui-cells__title.weui-cells_ft__title {
  font-size: 12px; /*px*/
  color: #777;
  margin-top: @group-title-margin-bottom;
  padding-left: @weuiCellGapH;
  padding-right: @weuiCellGapH;
}
.mp-no-border.weui-cells:after {
  border-bottom-color: #fff;
}
.mp-no-border.weui-cells:before {
  border-top-color: #fff;
}
</style>
