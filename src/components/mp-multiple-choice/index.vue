<template>
  <div class="wrapper">
    <div class="content">
      <div id="main">
        <search-slider :selectedArr="selectedPerson" :showFilterResult="showFilterResult"
                       :filterKey="searchQuery" :contacts="contacts" @showResultPanel="showResultPanel">
          <!--被选人-->
          <input type="text" id="search-input" placeholder="搜索" slot="search-input" @input="listenToKeyboard"
                 v-model="searchQuery">
        </search-slider>
        <div class="mb60" v-show="showResultFlag" style="background-color: #fff">
          <p class="panel-title">{{selectModule.selectEmp.title}}</p>
          <ul class="pd_lt_15">
            <mp-multiple-checkbox :hideSelectAll="hideSelectAll"
                              :dataSource="dataSource"
                              :allEmpCount="companyEmpNum"
                              :expandDeptOnce="expandDeptOnce"
                              ref="foldCheckbox"></mp-multiple-checkbox>
          </ul>
        </div>
      </div>
      <div id="footer" v-show="showResultFlag">
        <span>已选{{selectedPerson.length}}人</span>
        <div v-if="hideSelectAll!=true" class="checkbox" @click="allSelectedDept">
          全选
          <i class="icon_checkbox"
                :class="[{'ion-ios-checkmark':isAllSelected},{'ion-ios-circle-outline':!isAllSelected}]"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import SearchSlider from '../search-slider/index.vue'
  import MPMultipleCheckBox from '../mp-multiple-checkbox/index.vue'
  import {getUrlParam} from '../../libs/utils'
  import cloneDeep from 'lodash.clonedeep'
  import '../../../static/js/pinyinUtil'
  export default {
    components: {
      'search-slider': SearchSlider,
      'mp-multiple-checkbox': MPMultipleCheckBox
    },
    props: {
      currContactId: Number ,
      selectedId: Array,
      selectedDeptId: Array,
      selectModuleTitle: String,
      showRecently: {
        type: String,
        default: '0'
      },
      recentlyType: {
        type: String,
        default: '0'
      },
      hideSelectAll: {
        type: Boolean,
        default: false
      },
      contactsArr: {
        type: Array,
        default: []
      },
      departmentsArr: {
        type: Array,
        default: []
      }
    },
    created: function () {
      let self = this
      // 获取传过来的id,可以为数字或者数字字符串
      const currContactId = this.currContactId  // 自己的id
      this.contacts = cloneDeep(this.contactsArr)
      this.departments = cloneDeep(this.departmentsArr)
      this.assignedId = this.selectedId
      let selectModuleTitle = this.selectModuleTitle // 常用参与人标题
      let showRecently =this.showRecently // 是否显示常用参与人标题
      showRecently = showRecently === '1' || showRecently === null
      let notSelectAdmin = false // 是否不能选取admin
      selectModuleTitle = selectModuleTitle === null ? '请选择参与人' : selectModuleTitle
      self.selectModule.selectEmp.title = decodeURI(selectModuleTitle)
      self.selectModule.recentlyEmp.title = '常用参与人'
      self.selectModule.recentlyEmp.show = showRecently
      let currUserData = ''
      // 获取是否更新时间标识 通讯录 部门 this.GET_CONTACTS_UPDATE_TIME(),
      combineSource(this.contacts, this.departments)
      // 组装contacts departments
      function combineSource (contacts, departments) {
        self.contacts = initContacts(contacts)
        self.departments = initDepartments(departments)
        self.companyEmpNum = self.contacts.filter(function (contact) {
          return contact !== undefined
        }).length
        self.dataSource = outTravese(self.departments, self.contacts, currContactId)
        self.dataSource.forEach(function (source) {
          selectedEmpAndDept(source)
        })
      }
      // 初始化contacts数据
      function initContacts (contacts) {
        contacts.forEach(function (contact, index) {
          self.$set(contact, 'selected', false)
          if (contact.isAdmin && notSelectAdmin) {
            contact.canSelectAdmin = false
          }
          contact.firstLetter = window.pinyinUtil.getFirstLetter(contact.name)
          contact.pinyin = window.pinyinUtil.getPinyin(contact.name, '', false).trim()
          if (contact.isIdirector === undefined && (contact.isIdirector !== 1 || contact.isIdirector !== true)) {
          } else {
            delete contacts[index]
          }
          if (contact.id === parseInt(currContactId)) {
            currUserData = contact
          }
        })
        return contacts
      }
      // 初始化departments数据
      function initDepartments (deparments) {
        deparments.forEach(function (department) {
          self.$set(department, 'selected', false)
          self.$set(department, 'expanded', false)
        })
        return deparments
      }
      // 根据assigned选中部门和人
      function selectedEmpAndDept (source) {
        let empAllSelected = true
        let deptAllSelected = true
        let empSectionSelected = false
        let deptSectionSelected = false
        // 判断当前部门是否选中
        self.assignDepId.some(function (assignDep) {
          if (parseInt(assignDep) === source.id) {
            // 优先级最高
            source.selected = true
            return true
          }
        })
        if (source.members !== undefined) {
          source.members.forEach(function (member) {
            self.assignedId.some(function (assignId) {
              if (parseInt(assignId) === member.id) {
                member.selected = true
                empSectionSelected = true
                return true
              }
            })
            if (member.selected) {

            } else {
              // 有 未选中的人
              if (source.selected) {
                member.selected = true
              } else {
                empAllSelected = false
              }
            }
          })
        }
        if (source.branches !== undefined) {
          source.branches.forEach(function (branch) {
            if (source.selected) {
              branch.selected = true
            }
            self.assignDepId.forEach(function (assignDep) {
              if (parseInt(assignDep) === branch.id) {
                branch.selected = true
                branch.expanded = true
              }
            })
            //  递归子部门
            selectedEmpAndDept(branch)
            if (branch.selected) {
              deptSectionSelected = true
            } else {
              deptAllSelected = false
            }
            if (branch.expanded) {
              deptSectionSelected = true
            }
          })
        }
        if (empAllSelected && deptAllSelected && (source.members !== undefined || source.branches !== undefined)) {
          source.selected = true
        }
        if (empSectionSelected || deptSectionSelected) {
          source.expanded = true
        }
      }
      /*eslint-disable*/
      function outTravese (departments, contacts) {
        let dptTempArr = []
        let specialEmpObj = {}
        let departmentsTemp = departments
        if (departments.length === 0) {
          dptTempArr.push(currUserData)
        } else {
          // 部门里放人
          contacts.forEach(function (contactObj) {
            departmentsTemp.forEach(function (dptobj) {
              if (contactObj.departmentId === dptobj.id && (contactObj.isIdirector === undefined || contactObj.isIdirector === 0)) {
                if (dptobj.members == undefined) {
                  dptobj.members = []
                }
                dptobj.members.push(contactObj)
              }
            })
            if (contactObj.isAdmin) {
              // admin
              specialEmpObj.isAdmin = contactObj
            } else if (contactObj.isAssistantManager && contactObj.department === '无部门') {
              // 副总
              if (specialEmpObj.isAssistantAdmin === undefined) {
                specialEmpObj.isAssistantAdmin = []
              }
              specialEmpObj.isAssistantAdmin.push(contactObj)
            } else if (contactObj.departmentName === '无部门') {
              // 无部门
              if (specialEmpObj.isNoDeptArr === undefined) {
                specialEmpObj.isNoDeptArr = []
              }
              specialEmpObj.isNoDeptArr.push(contactObj)
            }
          })
          // 手动组装数据
          dptTempArr.push({members: [], expanded: true});
          dptTempArr[0].members.push(specialEmpObj.isAdmin)
          if (specialEmpObj.isAssistantAdmin !== undefined) {
            specialEmpObj.isAssistantAdmin.some(function (aaObj) {
              dptTempArr[0].members(aaObj)
            })
          }
          if (specialEmpObj.isNoDeptArr !== undefined && specialEmpObj.isNoDeptArr.length > 0) {
            specialEmpObj.isNoDeptArr.some(function (obj) {
              dptTempArr[0].members.push(obj)
            })
          }
          departmentsTemp.forEach(function (dptObj) {
            pushBranches(dptObj)
          })
          // 循环插入子部门
          function pushBranches(department) {
            departmentsTemp.forEach(function (dptChildObj, childId) {
              if (dptChildObj.parentId === department.id) {
                pushBranches(dptChildObj)
                if (department.branches === undefined) {
                  department.branches = []
                }
                department.branches.push(dptChildObj)
                // 插入到父部门后 删除该子部门
                delete departmentsTemp[childId]
              }
            })
          }
          // 去掉undefined元素
          departmentsTemp.forEach(function (dptObj) {
            if (dptObj !== undefined && dptObj.name !== '无部门' && dptObj.name !== '独立董事') {
              dptTempArr.push(dptObj)
            }
          })
        }
        return dptTempArr
      }
      /*eslint-disable*/
    },
    data: function () {
      return {
        ua: navigator.userAgent.toLowerCase(),
        selectModule: {
          recentlyEmp: {},
          selectEmp: {}
        },
        dataSource: [],
        selected: [],
        allChecked: false,
        loading: true,
        searchQuery: '',
        contacts: [],
        departments: [],
        companyEmpNum: 0,
        companyId: 0,
        recentlyUserArr: [],
        showResultFlag: true,
        showFilterResult: false,
        assignedId: [],
        assignDepId: [],
        expandDeptOnce: true
      }
    },
    computed: {
      selectedPerson () {
        return this.contacts.filter(function (contact) {
          return contact.selected === true
        })
      },
      selectedDept () {
        return this.departments.filter(function (department) {
          return department.selected === true
        })
      },
      assignedData () {
        let arr = []
        if (this.contacts.length > 0) {
          const self = this
          this.contacts.forEach(function (contact) {
            self.assignedId.forEach(function (id) {
              if (parseInt(id) === contact.departmentId) {
                arr.push(contact)
              }
            })
          })
        }
        return arr
      },
      isAllSelected: function () {
        const self = this
        if (self.companyEmpNum === 0) {
          self.allChecked = false
          return self.allChecked
        } else {
          if (self.companyEmpNum === self.selectedPerson.length) {
            self.allChecked = true
          } else {
            self.allChecked = false
          }
        }
        return self.allChecked
      }
    },
    watch: {
      selectedDept (value) {
        window.selectedDpt = value
      },
      selectedPerson (value) {
        window.selected = value
      },
      searchQuery: function (val, oldVal) {
        if (val != '') {
          this.showFilterResult = true
          this.showResultFlag = false
        } else {
          this.showFilterResult = false
          this.showResultFlag = true
        }
      }
    },
    methods: {
      allSelectedDept: function () {
        this.allChecked = !this.allChecked
        this.$refs.foldCheckbox.allSelectedDept(this.allChecked)
      },
      showResultPanel: function (flag) {
        this.showFilterResult = !flag
        this.showResultFlag = flag
        if (flag) {
          this.searchQuery = ''
        }
      },
      selectedEmp: function (data) {
        document.getElementById('emp' + data.contactId).click()
      },
      listenToKeyboard: function (event) {
        this.searchQuery = event.target.value
      }
    }
  }
