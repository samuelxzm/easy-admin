<template>
  <header>
    <div class="nav_top">
      <div class="option_left">
        <hamburger
          v-if="defaultSetting.hamberger"
          @toggleClick="toggleSideBar"
          :is-active="!sidebarOpened"
        />
        <tags-view v-if="defaultSetting.tagsView && tagsView" />
        <breadbrumb v-if="defaultSetting.breadbrumb && !tagsView" />
      </div>
      <div class="option_right">
        <nav-option />
      </div>
    </div>
  </header>
</template>
<script>
import Breadbrumb from "./Breadbrumb";
import Hamburger from "./Hamburger";
import NavOption from "./NavOption";
import TagsView from "./TagsView";
import { mapState } from "vuex";
import settings from "@/settings.js";
export default {
  components: {
    Breadbrumb,
    Hamburger,
    NavOption,
    TagsView
  },
  computed: {
    ...mapState({
      sidebarOpened: state => state.settings.sidebarOpened,
      tagsView: state => state.settings.tagsView
    })
  },
  data() {
    return {
      defaultSetting: settings
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("settings/changeSetting", {
        key: "sidebarOpened",
        value: !this.$store.state.settings.sidebarOpened
      });
    }
  }
};
</script>
<style lang="scss" scoped>
header {
  .nav_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
    .option_left {
display: flex;
      align-items: center;
      padding-left: 20px;
      height: 40px;
      box-sizing: border-box;
      width:calc(100% - 351px);
    }
    .option_right{
      flex:1;
    }
  }
}
</style>

