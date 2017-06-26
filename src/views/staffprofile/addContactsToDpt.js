/**
 * Created by KWAN on 17/2/13.
 */
export const outTravese = function (departments, contacts, currContactId) {
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
        if (contactObj.departmentId == dptobj.id && (contactObj.isIdirector === undefined || contactObj.isIdirector === 0)) {
          if (dptobj.members === undefined) {
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
    if (specialEmpObj.isAdmin !== undefined || specialEmpObj.isNoDeptArr !== undefined) {
      // 若无admin 或 无副总
      dptTempArr.push({members: [], expanded: true});
      if (specialEmpObj.isAdmin !== undefined) {
        dptTempArr[0].members.push(specialEmpObj.isAdmin)
      }
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
    departments.forEach(function (dptObj) {
      if (dptObj !== undefined && dptObj.name !== '无部门' && dptObj.name !== '独立董事') {
        dptTempArr.push(dptObj)
      }
    })
  }
  return dptTempArr
}
