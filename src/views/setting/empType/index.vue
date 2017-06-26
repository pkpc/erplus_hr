<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工类型与级别">
    </x-header>

    <div class="container">
      <group>
        <cell title="新建类型" :valueFlex="1" :link="{path:'/setting/typeDetail'}"  class="color-blue" is-link></cell>
      </group>
      <div class="mt-12" style="background-color: #FFFFFF">
        <swipeout>
          <!--<swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" :right-menu-width="80" transition-mode="follow">-->
          <swipeout-item v-for="(item,index) in items" :right-menu-width="btnWidth" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button :width="btnWidth" @click.native="onButtonClick(index)" type="warn">{{'删除'}}</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <div class="flex-row-start ftsize15" @click="editType(index)" style="background-color: #FFFFFF">
                <span class="ml-16">{{item.typeName}}</span>
                <span class="ml-10">{{item.typeCode}}</span>
                <span class="ml-10">{{"("+item.minimum +"-"+ item.maximum+")"}}</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import XHeader from '../../../components/x-header/index.vue'
  import Group from '../../../components/group/index.vue'
  import Cell from '../../../components/cell/index.vue'
  import {Swipeout,SwipeoutItem, SwipeoutButton} from '../../../components/swipeout'
  export default{
      created(){
          var self = this;
          this.$store.dispatch('get_empType_list').then(function (res) {
            self.items = res.data;
          })
      },
    components:{
      XHeader,
      Group,
      Cell,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
    },
    data(){
      return {
        items:[],
        btnWidth:60*document.getElementsByTagName("html")[0].getAttribute("data-dpr")
      }
    },
    methods:{
      deleteItem(index){
          this.$store.dispatch('remove_empType',index);
      },
      editType(index){
          this.$router.push("/setting/typeDetail?index="+index)
      },
      onButtonClick(index){
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
                console.log('plugin confirm')
              }
            })
          })

      }
    }
  }
</script>
<style>
  .mt-12{
    margin-top:12px;
  }
  .ml-10{
    margin-left:10px;
  }
  .ml-16{
    margin-left: 16px;
  }
  .ftsize15{font-size:15px;}
  .ftsize17{
    font-size:17px;
  }
  .color-blue{
    color: #4A90E2!important;
  }
</style>
