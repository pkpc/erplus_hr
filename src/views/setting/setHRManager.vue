<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="选择人事模块管理员">
      <a slot="right" @click="save">确定</a>
    </x-header>
    <mp-multiple-choice :contactsArr="getContacts" :departmentsArr="getDepartments" :selectedId="selectedId" ref="mpMultipleChoice" :selectModuleTitle="moduleTitle"></mp-multiple-choice>
  </div>
</template>
<script>
  import XHeader from '../../components/x-header/index'
  import MPMultipleChoice from '../../components/mp-multiple-choice/index'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XHeader,
      'mp-multiple-choice': MPMultipleChoice
    },
    computed: {
      selectedId () {
        let arr = []
        this.$store.state.hrManager.forEach(function (obj) {
          arr.push(obj.contactId)
        })
        return arr
      },
      ...mapGetters([
        'getUserInfo',
        'getContacts',
        'getDepartments'
      ]),
      moduleTitle () {
        return this.getUserInfo.companyName + ' (' + this.getUserInfo.companycount + ')'
      }
    },
    methods: {
      save () {
        this.$vux.loading.show({
            text: '正在保存...'
        })
        const self = this
        let selected = []
        this.$refs.mpMultipleChoice.selectedPerson.forEach(function (obj) {
          selected.push(obj.id)
        })
        this.$store.dispatch('SAVE_HR_MANAGER', {
          contactIds: selected.join(',')
        }).then(function(res) {
          if (res.result === '0') {
            self.$router.back()
            self.$vux.loading.hide()
          }
        })
      }
    }
  }
</script>

