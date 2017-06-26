<template>
  <div class="content">
    <ul>
      <mp-fold-cell :selectedArr="selected"
                    :dataSource="dataSource"
                    ref="MPFoldCell"></mp-fold-cell>
    </ul>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import MPFoldCell from '../mp-fold-cell/index.vue'
  const clonedeep = require('lodash.clonedeep')
  export default {
    props: {
      contacts: Array,
      departments: Array,
      staffProfileList: Array,
      contactId: Number
    },
    components: {
      'mp-fold-cell': MPFoldCell
    },
    mounted: function () {
      const self = this
      // 获取传过来的id,可以为数字或者数字字符串
      const currContactId = this.userContactId
      let expandedDpt = []
      let departmentData = clonedeep(this.departments)
      let contactsData = clonedeep(this.contacts)
      contactsData.forEach(function (obj) {
        obj.selected = false
        if (obj.isAdmin) {
          obj.canSelectAdmin = false
        }
        if (obj.isIdirector === undefined && (obj.isIdirector !== 1 || obj.isIdirector !== true)) {
          // 只保留非独董员工
          self.contacts.push(obj)
        }
      })
      departmentData.forEach(function (dptObj) {
        dptObj.selected = false
        expandedDpt.some(function (obj, index) {
          if (typeof obj !== Array) {
            if (obj == dptObj.id) {
              expandedDpt[index] = dptObj.path
              return true
            }
          }
        })
      })
      self.show = true
      self.dataSource = outTravese(departmentData, contactsData, currContactId)

      function outTravese(departments, contacts, currContactId) {
        var currUserData = ''
        var dptTempArr = []
        var specialEmpObj = {}
        contacts.some(function (obj) {
          if (obj.id == currContactId) {
            currUserData = obj
          }
        })
        if (departments.length == 0) {
          dptTempArr.push(currUserData)
        } else {
          // 部门里放人
          contacts.forEach(function (contactObj) {
            departments.forEach(function (dptobj) {
              dptobj.expanded = true
              dptobj.selected = false
              if (contactObj.departmentId == dptobj.id && (contactObj.isIdirector === undefined || contactObj.isIdirector === 0)) {
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
          departments.some(function (dptObj) {
            pushBranches(dptObj)
          })
          // 循环插入子部门
          function pushBranches(department) {
            departments.forEach(function (dptChildObj, childId) {
              if (dptChildObj.parentId == department.id) {
                pushBranches(dptChildObj)
                if (department.branches == undefined) {
                  department.branches = []
                }
                department.branches.push(dptChildObj)
                // 插入到父部门后 删除该子部门
                delete departments[childId]
              }
            })
          }

          // 去掉undefined元素
          departments.some(function (dptObj) {
            if (dptObj !== undefined && dptObj.name !== '无部门' && dptObj.name !== '独立董事') {
              dptTempArr.push(dptObj)
            }
          })
        }
        return dptTempArr
      }
    },
    data: function () {
      return {
        selectModule: {
          recentlyEmp: {},
          selectEmp: {}
        },
        dataSource: [],
        selected: [],
        loading: true,
        show: false,
        companyId: 0
      }
    },
    methods: {}
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
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

  .mt18 {
    margin-bottom: 18px;
  }
</style>
