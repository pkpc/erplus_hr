<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="生日祝福内容">
      <a slot="right" @click="save">确定</a>
    </x-header>
    <div class="birth_content">
      <group>
        <x-textarea :max="60"
                    :rows="8"
                    :placeholder="textPlaceholder"
                    v-model="textValue"></x-textarea>
      </group>
      <div>
        <p class="mp_panel_title">效果预览</p>
        <div class="mp_panel">
          <div class="mp_panel_hd">
            <img src="../../../../static/img/img-cake.png" alt="">
          </div>
          <div class="mp_panel_bd">
            <p class="mp_panel_bd_title">生日快乐，员工名</p>
            <p class="mp_panel_bd_desc">{{panelValue}}</p>
          </div>
          <div class="mp_panel_ft">
            <p class="mp_panel_ft_btn">谢谢</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../components/x-header/index.vue'
  import Group from '../../../components/group/index.vue'
  import XTextarea from '../../../components/x-textarea/index.vue'
  import {mapState} from 'vuex'
  export default {
    components: {
      XHeader,
      Group,
      XTextarea
    },
    data () {
      return {
        textValue: '',
        textPlaceholder: '请在此输入生日祝福内容...\ne.g. 感谢你一如既往的付出与努力，加号有你更精彩！'
      }
    },
    computed: {
      ...mapState([
        'birthSetting'
      ]),
      panelValue: function () {
        if (this.textValue === '' || this.textValue === undefined) {
          return '感谢你一如既往的付出与努力，加号有你更精彩！'
        } else {
          return this.textValue
        }
      }
    },
    methods: {
      save () {
        const self = this
        let bs = this.birthSetting
        bs.msgContent = this.textValue
        this.$store.dispatch('SAVE_BIRTH_REMIND_CONTENT', bs).then(function () {
          self.$router.back()
        })
      }
    },
    created () {
      this.textValue = this.birthSetting.msgContent
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .mp_panel {
    position: relative;
    border-radius: 3px;
    margin: 7px 48px 48px;
    background-color: #fff;
    .mp_panel_hd {
      padding: 25px 0;
      text-align: center;
      img {
        width: 154px;
        height: 92px;
      }
    }
    .mp_panel_bd {
      padding: 0 20px;
      height: 155px;
    }
    .mp_panel_bd_title {
      font-size: 17px; /*px*/
      padding-bottom: 10px;
    }
    .mp_panel_bd_desc {
      font-size: 14px; /*px*/
      color: #999;
      line-height: 1.3;
    }
    .mp_panel_ft_btn {
      position: absolute;
      right: 20px;
      bottom: 20px;
      font-size: 15px; /*px*/
      color: #F49191;
    }
  }

  .mp_panel_title {
    padding: 24px 48px 0;
    color: #666;
  }

  .color-pink {
    color: #F49191;
  }
  div.birth_content {
    -webkit-transform: translate3d(0, 0, 0)
  }
</style>
