<template>
  <div class="weui-cell">
    <div class="weui-cell__hd" v-if="title" :style="{alignSelf: hdAlignSelf, flex: hdFlex}">
      {{title}}
    </div>
    <div class="weui-cell__bd" :style="{flex: bdFlex}">
      <textarea
      class="weui-textarea"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
      :placeholder="placeholder"
      :readonly="readonly"
      :name="name"
      :rows="rows"
      :cols="cols"
      v-model="currentValue"
      :style="textareaStyle"
      :maxlength="max"
      ref="textarea"></textarea>
      <div class="weui-textarea-counter" v-show="showCounter && max"><span>{{count}}</span>/{{max}}</div>
    </div>
  </div>
</template>

<script>
import Base from '../../libs/base'

export default {
  minxins: [Base],
  props: {
    title: {
      type: String
    },
    showCounter: {
      type: Boolean,
      default: true
    },
    max: Number,
    value: {
      type: String,
      default: ''
    },
    name: String,
    placeholder: String,
    readonly: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: 3
    },
    cols: {
      type: Number,
      default: 30
    },
    height: Number,
    // https://github.com/yisibl/blog/issues/3
    autocomplete: {
      type: String,
      default: 'off'
    },
    autocapitalize: {
      type: String,
      default: 'off'
    },
    autocorrect: {
      type: String,
      default: 'off'
    },
    spellcheck: {
      type: String,
      default: 'false'
    },
    hdAlignSelf: {
      type: String,
      default: 'flex-start'
    },
    hdFlex: {
      type: Number
    },
    bdFlex: {
      type: Number
    }
  },
  created () {
    this.currentValue = this.value
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (newVal) {
      if (this.max && newVal > this.max) {
        this.currentValue = newVal.slice(0, this.max)
      }
      this.$emit('on-change', this.currentValue)
      this.$emit('input', this.currentValue)
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  computed: {
    count () {
      let len = 0
      if (this.currentValue) {
        len = this.currentValue.replace(/\n/g, 'aa').length
      }
      return len > this.max ? this.max : len
    },
    textareaStyle () {
      if (this.height) {
        return {
          height: `${this.height}px`
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/weui/widget/weui_cell/weui_cell_global';
@import '../../styles/weui/widget/weui_cell/weui_form/weui_form_common';
.weui-cell__hd {
  flex: 1;
}
.weui-cell__hd + .weui-cell__bd {
}
textarea {
  -webkit-overflow-scrolling: touch;
  position: relative;
  -webkit-transform: translateZ(0px);
}
</style>
