<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="适用范围">
      <a slot="right" @click="save">确定</a>
    </x-header>
    <mp-multiple-choice :currContactId="getUserInfo.id" :contactsArr="getContacts" :departmentsArr="getDepartments" :selectedId="selectedId" ref="mpMultipleChoice" :selectModuleTitle="moduleTitle"></mp-multiple-choice>
  </div>
</template>
<script>
  import XHeader from '../../../components/x-header/index'
  import MPMultipleChoice from '../../../components/mp-multiple-choice/index'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XHeader,
      'mp-multiple-choice': MPMultipleChoice
    },
    computed: {
      selectedId () {
        let selectedIdArr = []
        if (this.$store.state.birthRangeSelected === 'all') {
          this.$store.state.contacts.forEach(function (contact) {
            selectedIdArr.push(contact.contactId)
          })
        } else {
          if (this.$store.state.birthRangeSelected !== undefined && this.$store.state.birthRangeSelected !== "") {
            selectedIdArr = this.$store.state.birthRangeSelected.split(',')
          }

//          selectedIdArr = this.$store.state.birthRangeSelected.split(',')
        }
        return selectedIdArr
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
        const self = this
        let selected = []
        this.$refs.mpMultipleChoice.selectedPerson.forEach(function (obj) {
          selected.push(obj.id)
        })
        if (selected.length === this.$store.state.contacts.length) {
          selected = ['all']
        }
        this.$store.dispatch('SAVE_BIRTH_REMIND_RANGE', {
            range: selected.join(',')
        }).then(() => {
          self.$router.back()
        })
      }
    }
  }
</script>

