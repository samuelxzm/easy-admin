<template>
  <el-menu
    :router="true"
    :default-active="$route.path"
    :collapse="sidebarOpened"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.menuActiveText"
  >
    <template v-for="item in routers">
      <side-menu-item
        v-if="!!item.path"
        :key="item.path"
        :router="item"
        :base-path="item.path"
      />
    </template>
  </el-menu>
</template>
<script>
import SideMenuItem from "./SideMenuItem";
import { mapState } from "vuex";
import variables from "@/styles/variables.scss";
export default {
  name: "SideMenu",
  components: {
    SideMenuItem
  },
  computed: {
    routers() {
      return global.antRouter;
    },
    ...mapState({
      sidebarOpened: state => state.settings.sidebarOpened
    }),
    variables() {
      return variables;
    }
  },
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.el-menu {
  min-height: 100%;
}
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>

