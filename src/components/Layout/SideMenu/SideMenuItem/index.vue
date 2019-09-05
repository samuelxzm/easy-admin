<template>
<!-- <el-menu-item v-if="!routerhaschildren.children" :index="basePath+'/'+routerhaschildren[0].path">
    <template>
      <svg-icon :icon-class="routerhaschildren[0].iconCls" />
      <span slot="title">{{ routerhaschildren[0].name }}</span>
    </template>
  </el-menu-item> -->
  <el-menu-item v-if="!!router.children&&routerhaschildren.length<=1" :index="basePath+'/'+routerhaschildren[0].path">
    <template>
      <svg-icon :icon-class="routerhaschildren[0].iconCls" />
      <span slot="title">{{ routerhaschildren[0].name }}</span>
    </template>
  </el-menu-item>
  <!-- <side-menu-item
    v-else-if="routerhaschildren.length == 1"
    :router="router.children[0]"
    :base-path="router.path + '/' +routerhaschildren[0].path"
  /> -->
  <el-submenu v-else-if="!!router.children&&routerhaschildren.length>1" :index="basePath + '/' + router.path">
    <template slot="title">
      <svg-icon :icon-class="router.iconCls" />
      <span v-if="router.name">{{ router.name }}</span>
    </template>
    <!-- <side-menu-item
      v-for="item in router.children"
      :key="item.path"
      :router="item"
      :base-path="basePath + '/' + item.path"
    /> -->
    <template  v-for="item in router.children">
      <el-menu-item v-if="item.type!='hidden'" :index="basePath+'/'+item.path"  :key="item.id">
    <template>
      <svg-icon :icon-class="item.iconCls" />
      <span slot="title">{{ item.name }}</span>
    </template>
  </el-menu-item>
    </template>

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
      if(this.router.children){
      return this.router.children.filter(item => item.type!='hidden' )
      }
      else{
        return this.router
      }

    }
  },
  created() {}
};
</script>