
<template>
  <!-- 编辑组建 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      width="61%"
      :show="show"
      ref="mychild"
      :lock-scroll="false"
      :close-on-click-modal="false"
    >
      <div style="height:400px">
        <el-row class="dl_row">
          <el-col :span="1">
            <div style="display: inline-block;margin-top:30px">名称</div>
          </el-col>
          <el-col :span="6">
            <div class="dl_ul" style>
              <el-input
                placeholder="请输入内容"
                maxlength="25"
                v-model="data_val.val_Name"
                style="height:40px"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="1" :offset="1">
            <div style="display: inline-block;margin-top:30px;">编码</div>
          </el-col>
          <el-col :span="6">
            <div class="dl_ul">
              <el-input
                maxlength="25"
                placeholder="请输入内容"
                style="height:40px"
                v-model="data_val.val_Code"
                v-bind:disabled="this.id!=''"
              ></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="dl_row" style="  border-bottom: 1px solid #ebeef5;">
          <el-col :span="7">
            <div class="dl_ul">
              库状态
              <span class="dl_span">
                <template>
                  <el-select v-model="data_val.Status" placeholder="请选择" style="width:54%">
                    <el-option
                      v-for="item in Library_State"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </span>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="dl_ul">
              服务模式
              <span class="dl_span">
                <template>
                  <el-select v-model="data_val.Mode" placeholder="请选择" style="width:54%">
                    <el-option
                      v-for="item in service_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </span>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="dl_ul">
              库类型
              <span class="dl_span">
                <template>
                  <el-select v-model="data_val.Type" placeholder="请选择" style="width:54%">
                    <el-option
                      v-for="item in Library_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="1">
            <div class="dl_ul" style="margin-top: 30px;color: #303133;">库属性</div>
          </el-col>
          <el-col :span="12">
            <div class="dl_border">
              <el-input
                type="textarea"
                :rows="11"
                placeholder="库属性（json格式）"
                v-model="data_val.Attribute"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="dl_ul" style="margin-top: 30px;color: #303133;text-align:center;">关联图书馆</div>
          </el-col>
          <el-col :span="6">
            <div class style="margin-top:20px;">
              <el-cascader
                v-model="data_val.libCode"
                :show-all-levels="false"
                :props="{   expandTrigger: 'hover' }"
                :placeholder="ches"
                @change="handleItemChange"
                clearable
                :options="objker"
                filterable
              ></el-cascader>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-preventReClick="3000" @click.prevent="request()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import QS from "qs";
