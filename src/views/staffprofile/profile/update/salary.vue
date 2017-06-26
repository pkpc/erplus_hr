<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工信息完善">
      <a slot="right" @click="save">保存</a>
    </x-header>
    <div>
      <group title="薪资信息（税前）" titleBackground="#f7f7f7">
        <x-input :hdFlex="1" :bdFlex="2"  title='试用期薪资' placeholder="请输入" :show-clear="false" v-model="currentProfile.probationaryPeriodSalary">
        </x-input>
        <x-input :hdFlex="1" :bdFlex="2" title='转正后薪资' placeholder="请输入" :show-clear="false" v-model="currentProfile.regularSalary">
        </x-input>
      </group>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../../components/x-header/index.vue'
  import Group from '../../../../components/group/index.vue'
  import XInput from '../../../../components/x-input/index.vue'
  export default {
    components: {
      XHeader,
      Group,
      XInput
    },
    data () {
      return {
        currentProfile: {}
      }
    },
    created () {
      this.currentProfile = this.$store.state.editCurrentProfile
    },
    methods: {
      save () {
        this.$store.state.editCurrentProfile = this.currentProfile
        this.$router.back()
      }
    }
  }
</script>
<style>
</style>
