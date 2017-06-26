<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="生日提醒">
    </x-header>
    <div>
      <group>
        <x-switch title="员工生日提醒" @on-change="isRemindChange" v-model="isRemind"></x-switch>
      </group>
      <group>
        <cell title="适用范围" :link="{path: '/setting/birth/range'}" is-link :value="range" valueColor="#8F8E94">
        </cell>
        <cell title="提醒人" :link="{path: '/setting/birth/receiver'}" is-link :value="remind" valueColor="#8F8E94">
        </cell>
      </group>
      <group>
        <cell title="生日祝福内容" :link="{path: '/setting/birth/content'}" is-link>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import XHeader from '../../../components/x-header/index.vue'
  import XSwitch from '../../../components/x-switch/index.vue'
  import Group from '../../../components/group/index.vue'
  import Cell from '../../../components/cell/index.vue'
  export default {
    components: {
      XHeader,
      XSwitch,
      Group,
      Cell
    },
    data () {
      return {
        remindMap: {
          'self': '员工',
          'hr': '人事',
          'DM': '直属主管'
        }
      }
    },
    computed: {
      ...mapState([
        'birthSetting'
      ]),
      isRemind () {
        return this.birthSetting.isBirthdayRemind !== undefined && this.birthSetting.isBirthdayRemind === 1
      },
      rangeSelectedLen () {
          return this.$store.state.birthRangeSelected.split(',').length
      },
      range () {
        let str = '未选择'
        if (this.birthSetting.range !== undefined) {
          str = this.rangeSelectedLen === this.$store.state.contacts.length ? '全公司' : this.rangeSelectedLen + '人'
        }
        return str
      },
      remind () {
        let remindArr = []
        if (this.birthSetting.whoToRemind !== undefined) {
          const remindArrTemp = this.birthSetting.whoToRemind.split(',')
          const self = this
          if (remindArrTemp.length > 0) {
            remindArrTemp.forEach(function (obj) {
              if (obj != '') {
                remindArr.push(self.remindMap[obj])
              }
            })
          } else {
            remindArr.push('未选择')
          }
        } else {
          remindArr.push('未选择')
        }
        return remindArr.join('、')
      }
    },
    created () {
    },
    methods: {
      isRemindChange (value) {
        let bs = this.birthSetting
        bs.isBirthdayRemind = value ? 1 : 0
        this.$store.dispatch('SAVE_BIRTH_IS_REMIND', bs)
      }
    }
  }
</script>
