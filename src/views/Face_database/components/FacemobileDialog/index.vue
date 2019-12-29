<template>
  <!-- 人脸移动组建 -->
  <div>
    <el-dialog
      :title="names"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      width="61%"
      :show="show"
      ref="mymovecopy"
      :lock-scroll="false"
    >
      <div style="height:400px;border-top:1px solid #EBEEF5">
        <div style="margin-top: 20px;color: #303133;">
          {{val_text}}：
          <span style="color: #000015 ;">{{library_sizi}}</span>
        </div>
        <div style="margin-top: 20px;color: #303133;">目标人脸库</div>
        <div style="margin-top: 10px">
          <el-select v-model="value" placeholder="请选择人脸库" style="width:40%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remvisible">取 消</el-button>
        <el-button
          type="primary"
          v-preventReClick="2000"
          @click.prevent="mobile_face"
        >{{val_button}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import { mapGetters } from "vuex";
import { FaceLibrarysData, updateFace } from "@/api/FaceLibrarys"; //详情数据请求
export default {
  name: "movecopy",
  data() {
    return {
      isDisable: true,
      val_text: "",
      val_button: "",
      library_data: [],
      library_sizi: "",
      movedata: [],
      visible: this.show,
      //  id:this.id
      input: "",
      innerVisible: false,
      options: [],
      value: ""
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 1
    },
    names: {
      type: String,
      default: ""
    }
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  methods: {
    remvisible() {
      let _self = this;
      _self.visible = false;
      _self.value = "";
    },
    //  移动人脸
    mobile_face() {
      let _self = this;
      let form_data = {
        Id: "2019122215071656538511",
        RequestObject: "tunano.ldc.face",
        Operation: "mvFace",
        Data: {
          faceIds: _self.library_data,
          sourceFaceLibraryId: this.iddata,
          targetFaceLibraryId: _self.value
        },
        AppInfo: { AppId: null, DeviceId: null },
        Description: null
      };
      if (this.id == 1) {
        if (_self.value != "") {
          _self.isDisable == false;
          updateFace(form_data)
            .then(response => {
              if (response.data.result == 0) {
                _self.$message.error("人脸移动失败");
                _self.value = "";
                _self.visible = false;
                _self.isDisable == true;
              } else {
                _self.$message.success("人脸移动成功");
                _self.$parent.grabble();
                _self.visible = false;
                _self.value = "";
                _self.isDisable == true;
              }
            })
            .catch(err => {
              // _self.$message.error("人脸移动失败");
              _self.visible = false;
              _self.value = "";
              _self.isDisable == true;
            });
        } else if (_self.value == "") {
          _self.$message.info("请先选中移动到的目标库");
        }
      } else if (this.id == 2) {
        if (_self.value != "") {
          form_data.Operation = "cpFace";
          updateFace(form_data)
            .then(response => {
              if (response.data.result == 0) {
                _self.$message.error("人脸复制失败");
                _self.value = "";
              } else {
                _self.$message.success("人脸复制成功");
                _self.value = "";
                _self.$parent.grabble();
                _self.visible = false;
              }
            })
            .catch(err => {
              // _self.$message.error("人脸复制失败");
              _self.value = "";
              _self.visible = false;
            });
        } else if (_self.value == "") {
          _self.$message.info("请先选中复制到的目标库");
        }
      }
    },
    // 获取目标库
    object_library(checkedCities, ids) {
      // 获取路由的两个值
      let _self = this;
      _self.options = [];
      _self.library_data = checkedCities;
      _self.library_sizi = _self.library_data.length;
      FaceLibrarysData("", "", "", "", "0", "100").then(response => {
        let fordate = response.data.result.list;
        for (let index = 0; index < fordate.length; index++) {
          if (this.facenames != fordate[index].faceLibraryName) {
            var obj = {};
            obj.value = fordate[index].id;
            obj.label = fordate[index].faceLibraryName;
            _self.options.push(obj);
          } else {
          }
        }
      });
      if (ids == "1") {
        _self.val_text = "移动人脸用户数";
        _self.val_button = "移动";
      } else {
        _self.val_text = "复制人脸用户数";
        _self.val_button = "复制";
      }
    }
  },
  computed: {
    ...mapGetters(["iddata", "deviceFaceLibraryCode", "libCode", "facenames"])
  }
};
</script>
<style  lang="scss" scoped>
.el-select .el-input__inner {
  width: 360px;
}
</style>