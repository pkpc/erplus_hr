<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="更新记录">
    </x-header>
    <div class="bg-white">
      <timeline>
        <timeline-item v-for="(record, index) in historyRecord" :key="index">
          <div class="record_item" :class="[index === 0 ? 'recent' : '']">
            <span>{{record.operatedRecord}}</span>
            <span>{{record.operatedTime}}</span>
          </div>
        </timeline-item>
      </timeline>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../../components/x-header/index.vue'
  import Timeline from '../../../../components/timeline/timeline.vue'
  import TimelineItem from '../../../../components/timeline/timeline-item.vue'
  export default {
    components: {
      XHeader,
      Timeline,
      TimelineItem
    },
    created () {
      this.$vux.loading.show({
        text: '加载中...'
      })
      const self = this
      self.currentProfile = self.$store.state.currentProfile
      self.$store.dispatch('GET_HR_HISTORY', {
        id: self.currentProfile.profileId
      }).then(function (res) {
        if (res.result === 0) {
          self.historyRecord = res.data
        }
        self.$vux.loading.hide()
      })
    },
    data () {
      return {
        currentProfile: {},
        historyRecord: []
      }
    },
    methods: {
      employedDateChange () {

      },
      birthdayChange () {

      }
    }
  }
</script>
<style>
  .record_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-size: 12px;
  }
  .bg-white {
    background-color: #fff;
  }
</style>
