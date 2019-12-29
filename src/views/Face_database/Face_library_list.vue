<template>
  <!-- 人脸列表 -->
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
              style="width:14%;margin-right:20px;"
            >
              <el-option label="人脸库ID" value="1"></el-option>
              <el-option label="人脸库名称" value="2"></el-option>
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
              style="float:right;margin-left:20px;padding: 0px 29px;"
            >搜索</el-button>
            <el-button
              style="margin-left:20px"
              type="primary"
              plain
              icon="el-icon-plus"
              @click="The_editor('')"
            >新增</el-button>
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
            <el-table-column label="序号" min-width="20">
              <template scope="scope">
                <span>{{(scope.$index + 1)+(listQuery.page - 1) * listQuery.limit}}</span>
              </template>
            </el-table-column>
            <el-table-column label="人脸库ID" min-width="50">
              <template slot-scope="scope">
                <router-link :to="{name:'Face_the_user'}">
                  <span
                    style="color:#1989FA"
                    @click=" skip_face(scope.row)"
                  >{{ scope.row.deviceFaceLibraryCode}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="人脸库名称" min-width="35">
              <template slot-scope="scope">
                <router-link :to="{name:'Face_the_user'}">
                  <span
                    style="color:#1989FA"
                    @click=" skip_face(scope.row)"
                  >{{ scope.row.faceLibraryName}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="人脸库类型" min-width="35">
              <template slot-scope="scope">
                <span>{{scope.row.faceLibraryType| Librarytype }}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务模式" min-width="30">
              <template slot-scope="scope">
                <span>{{scope.row.serviceMode| servicemode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="faceLibraryStatus" label="人脸库状态" min-width="35">
              <template slot-scope="scope">
                <span>{{scope.row.faceLibraryStatus| facestate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastModifTime" label="最后修改时间" min-width="55">
              <template slot-scope="scope">
                <span>{{scope.row.lastModifTime| formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastModifier" label="修改人" min-width="30"></el-table-column>
            <el-table-column label="查看" min-width="75">
              <template slot-scope="scope">
                <div class="list_div">
                  <router-link :to="{name:'Synchronous_resource'}">
                    <span class="list_span" @click="skip_sdh(scope.row)">同步资源包</span>
                  </router-link>
                </div>
                <div class="list_div">
                  <router-link :to="{name:'Face_the_user'}">
                    <span class="list_span" @click="skip_face(scope.row)">人脸记录</span>
                  </router-link>
                </div>
                <div class="list_div">
                  <a>
                    <span class="list_span" @click="open(scope.row.id)">详情</span>
                  </a>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="a8" label="操作" min-width="60">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  round
                  v-preventReClick="3000"
                  @click.prevent="revision(scope.row.id)"
                >修改</el-button>
                <el-button round v-preventReClick="3000" @click.prevent="deletes(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
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
    <!-- 详情弹出框 -->
    <service-dialog :show.sync="show" :id="servic_id" ref="mychisds"></service-dialog>
    <!-- 编辑弹框 -->
    <revision-dialog :show.sync="revisionshow" ref="mychild" :id="servic_id"></revision-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary
import ServiceDialog from './components/ServiceDialog' //详情弹框组建
import RevisionDialog from './components/RevisionDialog' //编辑弹框组建
import { FaceLibrarysData, FaceLdelete } from '@/api/FaceLibrarys' //详情数据请求
export default {
  components: { Pagination, ServiceDialog, RevisionDialog },
  name: 'Face_library_list',
  data() {
    return {
      table_loading: true,
      servic_id: '',
      select: '',
      The_query: '',
      total: 50,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        forid: ''
      },
      //搜索人脸库名字
      facename: '',
      // 搜索人脸库ID
      faceID: '',
      show: false,
      revisionshow: false,
      a1: '1'
    }
  },
  methods: {
    grabble() {
      let _self = this
      _self.table_loading = true
      _self.listQuery.page = 1
      // 搜索内容
      if (_self.select != '') {
        if (_self.select == '1') {
          _self.faceID = _self.The_query
          _self.facename = ''
        } else if (_self.select == '2') {
          _self.faceID = ''
          _self.facename = _self.The_query
        }
      }
      FaceLibrarysData(
        '',
        '',
        _self.faceID,

        _self.facename,
        0,
        _self.listQuery.limit
      )
        .then(response => {
          _self.table_loading = false
          _self.total = response.data.result.totalCount
          _self.tableData = response.data.result.list

          // 序号
        })
        .catch(function(error) {
          _self.table_loading = false
          // self.$message.error("网络好像有点问题！");
        })
    },
    // 请求
    getData() {
      let _self = this
      _self.table_loading = true
      // 搜索内容
      if (_self.select != '') {
        if (_self.select == '1') {
          _self.faceID = _self.The_query
          _self.facename = ''
        } else if (_self.select == '2') {
          _self.faceID = ''
          _self.facename = _self.The_query
        }
      }
      FaceLibrarysData(
        '',
        '',
        _self.faceID,

        _self.facename,
        (_self.listQuery.page - 1) * _self.listQuery.limit,
        _self.listQuery.limit
      )
        .then(response => {
          _self.table_loading = false
          _self.total = response.data.result.totalCount
          _self.tableData = response.data.result.list

          // 序号
        })
        .catch(function(error) {
          _self.table_loading = false
          // self.$message.error("网络好像有点问题！");
        })
    },
    // 详情赋值
    open(servic_id) {
      this.show = true

      this.servic_id = servic_id + ''
      this.$refs.mychisds.details(servic_id)
    },
    // 修改
    revision(servic_id) {
      this.servic_id = servic_id + ''
      this.revisionshow = true
      this.$refs.mychild.editordata(servic_id)
    },
    // 新增
    The_editor(servic_id) {
      this.revisionshow = true
      this.servic_id = servic_id + ''
      this.$refs.mychild.editordata('')
    },
    // 删除
    deletes(ids) {
      this.$prompt('请输入二次密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false
      })
        .then(({ value }) => {
          let datas = {
            id: ids + '',
            pwd: value
          }
          FaceLdelete(ids + '', value)
            .then(response => {
              this.grabble()
              this.$message.success('人脸库删除成功')
            })
            .catch(function(error) {
              // this.$message.error("人脸删除失败");
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    skip_face(datas) {
      this.$store.commit('facedata/newImg', {
        deviceFaceLibraryCode: datas.deviceFaceLibraryCode,
        libCode: datas.libCode,
        id: datas.id,
        faceLibraryName: datas.faceLibraryName,
        time: datas.lastModifTime
      })
    },

    skip_sdh(datas) {
      this.$store.commit('facedata/newImg', {
        deviceFaceLibraryCode: datas.deviceFaceLibraryCode,
        libCode: datas.libCode,
        id: datas.id,
        faceLibraryName: datas.faceLibraryName,
        time: datas.lastModifTime
      })
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    //      设置table头部的灰色
    tableHeader({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-color'
      }
    }
  },
  created() {
    this.getData()
  }
}
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

