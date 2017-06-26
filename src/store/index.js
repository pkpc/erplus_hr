import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}, // 用户信息
    contacts: [], // 通讯录
    departments: [], // 公司部门
    hrManager: [], // hr管理员
    hrSetting: {}, // hr设置 参数
    hrSettingTemp: {},
    birthSetting: { // 生日设置 参数
      // "background": "",
      // "companyId": 0,
      // "currentPage": 0,
      // "dataNum": 0,
      // "isBirthdayRemind": 1,
      // "msgContent": "生日快乐啦阿西吧",
      // "msgToRemind": "",
      // "range": "all",
      // "whoToRemind": "self,hr,DM"
    },
    birthRangeSelected: '', /*生日提醒适用范围*/
    staffProfileList: [], /*员工档案列表*/
    currentProfile: {}, /*当前员工档案*/
    editCurrentProfile: {}, /*编辑状态员工档案*/
    applicationList: [],
    basicProfileList: [],
    basicProfileListExpandedDept: [],
    empType:[], //员工类型
    empLevel:{} //员工最终的等级
  },
  getters: {
    getEmpLevel(state){
      return state.empLevel;
    },
    getEmpType(state){
      return state.empType;
    },
    getUserInfo (state) {
      return state.userInfo
    },
    getContacts (state) {
      return state.contacts
    },
    getDepartments (state) {
      return state.departments
    },
    getStaffProfileList (state) {
      return state.staffProfileList
    }
  },
  mutations: {
    SET_EMP_LEVEL(state,params){
      state.empLevel = params;
    },
    EDIT_EMP_TYPE(state,params){
      state.empType[params.index] = params.empType;
    },
    REMOVE_EMP_TYPE(state,index){
      console.log(index)
      state.empType.splice(index,1)
    },
    ADD_EMP_TYPE(state,data){
      state.empType.push(data);
    },
    SET_EMP_TYPE(state,data){
      state.empType = data;
    },
    IS_HR (state, data) {
      if (data.item !== undefined) {
        state.hrManager = data.item
        data.item.forEach(function (obj) {
          if (obj.contactId === state.userInfo.id) {
            Vue.set(state.userInfo, 'isHRManager', 1)
          }
        })
      }
    },
    SET_HR_MANAGER (state, data) {
      state.hrManager = data
    },
    SET_USER_INFO (state, data) {
      state.userInfo = data
    },
    SET_CONTACTS (state, data) {
      state.contacts = []
      data.forEach(function (obj) {
        if (obj.isIdirector !== 1 && obj.isIdirector !== true) {
          obj.contactId = obj.id
          state.contacts.push(obj)
        }
      })
    },
    SET_DEPARTMENTS (state, data) {
      state.departments = data
    },
    SET_HR_SETTING (state, data) {
      state.hrSetting = data
    },
    SET_BIRTH_SETTING (state, data) {
      state.birthSetting = data
    },
    SET_BIRTH_REMIND_RANGE (state, data) {
      if (data.range === 'all') {
        data = []
        state.contacts.forEach(function (obj) {
          data.push(obj.id)
        })
        data = data.join(',')
      } else {
        data = data.range
      }
      state.birthSetting.range = data
      state.birthRangeSelected = data
    },
    SET_STAFF_PROFILE_LIST (state, data) {
      state.staffProfileList = data.data
      // 在通讯录中添加下列属性
      state.contacts.forEach(function (contact) {
        Vue.set(contact, 'isCompleted', false)
        contact.isCompleted = state.staffProfileList.some(function (obj) {
          if (contact.mainContactId === obj.mainContactId) {
            contact.age = obj.age
            contact.sex = obj.sex
            contact.profileId = obj.id
            return true
          }
        })
        if (!contact.isCompleted) {
          // 默认profile id
          contact.profileId = 0
        }
      })
    },
    SET_EDIT_CURRENT_PROFILE (state, data) {
      state.editCurrentProfile = data.data
    },
    UPDATE_EDIT_CURRENT_PROFILE (state, data) {
      state.editCurrentProfile = data
    },
    SET_CURRENT_PROFILE (state, data) {
      if (data.mainContactId === state.userInfo.mainContactId) {
        data.isSelf = true
      }
      // 更新 contacts 里的profileId
      state.contacts.forEach(function (contact) {
        if (contact.mainContactId === data.mainContactId) {
          // 多身份
          contact.profileId = data.profileId
        }
        if (contact.id === data.mainContactId) {
          // 主身份
          data.isAdmin = contact.isAdmin
          data.isAssistantManager = contact.isAssistantManager
          data.isDepManager = contact.isDepManager
          data.isAssistantManager = contact.isAssistantManager
          data.departmentName = contact.departmentName
          data.departmentId = contact.departmentId
          data.phoneInMp = parseInt(data.phoneInMp)
        }
      })
      state.currentProfile = data
    },
    SET_APPLICATION_LIST (state, data) {
      state.applicationList = data
    },
    SET_STAFF_PROFILE_LIST_EXPANDED_DEPT (state, data) {
      if (state.basicProfileListExpandedDept.length > 0) {
        let isExisted = state.basicProfileListExpandedDept.some(function (obj, index) {
          if (obj.id === data.id) {
            if (data.expanded) {

            } else {
              state.basicProfileListExpandedDept.splice(index, 1)
            }
            return true
          }
        })
        if (!isExisted) {
          if (data.expanded) {
            state.basicProfileListExpandedDept.push(data)
          }
        }
      } else {
        if (data.expanded === true) {
          state.basicProfileListExpandedDept.push(data)
        }
      }
    }
  },
  actions: {
    getLevelWhomUsingList({commit},params){
      return api.getLevelWhomUsingList(params).then(res =>{
        // if(res.result == 0)
        console.log(res)
        return res.data;
      })
    },get_empType_list({commit}){
      return api.getGradeInfoList().then(res =>{
        commit('SET_EMP_TYPE',res.data.data);
        return res.data;
      })
    },
    set_empLevel({commit},params){
      commit('SET_EMP_LEVEL',params)
    },
    edit_empType({commit},params){
      return api.editGradeOption(params).then(res =>{
        commit('EDIT_EMP_TYPE',params)
        return res.data;
      })
    },
    remove_empType({commit,state},index){
      const type = state.empType[index];
      const data = {
        descId:type.descId
      }
      return api.deleteGradeInfo(data).then(res =>{
          if(res.data.result === 0){
            commit('REMOVE_EMP_TYPE',index);
            return res;
          }
      })
    },
    add_empType({commit},payLoad){
      return api.saveGradeOption(payLoad).then(res => {
        // if (res.data.result === 0) {
          // commit('ADD_EMP_TYPE',payLoad);
          // commit('SET_HR_MANAGER', payLoad.contactIds.split(','))
        // }
        return res.data
      })
    },
    // 获取个人信息
    GET_USER_INFO ({commit}) {
      return api.fetchUserInfo().then(res => {
        commit('SET_USER_INFO', res.data)
        return res
      }).then(res => {
        let hrData = {}
        hrData.companyId = res.data.companyId
        hrData.authType = 41
        // 获取HR管理员
        return api.fetchHRAuth(hrData)
      }).then(res => {
        commit('IS_HR', res.data)
      })
    },
    // 获取通讯录
    GET_CONTACTS ({commit}) {
      return api.fetchContacts().then(res => {
        commit('SET_CONTACTS', res.data)
      })
    },
    // 获取部门
    GET_DEPARTMENTS ({commit}) {
      return api.fetchDepartments().then(res => {
        commit('SET_DEPARTMENTS', res.data)
      })
    },
    // 获取HR Manager
    GET_HR_MANAGER ({commit, state}) {
      let hrData = {}
      console.log(state.userInfo)
      hrData.companyId = state.userInfo.companyId
      hrData.authType = 41
      return api.fetchHRAuth(hrData).then(res => {
        if (res.data.result === '0') {
          commit('SET_HR_MANAGER', res.data.item)
        }
        return res.data
      })
    },
    // 获取HR设置
    GET_HR_SETTING ({commit}) {
      return api.fetchHRSetting().then(res => {
        if (res.data.result === 0) {
          commit('SET_HR_SETTING', res.data.data)
        }
        return res.data
      })
    },
    // 保存HR管理员
    SAVE_HR_MANAGER ({commit, state}, payLoad) {
      payLoad.authType = 41
      payLoad.companyId = state.userInfo.companyId
      return api.saveHRManager(payLoad).then(res => {
        if (res.data.result === '0') {
          commit('SET_HR_MANAGER', payLoad.contactIds.split(','))
        }
        return res.data
      })
    },
    // 获取Birth设置
    GET_BIRTH_SETTING ({commit}) {
      api.fetchBirthSetting().then(res => {
        if (res.data.result === 0) {
          commit('SET_BIRTH_SETTING', res.data.data)
          commit('SET_BIRTH_REMIND_RANGE', res.data.data)
        }
        return res.data
      })
    },
    // 更新Birth 生日提醒
    SAVE_BIRTH_IS_REMIND ({commit}, payLoad) {
      api.saveBirthIsRemind(payLoad).then(res => {
        if (res.data.result === 0) {
          commit('SET_BIRTH_SETTING', payLoad)
        }
      })
    },
    // 更新Birth 生日提醒内容
    SAVE_BIRTH_REMIND_CONTENT ({commit}, payLoad) {
      api.saveBirthContent(payLoad).then(res => {
        if (res.data.result === 0) {
          commit('SET_BIRTH_SETTING', payLoad)
        }
      })
    },
    // 更新Birth 生日提醒范围
    SAVE_BIRTH_REMIND_RANGE ({commit}, payLoad) {
      api.saveBirthRange(payLoad).then(res => {
        if (res.data.result === 0) {
          commit('SET_BIRTH_REMIND_RANGE', payLoad)
        }
      })
    },
    // 更新Birth 生日提醒人
    SAVE_BIRTH_REMINDER ({commit}, payLoad) {
      api.saveBirthReminder(payLoad).then(res => {
        if (res.data.result === 0) {
          commit('SET_BIRTH_SETTING', payLoad)
        }
      })
    },
    // 获取 员工档案列表
    GET_STAFF_PROFILE ({commit, state}, payLoad) {
      payLoad = {}
      payLoad.isHrManager = state.userInfo.isHRManager
      return api.fetchStaffProfileList(payLoad).then(res => {
        if (res.data.result === 0) {
          commit('SET_STAFF_PROFILE_LIST', res.data)
          return res.data
        }
      })
    },
    // 获取某个员工档案
    GET_PROFILE_DETAIL ({commit}, payLoad) {
      return api.fetchProfileDetailById(payLoad).then(res => {
        if (res.data.result === 0) {
          res.data.data.profileId = payLoad.id
          commit('SET_CURRENT_PROFILE', res.data.data)
          commit('UPDATE_EDIT_CURRENT_PROFILE', res.data.data)
          return res.data.data
        }
      })
    },
    // 更新某个员工档案
    SAVE_PROFILE_DETAIL ({commit}, payLoad) {
      return api.saveProfileDetailById(payLoad).then(res => {
        if (res.data.result === 0) {
          payLoad.profileId = res.data.id
          commit('SET_CURRENT_PROFILE', payLoad)
        }
        return res.data
      })
    },
    // 获取能查看的员工档案列表
    GET_ALLOWED_PROFILE_LIST () {
      return api.fetchAllowedProfileList().then(res => {
        return res.data
      })
    },
    // 获取我的申请列表
    GET_ALREADY_APPLIED_LIST () {
      return api.fetchAlreadyAppliedList().then(res => {
        return res.data
      })
    },
    // 申请查看某个人档案
    APPLY_FOR_PROFILE_DETAIL ({}, payload) {
      return api.fetchApplyForProfileDetail(payload).then(res => {
          return res.data
      })
    },
    // 获取我个人信息档案
    GET_MY_PROFILE ({commit}) {
      return api.fetchMyProfile().then(res => {
        res.data.data.profileId = res.data.data.id
        commit('SET_CURRENT_PROFILE', res.data.data)
        commit('UPDATE_EDIT_CURRENT_PROFILE', res.data.data)
        return res.data.data
      })
    },
    // 申请查看某个人档案
    GET_APPLICATION_LIST ({commit, state}) {
      let params = {}
      params.isHrManager = state.userInfo.isHRManager
      return api.fetchApplicationList(params).then(res => {
        if (res.data.result === 0) {
          commit('SET_APPLICATION_LIST', res.data.data)
        }
        return res.data
      })
    },
    // 批准某个申请
    APPROVE_APPLICATION ({state}, payload) {
      payload.isHrManager = state.userInfo.isHRManager
      return api.fetchApproveApplication(payload).then(res => {
        return res.data
      })
    },
    // 批准某个申请
    GET_HR_HISTORY ({}, payload) {
      return api.fetchHRHistory(payload).then(res => {
        return res.data
      })
    },
    // 加密字段
    ENCODE_DATA ({}, payload) {
      return api.fetchEncodeData(payload).then(res => {
        return res.data
      })
    },
    // 解密字段
    DECODE_DATA ({commit}, payload) {
      let encodeData = []
      if (payload.probationaryPeriodSalary !== undefined) {
        encodeData.push(payload.probationaryPeriodSalary)
      }
      if (payload.regularSalary !== undefined) {
        encodeData.push(payload.regularSalary)
      }
      return api.fetchDecodeData(encodeData).then(res => {
        if (res.data.respCode === '000') {
          if (res.data.item.length > 0) {
            payload.probationaryPeriodSalary = res.data.item[0]
            payload.regularSalary = res.data.item[1]
            commit('SET_CURRENT_PROFILE', payload)
            commit('UPDATE_EDIT_CURRENT_PROFILE', payload)
          }
        }
        return res.data
      })
    }
  }
})
