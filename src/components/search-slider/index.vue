<template>
  <div class="function_search">
    <div class="function-bar">
      <div class="list-content">
        <!--被选人的照片-->
        <div v-for="selected in selectedArr" class="selected-info needsclick" v-if="selected&&selected!=undefined" @click="selectedMe (selected)">
          <img :src="'https://www.erplus.co/uploads/avatars/'+selected.imageName" alt="图片" class="img-radius needsclick">
          <p class="name-text needsclick">{{selected.name}}</p>
        </div>
      </div>
      <div class="search-bar">
        <img v-if="selectedArr.length == 0" src="../../../static/img/icon_search.png" alt="图片" class="img-search">
        <slot name="search-input"></slot>
      </div>
    </div>
    <!--搜索展示面板-->
    <div class="mt18 result-panel" v-if="showFilterResult">
      <div class="base-bar needsclick" @click="selectedMe(data)" v-for="data in filteredData">
        <div class="emp-bar search-result-bar needsclick">
          <img class="img-radius img-avatar needsclick" :src="'https://www.erplus.co/uploads/avatars/'+data.imageName" alt="图片" />
          <span class="needsclick">{{data.name}}</span>
          <span class="pl8 needsclick">{{data.position}}</span>
        </div>
        <!--勾选图标-->
        <i class="icon_checkbox needsclick" :class="[{'ion-ios-checkmark':data.selected},{'ion-ios-circle-outline':!data.selected}]"></i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      selectedArr: {
        type: Array
      },
      filterKey: {
        type: String
      },
      contacts: {
        type: Array
      },
      showFilterResult: {
        type: Boolean
      }
    },
    computed: {
      filteredData: function () {
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        var filterKeyFirstLetter = window.pinyinUtil.getFirstLetter(filterKey).toUpperCase()
        var filterKeyPinyin = window.pinyinUtil.getPinyin(filterKey, '', false)
        var isChinese = false
        // 判断是否是汉字
        if (/^[\u4e00-\u9fa5]+$/.test(filterKey)) {
          isChinese = true
        }
//        console.log('filterKey:' + window.pinyinUtil.getFirstLetter(filterKey))
        var contacts = this.contacts
        // var regExp = new RegExp(filterKey)
        var self = this
        var filterResult = []
        if (filterKey) {
          contacts.forEach(function (ctObj) {
            if (isChinese) {
              if (ctObj.name.toLowerCase().indexOf(filterKey) > '-1' ||
                filterKey.indexOf(ctObj.name.toLowerCase()) > '-1') {
                filterResult.push(ctObj)
              }
            } else {
              if (ctObj.pinyin.indexOf(filterKeyPinyin) > '-1' ||
                filterKeyPinyin.indexOf(ctObj.pinyin) > '-1') {
                filterResult.push(ctObj)
              } else if (ctObj.firstLetter.indexOf(filterKeyFirstLetter) > '-1' ||
                filterKeyFirstLetter.indexOf(ctObj.firstLetter) > '-1') {
                filterResult.push(ctObj)
              }
            }
          })
        }
        if (filterResult.length > 0) {
          // 显示搜索结果
          self.$emit('showResultPanel', false)
        }
        return filterResult
      }
    },
    methods: {
      selectedMe (data) {
        document.getElementById('search-input').value = ''
        document.getElementById('emp' + data.id).click()
        this.$emit('showResultPanel', true)
      }
    },
    data: function () {
      return {
        searchQuery: ''
      }
    }
  }
</script>
<style scoped>
  .function_search {
    width: 100%;
    overflow: hidden;
  }
  .img-radius {
    height: 30px;
    width: 30px;
    border-radius: 100%;
  }
  .img-avatar {
    margin-right: 5px;
  }
  .result-panel .img-radius {
    /*margin-right: px2rem(10);*/
  }
  .img-search {
    height:14px;
    width:14px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .function-bar {
    /*overflow: hidden;*/
    box-sizing: border-box;
    background: #fff;
    width:100%;
    height: 68px;
    padding-left: 15px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    font-size: 12dpx;
  }
  .base-bar {
    height: 44px;
    background: #fff;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .selected-info {
    text-align: center;
    padding-right: 9px;
    min-width: 40px;
    flex-shrink: 0;
  }
  .selected-info .name-text {
    margin-top: 7px;
    margin-bottom: 0;
    text-align: center;
  }
  .list-content {
    /*flex: 1;*/
    -webkit-overflow-scrolling : touch;
    display: flex;
    position: relative;
    overflow: auto;
    overflow-y: hidden;
    max-width: 80%;
    flex-shrink: 0;
  }
  .selected-emp-list {
    overflow-x: auto;
    width: 100%;
    /*max-width: px2rem(285);*/
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
    flex-shrink: 0;
  }
  .search-bar {
    min-width: 80px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .search-bar input{
    font-size: 17dpx;
    min-width: 80px;
    width: 100%;
    padding-left: 9px;
    outline:none;
    border:0;
    -webkit-appearance: none;
  }
  .search-result-bar {
    display: flex;
    align-items: center;
  }
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
  .pl8 {
    padding-left: 8px;
  }
</style>
