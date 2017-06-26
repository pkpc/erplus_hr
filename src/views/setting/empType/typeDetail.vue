<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工类型详情">
      <div slot="right" @click="saveType">保存</div>
    </x-header>
    <div>
      <group titleFooter="例如：A-Z，MGR等">
        <x-input title="类型名称" placeholder="请输入" :show-clear="false" v-model="empType.typeName"></x-input>
        <x-input title="对应代号" placeholder="请输入" :show-clear="false" v-model="empType.typeCode"></x-input>
      </group>
      <group>
        <div class="flex-row-start">
          <x-input style="flex-shrink: 2.4" class="jun" type="number" title="级别范围" placeholder="请选择" :show-clear="false" v-model="empType.minimum"></x-input>
          <x-input style="flex-shrink:1" title="至" type="number" placeholder="请选择" :show-clear="false" v-model="empType.maximum"></x-input>
        </div>
      </group>
      <div v-if="editFlag===1" @click="deleteDetail" class="btn-delete">删除</div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import XHeader from '../../../components/x-header/index.vue'
  import Group from '../../../components/group/index.vue'
  import Cell from '../../../components/cell/index.vue'
  import XInput from '../../../components/x-input/index.vue'
  import {getUrlParam} from "../../../libs/utils"
  import clone from 'lodash.clonedeep'
  export default{
    components:{
      XHeader,
      Group,
      Cell,
      XInput
    },
    created(){
        var index = getUrlParam('index');
        if(index !== null){
            this.editFlag = 1;
            this.empType = clone(this.$store.getters.getEmpType[index]);
        }
    },
    data(){
        return{
            empType:{
              typeName:null,
              typeCode:null,
              maximum:null,
              minimum:null,
              descId:null
            },
          editFlag:0
        }
    },
    methods:{
      deleteDetail(){
//        this.$store.dispatch('remove_empType',getUrlParam('index'));
        var index = getUrlParam('index');
        var list = this.$store.getters.getEmpType[index];
        var params = {
          descId:list.descId
        };
        var self = this;
        this.$store.dispatch('getLevelWhomUsingList',params).then(function (res) {
          console.log(res.data)
          var counts = 0;
          if(res.data !== undefined){
            counts = res.data.length;
          }
          self.$vux.confirm.show({
            title: '删除',
            content: '已有'+counts+'人正在使用此员工类型，是否确认删除？',
            confirmText:'删除',
            onConfirm () {
              self.$store.dispatch('remove_empType',index);
              self.$router.back();
            }
          })
        })
      },
      saveType(){
          if(this.empType.typeName===null||this.empType.typeName===""){
            // 显示
            this.$vux.toast.show({
              type:'text',
              text: '请输入类型名称',
              position:'bottom',
              width:'auto'
            })
            return false;
          }else if(this.empType.typeCode===null||this.empType.typeCode===""){
            // 显示
            this.$vux.toast.show({
              type:'text',
              text: '请输入对应代码',
              position:'bottom',
              width:'auto'
            })
            return false;
          }else if(this.empType.minimum===null||this.empType.minimum===""||this.empType.maximum===null||this.empType.maximum===""){
            // 显示
            this.$vux.toast.show({
              type:'text',
              text: '请选择级别范围',
              position:'bottom',
              width:'auto'
            })
            return false;
          }else if(this.empType.minimum==0){
            this.$vux.toast.show({
              type:'text',
              text: '级别范围最小为1',
              position:'bottom',
              width:'auto'
            })
            return false;
          }
          if(this.editFlag ===1){
            const params = {
              descId : this.empType.descId,
              typeName : this.empType.typeName,
              typeCode : this.empType.typeCode,
              maximum : this.empType.maximum,
              minimum : this.empType.minimum
            }
            var self = this;
            this.$store.dispatch('edit_empType',params).then(function (res) {
              if (res.result === 0) {
                self.$router.back();
                self.$vux.loading.hide()
              }else{
                self.$vux.toast.show({
                  type:'text',
                  text: res.res_info,
                  position:'bottom',
                  width:'auto'
                })
              }
            })
          }else{
            const params = {
              typeName : this.empType.typeName,
              typeCode : this.empType.typeCode,
              maximum : this.empType.maximum,
              minimum : this.empType.minimum
            }
            var self = this;
            this.$store.dispatch('add_empType',params).then(function (res) {
              if (res.result === 0) {
                self.$router.back();
                self.$vux.loading.hide()
              }else{
                self.$vux.toast.show({
                  type:'text',
                  text: res.res_info,
                  position:'bottom',
                  width:'auto'
                })
              }
            });
          }
      }
    }
  }
</script>
<style>
  .btn-delete{
    background-color: #fff;
    height:44px;
    line-height:44px;
    margin-top: 50px;
    text-align: center;
    color: #FE3824;
    font-size:15px;
  }
  .flex-row-start{
    display: flex;
    flex-flow:row nowrap;
    justify-content: flex-start;
    align-items: center;
    height:45px;
  }
  .text-example{
    color:#6D6D72;
    font-size:13px;
    padding-left:16px;
    background-color: rgb(239,239,239);
    padding-top: 7px;
  }
  .ftsize17{
    font-size:17px;
  }
  .color-blue{
    color: #4A90E2!important;
  }
</style>
