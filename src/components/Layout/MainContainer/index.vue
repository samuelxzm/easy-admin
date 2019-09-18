<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.app-main {
  // padding: 20px;
  height: 100%;
  box-sizing: border-box;
}
</style>

