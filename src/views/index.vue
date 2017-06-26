<template>
  <div>
    <x-header :left-options="{showBack: true,backText: '', preventGoBack: true}" @on-click-back="goBackToMP" title="人事">
      <a href="javascript:" v-if="getUserInfo.isAdmin==true || getUserInfo.isHRManager==1" @click="showHRSetting" slot="right">设置</a>
    </x-header>
    <div>
      <group>
        <cell title="员工档案" is-link @click.native="judgeUserIdentity" inline-desc='家庭信息、人事信息及过往记录'>
          <img class="weui_cell_hd_img" slot="icon" src="../../static/img/icon-3.png">
          <badge v-if="applicationCount!=0 && (getUserInfo.isAdmin==true || getUserInfo.isHRManager==1)" :text="applicationCount"></badge>
        </cell>
        <!--<cell title="薪酬管理" :valueFlex='0' link="https://vux.li" inline-desc='工资、社保、公积金计算'>-->
          <!--<img class="weui_cell_hd_img" slot="icon" src="../../static/img/icon-5.png">-->
        <!--</cell>-->
      </group>
    </div>
    <loading v-model="showLoading" :text="loadingText"></loading>
  </div>
</template>
<script>
  import Vue from 'vue'
  import XHeader from '../components/x-header/index.vue'
  import Cell from '../components/cell/index.vue'
  import Group from '../components/group/index.vue'
  import Loading from '../components/loading/index.vue'
  import Badge from '../components/badge/index.vue'
  import {mapGetters, mapActions} from 'vuex'
  import axios from 'axios'
  export default {
    components: {
      XHeader,
      Cell,
      Group,
      Loading,
      Badge
    },
    data () {
      return {
        showLoading: true,
        loadingText: '加载中...',
        hasAuth: false
      }
    },
    computed: {
      ...mapGetters([
        'getUserInfo'
      ]),
      applicationCount () {
        return this.$store.state.applicationList.filter(function (application) {
          return application.applicantType === 1
        }).length
      }
    },
    mounted () {
      // 获取个人信息
      // 获取通讯录
      // 获取部门
      const self = this
      self.showLoading = true
      axios.all([this.GET_USER_INFO(), this.GET_CONTACTS(), this.GET_DEPARTMENTS(), this.GET_APPLICATION_LIST()])
        .then(axios.spread(function () {
          self.showLoading = false
      }))
      this.$store.state.basicProfileListExpandedDept = []
    },
    methods: {
      ...mapActions([
        'GET_USER_INFO',
        'GET_CONTACTS',
        'GET_DEPARTMENTS',
        'GET_APPLICATION_LIST'
      ]),
      judgeUserIdentity () {
         if (this.getUserInfo.isHRManager === 1 || this.getUserInfo.isAdmin === true || this.getUserInfo.isDepManager === true || this.getUserInfo.isAssistantManager === 1) {
           this.$router.push({path: '/staffprofile/list'})
         } else {
           this.$router.push({path: '/staffprofile/profile/' + this.getUserInfo.mainContactId})
         }
      },
      showHRSetting () {
        if (this.getUserInfo.isHRManager === 1 || this.getUserInfo.isAdmin === true) {
           this.$router.push({path: '/setting'})
        }
      },
      goBackToMP () {
        window.location.href='goBackToMP'
      }
    }
  }
</script>
<style>
  #app .weui_media_box.weui_media_appmsg .weui_media_hd {
    width: 35px;
    height: 35px;
    margin-right: 14px;
  }
  #app .weui_media_box .weui_media_desc {
    padding-top: 8px;
  }
  .weui_cell_hd_img {
    display: block;
    width: 35px;
    margin-right: 14px;
  }
  /*#app .weui_cell {*/
    /*padding: 6.5px 15px;*/
  /*}*/
  #app .weui_cell .vux-label-desc {
    color: #999;
  }
</style>
