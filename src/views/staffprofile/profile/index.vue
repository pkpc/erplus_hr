<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工档案">
      <a href="javascript:" v-if="getUserInfo.isAdmin || getUserInfo.isHRManager==1 || getUserInfo.mainContactId==profileData.mainContactId" @click="showEditPage" slot="right">编辑</a>
    </x-header>
    <div>
      <div class="profile_hd">
        <div class="profile_hd_left">
          <img v-if="profileData.headImgUrl" :src="'https://www.erplus.co/uploads/avatars'+profileData.headImgUrl"
               alt="">
          <div class="hd_left_title">
            <p class="left_title_main">
              {{profileData.name}}
              <span v-if="profileData.age" class="after_title">{{profileData.age}}岁</span>
              <span v-if="profileData.sex==0 || profileData.sex==1" class="after_title"
                    :class="{'ion-female': profileData.sex==0, 'ion-male': profileData.sex==1}"></span>
            </p>
            <p class="left_title_sub">{{profileData.position}}</p>
          </div>
        </div>
        <div class="profile_hd_right">
          <div class="profile_hd_right_bd" v-show="empPosition" :class="[empPosition]" ></div>
        </div>
      </div>
      <router-link to="preview/record" tag="p" append class="profile_update_btn">
        <!--<img class="icon_clock" src="../../../../static/img/icon_clock.png" alt="">-->
        <i class="ion-ios-clock-outline"></i>
        查看更新记录
      </router-link>
      <group titleBackground="#f7f7f7">
        <cell title="手机" :valueFlex="2" valueTextAlign="left">
          <span slot="value">{{profileData.phoneInMp}}</span>
          <img slot="child" class="icon_telephone" src="../../../../static/img/icon_telephone.png" alt="">
        </cell>
        <cell :title="profileData.isLunarBirth == 1 ? '农历生日' : '公历生日'" :link="{name: 'previewBirth'}" :valueFlex="2" valueTextAlign="left" is-link>
          <p slot="value">{{profileData.isLunarBirth == 1 ? profileData.lunarBirthday : profileData.birthday}}</p>
        </cell>
        <cell title="籍贯" :valueFlex="2" valueTextAlign="left">{{profileData.hometown}}</cell>
        <cell title="身份证号" :valueFlex="2" valueTextAlign="left">{{profileData.idcard}}</cell>
      </group>
      <cell-collapse title="家庭信息" is-link :items="familyList"></cell-collapse>
      <cell-collapse title="人事信息" is-link :items="personnelList"></cell-collapse>
      <cell-collapse title="薪资信息（税前）" is-link :items="salaryList"></cell-collapse>
      <cell-collapse title="相关附件" is-link collapseType="gallery">
        <div class="mp_cell_gallery" slot="cell-more">
          <img class="mp_cell_gallery_photo " v-for="(item, index) in attachmentList" :src="item.src"
               @click="previewImage (index)"/>
        </div>
      </cell-collapse>
      <div v-if="profileData.remark" class="profile_remark">
        {{profileData.remark}}
      </div>
    </div>
    <previewer :list="attachmentList" ref="previewer" :options="options"></previewer>
  </div>
