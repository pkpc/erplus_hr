<template>
  <div>
    <x-header :left-options="{showBack: true,backText: ''}" title="HR">
      <a slot="right">设置</a>
    </x-header>
    <div>
      <!--<div>这是测试用的</div>-->
      <!--<div>这是测试用的</div>-->

    </div>
  </div>
</template>
<script>
  import XHeader from '../../components/x-header/index.vue'
  export default {
    components: {
      XHeader
    }
  }
</script>
<style>
</style>
