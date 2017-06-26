<template>
  <div style="-webkit-transform: translateZ(0px)">
    <x-header :left-options="{showBack: true,backText: ''}" title="员工档案">
      <div slot="right">
        <!--<router-link to='/staffprofile/search'>-->
          <!--<img class="mp_icon_search" src="../../../static/img/icon_search_1.png" alt="">-->
        <!--</router-link>-->
        <!--<img class="mp_icon_add" src="../../../static/img/icon_add.png" alt="">-->
      </div>
    </x-header>
    <div>
      <search @input-status="getInputStatus" placeholder="搜索" ref="search" @result-click="applyForAuthConfirm" @on-change="getSearchResult" :results="searchResults" v-model="searchKeyword" position="absolute" cancelText="取消"></search>
      <group gutter="0" v-if="((getUserInfo.isAdmin==true || getUserInfo.isHRManager==1)&&applicationCount>0)" v-show="!inputFocus">
        <cell title="查看员工档案申请" :link="{path: '/staffprofile/applicationList'}" is-link>
          <img class="img_file_view" src="../../../static/img/icon_file_view.png" slot="icon" />
          <badge :text="applicationCount"></badge>
        </cell>
      </group>
      <ul class="bg_fff mt8" v-show="!inputFocus">
        <mp-fold-cell :selectedArr="selected"
                      :dataSource="dataSource"
                      ref="MPFoldCell"
                      @expandedDept="expandedDept2"></mp-fold-cell>
      </ul>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../components/x-header/index.vue'
  import Group from '../../components/group/index.vue'
  import Cell from '../../components/cell/index.vue'
  import Badge from '../../components/badge/index.vue'
  import MPFoldCell from  '../../components/mp-fold-cell/index.vue'
  import {outTravese} from  './addContactsToDpt'
  import {mapGetters, mapActions} from 'vuex'
  import dateFormat from '../../tools/date/format'
  import {getAgeByDate} from '../../../src/libs/utils'
  import Search from '../../components/search/index.vue'
  import axios from 'axios'
  const clonedeep = require('lodash.clonedeep')
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      Badge,
      'mp-fold-cell': MPFoldCell,
      Search
    },
    data () {
      return {
        selectModule: {
          recentlyEmp: {},
          selectEmp: {}
        },
        selected: [],
        loading: true,
        show: false,
        companyId: 0,
        expanded: {},
        dataSource: [],
        contacts: [],
        departments: [],
        profileList: [],
        searchResults: [],
        searchKeyword: '',
        inputFocus: false
      }
    },
    computed: {
      ...mapGetters([
        'getUserInfo',
        'getContacts',
        'getDepartments',
        'getStaffProfileList'
      ]),
      applicationCount () {
        return this.$store.state.applicationList.filter(function (application) {
          return application.applicantType === 1
        }).length
      },
      hasAuth () {
        // 是老板 或者 HR
        return !!(this.getUserInfo.isAdmin || this.getUserInfo.isHRManager)
      },
      contactsData () {
        const self = this
        let contactsTemp = clonedeep(this.getContacts)
        if (contactsTemp.length > 0) {
          contactsTemp = contactsTemp.filter(function (obj) {
            if (self.hasAuth) {
              return true
            } else {
              if (self.getUserInfo.isDepManager || (self.getUserInfo.isAssistantManager === 1 && self.getUserInfo.department.name !== '无部门')) {
                // 是主管 或者副主管，只显示本部门人员
                if (obj.isAdmin || obj.departmentName === '无部门') {
                } else {
                  if (self.getUserInfo.isDepManager) {
                    return true
                  } else {
                    // 副主管 不显示 本部门 主管或副主管
                    if (obj.contactId !== self.getUserInfo.id && ((obj.isDepManager || obj.isAssistantManager === 1) && obj.departmentId === self.getUserInfo.departmentId)) {
                    } else {
                      return true
                    }
                  }
                }
              } else if (self.getUserInfo.isAssistantManager === 1) {
                // 副总 除了admin 其他副总 都显示
                if (obj.contactId !== self.getUserInfo.id && (obj.isAdmin || (obj.departmentName === '无部门' && obj.isAssistantManager === 1))) {
                } else {
                  return true
                }
              }
            }
          })
        }
        return contactsTemp
      },
      departmentData () {
        const self = this
        let departments = clonedeep(this.getDepartments)
        if (this.hasAuth || (this.getUserInfo.isAssistantManager === 1 && this.getUserInfo.department.name === '无部门')) {
          // 是老板 或者 HR 或者 副总
          departments.forEach(function (department) {
            if (department.expanded === undefined) {
              self.$set(department, 'expanded', false) // 添加响应属性expanded
            }
            if (self.expandedDept.length > 0) {
              self.expandedDept.some(function (obj) {
                if (obj.id === department.id) {
                  department.expanded = true
                  return true
                }
              })
            } else {
              department.expanded = false
            }
          })
        } else {
          if (this.getUserInfo.isDepManager || (this.getUserInfo.isAssistantManager === 1 && this.getUserInfo.department.name !== '无部门')) {
            // 是主管 或者 副主管，只显示本部门人员
            departments = departments.filter(function (department) {
              self.$set(department, 'expanded', true) // 添加响应属性expanded
              const deptIndex = department.path.indexOf(self.getUserInfo.departmentId.toString())
              return department.id === self.getUserInfo.departmentId || (deptIndex !== -1 && deptIndex !== (department.path.length - 1))
            })
          }
        }
        return departments
      },
      expandedDept () {
        return this.$store.state.basicProfileListExpandedDept
      }
    },
    created () {
      this.$vux.loading.show({
        text: '加载中...'
      })
      const self = this
      if (self.hasAuth) {
        this.$store.dispatch('GET_APPLICATION_LIST')
      }
        axios.all([this.$store.dispatch('GET_STAFF_PROFILE'), this.$store.dispatch('GET_ALREADY_APPLIED_LIST')])
          .then(axios.spread(function (profileList, alreadyAppliedList) {
            if (profileList.result === 0) {

              self.contactsData.forEach(function (contact) {
                // 判断是否是本人
                if (self.getUserInfo.mainContactId === contact.mainContactId) {
                  self.$set(contact, 'isSelf', true)
                }
                if (profileList.data.length > 0) {
                  contact.isCompleted = profileList.data.some(function (obj) {
                    if (contact.mainContactId === obj.mainContactId) {
                      contact.age = obj.age
                      contact.sex = obj.sex
                      contact.profileId = obj.id
                      return true
                    }
                  })
                }
                if (!contact.isCompleted) {
                  // 默认profile id
                  contact.profileId = 0
                }
                // 判断是否已完善信息
                if (self.hasAuth) {
                  // 是老板 或者 HR 有所有权限
                  contact.isAllowed = 0
                  contact.applyStatus = ''
                  contact.isAdminOrHR = 1
                } else {
                  contact.isAdminOrHR = 0
                  // 默认可申请
                  contact.isAllowed = 3
                  // 判断是否有查看权限
                  alreadyAppliedList.data.some(function (obj) {
                    if (contact.mainContactId === obj.beWatch) {
                      // 设置查看权限结束时间
                      if (obj.applicantType === 0) {
                        // 申请通过
                        obj.endtime = obj.endtime.replace(/-/g, '/')
                        let endDateTemp = dateFormat(new Date(obj.endtime), 'YYYY-MM-DD HH:mm')
                        const endDateArr = endDateTemp.split(' ')
                        let endDayTemp = endDateArr[0]
                        let endTimeTemp = endDateArr[1]
                        let currTimeTemp = dateFormat(new Date(), 'YYYY-MM-DD HH:mm')
                        if (currTimeTemp < endDateTemp) {
                          // 未超过结束时间
                          if (currTimeTemp >= endDayTemp) {
                            contact.applyStatus = '今日' + endTimeTemp + '前可查看'
                          } else {
                            contact.applyStatus = '明日' + endTimeTemp + '前可查看'
                          }
                          contact.endTime = obj.endtime
                          contact.isAllowed = 0
                        } else {
                          // 超过结束时间
                          contact.isAllowed = 3
                        }
                      } else if (obj.applicantType === 1 || obj.applicantType === 2) {
                        // 1 申请中 2申请被拒绝
                        contact.isAllowed = obj.applicantType
                        contact.applyStatus = '今日已申请'
                      } else {
                        // 可申请
                        contact.isAllowed = 3
                      }
                      return true
                    }
                  })
                }
              })
            }
            self.$store.state.basicProfileList = self.contactsData
            if (self.hasAuth) {
              self.contacts = self.contactsData
            } else {
              self.departmentData.forEach(function (department) {
                self.contactsData.forEach(function (contact) {
                  if (department.id === contact.departmentId) {
                    self.contacts.push(contact)
                  }
                })
              })
            }
            self.departments = self.departmentData
            self.dataSource = outTravese(self.departments, self.contacts, self.getUserInfo.id)
            self.$store.state.basicProfileListSource = self.dataSource
            self.$vux.loading.hide()
          }))
      self.$store.state.currentProfile = {}
      self.$store.state.editCurrentProfile = {}
    },
    methods: {
      ...mapActions([
        'GET_USER_INFO',
        'GET_CONTACTS',
        'GET_DEPARTMENTS',
        'GET_STAFF_PROFILE'
      ]),
      getInputStatus (value) {
        this.inputFocus = value
      },
      getSearchResult (value) {
        const self = this
        let tempResults = []
        if (value !== '') {
          self.contacts.forEach(function (contact) {
            if (contact.name.indexOf(value) !== -1) {
              tempResults.push(contact)
            }
          })
        }
        this.searchResults = tempResults
      },
      applyForAuthConfirm (result) {
        // 弹出窗
        if (result.isAllowed === 0 || result.isSelf === true || this.getUserInfo.isHRManager === 1 || this.getUserInfo.isAdmin === true) {
          this.$router.push({path: '/staffprofile/profile/' + result.mainContactId})
        } else {
          const self = this
          if (result.isAllowed === 3) {
            this.$vux.confirm.show({
              title: '申请查看员工档案',
              content: '提交查看申请后，老板会收到相关提醒，批准后您即可查看该员工的相关资料',
              confirmText: '好的',
              cancelText: '取消',
              onConfirm () {
                self.searchResultClick(result)
              }
            })
          }
        }
      },
      searchResultClick (result) {
        this.$store.dispatch('APPLY_FOR_PROFILE_DETAIL', {
          beWatch: result.mainContactId,
          operatedId: result.profileId
        }).then(function (res) {
          if (res.result === 0) {
            result.isAllowed = 1
            result.applyStatus = '今日已申请'
          }
        })
      },
      expandedDept2 (data) {
        // 折叠｜｜展开的部门
        this.$store.commit('SET_STAFF_PROFILE_LIST_EXPANDED_DEPT', data)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .weui_icon.weui_icon_search:before {
    color: #fff;
  }
  .img_file_view {
    width: 23.86px;
    height: 24.29px;
    margin-right: 4px;
    vertical-align: middle;
  }
  .mp_icon_add {
    width: 20px;
    height: 20px;
  }

  .mp_icon_search {
    width: 18px;
    height: 18px;
    /*margin-right: 18.5px;*/
  }

  .content {
    padding-bottom: 70px;
    background-color: #fff;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
  }

  /*end 复选框样式*/

  .bg_fff {
    background-color: #fff;
  }

  .emp-list {
    list-style: none;
    font-size: 28px; /*px*/
    display: flex;
    position: relative;
    justify-content: flex-start;
  }

  .emp-li {
    height: 68px;
    width: 68px;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .emp-avatar {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    margin-bottom: 4px;
  }
  .mt8 {
    margin-top: 8px;
  }
</style>
