<template>
  <li>
    <ul v-for="(data, index) in dataSource" class="base-bar tree-bar" @click="checkUp(data, undefined, $event)">
      <li class="dep-bar" v-if="data.id">
        <div :id="'expanded'+data.id" class="dep-name-bar" :class="{'expand-dep-name':expandDeptOnce}" @click="expandedDept(data, undefined, $event)">
          <span class="icon-expand dep-name-element" :class="{'ion-android-add':!data.expanded,'ion-android-remove':data.expanded}"></span>
          <span class="dep-name-element">{{data.name}}({{data.totalPeople}})</span>
        </div>
        <span :id="'dpt'+data.id" class="dpt_element icon_checkbox" @click="checkDown(data)" :class="[{'ion-ios-checkmark':data.selected},{'ion-ios-circle-outline':!data.selected}]"></span>
      </li>
      <!--@click="selectEmp(data,member)"-->
      <li v-show="data.expanded" @click="selectEmp(member)" class="branch-bar emp_element" v-for="member in data.members">
        <div class="emp-bar emp_element" >
          <img class="img-avatar emp_element" :src="'https://www.erplus.co/uploads/avatars/'+member.imageName" alt="图片" />
          <span class="pl8 emp_element">{{member.name}}</span>
          <span class="pl8 emp_element">{{member.position}}</span>
        </div>
        <span :id="'emp'+member.id" class="emp_element icon_checkbox" :class="[{'ion-ios-checkmark':member.selected},{'ion-ios-circle-outline':!member.selected},{'ion-ios-checkmark-outline':member.canSelectAdmin==false}]"></span>
      </li>
      <mp-multiple-checkbox :allEmpCount="allEmpCount"  v-show="data.expanded" :dataSource="data.branches"></mp-multiple-checkbox>
    </ul>
  </li>
</template>
<script>
  //  var includes = require('lodash.includes')
  export default {
    name: 'mp-multiple-checkbox',
    props: {
      dataSource: {
        type: Array
      },
      allSelectedFlag: {
        type: Boolean
      },
      allEmpCount: {
        type: Number
      },
      hideSelectAll: {
        type: Boolean
      },
      expandDeptOnce: Boolean
    },
    data: function () {
      return {
        allChecked: false
      }
    },
    methods: {
      // 点击展开，收缩
      checkDown (dpt, flag) {
        const self = this
        if (flag !== undefined) {
          dpt.selected = flag
        } else {
          dpt.selected = !dpt.selected
        }
        selectEmpAndDpt(dpt, dpt.selected)
        function selectEmpAndDpt (departments, flag) {
          if (departments.members !== undefined && departments.members.length > 0) {
            // 如果有子部门
            departments.members.forEach(function (member) {
              self.selectEmp(member, flag)
            })
          }
          if (departments.branches !== undefined && departments.branches.length > 0) {
            // 如果有子部门
            departments.branches.forEach(function (branch) {
              branch.selected = flag
              selectEmpAndDpt(branch, flag)
            })
          }
        }
      },
      checkUp (data, flag, event) {
        // 向上选
        if (event.target.className.indexOf('dpt_element') !== -1 || event.target.className.indexOf('emp_element') !== -1) {
          let shouldSelected
          if (data.branches !== undefined && data.branches.length > 0) {
            // 有子部门
            shouldSelected = !data.branches.some(function (branch) {
              return branch.selected === false
            })
            if (shouldSelected && data.members !== undefined && data.members.length > 0) {
              // 有子部门 并且都被选中
              shouldSelected = !data.members.some(function (member) {
                return member.selected === false
              })
            }
          } else {
            // 无子部门
            if (data.members !== undefined && data.members.length > 0) {
              shouldSelected = !data.members.some(function (member) {
                return member.selected === false
              })
            }
          }
          if (data.branches === undefined && data.members === undefined) {
            // 无子部门 并且 无人
          } else {
            data.selected = shouldSelected
          }
        }
      },
      selectEmp (emp, flag) {
        if (flag !== undefined) {
          emp.selected = flag
        } else {
          emp.selected = !emp.selected
        }
        this.$emit('selectedEmp', emp)
      },
      expandedDept (dpt, flag, event) {
        if (flag !== undefined) {
          dpt.expanded = flag
        } else {
          dpt.expanded = !dpt.expanded
        }
      },
      allSelectedDept (allChecked) {
        const self = this
        self.dataSource.forEach(function (dptObj) {
          self.checkDown(dptObj, allChecked)
        })
      }
    }
  }
</script>
<style scoped>
  ul{
    display: block;
    list-style: none;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-padding-start: 0;
    padding-left: 15px;
  }
  li.dep-bar,
  .base-bar.tree-bar > .dep-bar ~ .branch-bar {
    padding-left: 10px;
  }
  .base-bar{
    /*padding-left: px2rem(15);*/
    background-color: #fff;
    position: relative;
    display: flex;
    font-size: 14dpx;
  }
  .tree-bar {
    flex-direction: column;
  }
  .dep-bar ,
  .branch-bar,
  .emp-bar{
    height: 44px;
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }
  .dep-name-bar {
    flex:1;
    display: flex;
    position: relative;
    align-items: center;
    height:100%;
  }
  .dep-bar ,
  .branch-bar {
    border-bottom:1rpx solid #efefef;
    padding-right: 15px;
    justify-content: space-between;
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
  li {
    list-style: none;
  }
  p {
    margin: 0;
  }
  ul {
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
  }
</style>
