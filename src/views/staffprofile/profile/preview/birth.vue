<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="生日信息">
    </x-header>
    <div>
      <group>
        <cell :title="currentProfile.isLunarBirth == 1 ? '农历生日' : '公历生日'" :valueFlex="2" valueTextAlign="left">
          <p slot="value">{{currentProfile.isLunarBirth == 1 ? currentProfile.lunarBirthday : currentProfile.birthday}}</p>
        </cell>
        <cell v-if="currentProfile.isLunarBirth == 1" title="闰月" :valueFlex="2" valueTextAlign="left">
          <p slot="value">{{currentProfile.isLeapMonth == 1 ? '是' : '否'}}</p>
        </cell>
        <cell title="星座" :valueFlex="2" valueTextAlign="left">
          <p slot="value">{{currentProfile.constellation}}</p>
        </cell>
        <cell title="生肖" :valueFlex="2" valueTextAlign="left">
          <p slot="value">{{currentProfile.chineseZodiac}}</p>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import XHeader from '../../../../components/x-header/index.vue'
  import Group from '../../../../components/group/index.vue'
  import Datetime from '../../../../components/datetime/index.vue'
  import Cell from '../../../../components/cell/index.vue'
  import {calendar} from '../../../../../static/js/solar_lunar'
  import clone from 'lodash.clonedeep'
  export default {
    created () {
      this.currentProfile = clone(this.$store.state.editCurrentProfile)
      if (this.currentProfile.isLunarBirth === 1) {
        // 农历
        if (this.currentProfile.lunarBirthday !== undefined) {
          this.lunarBirthdayChange (this.currentProfile.lunarBirthday)
        }
      } else {
        // 公历
        if (this.currentProfile.birthday !== undefined) {
          this.birthdayChange(this.currentProfile.birthday)
        }
      }

    },
    components: {
      XHeader,
      Group,
      Datetime,
      Cell
    },
    data () {
      return {
        currentProfile: {}
      }
    },
    methods: {
      employedDateChange () {

      },
      birthdayChange (value) {
        if (value) {
//          this.currentProfile.lunarBirthday = calendar.solar2lunar(value)
          const tempDate = this.formatDateToObj(value)
          this.solarAndLunar = calendar.solar2lunar(tempDate.year, tempDate.month, tempDate.day)
          this.currentProfile.constellation = this.solarAndLunar.astro
          this.currentProfile.chineseZodiac = this.solarAndLunar.Animal
        }
      },
      lunarBirthdayChange (value) {
//        const calendarDayInfo = calendar.
        if (value) {
          this.lunarValue = value
          const tempDate = this.formatDateToObj(value)
          this.solarAndLunar = calendar.lunar2solar(tempDate.year, tempDate.month, tempDate.day, this.currentProfile.isLeapMonth)
          // 是否为闰月
          this.showLeapMonth = calendar.leapMonth(this.solarAndLunar.lYear) === tempDate.month
          this.lunarBirthday = this.solarAndLunar.gzYear + '(' + this.solarAndLunar.lYear + ') ' + this.solarAndLunar.IMonthCn + ' ' + this.solarAndLunar.IDayCn
          this.currentProfile.birthday = this.solarAndLunar.cYear + '-' + this.solarAndLunar.cMonth + '-' + this.solarAndLunar.cDay
          this.currentProfile.constellation = this.solarAndLunar.astro
          this.currentProfile.chineseZodiac = this.solarAndLunar.Animal
        } else {
          this.lunarBirthday = ''
        }
      },
      formatDateToObj (value) {
        const temp = value.split('-')
        let obj = {}
        obj.year = parseInt(temp[0])
        obj.month = parseInt(temp[1])
        obj.day = parseInt(temp[2])
        return obj
      },
      save () {
        this.$store.state.editCurrentProfile = this.currentProfile
        this.$router.back()
      }
    }
  }
</script>
<style>
</style>
