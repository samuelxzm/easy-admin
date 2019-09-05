<template>
  <div class="drawer-container">
    <div>
      <h5 class="drawer-title" style="margin-bottom:0;">切换项目</h5>
      <div class="drawer-item">
        <el-select size="small" v-model="projectId" @change="projectChange">
          <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <h5 class="drawer-title">系统布局配置</h5>
      <div class="drawer-item">
        <span>开启多页签</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>头部固定</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectList: [],
      projectId: ""
    };
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    }
  },
  created() {
    let that = this;
    this.getRequest({
      url:"/api/ts-user/projects/get/all",
      success:result=>{
        that.projectList = result;
      }
      
    });
    this.getRequest({
      url:"/api/ts-user/projects/get/default/project/id",
      success:result=>{
        that.projectId = result;
      }
      })
  },
  methods: {
    projectChange(e) {
      this.postRequest({
        url:"/api/ts-user/projects/change",
        data:{id: e },
        success:()=>{
          location.reload();
        } 
    })
  }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 10px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  .drawer-title {
    margin-top: 8px;
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
    width: 140px;
  }
  .drawer-switch {
    float: right;
  }
}
</style>
