<template>
  <div id="app">
    <!-- 布局组件 -->
    <ea-layout>
      <!-- logo可自定义 加slot='logo'属性 -->
      <div slot="logo" class="logo">
        <img class="logo_img" src="../assets/logo.png" />
        <span>EasyAdmin</span>
      </div>
      <!-- 菜单组件 加slot='sidemenu'属性-->
      <ea-sidemenu slot="sidemenu" />
         <!-- 头部组件 加slot='header'属性-->
      <ea-header slot="header">
        <!-- 页签组件 -->
        <ea-tagview slot="tagview" />
        <!-- 右侧操作按钮，如不需要某些功能，删除其标签即可。如有自定义内容，加slot="options"属性  -->
        <!-- 全局搜索功能 -->
        <ea-search slot="options" />
        <!-- 刷新功能 -->
        <ea-refresh slot="options" />
        <!-- 帮助功能 -->
        <ea-help slot="options" />
        <!-- 全屏功能 -->
        <ea-fullscreen slot="options" />
        <!-- 页面配置功能 -->
        <ea-pagesetting slot="options" />
        <!-- 用户中心功能 -->
        <ea-usercenter slot="options" />
      </ea-header>

    </ea-layout>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.logo {
  height: 60px;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.logo_img {
  height: 60px;
}
</style>