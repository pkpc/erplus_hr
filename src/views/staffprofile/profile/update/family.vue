<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工信息完善">
      <a slot="right" @click="save">保存</a>
    </x-header>
    <div>
      <group title="家庭信息" titleBackground="#f7f7f7">
        <selector title="情感状况" :withIcon="true" :hdFlex="1" :bdFlex="2" :options="maritalStatusList"
                  v-model="currentProfile.personalEmotionStatus"></selector>
        <x-textarea title="家庭住址" :hdFlex="1" :bdFlex="2" :hdAlignSelf="'flex-start'" :rows="5" placeholder="请输入"
                    v-model="currentProfile.homeAddress"></x-textarea>
      </group>
      <group :borderNoWidth="true">
        <x-input :hdFlex="1" :bdFlex="2" title='紧急联络人' placeholder="请输入" :show-clear="false"
                 v-model="currentProfile.emergencyContact">
        </x-input>
        <x-input :hdFlex="1" :bdFlex="2" title='关系' placeholder="请输入" :show-clear="false"
                 v-model="currentProfile.emergencyContactRelation">
        </x-input>
        <x-input :hdFlex="1" :bdFlex="2" title='联络电话' placeholder="请输入" :show-clear="false"
                 v-model="currentProfile.emergencyContactPhone">
        </x-input>
      </group>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../../components/x-header/index.vue'
  import Group from '../../../../components/group/index.vue'
  import XInput from '../../../../components/x-input/index.vue'
  import Selector from '../../../../components/selector/index.vue'
  import XTextarea from '../../../../components/x-textarea/index.vue'
  import clone from 'lodash.clonedeep'
  export default {
    components: {
      XHeader,
      Group,
      XInput,
      Selector,
      XTextarea
    },
    data () {
      return {
        currentProfile: {},
        maritalStatusList: [
          {key: '0', value: '请选择'},
          {key: '1', value: '单身'},
          {key: '2', value: '恋爱中'},
          {key: '3', value: '已婚'},
          {key: '4', value: '离异'},
          {key: '5', value: '丧偶'},
        ],
        defaultValue: ''
      }
    },
    created () {
      this.currentProfile = clone(this.$store.state.editCurrentProfile)
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
