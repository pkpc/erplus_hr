import StaffProfileList from '../views/staffprofile/list'
import SearchProfile from '../views/staffprofile/search'
import ApplicationList from '../views/staffprofile/applicationList'
import CreateBase from '../views/staffprofile/profile/create/base'
import CreateFamily from '../views/staffprofile/profile/create/family'
import CreatePersonnel from '../views/staffprofile/profile/create/personnel'
import CreateSalary from '../views/staffprofile/profile/create/salary'
import CreateAttachment from '../views/staffprofile/profile/create/attachment'
import UpdateBase from '../views/staffprofile/profile/update/base'
import UpdateFamily from '../views/staffprofile/profile/update/family'
import UpdatePersonnel from '../views/staffprofile/profile/update/personnel'
import UpdateSalary from '../views/staffprofile/profile/update/salary'
import UpdateAttachment from '../views/staffprofile/profile/update/attachment'
import UpdateBirth from '../views/staffprofile/profile/update/birth'
import Profile from '../views/staffprofile/profile/index'
import EditProfile from '../views/staffprofile/profile/edit'
import PreviewBirth from '../views/staffprofile/profile/preview/birth'
import PreviewRecord from '../views/staffprofile/profile/preview/record'

const baseUrl = '/staffprofile'
const baseUrl_profile = baseUrl + '/profile'
const baseUrl_create = baseUrl_profile + '/create'
const baseUrl_preview = baseUrl_profile + '/:id/preview'
const baseUrl_update = baseUrl_profile + '/:id/update'
export default [
  {
    path: baseUrl + '/list',
    name: 'staffProfileList',
    component: StaffProfileList,
  },
  {
    path: baseUrl + '/search',
    name: 'searchProfile',
    component: SearchProfile
  },
  {
    path: baseUrl + '/applicationList',
    name: 'applicationList',
    component: ApplicationList
  },
  {
    path: baseUrl_profile + '/:id',
    name: 'profile',
    component: Profile
  },
  {
    path: baseUrl_profile + '/:id/edit',
    name: 'editProfile',
    component: EditProfile
  },
  {
    path: baseUrl_preview + '/birth',
    name: 'previewBirth',
    component: PreviewBirth
  },
  {
    path: baseUrl_preview + '/record',
    name: 'previewRecord',
    component: PreviewRecord
  },
  {
    path: baseUrl_create + '/base',
    name: 'createBase',
    component: CreateBase
  },
  {
    path: baseUrl_create + '/family',
    name: 'createFamily',
    component: CreateFamily
  },
  {
    path: baseUrl_create + '/personnel',
    name: 'createPersonnel',
    component: CreatePersonnel
  },
  {
    path: baseUrl_create + '/salary',
    name: 'createSalary',
    component: CreateSalary
  },
  {
    path: baseUrl_update + '/attachment',
    name: 'createAttachment',
    component: CreateAttachment
  },
  {
    path: baseUrl_update + '/base',
    name: 'updateBase',
    component: UpdateBase
  },
  {
    path: baseUrl_update + '/family',
    name: 'updateFamily',
    component: UpdateFamily
  },
  {
    path: baseUrl_update + '/personnel',
    name: 'updatePersonnel',
    component: UpdatePersonnel
  },
  {
    path: baseUrl_update + '/salary',
    name: 'updateSalary',
    component: UpdateSalary
  },
  {
    path: baseUrl_update + '/attachment',
    name: 'updateAttachment',
    component: UpdateAttachment
  },
  {
    path: baseUrl_update + '/birth',
    name: 'updateBirth',
    component: UpdateBirth
  }
]

