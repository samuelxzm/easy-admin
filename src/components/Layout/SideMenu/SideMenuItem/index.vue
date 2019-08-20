<template>
  <el-menu-item v-if="!router.children" :index="basePath">
    <template>
      <svg-icon :icon-class="router.meta.icon" />
      <span slot="title">{{ router.meta.title }}</span>
    </template>
  </el-menu-item>
  <side-menu-item
    v-else-if="router.children.length == 1"
    :router="router.children[0]"
    :base-path="router.path + '/' + router.children[0].path"
  />
  <el-submenu v-else :index="basePath + '/' + router.path">
    <template slot="title">
      <svg-icon :icon-class="router.meta.icon" />
      <span v-if="router.meta.title">{{ router.meta.title }}</span>
    </template>
    <side-menu-item
      v-for="item in router.children"
      :key="item.path"
      :router="item"
      :base-path="basePath + '/' + item.path"
    />
  </el-submenu>
</template>
<script>
export default {
  name: "SideMenuItem",
  props: {
    router: Object,
    basePath: {
      type: String,
      default: ""
    }
  },
  created() {}
};
</script>