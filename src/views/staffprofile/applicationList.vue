<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="查看员工档案申请">
    </x-header>
    <div>
        <swipeout>
          <swipeout-item class="application-item" transition-mode="follow" v-for="(application, key) in applicationList" :key="application.id" >
            <div slot="right-menu" v-if="application.applicantType==1">
              <swipeout-button @click.native="operateApplication(application, 1, key)" :width="swipeBtnWidth" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="application-item_content vux-1px-t">
              <div class="item_content_bd">
                <div class="item_content_bd_one">
                  <img class="content_bd_hd img-avatar" :src="'https://www.erplus.co/uploads/avatars'+application.applicationImage"
                       alt="图片"/>
                  <div class="content_bd_bd">
                    {{application.applicantName}}
                  </div>
                  <div class="content_bd_ft">
                    {{application.applicantPosition}}
                  </div>
                </div>
                <div class="item_content_bd_one">
                  <span class="item_content_access">
                    申请</br>查看
                  </span>
                </div>
                <div class="item_content_bd_one">
                  <img class="content_bd_hd img-avatar" :src="'https://www.erplus.co/uploads/avatars'+application.beWatchImage"
                       alt="图片"/>
                  <div class="content_bd_bd">
                    {{application.beWatchName}}
                  </div>
                  <div class="content_bd_ft">
                    {{application.beWatchPosition}}
                  </div>
                </div>
              </div>
              <div class="item_content_ft">
                <x-button v-if="application.applicantType==1" @click.native="operateApplication(application, 0, key)" :borderColor="'#4a90e2'"  :color="'#4a90e2'" type="default" text="批准" mini plain></x-button>
                <span class="fc_ccc" v-else-if="application.applicantType==0">已批准</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../components/x-header/index.vue'
  import Group from '../../components/group/index.vue'
  import Cell from '../../components/cell/index.vue'
  import XButton from '../../components/x-button/index.vue'
  import Scroller from '../../components/scroller/index.vue'
  import Spinner from '../../components/spinner/index.vue'
  import {Swipeout, SwipeoutItem, SwipeoutButton} from '../../components/swipeout/index'
  import {mapGetters} from 'vuex'
  const pulldownDefaultConfig = () => ({
    height: 60,
    autoRefresh: false,
    clsPrefix: 'xs-plugin-pulldown-'
  })

  const pullupDefaultConfig = () => ({
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    clsPrefix: 'xs-plugin-pullup-'
  })
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Scroller,
      Spinner
    },
    data () {
      return {
        showList: false,
        applicationList: []
      }
    },
    computed: {
      swipeBtnWidth () {
        return window.dpr * 90
      },
      ...mapGetters([
        'getUserInfo'
      ])
    },
    created () {
      this.applicationList = this.$store.state.applicationList
    },
    methods: {
      loadMore () {
        setTimeout(() => {
          this.n1 += 10
          setTimeout(() => {
            this.$refs.scroller.donePullup()
          }, 10)
        }, 2000)
      },
      refresh () {
      },
      operateApplication (application, operateType, index) {
        const self = this
        this.$store.dispatch('APPROVE_APPLICATION',{
          id: application.id,
          operatedType: operateType
        }).then(function (res) {
          if (res.result === 0) {
            if (operateType === 0) {
              application.applicantType = 0
            } else {
              self.applicationList.splice(index, 1)
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .application-item {
    font-size: 14dpx; /*px*/
    flex: 1;
    .application-item_content {
      height: 90px;
      padding: 10px 15px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item_content_bd {
        position: relative;
        display: flex;
        align-items: center;
        flex: 2;
        .item_content_bd_one {
          text-align: center;
          justify-self: center;
          flex: 1;
        }
        .img-avatar {
          width: 35px;
          height: 35px;
          border-radius: 100%;
        }
        .content_bd_bd {
          font-size: 14dpx; /*px*/
          color: #333;
        }
        .content_bd_ft {
          font-size: 12px; /*px*/
          color: #777;
        }
      }
      .item_content_ft {
        flex: 1;
        text-align: right;
      }
      .item_content_access {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: #efefef;
        color: #777;
        font-size: 12px; /*px*/
        width: 36px;
        height: 44px;
        border-radius: 4px;
        line-height: normal;
        margin-left: -15px;
      }
      .item_content_access:after {
        content: '';
        display: inline-block;
        border-left: 16px solid #efefef;
        border-top: 22px solid #fff;
        border-bottom: 22px solid #fff;
        /*border-left-color: #efefef;*/
        width: 0;
        height: 0;
        position: absolute;
        right: -15px;
        top:0;
        background-color: #efefef;
      }
    }
  }
  .item-list {
    /*height: 100%;*/
    overflow: hidden;
    div {
      height: 100px;
    }
  }
  .xs-plugin-pulldown-down {
    position: absolute;
    width: 100%;
    height: 60px; /*no*/
    top: -60px; /*no*/
    text-align: center;
  }
  .xs-plugin-pullup-up {
    position: absolute;
    width: 100%;
    height: 40px; /*no*/
    bottom: -40px; /*no*/
    text-align: center;
  }
  .pullup-rotate {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
  .pullup-arrow {
    display: block;
    transition: all linear 0.2s;
    -webkit-transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
  .pulldown-rotate {
    transform: rotate(-180deg);
  }
  .pulldown-arrow {
    display: inline-block;
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
  .vux-swipeout {
    /*background-color: #fff;*/
    margin-top: 12px;
    margin-bottom: 50px;
  }
  .fc_ccc {
    color: #ccc;
  }
</style>
