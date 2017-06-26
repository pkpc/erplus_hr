import Setting from '../views/setting/index'
import SetHRManager from '../views/setting/setHRManager'
import BirthIndex from '../views/setting/birth/index'
import BirthRange from '../views/setting/birth/range'
import BirthReceiver from '../views/setting/birth/receiver'
import BirthContent from '../views/setting/birth/content'
import EmpType from '../views/setting/empType/index.vue'
import TypeDetail from '../views/setting/empType/typeDetail.vue'
const baseUrl = '/setting'
const baseUrl_birth = '/setting/birth'
export default [
  {
    path: baseUrl,
    name: 'setting',
    component: Setting
  },
  {
    path: baseUrl + '/setHR',
    name: 'setHR',
    component: SetHRManager
  },
  {
    path: baseUrl_birth,
    name: 'birthIndex',
    component: BirthIndex
  },
  {
    path: baseUrl_birth + '/range',
    name: 'birthRange',
    component: BirthRange
  },
  {
    path: baseUrl_birth + '/receiver',
    name: 'birthReceiver',
    component: BirthReceiver
  },
  {
    path: baseUrl_birth + '/content',
    name: 'birthContent',
    component: BirthContent
  },
  {
    path: baseUrl + '/empType',
    name: 'empType',
    component: EmpType
  },
  {
    path: baseUrl + '/typeDetail',
    name: 'typeDetail',
    component: TypeDetail
  }
]

