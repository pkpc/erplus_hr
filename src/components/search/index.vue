<template>
  <div class="vux-search-box" :class="{'vux-search-fixed':isFixed}" :style="{top: isFixed ? top : '', position: fixPosition }">
    <div class="weui-search-bar" :class="{'weui-search-bar_focusing': !isCancel || currentValue}">
      <form class="weui-search-bar__form" @submit.prevent="$emit('on-submit', value)">
        <div class="vux-search-mask" @click="touch" v-show="!isFixed && autoFixed"></div>
        <div class="weui-search-bar__box">
          <i class="weui-icon-search"></i>
          <input type="search" class="weui-search-bar__input" :id="`search_input_${uuid}`" autocomplete="off" :required="required" v-model="currentValue" ref="input"
          @focus="onFocus"
          @blur="onBlur"/>
          <a href="javascript:" class="weui-icon-clear" @click="clear" v-show="currentValue"></a>
        </div>
        <label :for="`search_input_${uuid}`" class="weui-search-bar__label" v-show="!isFocus && !value">
          <i class="weui-icon-search"></i>
          <span>{{placeholder}}</span>
        </label>
      </form>
      <a href="javascript:" class="weui-search-bar__cancel-btn" @click="cancel">{{cancelText}}</a>
    </div>
    <div class="weui-cells vux-search_show" v-show="isFixed">
      <slot></slot>
      <div class="weui-cell" :class="{'weui-cell_access': item.isAllowed<3 || item.isSelf}" v-for="item in results" @click="handleResultClick(item)" >
        <div class="weui-cell__hd">
          <img class="weui-cell__hd-avatar" :src="'https://www.erplus.co/uploads/avatars'+item.imageName" alt=""/>
        </div>
        <div class="weui-cell__bd weui-cell_primary">
          <p>
            {{item.name}}
            <span v-if="item.age" class="weui-after-title" >{{item.age}}岁</span>
            <span v-if="item.sex==1 || item.sex==0" class="weui-after-title" :class="{'ion-female': item.sex==0, 'ion-male': item.sex==1}">
              </span>
          </p>
          <inline-desc>{{item.position}}</inline-desc>
        </div>
        <div class="weui-cell__ft">
          <x-button v-if="item.isAllowed==3 && !item.isSelf" :borderColor="'#4a90e2'" :color="'#4a90e2'" type="default" text="申请查看" mini plain></x-button>
          <span v-else-if="item.isAllowed<3" class="weui-cell__status">
          <span v-if="item.isAdminOrHR==1" class="weui-cell__status">
            {{item.isCompleted ? '':'未完善' }}
          </span>
          <span v-else class="weui-cell__status">
            {{item.applyStatus}}
          </span>
          <!--<i class="icon_arrow"></i>-->
        </span>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
cancel_text:
  en: cancel
  zh-CN: 取消
placeholder:
  en: Search
  zh-CN: 搜索
</i18n>

<script>
  import InlineDesc from '../inline-desc'
  import XButton from '../../../src/components/x-button/index.vue'
import uuidMixin from '../../mixins/uuid'

export default {
  components: {
    InlineDesc,
    XButton
  },
  mixins: [uuidMixin],
  props: {
    required: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    cancelText: String,
    value: {
      type: String,
      default: ''
    },
    results: {
      type: Array,
      default () {
        return []
      }
    },
    autoFixed: {
      type: Boolean,
      default: true
    },
    top: {
      type: String,
      default: '0px'
    },
    position: {
      type: String,
      default: 'fixed'
    },
    autoScrollToTop: Boolean
  },
  created () {
    if (this.value) {
      this.currentValue = this.value
    }
  },
  computed: {
    fixPosition () {
      if (this.isFixed) {
        return this.position === 'absolute' ? 'absolute' : 'fixed'
      }
      return 'static'
    }
  },
  methods: {
    clear () {
      this.currentValue = ''
      this.isFocus = true
      this.setFocus()
      if (this.autoFixed && !this.isFixed) {
        this.isFixed = true
      }
    },
    cancel () {
      this.currentValue = ''
      this.isCancel = true
      this.isFixed = false
      this.$emit('on-cancel')
    },
    handleResultClick (item) {
      this.$emit('result-click', item) // just for compatibility
      this.$emit('on-result-click', item)
      this.isCancel = true
      this.isFixed = false
    },
    touch () {
      this.isCancel = false
      if (this.autoFixed) {
        this.isFixed = true
      }
      this.$emit('on-touch')
    },
    setFocus () {
      this.$refs.input.focus()
    },
    onFocus () {
      this.isFocus = true
      this.$emit('on-focus')
      this.touch()
    },
    onBlur () {
      this.isFocus = false
    }
  },
  data () {
    return {
      currentValue: '',
      isCancel: true,
      isFocus: false,
      isFixed: false
    }
  },
  watch: {
    isFixed (val) {
      if (val === true) {
        this.setFocus()
        this.isFocus = true
        if (this.autoScrollToTop) {
          setTimeout(() => {
            window.scrollTo(0, 0)
          }, 150)
        }
      } else {}
      this.$emit('input-status', this.isFocus)
    },
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      if (!this.isCancel) {
        this.$emit('on-change', val)
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="less">
@import '../../styles/weui/icon/weui_icon_font';
@import '../../styles/weui/widget/weui_searchbar/weui_searchbar';
@import '../../styles/weui/widget/weui_cell/weui_cell_global';
@import '../../styles/weui/widget/weui_cell/weui_access';
@import '../../styles/weui/base/mixin/setArrow.less';

.vux-search-fixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(5px);
}
.vux-search-box {
  width: 100%;
}
.vux-search-box.vux-search-fixed {
  height: 100%;
}
.weui-cells.vux-search_show {
  margin-top: 0!important;
  overflow-y: scroll;
}
.vux-search-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 90%;
  height: 100%;
  z-index: 5;
}
.weui-after-title {
    padding-left:5px;
  color: #777;
  font-size: 12px; /*px*/

  }
  .weui-cell__hd-avatar {
    width: 35px;
    height: 35px;
    border-radius: 100%;
    margin-right: 10px;
  }
.weui-after-title.ion-female {
  color: #ff2744
}
.weui-after-title.ion-male{
  color: #2196f3
}
.weui-cell__status {
  font-size: 14px; /*px*/
  color: #ccc;
}
</style>