</script>
<style scoped>
  body {
    background-color: #efefef;
  }
  .wrapper,
  .content {
    height: 100%;
    overflow: hidden;
  }
  .is-iphone .wrapper > .content {
    margin-top: 64px;
    overflow: hidden;
  }
  #main {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background: #efefef;
  }
  #footer {
    font-size: 14dpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    position: fixed;
    z-index: 100;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    /* footer高度的负值 */
    height: 50px;
    background-color: #fff;
    -webkit-transform: translateZ(0px);
  }

  p {
    margin: 0;
  }

  .panel-title {
    height: 26px;
    padding-left: 15px;
    background: #f7f7f7;
    font-size: 12dpx;
    display: flex;
    align-items: center;
  }

  /* 复选框样式*/
  .icon_checkbox {
    display: inline-block;
    margin-left: 10px;
    font-size: 22dpx;
  }
  .icon_checkbox.ion-ios-checkmark {
    color: #4e92df;
  }
  .icon_checkbox.ion-ios-circle-outline {
    color: #c9c9c9;
  }

  /*常用负责人*/
  ul {
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
  }
  .checkbox {
    height: 100%;
    display: flex;
   align-items: center;
  }
  .mb60 {
    margin-bottom: 60px;
  }
  .pd_lt_15 {
    padding-left: 15px;
  }

</style>