import { close } from "fs";
import {
  addFaceLibrarys,
  FaceLibrarysData,
  Organization,
  Library_enquiry
} from "@/api/FaceLibrarys"; //详情数据请求
import { mapGetters } from "vuex";
import { constants } from "crypto";
// import service from "axios";
export default {
  name: "child",
  data() {
    return {
      // checkStrictly: false,
      ches: "搜索关联图书馆",
      selectedOptions: ["CN-518000-NSLIB"],
      one_token: "",
      ids: "",
      title: "人脸库新增",
      visible: this.show,
      boos: "",
      text: "",
      // 页面数据
      data_val: {
        // 人脸库名称
        val_Name: "",
        // 人脸库编码
        val_Code: "",
        Type: "",
        Status: "",
        Mode: "",
        Attribute: "",
        libCode: []
      },
      // 库状态
      Library_State: [
        {
          value: "0",
          label: "在用"
        },
        {
          value: "1",
          label: "暂停"
        }
      ],
      objker: [],
      //服务模式
      service_type: [
        {
          value: "0",
          label: "V1-1"
        },
        {
          value: "1",
          label: "V1-2"
        },
        {
          value: "2",
          label: "V2-1"
        },
        {
          value: "3",
          label: "V2-2"
        },
        {
          value: "4",
          label: "V3"
        }
      ],
      //库类型
      Library_type: [
        {
          value: "0",
          label: "持久库"
        },
        {
          value: "1",
          label: "临时库"
        }
      ],
      value: "0",
      restaurants: [],
      state1: "",
      state2: "asda"
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  watch: {
    show() {
      this.visible = this.show;
      this.boos = this.id;
    }
  },
  methods: {
    handleItemChange(val) {
      let _self = this;
      _self.data_val.libCode = val;
    },
    // 取消
    cancel() {
      let _self = this;
      _self.visible = false;
      _self.title = "人脸库新增";
      _self.data_val = {
        // 人脸库名称
        val_Name: "",
        // 人脸库编码
        val_Code: "",
        Type: "",
        Status: "",
        Mode: "",
        Attribute: "",
        libCode: []
      };
    },
    request() {
      //post请求传新增参数
      let _self = this;
      if (
        _self.data_val.val_Name != "" &&
        _self.data_val.val_Code != "" &&
        _self.data_val.Status != "" &&
        _self.data_val.Mode != "" &&
        _self.data_val.Type != "" &&
        _self.data_val.libCode.length > 0
      ) {
        let form_Data = {
          id: "2019122215071656538531",
          RequestObject: "tunano.ldc.face",
          Operation: "addFaceLibrarys",
          Data: {
            faceLibraryName: _self.data_val.val_Name,
            deviceFaceLibraryCode: _self.data_val.val_Code,
            faceLibraryType: _self.data_val.Type,
            faceLibraryStatus: _self.data_val.Status,
            serviceMode: _self.data_val.Mode,
            // 暂时死值
            creator: this.name,
            faceLibraryAttribute: _self.data_val.Attribute,
            libCode: _self.data_val.libCode[_self.data_val.libCode.length - 1]
          },
          AppInfo: { AppId: "1", DeviceId: "1" },
          Description: "1"
        };

        if (this.id == "") {
          addFaceLibrarys(form_Data)
            .then(response => {
              // alert(this.data_val.Status);
              _self.$parent.grabble();
              _self.visible = false;
              _self.$message.success("人脸新增成功");
              _self.data_val = {
                // 人脸库名称
                val_Name: "",
                // 人脸库编码
                val_Code: "",
                Type: "",
                Status: "",
                Mode: "",
                Attribute: "",
                libCode: []
              };
              _self.title = "人脸库新增";
            })
            .catch(function(error) {
              var str = error.response.data.message.split(";");
            });
        } else {
          this.$prompt("请输入二次密码", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            lockScroll: false
          })
            .then(({ value }) => {
              form_Data.Operation = "updateFaceLibrarys";
              form_Data.Data.id = this.id;
              form_Data.Data.pwd = value;
              form_Data.Data.lastModifier = "111";
              addFaceLibrarys(form_Data)
                .then(response => {
                  _self.$parent.grabble();
                  _self.visible = false;
                  _self.$message.success("人脸修改成功");
                  _self.data_val = {
                    // 人脸库名称
                    val_Name: "",
                    // 人脸库编码
                    val_Code: "",
                    Type: "",
                    Status: "",
                    Mode: "",
                    Attribute: "",
                    libCode: []
                  };
                  _self.title = "人脸库新增";
                })
                .catch(function(error) {
                  // self.$message.error(error);
                  _self.$parent.grabble();
                  // _self.$message.error(error.response.data.message);
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消输入"
              });
            });
        }
      } else if (_self.data_val.val_Name == "") {
        _self.$message.info("姓名不能为空");
      } else if (_self.data_val.val_Code == "") {
        _self.$message.info("编码不能为空");
      } else if (_self.data_val.Status == "") {
        _self.$message.info("请选择库状态");
      } else if (_self.data_val.Mode == "") {
        _self.$message.info("请选择服务模式");
      } else if (_self.data_val.Type == "") {
        _self.$message.info("请选择库类型");
      } else if (_self.data_val.libCode.length == 0) {
        _self.$message.info("请选择关联图书馆");
      }
    },
    // 获取修改前数据
    editordata(ids) {
      var lists = JSON.parse(sessionStorage.getItem("tokens"));
      let constval = [];
      let _self = this;
      if (ids == "") {
        let _self = this;
        _self.visible = false;
        _self.title = "人脸库新增";
        _self.data_val = {
          // 人脸库名称
          val_Name: "",
          // 人脸库编码
          val_Code: "",
          Type: "",
          Status: "",
          Mode: "",
          Attribute: "",
          libCode: []
        };
      } else {
        _self.title = "人脸库修改";
        FaceLibrarysData("", ids + "", "", "", "0", "10")
          .then(response => {
            let datas = response.data.result.list;
            _self.data_val.val_Name = datas[0].faceLibraryName;
            _self.data_val.val_Code = datas[0].deviceFaceLibraryCode;
            _self.data_val.Type = datas[0].faceLibraryType + "";
            _self.data_val.Status = datas[0].faceLibraryStatus + "";
            _self.data_val.Mode = datas[0].serviceMode + "";
            _self.data_val.Attribute = datas[0].faceLibraryAttribute;

            // axios
            //   .get(
            //       process.env.VUE_APP_BASE_APIS+"tunano/ldc/library/v1/ldc/Organization/libCode/" +
            //       datas[0].libCode,
            //     {
            //       headers: {
            //         Authorization: "Bearer " + lists //token换成从缓存获取
            //       }
            //     }
            //   )
            //   .then(request => {
            //     let resdata = request.data.result;
            //     if (resdata.masterId) {
            //       constval = resdata.relativeFatherLibCodeNode;
            //       constval.push(resdata.isilCode);
            //       _self.data_val.libCode = constval;
            //     } else {
            //       constval.push(resdata.isilCode);
            //       _self.data_val.libCode = constval;
            //     }
            //   });
            Library_enquiry(datas[0].libCode).then(response => {
              let data = response.data.result[0].libCode;
              _self.data_val.libCode = data;
            });
          })
          .catch(function(error) {});
        let orgdata = {
          id: "201807181636001119999",
          requestObject: "LDC.LIB",
          operation: "findlibraryorganizationmutli",
          data: {
            query: [
              {
                column: "ismainbranch",
                action: "==",
                logic: "AND",
                value: true,
                dataType: "bool"
              }
            ],
            page: { pageSize: "100", currentPage: "1" }
          },
          appinfo: { appid: "", deviceid: "" },
          description: ""
        };
      }
    },
    // 关联图书馆搜索

    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      Library_enquiry("").then(response => {
        let data = response.data.result;
        for (const key in data) {
          const obj = { value: "", label: "" };
          obj.value = data[key].libCode;
          obj.label = data[key].libName;
          this.objker.push(obj);
        }
      });
      return this.objker;
    },
    handleSelect(item) {}
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  created() {},
  computed: {
    ...mapGetters(["iddata", "name", "libCode", "tokens"])
  }
};
</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}
.dl_row {
  // border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  .dl_ul {
    height: 85px;
    // width: 300px;
    // margin-left: 50px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;
    line-height: 85px;
    .dl_span {
      padding-left: 5px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #606266;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
}
.dl_border {
  //   border: 1px solid #dddfe7;
  height: 238px;
  width: 80%;
  border-radius: 6px;
  border-radius: 6px;
  padding: 10px;
  margin-top: 10px;
}
.el-autocomplete {
  width: 235px;
}
textarea {
  outline: none;
}
textarea {
  resize: none;
}
textarea {
  border: 0px solid #fff;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  letter-spacing: 0;
  line-height: 14px;
}
</style>
