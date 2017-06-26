<template>
  <div class="mp_radio">
    <div class="mp_radio_item " v-for="(item, key) in items">
      <input class="magic-radio " type="radio" :id="name + key" :name="name" :value="item.value" v-model="currentValue">
      <label :for="name + key" :class="[{'ion-ios-circle-filled':currentValue==item.value, 'ion-ios-circle-outline':currentValue!=item.value}]" >{{item.name}}</label>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      items: Array,
      name: String,
      value: [String, Number]
    },
    data () {
      return {
        checked: {},
        currentValue: ''
      }
    },
    computed: {
      selectedValue () {
        return this.items.filter(function (item) {
          return item.check = true
        })
      }
    },
    watch: {
      checked (newVal) {
        this.currentValue = newVal
      },
      currentValue (newVal) {
        this.$emit('on-change', newVal)
        this.$emit('input', newVal)
      }
    },
    created () {
      this.checked = this.value
    }
  }
</script>
<style>
  .mp_radio,
  .mp_radio_item {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .magic-radio {
    display: none;
  }

  .magic-radio + label {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #333;
  }

  .magic-radio + label:before {
    padding-right: 3px;
    font-size: 18px; /*px*/
    color: #d8d8d8;
  }

  .magic-radio:checked + label:before {
    color: #4a90e2;
  }
</style>
