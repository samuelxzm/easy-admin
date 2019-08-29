<template>
  <div class="nav_option">
    <!-- <hearder-search></hearder-search> -->
    <el-dropdown style="margin:0 15px;">
      <el-button class="el-dropdown-link" style="font-size:20px;" type="text">
        <svg-icon icon-class="close" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="closeOthersTags()">关闭其他</el-dropdown-item>
        <el-dropdown-item @click.native="closeAllTags()">关闭全部</el-dropdown-item>
        <!-- <el-dropdown-item @click="refreshSelectedTag()">刷新</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <el-button size="medium" type="text" @click="reFresh()">
      <svg-icon icon-class="refresh" />
    </el-button>
    <el-button v-if="defaultSetting.fullScreen" size="medium" type="text" @click="screenFull()">
      <svg-icon :icon-class="isFullscreen ? 'fullScreen' : 'fullScreen'" />
    </el-button>
    <el-button v-if="defaultSetting.openAlone" size="medium" type="text" @click="openAlone()">
      <svg-icon icon-class="show" />
    </el-button>
    <el-button v-if="defaultSetting.message" size="medium" type="text">
      <svg-icon icon-class="message" />
    </el-button>
    <el-button v-if="defaultSetting.help" size="medium" type="text">
      <svg-icon icon-class="help" />
    </el-button>
    <el-dropdown
      v-if="defaultSetting.showSettings"
      size="medium"
      style="margin-left:15px;align-items: center;display: flex;"
      :hide-on-click="false"
    >
      <el-button
        style="color:#4b4b4b;font-size: 20px;"
        v-if="defaultSetting.message"
        size="medium"
        type="text"
      >
        <svg-icon icon-class="set" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <setting-plane />
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown
      v-if="defaultSetting.avatar"
      size="medium"
      style="margin-left:15px;align-items: center;display: flex;"
    >
      <div class="avatar-wrapper">
        <el-avatar
          shape="square"
          size="large"
          src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        ></el-avatar>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-s-custom">个人中心</el-dropdown-item>
        <el-dropdown-item icon="el-icon-key">修改密码</el-dropdown-item>
        <el-dropdown-item divided icon="el-icon-switch-button">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
//import HearderSearch from "@/components/Header/HeaderSearch";
// import svgIcon from "@/components/SvgIcon"
import screenfull from "screenfull";
import settings from "@/settings.js";
import settingPlane from "../../RightPanel/Settings/index";
export default {
  components: {
    settingPlane
  },
  data() {
    return {
      isFullscreen: false,
      defaultSetting: settings
    };
  },
  mounted() {
    this.screenFullInit();
  },
  beforeDestroy() {
    this.screenFullIDestroy();
  },
  methods: {
    openAlone() {
      let url = this.$router.currentRoute.path + "?nolayout=true";
      Object.keys(this.$router.currentRoute.query).forEach(i => {
        url = url + "&" + i + "=" + this.$router.currentRoute.query[i];
      });
      window.open(url, "_blank");
    },
    screenFull() {
      if (!screenfull.enabled) {
        this.$message({
          message: "不支持此功能",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    screenFullInit() {
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
    screenFullIDestroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    },
    reloadRouter(path) {
      this.$router.push({
        name: "redirect",
        params: {
          path: path
        }
      });

      this.$router.push({
        path: "redirect",
        query: {
          path: path
        }
      });
    },
    reFresh() {
      let that = this;
      let view = this.$router.currentRoute;
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$router.replace({
          path: fullPath,
          query: {
            t: Date.now()
          }
        });
      });
    },
    closeOthersTags() {
      let view = this.$router.currentRoute;
      this.$router.push(view);
      this.$store.dispatch("tagsView/delOthersViews", view).then(() => {
        // this.moveToCurrentTag()
      });
    },
    closeAllTags() {
      let view = this.$router.currentRoute;
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        // this.toLastView(visitedViews, view)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.nav_option {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  padding-right: 20px;
  & > .el-button {
    color: #4b4b4b;
    font-size: 20px;
    & + .el-button {
      margin-left: 15px;
    }
  }
}
.avatar-wrapper {
  display: flex;
  align-items: flex-end;
  & > .el-avatar--square {
    border-radius: 10px;
  }
  & > .el-icon-caret-bottom {
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>
