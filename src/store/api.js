import axios from 'axios'
import {getUrlParam} from '../libs/utils'
// 获取token
const token = getUrlParam('token')
// const baseUrl = 'https://www.erplus.co/mphr'
// 设置全局携带
axios.defaults.baseURL = 'https://www.erplus.co'
axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
}

export default {
  getLevelWhomUsingList:function (data) {
    return axios.post('/mphr//getLevelWhomUsingList',data)
  },
  getGradeInfoList:function () {
    return axios.post('/mphr/getGradeInfoList')
  },
  saveGradeOption:function (data) {
    return axios.post('/mphr/saveGradeOption',data)
  },
  deleteGradeInfo:function (data) {
    return axios.post('/mphr/deleteGradeInfo',data)
  },
  editGradeOption:function (data) {
    return axios.post('/mphr/editGradeOption',data)
  },
  fetchUserInfo: function () {
    return axios.get('/api/v1/profile')
  },
  fetchHRAuth: function (data) {
    return axios.post('/mpauth/getContactidsByAuthType', data)
  },
  fetchContacts: function () {
    return axios.get('/api/v1/contacts')
  },
  fetchDepartments: function () {
    return axios.get('/api/v1/departments')
  },
  fetchHRSetting: function () {
    return axios.post('/mphr/getHrOption')
  },
  saveHRManager: function (data) {
    return axios.post('/mpauth/insertAuth', data)
  },
  fetchBirthSetting: function () {
    return axios.post('/mphr/getBirthdayOption')
  },
  saveBirthIsRemind: function (data) {
    return axios.post('/mphr/birthdayRemindSwitch', data)
  },
  saveBirthContent: function (data) {
    return axios.post('/mphr/saveBirthdayRemindContext', data)
  },
  saveBirthRange: function (data) {
    return axios.post('/mphr/saveBirthdayRemindRange', data)
  },
  saveBirthReminder: function (data) {
    return axios.post('/mphr/saveWhoNeedsBirthdayRemind', data)
  },
  fetchStaffProfileList: function (data) {
    return axios.post('/mphr/getBasicHrInfoList', data)
  },
  fetchProfileDetailById: function (data) {
    return axios.post('/mphr/getBasicHrInfoDetail', data)
  },
  saveProfileDetailById: function (data) {
    return axios.post('/mphr/saveBasicHrInfo', data)
  },
  fetchAllowedProfileList: function () {
    return axios.post('/mphr/getWhoAuthToSeeList')
  },
  fetchApplyForProfileDetail: function (data) {
    return axios.post('/mphr/applyForCheckingBasicHrInfo', data)
  },
  fetchApplicationList: function (data) {
    return axios.post('/mphr/getApplicationList', data)
  },
  fetchAlreadyAppliedList: function (data) {
    return axios.post('/mphr/getWhoIAlreadyAppliedList', data)
  },
  fetchApproveApplication: function (data) {
    return axios.post('/mphr/handleBasicHrInfoApplication', data)
  },
  fetchMyProfile: function () {
    return axios.post('/mphr/getMyBasicHrInfo')
  },
  fetchHRHistory: function (data) {
    return axios.post('/mphr/getHrHistoryInfo', data)
  },
  fetchEncodeData: function (data) {
    return axios.post('/salaryServlet/encodeData', data)
  },
  fetchDecodeData: function (data) {
    return axios.post('/salaryServlet/decodeData', data)
  }
}
