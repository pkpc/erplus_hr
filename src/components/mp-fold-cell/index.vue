<template>
  <li class="pl15">
    <ul v-for="(data, index) in dataSource" class="fold-list" @click="emitEvent(data, $event)">
      <li class="fold-li" v-if="data.id">
        <div :id="'expandDpt'+data.id" class="fold-title" @click="expandDpt(data, null)">
          <span class="icon-expand"
                :class="{'ion-android-add':!data.expanded,'ion-android-remove':data.expanded}"></span>
          <span>{{data.name}}({{data.totalPeople}})</span>
        </div>
      </li>
      <li @click="showMemberDetail(member)" v-show="data.expanded" class="branch-bar"
          v-for="member in data.members">
        <div class="emp-bar">
          <img class="img-avatar" :src="'https://www.erplus.co/uploads/avatars/'+member.imageName"
               alt="图片"/>
          <div class="emp-info">
            <p class="emp-name">
              {{member.name}}
              <span v-if="member.age" class="mp_after-title" >{{member.age}}岁</span>
              <span v-if="member.sex==0 || member.sex==1" class="mp_after-title" :class="[{'ion-female': member.sex==0, 'ion-male': member.sex==1}]">
              </span>
            </p>
            <p class="emp-desc">{{member.position}}</p>
          </div>
        </div>
        <!--<span class="icon_arrow"></span>-->
        <!--<x-button v-if="member.isAllowed==3 && !member.isSelf" :borderColor="'#4a90e2'" :color="'#4a90e2'" type="default" text="申请查看" mini plain @click.native.stop="applyForAuthConfirm(member)"></x-button>-->
        <x-button v-if="false" :borderColor="'#4a90e2'" :color="'#4a90e2'" type="default" text="申请查看" mini plain @click.native.stop="applyForAuthConfirm(member)"></x-button>
        <span v-else-if="member.isAllowed<3" class="fc_ccc">
          <span v-if="member.isAdminOrHR==1">
            {{member.isCompleted ? '':'未完善' }}
          </span>
          <span v-else>
            {{member.applyStatus}}
          </span>
          <i class="icon_arrow"></i>
        </span>
        <i v-if="member.isSelf && member.isAdminOrHR==0" class="icon_arrow"></i>
        <!--<span :id="'emp'+member.id" class="icon_checkbox"-->
              <!--:class="[{'icon_checkbox_checked':member.selected},{'icon_checkbox_unchecked':!member.selected},{icon_checkbox_disabled:member.canSelectAdmin==false}]">-->
        <!--</span>-->
      </li>
      <!--@click="selectEmp(data,member)"--><!--v-show="data.expanded"-->
      <mp-fold-cell :selectedArr="selectedArr" v-show="data.expanded"
                   :dataSource="data.branches" @expandedDept="emitExpandEvent"></mp-fold-cell>
    </ul>
  </li>
