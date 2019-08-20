<template>
  <el-container v-if="!hasLayOut">
    <el-aside
      style="width: unset;"
      :class="{ has_logo: sidebarLogo, wide_side: sidebarOpened }"
    >
      <div v-if="sidebarLogo" class="logo">
        <img src="@/assets/images/logo.png" />
        <span v-if="!sidebarOpened">公益运营平台</span>
      </div>
      <el-scrollbar
        wrap-class="sidemenu-scrollbar__wrap"
        view-class="sidemenu-scrollbar__view"
      >
        <side-menu />
      </el-scrollbar>
    </el-aside>
    <el-main
      :class="{
        fixed_header: fixedHeader,
        has_logo: sidebarLogo,
        wide_side: !sidebarOpened
      }"
    >
      <el-header>
        <header-nav v-if="defaultSetting.headNav" class="header_nav" />
      </el-header>
      <main-container class="main_container" />
    </el-main>
  </el-container>
  <main-container v-else class="main_container" />
  <!-- <right-panel v-if="defaultSetting.showSettings" /> -->
</template>
<script>
import SideMenu from "@/components/Layout/SideMenu";
import HeaderNav from "@/components/Layout/HeaderNav";
import MainContainer from "@/components/Layout/MainContainer";
import { mapState } from "vuex";
import settings from "@/settings.js";
export default {
  components: {
    SideMenu,
    HeaderNav,
    MainContainer
  },
  computed: {
    ...mapState({
      sidebarOpened: state => state.settings.sidebarOpened,
      fixedHeader: state => state.settings.fixedHeader,
      tagsView: state => state.settings.tagsView,
      sidebarLogo: state => state.settings.sidebarLogo
    }),
    hasLayOut(){
      return this.$router.currentRoute.query.nolayout
    }
  },
  data() {
    return {
      defaultSetting: settings
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.sidemenu-scrollbar__wrap {
  overflow-x: hidden !important;
}
.sidemenu-scrollbar__view {
  overflow-y: visible;
  height: 100%;
}
</style>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.el-header,
.el-main {
  padding: 0;
}
.el-container {
  height: 100%;
  .el-aside {
    &.has_logo {
      .el-scrollbar {
        height: calc(100% - 50px);
      }
    }
    &.wide_side {
      .logo {
        width: 64px;
      }
    }
    .logo {
      background: #{$menuHover};
      width: 200px;
      height: 50px;
      display: flex;
      align-items: center;
      overflow: hidden;
      & > img {
        width: 40px;
        height: 40px;
        margin: 10px;
      }
      & > span {
        color: #fff;
      }
    }
    .el-scrollbar {
      height: 100%;
    }
    .sidemenu-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .fixed_header {
    margin-top: 50px;
    background: #f0f2f5;
    & > .el-header {
      position: fixed;
      width: calc(100% - 64px);
      top: 0;
      right: 0;
      z-index: 2000;
    }
    &.wide_side {
      & > .el-header {
        width: calc(100% - 200px);
      }
    }
  }
}
</style>
