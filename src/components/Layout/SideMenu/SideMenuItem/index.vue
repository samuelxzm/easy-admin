<template>
  <el-menu-item v-if="routerhaschildren.length==1" :index="basePath+'/'+routerhaschildren[0].path">
    <template>
      <svg-icon :icon-class="router.iconCls" />
      <span slot="title">{{ router.name }}</span>
    </template>
  </el-menu-item>
  <!-- <side-menu-item
    v-else-if="routerhaschildren.length == 1"
    :router="router.children[0]"
    :base-path="router.path + '/' +routerhaschildren[0].path"
  /> -->
  <el-submenu v-else :index="basePath + '/' + router.path">
    <template slot="title">
      <svg-icon :icon-class="router.meta.icon" />
      <span v-if="router.name">{{ router.name }}</span>
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
  computed:{
    routerhaschildren(){
      return this.router.children.filter(item => item.type!='hidden' )
    }
  },
  created() {}
};
</script>