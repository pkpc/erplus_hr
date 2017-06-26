<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工信息完善">
      <a slot="right" @click="save">保存</a>
    </x-header>
    <div>
      <group>
        <x-input :hdFlex="1" :bdFlex="2" title='员工编号' placeholder="请输入" :show-clear="false" v-model="currentProfile.idInCompany" confirm-text="确定" cancel-text="取消">
        </x-input>
        <datetime :hdFlex="1" :valueFlex="2" valueTextAlign="left" title="入职日期" format="YYYY-MM-DD" v-model="currentProfile.employedDate" :min-year="1949" :max-year="2114" placeholder="请选择"></datetime>
        <datetime :hdFlex="1" :valueFlex="2" valueTextAlign="left" title="拟转正日期" format="YYYY-MM-DD" v-model="currentProfile.dateSupposeToBeRegular" :min-year="1949" :max-year="2114" placeholder="请选择"></datetime>
      </group>
      <!--<group>-->
        <!--<selector :hdFlex="1" :bdFlex="2" title="所属部门" :options="maritalStatusList" v-model="currentProfile.positionInMp"></selector>-->
        <!--<x-input :hdFlex="1" :bdFlex="2" title='职位' placeholder="请输入" :show-clear="false" v-model="currentProfile.position">-->
        <!--</x-input>-->
      <!--</group>-->
      <group v-show="showLevel">
        <popup-picker title="员工类型" confirmText="完成"  cancel-text="取消" value-text-align="left" :data="empType" v-model="emp.typeName" @on-change="changeType" placeholder="请选择"></popup-picker>
        <popup-picker title="级别"  confirmText="完成" cancel-text="取消" value-text-align="left" :data="empLevel" v-model="emp.level" @on-change="changeLevel" placeholder="请选择"></popup-picker>
      </group>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../../components/x-header/index.vue'
  import Group from '../../../../components/group/index.vue'
  import XInput from '../../../../components/x-input/index.vue'
  import Selector from '../../../../components/selector/index.vue'
  import XTextarea from '../../../../components/x-textarea/index.vue'
  import Datetime from '../../../../components/datetime/index.vue'
  import PopupPicker from '../../../../components/popup-picker/index.vue'
  import clone from 'lodash.clonedeep'
  export default {
    created () {
      var self = this;
      this.$store.dispatch('get_empType_list').then(function (res) {
        if(res.data.length >0){
          self.showLevel = true;
        }
      })
      this.currentProfile = clone(this.$store.state.editCurrentProfile);
      var temp = clone(this.$store.state.empLevel);
      if(temp.typeName !==undefined&&temp.code !== undefined){
        this.emp.typeName[0] = temp.typeName+" ("+temp.code+")";
        this.emp.level[0] = temp.level;
      }
    },
    components: {
      XHeader,
      Group,
      XInput,
      Selector,
      XTextarea,
      Datetime,
      PopupPicker
    },
    data () {
      return {
        showLevel:false,
        currentProfile: {},
        maritalStatusList: [
          {key: '1', value: '单身'},
          {key: '2', value: '恋爱中'},
          {key: '3', value: '已婚'},
          {key: '4', value: '离异'},
          {key: '5', value: '丧偶'},
        ],
        defaultValue: '',
        emp:{
          typeName:[],
          level:[]
        }
      }
    },
    computed:{
        empType(){
            var list = this.$store.getters.getEmpType;
            var array = [[]];
            if(list.length===0){
              array = [[""]];
            }else{
              list.forEach(function (item) {
                array[0].push(item.typeName+" ("+item.typeCode+")")
              })
            }
            return array;
        },
      empLevel(){
        var array = [[]];
        var temp = this.emp.typeName;
        if(temp.length > 0){
          var name = temp[0].split('(')[0].trim();
          var tempCode = temp[0].split('(')[1];
          var code = tempCode.substr(0,tempCode.length-1);
          var list = this.$store.getters.getEmpType;
          list.forEach(function (item,index) {
            if(item.typeName===name && item.typeCode === code){
              for(var i = item.minimum;i<=item.maximum;i++){
                  array[0].push(i)
              }
            }
          })
        }else{
          array = [[""]];
        }
        return array;
      }
    },
    methods: {
      save () {
        this.$store.state.editCurrentProfile = this.currentProfile;
        var temp = this.emp.typeName;
        if(temp[0]!==undefined){
            if(this.emp.level[0]!==undefined){
              var name = temp[0].split('(')[0].trim();
              var tempCode = temp[0].split('(')[1];
              var code = tempCode.substr(0,tempCode.length-1);

              const params = {
                typeName:name,
                code:code,
                level:this.emp.level[0]
              }
              this.$store.dispatch('set_empLevel',params);
            }else{
              // 显示
              this.$vux.toast.show({
                type:'text',
                text: '请选择员工级别',
                position:'bottom',
                width:'auto'
              })
              return false;
            }
        }
        this.$router.back()
      },
      changeType(value){
          this.emp.level = [];
      },
      changeLevel(){
        console.log("22")
      }
    }
  }
</script>
<style>
</style>
