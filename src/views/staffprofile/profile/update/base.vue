<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="HR">
      <a slot="right">保存</a>
    </x-header>
    <div>

    </div>
  </div>
</template>
<script>
  import XHeader from '../../../../components/x-header/index.vue'
  export default {
    components: {
      XHeader
    }
  }
</script>
<style>
</style>
