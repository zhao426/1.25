<template>
  <!-- 详情组建 -->
  <div>
    <el-dialog
      title="人脸库详情"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      width="61%"
      :show="show"
      ref="mychisds"
      :lock-scroll="false"
      :close-on-click-modal="false"
    >
      <div style="height:400px">
        <el-row class="ai33">
          <el-col :span="6">
            <div class="dl_ul" style>
              名称
              <span class="dl_span">{{data_val.val_Name}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dl_ul">
              编码
              <span class="dl_span">{{data_val.val_Code}}</span>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="dl_ul"></div>
          </el-col>
        </el-row>
        <el-row class="ai33">
          <el-col :span="6">
            <div class="dl_ul" style>
              库状态
              <span class="dl_span">{{data_val.Status | facestate}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dl_ul">
              库类型
              <span class="dl_span">{{data_val.Type | Librarytype}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dl_ul">
              服务模式
              <span class="dl_span">{{data_val.Mode | servicemode}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dl_ul"></div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="1" style="width:50px;margin-top: 30px;color: #303133;width:50px">库属性</el-col>
          <el-col :span="8">
            <div class="dl_border">{{data_val.Attribute}}</div>
          </el-col>
          <el-col :span="2" :offset="3" style="width:90px;margin-top: 30px;color: #303133;">关联图书馆</el-col>
          <el-col :span="8">
            <div class="dl_border" style="margin-left:-15px">{{data_val.libCode}}</div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dl_div">
          <div class="dl_form">
            创建人员
            <span class="dl_span">{{data_val.creator}}</span>
          </div>
          <div class="dl_form">
            创建时间
            <span class="dl_span">{{data_val.createTime|formatDate}}</span>
          </div>
          <div class="dl_form" style="margin-left:60px;">
            修改人员
            <span class="dl_span">{{data_val.lastModifier }}</span>
          </div>
          <div class="dl_form">
            修改时间
            <span class="dl_span">{{data_val.lastModifTime |formatDate }}</span>
          </div>
        </div>

        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import axios from "axios";
import { FaceLibrarysData,Library_enquiry } from "@/api/FaceLibrarys"; //详情数据
export default {
  name: "chisds",
  data() {
    return {
      visible: this.show,
      data_val: {
        // 人脸库名称
        val_Name: "",
        // 人脸库编码
        val_Code: "",
        //  库类型
        Type: "",
        //库状态
        Status: "",
        //  服务模式
        Mode: "",
        //库属性
        Attribute: "",
        //关联图书馆
        libCode: "",
        //创建时间
        createTime: "",
        // 修改时间
        lastModifTime: "",
        // 创建人
        creator: "",
        // 最后修改人
        lastModifier: ""
      }
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
    }
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  methods: {
    details(ids) {
      var lists = JSON.parse(sessionStorage.getItem("tokens"));
      let _self = this;
      FaceLibrarysData("", ids + "", "", "", "0", "10")
        .then(response => {
          let datas = response.data.result.list;
          _self.data_val.val_Name = datas[0].faceLibraryName;
          _self.data_val.val_Code = datas[0].deviceFaceLibraryCode;
          _self.data_val.Type = datas[0].faceLibraryType;
          _self.data_val.Status = datas[0].faceLibraryStatus;
          _self.data_val.Mode = datas[0].serviceMode;
          _self.data_val.Attribute = datas[0].faceLibraryAttribute;
          _self.data_val.createTime = datas[0].createTime;
          _self.data_val.lastModifTime = datas[0].lastModifTime;
          _self.data_val.creator = datas[0].creator;
          _self.data_val.lastModifier = datas[0].lastModifier;
          Library_enquiry(datas[0].libCode).then(response => {
            let data = response.data.result[0].libName;
             _self.data_val.libCode =data;
          });
          // axios
          //   .get(
          //     process.env.VUE_APP_BASE_APIS +
          //       "tunano/ldc/library/v1/ldc/Organization/isil/" +
          //       datas[0].libCode,
          //     {
          //       headers: {
          //         Authorization: "Bearer " + lists //token换成从缓存获取
          //       }
          //     }
          //   )
          //   .then(request => {
          //     _self.data_val.libCode = request.data.result.name;
          //   });
        })
        .catch(function(error) {});
    }
  }
};
</script>
<style  lang="scss" scoped>
.line {
  text-align: center;
}
.ai33 {
  border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  .dl_ul {
    height: 60px;
    width: 280px;
    // border: 1px solid #ebeef5;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;
    line-height: 60px;
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
  border: 1px solid #dddfe7;
  height: 85px;
  // width: 80%;
  border-radius: 6px;
  border-radius: 6px;
  padding: 10px;
  margin-top: 20px;
}
.dl_div {
  margin-top: 10px;
  display: inline-block;
  float: left;
  .dl_form {
    display: inline-block;
    margin-left: 30px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;

    .dl_span {
      display: inline-block;
      margin-left: 10px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #606266;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
}
</style>