</template>
<script>
  import XHeader from '../../../components/x-header/index.vue'
  import Group from '../../../components/group/index.vue'
  import Cell from '../../../components/cell/index.vue'
  import CellCollapse from '../../../components/cell-collapse/index.vue'
  import XButton from '../../../components/x-button/index.vue'
  import XInput from '../../../components/x-input/index.vue'
  import Previewer from '../../../components/previewer/index.vue'
  import {mapGetters} from 'vuex'
  import {isEmptyObject} from '../../../../src/libs/utils'
  import dateFormat from '../../../../src/tools/date/format'
  import cloneDeep from 'lodash.clonedeep'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      CellCollapse,
      Previewer
    },
    data () {
      return {
        familyList: [{
          label: '情感状况：',
          value: ''
        }, {
          label: '家庭住址：',
          value: ''
        }, {
          label: '紧急联络人：',
          value: ''
        },{
          label: '关系：',
          value: ''
        }, {
          label: '联系电话：',
          value: ''
        }],
        personnelList: [{
          label: '员工编号：',
          value: ''
        },
        {
          label: '入职日期：',
          value: ''
        }, {
          label: '拟转正日期：',
          value: ''
        }, {
          label: '员工类型：',
          value: ''
        }, {
          label: '级别：',
          value: ''
        }],
        salaryList: [{
          label: '试用期薪资：',
          value: ''
        }, {
          label: '转正后薪资：',
          value: ''
        }],
        attachmentList: [],
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.mp_cell_gallery_photo')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'getContacts',
        'getUserInfo'
      ]),
      profileData () {
        return this.$store.state.currentProfile
      },
      empPosition () {
        var tempSrc = ''
        if (this.profileData.isAdmin === true) {
          // Admin
          tempSrc = 'icon_position_boss'
        } else if (this.profileData.isAssistantManager === 1) {
          if (this.profileData.departmentName === '无部门') {
            // 副总
            tempSrc = 'icon_position_assist_mgr1'
          } else {
            // 副主管
            tempSrc = 'icon_position_assist_mgr2'
          }
        } else if (this.profileData.isDepManager === true) {
          // 主管
          tempSrc = 'icon_position_mgr'
        }
        return tempSrc
      }
    },
    created () {
      let self = this
      let currentContact = {}
      let today = dateFormat(new Date(), 'YYYY-MM-DD')
      console.log(today)
      // 判断当前是否有已选人资料
      this.getContacts.some(function (contact) {
        // 获取主身份 信息
        if (contact.id === parseInt(self.$route.params.id)) {
          if (contact.profileId === 0) {
            currentContact = contact
//            delete currentContact['id']
            currentContact.name = contact.name
            currentContact.headImgUrl = contact.imageName
            currentContact.deptName = contact.department
            currentContact.deptId = contact.departmentId
            currentContact.position = contact.position
            currentContact.phoneInMp = parseInt(contact.phone)
            if (parseInt(self.$route.params.id) === self.getUserInfo.mainContactId) {
              currentContact.isSelf = true
            }
            currentContact = cloneDeep(currentContact)
            self.$store.commit('SET_CURRENT_PROFILE', currentContact)
            self.$store.commit('UPDATE_EDIT_CURRENT_PROFILE', currentContact)
            var params = {};
            self.$store.dispatch('set_empLevel',params);
            return true
          } else {
            self.$vux.loading.show({
              text: '加载中...'
            })
            let getProfileApi = ''
            if (parseInt(self.$route.params.id) === self.getUserInfo.mainContactId) {
              getProfileApi = 'GET_MY_PROFILE'
            } else {
              getProfileApi = 'GET_PROFILE_DETAIL'
            }
            self.$store.dispatch(getProfileApi, {
              id: contact.profileId,
              mainContactId: contact.mainContactId
            }).then(function(res) {
              if (res.personalEmotionStatus !== undefined) {
                self.familyList[0].value = self.changeEmotionStatus(res.personalEmotionStatus)
              }
              self.familyList[1].value = res.homeAddress
              self.familyList[2].value = res.emergencyContact
              self.familyList[3].value = res.emergencyContactRelation
              self.familyList[4].value = res.emergencyContactPhone
              self.personnelList[0].value = res.idInCompany
              self.personnelList[1].value = res.employedDate
              if (res.dateSupposeToBeRegular < today) {
                self.personnelList[2].label = '转正日期'
              }
              self.personnelList[2].value = res.dateSupposeToBeRegular
              if(res.typeName!==undefined){
                self.personnelList[3].value = res.typeName+" ("+res.typeCode+")"
                self.personnelList[4].value = res.mainLevel
              }
              var params = {
                code:res.typeCode,
                level:res.mainLevel,
                typeName:res.typeName
              };
              self.$store.dispatch('set_empLevel',params);

//              self.salaryList[0].value = res.probationaryPeriodSalary
//              self.salaryList[1].value = res.regularSalary
              if (res.attachments !== undefined && res.attachments.length > 0) {
                res.attachments.forEach(function (atm) {
                  self.getImgNaturalDimensions(atm.attachment, self.addImgToList)
                })
              }
              return self.$store.dispatch('DECODE_DATA', res)
//              self.$vux.loading.hide()
            }).then(function (res) {
              if (res.respCode === '000') {
                self.salaryList[0].value = res.item[0]
                self.salaryList[1].value = res.item[1]
                self.$vux.loading.hide()
              }
            })
          }
        }
      })
    },
    methods: {
      previewImage (index) {
        console.log(index)
        this.$refs.previewer.show(index)
      },
      changeEmotionStatus (value) {
        var str = ''
        switch (value) {
          case 1:
            str = '单身'
            break
          case 2:
            str = '恋爱中'
            break
          case 3:
            str = '已婚'
            break
          case 4:
            str = '离异'
            break
          case 5:
            str = '丧偶'
            break
          default:
            str = ''
        }
        return str
      },
      addImgToList (imgSrc, imgWidth, imgHeight) {
        this.attachmentList.unshift({
          src: imgSrc,
          w: imgWidth,
          h: imgHeight
        })
      },
      getImgNaturalDimensions (imgSrc, callback) {
        // 根据src获取图片真实宽高
        var image = new Image()
        image.src = imgSrc
        image.onload = function() {
          callback(imgSrc, image.width, image.height)
        }
      },
      showEditPage () {
        if (this.getUserInfo.isAdmin === true || this.getUserInfo.isHRManager === 1 || this.getUserInfo.mainContactId=== this.profileData.mainContactId) {
          this.$router.push({path: this.$route.path + '/edit'})
        }
      }
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  .profile_hd {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 104px;
    padding: 0 15px;
    margin-top: 12px;
    background-color: #fff;
    .profile_hd_left {
      position: relative;
      display: flex;
      align-items: center;
      img {
        width: 67px;
        height: 67px;
        border-radius: 100%;
        margin-right: 17px;
      }
    }
    .profile_hd_right {
      position: relative;
      display: flex;
      align-items: center;
      .profile_hd_right_bd {
        width: 50px;
        height: 52px;
      }
    }
  }

  .hd_left_title {
    .left_title_main {
      padding-bottom: 7px;
      font-size: 18px; /*px*/
      .after_title {
        color: #777;
        font-size: 14px; /*px*/
        &.ion-female {
          color: #ff2744
        }
        &.ion-male {
          color: #2196f3
        }
      }
    }
    .left_title_sub {
      font-size: 13px; /*px*/
    }
  }

  .profile_update_btn {
    align-items: center;
    justify-content: center;
    display: flex;
    height: 44px;
    border-top: 1px solid #efefef; /*no*/
    background-color: #fff;
    color: #4a90e2;
    font-size: 14px; /*px*/
    .ion-ios-clock-outline {
      margin-right: 5px;
    }
  }

  .icon_clock {
    width: 13px;
    height: 13px;
    margin-right: 5px;
  }

  .icon_telephone {
    width: 16px;
    height: 16px;
  }

  .mp_cell_gallery > div {
    height: 100px;
    width: 100%;
    flex: 1;
    display: flex;
    /*position: relative;*/
    flex-wrap: nowrap;
  }

  .mp_cell_gallery img {
    width: 100px;
  }
  .profile_remark {
    font-size: 15dpx;
    margin-top: 12px;
    padding: 15px;
    height: 120px;
    background-color: #fff;
  }
  .icon_position_boss {
    background: url("../../../../static/img/icon_position_boss.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .icon_position_assist_mgr1 {
    background: url("../../../../static/img/icon_position_assistantMgr_1.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .icon_position_assist_mgr2 {
    background: url("../../../../static/img/icon_position_assistantMgr_2.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .icon_position_mgr {
    background: url("../../../../static/img/icon_position_manager.png") center center no-repeat;
    background-size: 100% 100%;
  }
</style>
