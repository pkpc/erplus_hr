<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="搜索员工">
    </x-header>
    <div>
      <search placeholder="搜索" ref="search" @result-click="resultClick" @on-change="getResult" :results="results" v-model="selectedResult" position="absolute" auto-scroll-to-top cancelText="取消"></search>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../components/x-header/index.vue'
  import Search from '../../components/search/index.vue'
  import {mapGetters} from 'vuex'
  import clonedeep from 'lodash.clonedeep'
  export default {
    created () {
      this.contactsData = this.$store.state.basicProfileList
    },
    components: {
      XHeader,
      Search
    },
    data () {
      return {
        contactsData: [],
        results: [],
        selectedResult: ''
      }
    },
    computed: {
      ...mapGetters([
        'getUserInfo',
        'getContacts'
      ])
    },
    methods: {
      getResult (value) {
        const self = this
        let tempResults = []
        self.contactsData.forEach(function (contact) {
          if (contact.name.indexOf(value) !== -1) {
            tempResults.push(contact)
          }
        })
        this.results = tempResults
      },
      resultClick (result) {
        if (result.isAllowed === 0 || result.isSelf === true || this.getUserInfo.isHRManager === 1 || this.getUserInfo.isAdmin === true) {
          this.$router.push({path: '/staffprofile/profile/' + result.mainContactId})
        } else {
          const self = this
          setTimeout(function () {
            self.$refs.search.touch()
          }, 0)
        }
      }
    }
  }
</script>
<style scoped>
</style>