</template>
<script>
  import XButton from '../../../src/components/x-button/index.vue'
  import dateFormat from '../../tools/date/format'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XButton
    },
    name: 'mp-fold-cell',
    props: {
      dataSource: {
        type: Array
      },
      allSelectedFlag: {
        type: Boolean
      },
      currIndex: {
        type: Number
      },
      selectedArr: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        isAlreadyApply: false
      }
    },
    computed: {
      ...mapGetters([
        'getUserInfo'
      ])
    },
    methods: {
      selectDpt (dpt, selected) {
        // 选中部门
        const self = this
        if (selected) {
          dpt.selected = selected
        } else {
          dpt.selected = !dpt.selected
        }
        // 局部全选
        if (dpt.members !== undefined) {
          dpt.members.forEach(function (member) {
            self.selectEmp(member, dpt.selected)
          })
        }
        if (dpt.branches !== undefined && dpt.branches.length > 0) {
          // 如果有子部门 则递归
          dpt.branches.forEach(function (branch) {
            self.selectDpt(branch, dpt.selected)
          })
        }
      },
      selectEmp (emp, selected) {
        //  选中人
        const self = this
        if (selected) {
          emp.selected = selected
        } else {
          emp.selected = !emp.selected
        }
        const isExisted = this.selectedArr.some(function (obj, index) {
          // 判断是否已存在已选数组里
          if (emp.id === obj.id) {
            if (emp.selected) {

            } else {
              self.selectedArr.splice(index, 1)
            }
            return true
          }
        })
        if (isExisted) {

        } else {
          self.selectedArr.push(emp)
        }
      },
      emitEvent (data, e) {
        // 判断子部门是否需要被选中
        let selected = false
        if (data.members !== undefined) {
          selected = !data.members.some(function (member) {
            return member.selected === false
          })
        } else {
            selected = true
        }
        if (selected && data.branches !== undefined) {
          selected = !data.branches.some(function (branch) {
            return branch.selected === false
          })
        }
        data.selected = selected
      },
      expandDpt (data, expanded) {
        // 展开部门
        if (expanded) {
          data.expanded = expanded
        } else{
          data.expanded = !data.expanded
        }
        this.emitExpandEvent(data)
      },
      emitExpandEvent (data) {
        this.$emit('expandedDept', data)
      },
      isExistedSelected (data) {
        this.selectedArr.some(function (obj) {
          return data.id === obj.id
        })
      },
      showMemberDetail (member) {
        if (member.isAllowed === 0 || member.isSelf === true || this.getUserInfo.isHRManager === 1 || this.getUserInfo.isAdmin === true) {
          this.$router.push({path: '/staffprofile/profile/' + member.mainContactId})
        }
      },
      applyForAuthConfirm (member) {
        // 弹出窗
        const self = this
        this.$vux.confirm.show({
          title: '申请查看员工档案',
          content: '提交查看申请后，老板会收到相关提醒，批准后您即可查看该员工的相关资料',
          confirmText: '好的',
          cancelText: '取消',
          onConfirm () {
            self.applyForAuth(member)
          }
        })
      },
      applyForAuth (member) {
        this.$store.dispatch('APPLY_FOR_PROFILE_DETAIL', {
          beWatch: member.mainContactId,
          operatedId: member.profileId
        }).then(function (res) {
          if (res.result === 0) {
            member.isAllowed = 1
            member.applyStatus = '今日已申请'
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .mp_after-title.ion-female {
    color: #ff2744
  }
  .mp_after-title.ion-male {
    color: #2196f3
  }
  li {
    list-style: none;
  }
  .emp-info {
    padding-left: 8px;
    line-height: 1.4;
  }
  .emp-name {
    font-size: 14dpx; /*px*/
  }
  .emp-desc {
    color: #777;
    font-size: 13dpx; /*px*/
  }
  .fold-list {
    background-color: #fff;
    display: flex;
    position: relative;
    font-size: 14dpx; /*px*/
    flex-direction: column;
  }

  .tree-bar {
    flex-direction: column;
  }
  .fold-li {
    height: 44px;
  }
  .fold-li,
  .branch-bar,
  .emp-bar {
    display: flex;
    position: relative;
    align-items: center;
    flex: 1;
  }

  .branch-bar,
  .emp-bar {
    height: 60px;
  }

  .fold-title {
    flex: 1;
    display: inline-flex;
    height: 100%;
    align-items: center;
  }

  .fold-li,
  .branch-bar {
    border-bottom: 1px solid #efefef; /*no*/
    padding-right: 15px;
    justify-content: space-between;
  }

  .fold-list > .fold-li,
  .fold-list > .fold-li ~ .branch-bar {
    padding-left: 10px;
  }

  .branch-bar + .pl15 {
    padding-left: 10px;
  }

  .img-avatar {
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }

  .pl8 {
    padding-left: 8px;
  }

  .pl15 {
    padding-left: 15px;
  }

  .bg_FFF {
    background-color: #fff;
  }

  .icon-expand {
    display: inline-block;
    margin-right: 5px;
    color: #4a90e2;
  }

  /*start 复选框样式*/
  .fold-li-right {

  }
  .icon_arrow {
    display: inline-block;
    width: 18px;
    height: 18px;
  }
  .icon_arrow:after {
    content: " ";
    display: inline-block;
    transform: rotate(45deg);
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    position: relative;
    top: -1px;
    margin-left: .3em;
  }
  .mp_after-title {
    padding-left: 3px;
    color: #777;
    font-size: 12dpx; /*px*/
  }
  .fc_ccc {
    color: #ccc;
  }
</style>
