<template>
  <!-- 人脸同步资源包列表 -->
  <div class="app-container">
    <div class="header-container" v-loading.body="table_loading">
      <el-row>
        <!-- 新增/搜索区域 -->
        <el-col :md="24">
          <div style="display: inline-flex; widht:40%;">
            <el-select
              v-model="select"
              slot="prepend"
              placeholder="请选择"
              style="width:16%;margin-right:20px;"
            >
              <el-option label="人脸库名称" value="1"></el-option>
              <el-option label="关联设备编码" value="2"></el-option>
            </el-select>
            <el-input
              v-model="The_query"
              placeholder="请输入搜索内容"
              style="width: 550px;"
              class="input-with-select search-item"
            ></el-input>
            <el-button
              v-preventReClick="2000"
              @click.prevent="grabble()"
              type="primary"
              size="medium"
              style="float:right;margin-left:30px;padding: 0px 29px;"
            >搜索</el-button>
            <el-button type="primary" plain style="margin-left:30px;" @click="revision('')">创建同步资源包</el-button>
          </div>
        </el-col>
        <div class="table-box">
          <!-- 表格 -->
          <el-table
            :data="tableData"
            style="width: 100%;"
            :header-row-class-name="tableHeader"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'10px'}"
          >
            <el-table-column prop label="序号" min-width="30">
              <template scope="scope">
                <span>{{(scope.$index + 1)+(listQuery.page - 1) * listQuery.limit}}</span>
              </template>
            </el-table-column>
            <el-table-column label="人脸库ID" min-width="50">
              <template slot-scope="scope">
                <router-link :to="{name:'Face_the_user'}">
                  <span
                    style="color:#1989FA "
                    @click="skip_sdh(scope.row)"
                  >{{ scope.row.deviceFaceLibraryCode}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="faceLibraryName" label="人脸库名称" min-width="40"></el-table-column>
            <el-table-column prop label="资源包类型" min-width="40">
              <template slot-scope="scope">
                <span>{{scope.row.faceResourceType| faceResource }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="faceRecordCount" label="人脸记录数" min-width="40"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="60">
              <template slot-scope="scope">
                <span>{{scope.row.createTime| formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deviceAcqCount" label="设备端获取次数" min-width="40"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getData"
          />
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination"; // secondary
import { resource_bundle, resource_create } from "@/api/FaceLibrarys"; //获取全量列表
export default {
  components: { Pagination },
  name: "Synchronous_resource",
  data() {
    return {
      select: "",
      facename: "",
      faceID: "",
      table_loading: false,
      servic_id: "",
      gridData: [],
      The_query: "",
      total: 10,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
        forid: ""
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      show: false,
      revisionshow: false,
      a1: "1"
    };
  },
  methods: {
    // 详情赋值
    open(servic_id) {
      this.show = true;
      this.servic_id = servic_id;
    },
    revision(servic_id) {
      this.$confirm("是否创建同步资源包, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        lockScroll: false,
        type: "warning"
      })
        .then(() => {
          let form_data = {
            Id: "2019122215071656538511",
            RequestObject: "tunano.ldc.face",
            Operation: "pullIncrPackage",
            Data: {
              libCode: this.libCode,
              deviceFaceLibraryCode: this.deviceFaceLibraryCode
            },
            AppInfo: { AppId: null, DeviceId: null },
            Description: null
          };
          resource_create(form_data)
            .then(response => {
              this.$message.success("已成功创建同步资源包");
              this.grabble();
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消创建同步资源包"
          });
        });
    },
    //      设置table头部的灰色
    tableHeader({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "header-color";
      }
    },
    //
    grabble() {
      let _self = this;
      _self.listQuery.page = 1;
      _self.table_loading = true;
      let form_data = {
        Id: "2019122215071656538511",
        RequestObject: "tunano.ldc.face",
        Operation: "addFaceOperationRecords",
        Data: {
          libCode: this.libCode,
          faceLibraryName: "",
          deviceFaceLibraryCode: "",
          maxResultCount: _self.listQuery.limit,
          skipCount: 0
        },
        AppInfo: { AppId: null, DeviceId: null },
        Description: null
      };
      if (_self.select != "") {
        if (_self.select == "1") {
          _self.faceID = "";
          _self.facename = _self.The_query;
        } else if (_self.select == "2") {
          _self.faceID = _self.The_query;
          _self.facename = "";
        }
      }
      if (_self.The_query == "") {
        _self.faceID = this.deviceFaceLibraryCode;
        _self.facename = this.facenames;
      }
      form_data.Data.deviceFaceLibraryCode = _self.faceID;
      form_data.Data.faceLibraryName = _self.facename;
      resource_bundle(form_data)
        .then(response => {
          _self.table_loading = false;
          _self.tableData = response.data.result.list;
          _self.total = response.data.result.totalCount;
        })
        .catch(function(error) {
          _self.table_loading = false;
        });
    },
    //获取列表
    getData() {
      let _self = this;
      _self.table_loading = true;
      let form_data = {
        Id: "2019122215071656538511",
        RequestObject: "tunano.ldc.face",
        Operation: "addFaceOperationRecords",
        Data: {
          libCode: this.libCode,
          faceLibraryName: "",
          deviceFaceLibraryCode: "",
          maxResultCount: _self.listQuery.limit,
          skipCount: (_self.listQuery.page - 1) * _self.listQuery.limit
        },
        AppInfo: { AppId: null, DeviceId: null },
        Description: null
      };
      if (_self.select != "") {
        if (_self.select == "1") {
          _self.faceID = "";
          _self.facename = _self.The_query;
        } else if (_self.select == "2") {
          _self.faceID = _self.The_query;
          _self.facename = "";
        }
      }
      if (_self.The_query == "") {
        _self.faceID = this.deviceFaceLibraryCode;
        _self.facename = this.facenames;
      }
      form_data.Data.deviceFaceLibraryCode = _self.faceID;
      form_data.Data.faceLibraryName = _self.facename;
      resource_bundle(form_data)
        .then(response => {
          _self.table_loading = false;
          _self.tableData = response.data.result.list;
          _self.total = response.data.result.totalCount;
        })
        .catch(function(error) {
          _self.table_loading = false;
        });
    },
    // 跳转
    skip_sdh(datas) {
      this.$store.commit("facedata/newImg", {
        deviceFaceLibraryCode: datas.deviceFaceLibraryCode,
        faceLibraryName: datas.faceLibraryName
      });
    }
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapGetters(["iddata", "deviceFaceLibraryCode", "libCode", "facenames"])
  }
};
</script>
<style  lang="scss" scoped>
.list_div {
  display: inline-block;
  width: 80px;
  .list_span {
    display: inline-block;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #1989fa;
    letter-spacing: 0;
    line-height: 14px;
  }
}
</style>

