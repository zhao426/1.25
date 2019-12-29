<template>
  <div class="bosx">
    <div class="box_text">图书馆人脸服务平台管理</div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <img src="../../assets/20151113110434_kyReJ.jpeg" class="user-avatar" />
          <div class="avatar-span">{{this.names}}</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>-->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  data() {
    return {
      names: ""
    };
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  created() {
    this.loadComments();
  },
  methods: {
    loadComments() {
      var list = JSON.parse(sessionStorage.getItem("name"));
      this.names = list;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.bosx {
  height: 55px;
  overflow: hidden;
  position: fixed;
  width: 100%;
  left: 0px;
  background: #555c64;
  z-index: 1004;
  .box_text {
    font-family: PingFangSC-Semibold;
    // padding-left: 2%;
    font-size: 26px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    height: 37px;
    width: 350px;
    display: inline-block;
    line-height: 50px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 15px;

      .avatar-wrapper {
        height: 59px;
        width: 107px;
        background-color: #434a51;
        // margin-top: 5px;
        position: relative;
        .avatar-span {
          display: inline-block;
          position: absolute;
          top: 7px;
          left: 40px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          margin-top: 15px;
          margin-left: 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          color: #ffffff;
          position: absolute;
          right: 5px;
          top: 25px;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
