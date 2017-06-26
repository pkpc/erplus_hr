<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="员工信息完善">
      <a slot="right" @click="save">保存</a>
    </x-header>
    <div>
      <group>
        <x-switch title="切至农历" @on-change="switch2Lunar" v-model="isLunar"></x-switch>
        <datetime v-if="isLunar" :hdFlex="1" :valueFlex="2" valueTextAlign="right" title="农历生日" format="YYYY-MM-DD" :display-format="formatLunarValue" v-model="currentProfile.lunarBirthday" @on-change="lunarBirthdayChange" :min-year="1900" :max-year="2017" placeholder="请选择" confirm-text="确定" cancel-text="取消"></datetime>
        <x-switch v-if="isLunar && showLeapMonth" title="闰月" @on-change="switchLeapMonth" v-model="currentProfile.isLeapMonth"></x-switch>
        <cell v-if="isLunar" title="公历生日" :valueFlex="2" valueTextAlign="right">
          <p slot="value">{{currentProfile.birthday}}</p>
        </cell>
        <datetime v-if="!isLunar" :hdFlex="1" :valueFlex="2" valueTextAlign="right"  title="公历生日" format="YYYY-MM-DD" v-model="currentProfile.birthday" @on-change="birthdayChange" :min-year="1900" :max-year="2017" placeholder="请选择" confirm-text="确定" cancel-text="取消"></datetime>
        <cell title="星座" :valueFlex="2" valueTextAlign="right">
          <p slot="value">{{currentProfile.constellation}}</p>
        </cell>
        <cell title="生肖" :valueFlex="2" valueTextAlign="right">
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
  import clone from 'lodash.clonedeep'
  import {calendar} from '../../../../../static/js/solar_lunar'
  import XSwitch from '../../../../components/x-switch/index.vue'
  export default {
    created () {
      this.currentProfile = clone(this.$store.state.editCurrentProfile)
      if (this.currentProfile.constellation === undefined) {
        this.$set(this.currentProfile, 'constellation', '')
        this.$set(this.currentProfile, 'chineseZodiac', '')
      }
      if (this.currentProfile.lunarBirthday === undefined) {
        this.$set(this.currentProfile, 'lunarBirthday', '')
      } else {
        this.isLunar = true
//        this.lunarBirthdayChange (this.currentProfile.lunarBirthday)
      }
      if (this.currentProfile.birthday === undefined) {
        this.$set(this.currentProfile, 'birthday', '')
      }
      if (this.currentProfile.isLeapMonth === undefined) {
        this.$set(this.currentProfile, 'isLeapMonth', false)
        this.showLeapMonth = true
      } else {
        this.currentProfile.isLeapMonth = this.currentProfile.isLeapMonth === 1
      }
    },
    components: {
      XHeader,
      Group,
      Datetime,
      Cell,
      XSwitch
    },
    data () {
      return {
        currentProfile: {},
        isLunar: false,
        showLeapMonth: false,
        lunarValue: '',
        formatLunarValue (val) {
          const t_dateValue = val.split('-')
          const _year = parseInt(t_dateValue[0])
          const _month = parseInt(t_dateValue[1])
          let _day = parseInt(t_dateValue[2])
          const monthsDay = calendar.monthDays(t_dateValue[0], t_dateValue[1])
          if (monthsDay < t_dateValue[2]) {
            _day = monthsDay
            val = _year + '-' + _month + '-' + monthsDay
          }
          const dateMoreInfo = calendar.lunar2solar(_year, _month, _day, this.isLeapMonth)
          return dateMoreInfo.gzYear + '(' + dateMoreInfo.lYear + ') ' + dateMoreInfo.IMonthCn + ' ' + dateMoreInfo.IDayCn
        },
        solarAndLunar: null
      }
    },
    computed: {
      isLeapMonth () {
         return  !!this.currentProfile.isLeapMonth
      }
    },
    methods: {
      switch2Lunar () {
        if (this.isLunar) {
          // 农历
          if (this.currentProfile.birthday !== '') {
            this.currentProfile.lunarBirthday = this.currentProfile.birthday
            this.lunarValue = this.currentProfile.birthday;
          }
        } else {
          // 公历
          if (this.currentProfile.birthday !== '') {
            this.currentProfile.birthday = this.solarAndLunar.lYear + '-' + this.fillZeroToNum(this.solarAndLunar.lMonth) + '-' + this.fillZeroToNum(this.solarAndLunar.lDay)
          }
          this.lunarBirthday = ''
        }
      },
      switchLeapMonth () {
        this.lunarBirthdayChange(this.lunarValue)
      },
      lunarBirthdayChange (value) {
//        const calendarDayInfo = calendar.
        console.log(value)
        if (value) {
          const tempValue = value.split('-')
          const monthsDay = calendar.monthDays(tempValue[0], tempValue[1])
          if (monthsDay < tempValue[2]) {
            value = tempValue[0] + '-' + tempValue[1] + '-' + monthsDay
            this.currentProfile.lunarBirthday = value
            this.$vux.toast.show({
              type: 'text',
              text: '日期已自动修正',
              position: 'bottom',
              width: 'auto'
            })
          }
          this.lunarValue = value
          const tempDate = this.formatDateToObj(value)
          // 有无闰月 有则返回当月 无则返回0
          const hasLeapMonth = calendar.leapMonth(tempDate.year)
          // 是否显示闰月栏
          this.showLeapMonth = hasLeapMonth === tempDate.month
          if (this.showLeapMonth) {

          } else {
            this.currentProfile.isLeapMonth = false
          }
          this.solarAndLunar = calendar.lunar2solar(tempDate.year, tempDate.month, tempDate.day, this.currentProfile.isLeapMonth)
          this.currentProfile.lunarBirthday = this.solarAndLunar.gzYear + '(' + this.solarAndLunar.lYear + ') ' + this.solarAndLunar.IMonthCn + ' ' + this.solarAndLunar.IDayCn
          this.currentProfile.birthday = this.solarAndLunar.cYear + '-' + this.fillZeroToNum(this.solarAndLunar.cMonth) + '-' + this.fillZeroToNum(this.solarAndLunar.cDay)
          this.currentProfile.constellation = this.solarAndLunar.astro
          this.currentProfile.chineseZodiac = this.solarAndLunar.Animal
        } else {
          this.currentProfile.lunarBirthday = ''
        }
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
      formatDateToObj (value) {
        const temp = value.split('-')
        let obj = {}
        obj.year = parseInt(temp[0])
        obj.month = parseInt(temp[1])
        obj.day = parseInt(temp[2])
        return obj
      },
      fillZeroToNum (value) {
        return parseInt(value) > 9 ?  parseInt(value) : '0' + value
      },
      save () {
        const tmp = clone(this.currentProfile)
        if (this.isLunar) {
          // 农历
          tmp.isLunarBirth = 1
          if (this.showLeapMonth && tmp.isLeapMonth) {
            // 闰月
            tmp.isLeapMonth = 1
          } else {
            tmp.isLeapMonth = 0
          }
          tmp.lunarBirthday = this.lunarValue
          delete tmp['birthday']
        }  else {
          // 公历
          tmp.isLunarBirth = 0
          tmp.isLeapMonth = 0
          delete tmp['lunarBirthday']
        }
        this.$store.state.editCurrentProfile = tmp
        this.$router.back()
      }
    }
  }
</script>
<style>
</style>
