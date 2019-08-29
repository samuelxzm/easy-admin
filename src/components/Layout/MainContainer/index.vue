<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
    <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
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
    computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
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

