<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工档案">
      <a slot="right" @click="save">保存 </a>
    </x-header>
    <div>
      <div class="profile_hd">
        <div class="profile_hd_left">
          <img :src="'https://www.erplus.co/uploads/avatars/'+currentProfile.headImgUrl" alt="">
        </div>
        <group class="flex-1" gutter="0px" :borderNoWidth="true" :noBorder="true">
          <cell title='姓名' :valueFlex="2" valueTextAlign="left" :value="currentProfile.name"></cell>
          <cell title="性别" :valueFlex="2" valueTextAlign="left">
            <mp-radio slot="value" :items="sexList" name="sexRadio" v-model="currentProfile.sex"></mp-radio>
          </cell>
        </group>
      </div>
      <group gutter="0px" :borderNoWidth="true">
        <x-input :withIcon="showSecondPhone" title='手机' :hdFlex="1" :bdFlex="2" :show-clear="false" v-model="currentProfile.phoneInMp" readonly>
          <i v-show="showSecondPhone" slot="right" class="hriconfont hr-icon-plus" @click="showSecondPhone=true"></i>
        </x-input>
        <x-input v-show="showSecondPhone" :withIcon="showSecondPhone" class="wd_30p" title='手机' placeholder="请输入手机号" :hdFlex="1" :bdFlex="2" :show-clear="false" v-model="userInfo.phone2">
          <i slot="right" class="hriconfont hr-icon-minus" @click="showSecondPhone=false"></i>
        </x-input>
      </group>

      <group>
        <cell :title="currentProfile.isLunarBirth == 1 ? '农历生日' : '公历生日'" :link="{path: 'update/birth'}" :valueFlex="2" valueTextAlign="left" is-link>
          <p slot="value">{{currentProfile.isLunarBirth == 1 ? currentProfile.lunarBirthday : currentProfile.birthday}}</p>
        </cell>
        <x-input class="wd_30p" title='籍贯' placeholder="请输入籍贯" :hdFlex="1" :bdFlex="2" :show-clear="false" v-model="currentProfile.hometown"></x-input>
        <x-input class="wd_30p" title='身份证号' placeholder="请输入身份证号" :hdFlex="1" :bdFlex="2" :show-clear="false" v-model="currentProfile.idcard"></x-input>
      </group>
      <group>
        <cell title="家庭信息" :link="{path: 'update/family'}" is-link value="编辑" valueColor="#ccc"></cell>
        <cell v-if="hasAuth===true" title="人事信息" :link="{path: 'update/personnel'}" is-link value="编辑" valueColor="#ccc"></cell>
        <cell v-if="hasAuth===true" title="薪资信息（税前）" :link="{path: 'update/salary'}" is-link value="编辑" valueColor="#ccc"></cell>
      </group>
      <cell-collapse v-if="hasAuth===true" title="相关附件" collapseType="gallery" :collapse="true" :collapseDesc="{open:'', close:''}">
        <div class="mp_cell_gallery" slot="cell-more">
          <img class="mp_cell_gallery_photo " v-for="(item, index) in attachmentList" :src="item.src"
               @click="previewImage (index)"/>
        </div>
        <label class="mp_cell_addPhoto" for="fileUpload">
          <input id="fileUpload" type="file" multiple="multiple" accept="image/*" @change="fileUploadChange"/>
          添加扫描件或证书
        </label>
      </cell-collapse>
      <!--<cell-collapse title="简历" collapseType="gallery" :collapse="true" :collapseDesc="{open:'', close:''}">
        <div class="mp_cell_gallery" slot="cell-more">
          <img class="mp_cell_gallery_photo " v-for="(item, index) in imgList" :src="item.src"
               @click="previewImage (index)"/>
        </div>
      </cell-collapse>-->
      <group >
        <x-textarea :hdAlignSelf="'flex-start'" :rows="5" placeholder="在此添加备注..."
                    v-model="currentProfile.remark"></x-textarea>
      </group>
    </div>
    <previewer :list="attachmentList" ref="previewer" :options="options" @deleteCurrImage="deleteImage" :showDeleteBtn="true">
      <!--<p class="hriconfont hr-icon-delete"></p>-->
    </previewer>
    <loading v-model="showLoading" :text="uploadCount"></loading>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import XHeader from '../../../components/x-header/index.vue'
  import Group from '../../../components/group/index.vue'
  import Cell from '../../../components/cell/index.vue'
  import CellCollapse from '../../../components/cell-collapse/index.vue'
  import XButton from '../../../components/x-button/index.vue'
  import XInput from '../../../components/x-input/index.vue'
  import Previewer from '../../../components/previewer/index.vue'
  import MPRadio from '../../../components/mp-radio/index.vue'
  import XTextarea from '../../../components/x-textarea/index.vue'
  import clonedeep from 'lodash.clonedeep'
  import lrz from 'lrz'
  import Loading from '../../../components/loading/index.vue'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      CellCollapse,
      Previewer,
      'mp-radio': MPRadio,
      XTextarea,
      Loading
    },
    data () {
      return {
        currentProfile: {},
        fileUpload: '',
        showSecondPhone: false,
        sex: '1',
        list: [],
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
        },
        sexList: [
          {
            name: '男',
            value: '1'
          },
          {
            name: '女',
            value: '0'
          }
        ],
        uploadCount: '0%',
        showLoading: false
      }
    },
    computed: {
      userInfo () {
        return clonedeep(this.$store.state.userInfo)
      },
      hasAuth () {
        // 是老板 或者 HR
        return !!(this.userInfo.isAdmin || this.userInfo.isHRManager)
      }
    },
    created () {
      const self = this
      this.currentProfile = this.$store.state.editCurrentProfile
      this.currentProfile.sex = this.currentProfile.sex !== undefined ? this.currentProfile.sex : 0
      if (this.currentProfile.remark !== undefined) {
      } else {
        this.$set(this.currentProfile, 'remark', '')
      }
      if (this.currentProfile.attachments !== undefined) {
        this.currentProfile.attachments.forEach(function (atm) {
          self.getImgNaturalDimensions(atm.attachment, self.addImgToList, 'push')
        })
      } else {
        this.currentProfile.attachments = []
      }
    },
    methods: {
      previewImage (index) {
        this.$refs.previewer.show(index)
      },
      deleteImage (index) {
        this.attachmentList.splice(index, 1)
      },
      fileUploadChange (event) {
        const self = this
        self.showLoading = true
        if (event.target.files.length === 0) return
        var files = event.target.files
        for(var i = 0 ;i<files.length;i++){
          lrz(files[i]).then(function (rst) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://www.erplus.co/upload/uploadAttachment');

          xhr.onload = function () {
            if (xhr.status === 200) {
              // 上传成功
//                event.target.value = '' /*清空文件值*/
              var res = JSON.parse(xhr.response)
              if (res.respCode == '000') {
                var uploadImgArr = res.item[0].split('.')
                var uploadImgFrontArr = uploadImgArr[0].split('-')
                var uploadImgSrc = ''
                uploadImgFrontArr.forEach(function (src) {
                  uploadImgSrc += '/' + self.hexToDecimal(src)
                })
                uploadImgSrc += '.' + uploadImgArr[1]
                self.getImgNaturalDimensions('https://www.erplus.co/image' + uploadImgSrc, self.addImgToList)
              }
            } else {
              // 处理其他情况
            }
            self.showLoading = false
            self.uploadCount = '0%'
          }

          xhr.onerror = function () {
            // 处理错误
          };

          xhr.upload.onprogress = function (e) {
            // 上传进度
//            var percentComplete = ((e.loaded / e.total) || 0) * 100;
            self.uploadCount = parseInt(((e.loaded / e.total) || 0) * 100) + '%'
          }
          // 触发上传
          xhr.send(rst.formData);
          /* ==================================================== */

//            return rst
          })
        }
        event.target.value = '' /*清空文件值*/
      },
      addImgToList (imgSrc, imgWidth, imgHeight, insertType) {
        const imgObj = {
          attachment: imgSrc,
          src: imgSrc,
          w: imgWidth,
          h: imgHeight,
        }
        if (insertType === 'push') {
          this.attachmentList.push(imgObj)
        } else {
          this.attachmentList.unshift(imgObj)
        }
        this.currentProfile.attachments = this.attachmentList
      },
      hexToDecimal (hexValue) {
        // 十六进制＝> 十进制
        hexValue = hexValue.toString()
        return parseInt(hexValue, 16)
      },
      getImgNaturalDimensions (imgSrc, callback, insertType) {
        // 根据src获取图片真实宽高
        var image = new Image()
        image.src = imgSrc
        image.onload = function() {
          callback(imgSrc, image.width, image.height, insertType)
        }
      },
      save () {
        const self = this
        var atmArr = []
        this.attachmentList.forEach(function (atm) {
          atmArr.push({attachment: atm.src})
        })
        self.$vux.loading.show({
          text: '加载中...'
        })
        this.currentProfile.attachments = atmArr
        let currentProfile = clonedeep(this.currentProfile)
        if (currentProfile.profileId !== undefined && currentProfile.profileId !== 0) {
          // 有档案
          currentProfile.id = currentProfile.profileId
        } else {
          // 无档案
          delete currentProfile['id']
        }
        let encodeData = []
        if (currentProfile.probationaryPeriodSalary !== undefined) {
          encodeData.push(currentProfile.probationaryPeriodSalary)
        }
        if (currentProfile.regularSalary !== undefined) {
          encodeData.push(currentProfile.regularSalary)
        }
        //添加员工等级参数
        var empType = this.$store.getters.getEmpType;
        var empLevel = this.$store.getters.getEmpLevel;
        if(empLevel.typeName !==undefined&&empLevel.code !== undefined){
            if(empType.length!== 0){
                empType.forEach(function (item) {
                  if(item.typeName === empLevel.typeName&& item.typeCode === empLevel.code){
                      var list = item.rangeList;
                      list.forEach(function (data) {
                        if(data.mainLevel == empLevel.level){
                          currentProfile.levelId = data.rangeId;
                        }
                      })
                  }
                })
            }
        }
        this.$store.dispatch('ENCODE_DATA', encodeData).then(function (res) {
          return res
        }).then(function (res) {
          if (res.respCode === '000') {
            currentProfile.probationaryPeriodSalary = res.item[0]
            currentProfile.regularSalary = res.item[1]
            return self.$store.dispatch('SAVE_PROFILE_DETAIL', currentProfile)
          }
        }).then(function (res) {
          self.$vux.loading.hide()
          if (res.result === 0) {
            self.$router.back()
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  @import '../../../styles/variable.less';
  .profile_hd {
    position: relative;
    display: flex;
    align-items: center;
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
      flex: 1;
      img {
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

  .mp_cell_gallery img {
    width: 100px;
  }
  .mp_cell_addPhoto {
    box-sizing: border-box;
    width: 100px;
    height: 130px;
    text-align: center;
    margin-left: 15px;
    border: 2dpx dashed #b2b2b2;
    border-radius: 8px;
    color: #b2b2b2;
    font-size: 14px; /*px*/
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .hr-icon-plus:before,
  .hr-icon-minus:before{
    font-size: 13px; /*px*/
    color: #4a90e2;
  }
  .hr-icon-delete:before {
    color: #efefef;
    font-size: 30px; /*px*/
  }
  .flex-1 {
    flex: 1;
  }
  #fileUpload {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .fc_blue {
    color: #4a90e2
  }
  textarea {
    width: 100%;
    font-size: 18dpx;
  }
</style>
