<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="提醒人">
      <a slot="right" @click="save">确定</a>
    </x-header>
    <div>
      <checklist title=" " :options="objectList" :checkboxRight=true v-model="objectListValue"
                 @on-change="change"></checklist>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../components/x-header/index.vue'
  import Checklist from '../../../components/checklist/index.vue'
  import {mapState} from 'vuex'
  export default {
    components: {
      XHeader,
      Checklist
    },
    data () {
      return {
        objectList: [{key: 'self', value: '员工本人'}, {key: 'hr', value: '人事模块管理员'}, {key: 'DM', value: '员工直属主管'}],
        objectListValue: []
      }
    },
    computed: {
      ...mapState([
        'birthSetting'
      ])
    },
    methods: {
      change (val) {
      },
      save () {
        let remindArr = []
        const self = this
        let bs = this.birthSetting
        this.objectListValue.forEach(function (obj) {
          if (obj !== '') {
            remindArr.push(obj)
          }
        })
        bs.whoToRemind = remindArr.join(',')
        this.$store.dispatch('SAVE_BIRTH_REMINDER', bs).then(function () {
          self.$router.back()
        })
      }
    },
    created () {
      const self = this
      let whoToRemind = this.birthSetting.whoToRemind
      if (whoToRemind !== undefined) {
        whoToRemind = whoToRemind.split(',')
        whoToRemind.forEach(function (obj) {
          if (obj !== '') {
            self.objectListValue.push(obj)
          }
        })
      }
    }
  }
</script>
<style>
</style>
