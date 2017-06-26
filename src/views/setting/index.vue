<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="人事模块设置">
    </x-header>
    <div>
      <cell-desc :link="{path: '/setting/setHR'}">
        <cell title="人事模块管理员" is-link class="no-wrap-desc" :valueFlex="1">
          <span slot="value" class="fc-blue no-wrap-desc">{{hrManagerTitle}}</span>
        </cell>
        <div slot="desc-title" class="desc-list-hd">权限</div>
        <div slot="desc-body" class="desc-list-bd">
          <ul class="desc-list-item">
            <li>新建员工档案；</li>
            <li>编辑员工档案信息；</li>
            <li>设置员工薪酬模板；</li>
          </ul>
          <ul class="desc-list-item">
            <li>授权主管查看员工档案。</li>
          </ul>
        </div>
      </cell-desc>
      <group title="员工档案相关" titleColor="#666666">
        <cell title="员工生日提醒" :valueFlex="1" :link="{path: '/setting/birth'}" is-link valueColor="#8F8E94">{{isBirthRemind}}</cell>
        <cell title="员工类型与级别" :valueFlex="1" :link="{path: '/setting/empType'}" is-link valueColor="#8F8E94"></cell>
      </group>

<!--      <group title="薪酬管理相关" titleFooter="每月计算与填写员工的具体薪资项，建议选择人事或财务负责">
        <cell title="薪资单填写人" is-link>
          <span class="fc-blue" slot="value"></span>
        </cell>
      </group>
      <group titleFooter="每月核准最终薪资，建议由老板或财务总监负责">
        <cell title="薪资核准人" is-link>
          <span class="fc-blue" slot="value"></span>
        </cell>
      </group>
      <group titleFooter="薪资发放完毕后将本月薪资标记为已发放，建议由财务负责">
        <cell title="薪资发放人" is-link>
          <span class="fc-blue" slot="value"></span>
        </cell>
      </group>-->
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import XHeader from '../../components/x-header/index.vue'
  import Cell from '../../components/cell/index.vue'
  import Group from '../../components/group/index.vue'
  import CellDesc from '../../components/cell-desc/index.vue'
  import {mapState, mapActions, mapGetters} from 'vuex'
  import {getNameByIds} from '../../libs/utils'
  import axios from 'axios'
  export default {
    components: {
      XHeader,
      Cell,
      Group,
      CellDesc
    },
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'getContacts'
      ]),
      ...mapState([
        'hrManager',
        'hrSetting'
      ]),
      hrManagerTitle () {
        var mgrObj = []
        this.hrManager.forEach(function (obj) {
          mgrObj.push(obj.name)
        })
        // 只显示前两个
        if (mgrObj.length > 2) {
          mgrObj = mgrObj.length + '人'
        } else {
          mgrObj = mgrObj.join('、')
        }
        return mgrObj
      },
      isBirthRemind () {
        if (this.hrSetting.isBirthdayRemind === undefined || this.hrSetting.isBirthdayRemind === 0) {
          return '未开启'
        } else {
          return '已开启'
        }
      }
    },
    mounted () {
      // 获取HR设置
      // 获取生日设置
      // 获取HR Manager
      const self = this
      self.$vux.loading.show({
        text: '加载中...'
      })
      axios.all([this.GET_HR_SETTING(), this.GET_BIRTH_SETTING(), this.GET_HR_MANAGER()])
        .then(axios.spread(function (result) {
          self.loadingOver = true
          self.$vux.loading.hide()
        }))
    },
    methods: {
      ...mapActions([
        'GET_HR_SETTING',
        'GET_BIRTH_SETTING',
        'GET_HR_MANAGER'
      ])
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
  .weui-cells__title {
    color: #666;
  }

  .fc-blue {
    color: #4a90e2;
  }

  .desc-list-hd {
    font-size: 10px; /*px*/
    padding: 1px 4px;
    margin-right: 18px;
    margin-top: 12px;
    border-radius: 4px;
    background-color: #4a90e2;
    color: #fff;
    align-self: flex-start;
  }
  & .desc-list-bd {
    flex: 1;
  }

  .desc-list-bd {
    display: flex;
    margin-top: 12px;
    margin-bottom: 10px;
  }
  .no-wrap-desc .weui-cell__ft{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .desc-list-item {
    flex: 1;
    & li {
      padding-bottom: 4px;
    }
  }
  ul {
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
  }
  li {
    list-style: none;
  }

</style>
