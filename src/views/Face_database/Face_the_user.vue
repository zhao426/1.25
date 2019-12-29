<template>
  <!-- 人脸用户列表 -->
  <div class="app-containers">
    <div class="header-container">
      <div>
        <div style="font-size:14px;margin-bottom:20px;">
          <h4 style="line-height: 0px;">
            当前人脸库名称为:
            <span style="font-size: 16px;">{{facenames}}</span>
          </h4>
        </div>
      </div>
      <el-row>
        <!-- 新增/搜索区域 -->
        <el-col :md="24" style="height:60px;border-bottom:1px solid #EBEEF5;">
          <div style="display: inline-flex; widht:55%;">
            <el-input
              v-model="The_query"
              placeholder="请输入人员ID"
              style="width: 550px;"
              class="input-with-select search-item"
            ></el-input>
            <el-button
              type="primary"
              size="medium"
              style="float:right;margin-left:30px;padding: 0px 29px;"
              @click="grabble()"
            >搜索</el-button>
          </div>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            style="margin-left:30px;"
            @click="editorClick('')"
          >新增</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-sold-out"
            style="margin-left:30px;"
            @click="theimport"
          >导入</el-button>
        </el-col>
        <el-row style="margin-top:70px;">
          <el-col :span="15">
            <div class="head-left">
              <span style="padding-right:10px">共 {{total}} 条数据</span>
              <span>{{times | formatDate}}</span>
              <span>（更新时间）</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="head-right" style="float: right;">
              <el-checkbox
                class="checkbox"
                :indeterminate="isIndeterminate"
                v-model="checkAllFlag"
                @change="checkAll"
              >全选</el-checkbox>

              <el-button
                round
                v-preventReClick="3000"
                @click.prevent="facemoopen('2')"
                size="small"
              >复制到</el-button>
              <el-button
                round
                v-preventReClick="3000"
                @click.prevent="facemoopen('1')"
                size="small"
              >移动到</el-button>
              <el-button
                round
                type="danger"
                size="small"
                v-preventReClick="3000"
                @click.prevent="deletes()"
              >删除</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="table-box">
          <div class="home-card">
            <div v-show="theme_val">暂时无数据</div>
            <div
              class="home-item"
              v-for="(item,index) in cities"
              :key="item.id"
              :class="[{'The-selected':(checkedCities).includes(item.id)}]"
            >
              <vue-hover-mask @click="handleClick(item)">
                <!-- 默认插槽 -->
                <img :src="url+item.image.faceImagePath" class="home-img user-avatar" srcset />
                <!-- action插槽 -->
                <template v-slot:action>
                  <i class="iconfont el-icon-edit">
                    <i style="padding-left:5px;">修改</i>
                  </i>
                </template>
              </vue-hover-mask>
              <div class="home-right">
                <el-checkbox-group v-model="checkedCities" @change="homecheckbox">
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">{{item.patron.cardNo}}</div>
                    <el-checkbox :key="item.id" :label="item.id">{{item.patron.cardNo|ellipsis}}</el-checkbox>
                  </el-tooltip>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="30"
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </el-row>
    </div>
    <!-- 移动 复制 -->
    <facemobile-dialog :show.sync="facemoshow" :id="userid" :names="nameto" ref="mymovecopy"></facemobile-dialog>
    <!-- 修改 新增 -->
    <faceeditor-dialog :show.sync="ditorshow" :id="servic_id" ref="myfaceed"></faceeditor-dialog>
    <!-- 导入文件弹框 -->
    <theimport-dialog :show.sync="importshow" :id="userid" ref="mytolead"></theimport-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const cityOptions = ['上海', '北京']
import Pagination from '@/components/Pagination' // secondar
import FacemobileDialog from './components/FacemobileDialog' //移动弹框
import FaceeditorDialog from './components/FaceeditorDialog' //修改编辑组建
import VueHoverMask from '@/components/VueHoverMask' //图片遮罩层
import TheimportDialog from './components/TheimportDialog' //导入弹框
import { FaceLibrarysDatasss, updateFace } from '@/api/FaceLibrarys'
export default {
  components: {
    Pagination,
    FacemobileDialog,
    VueHoverMask,
    FaceeditorDialog,
    TheimportDialog
  },
  name: 'Face_the_user',
  data() {
    return {
      // lastModifTime:this
      timestamp1: Date.parse(new Date()),
      currentPage3: 0,
      nameto: '移动人脸',
      theme_val: false,
      userid: '',
      facemoshow: false,
      ditorshow: false,
      importshow: false,
      servic_id: '',
      url: '',
      The_query: '',
      total: 0,
      listQuery: {
        page: 1,
        limit: 30,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        forid: ''
      },
      checkedCities: [],
      //   checkAll: false,
      cities: [],
      isIndeterminate: true,
      checked: [],
      isCheckedAll: false, //全选判断标识
      checkAllFlag: false,
      checkArr: [] //选中数组
    }
  },
  methods: {
    //每页显示数据量变更
    handleCurrentChange(val) {
      let _self = this
      _self.listQuery.page = val
      this.getData()
      this.checkAllFlag = false
      this.checkAll(false)
    },
    grabble() {
      this.checkAllFlag = false
      this.checkAll(false)
      let _self = this
      _self.cities = []
      _self.url = process.env.VUE_APP_BASE_API
      _self.url = _self.url.substring(0, _self.url.length - 1)
      _self.listQuery.page = 0
      FaceLibrarysDatasss(
        this.libCode,
        this.deviceFaceLibraryCode,
        _self.The_query,
        0,
        _self.listQuery.limit
      )
        .then(response => {
          _self.total = response.data.result.totalCount
          _self.cities = response.data.result.list
          for (let index = 0; index <= _self.cities.length; index++) {
            _self.cities[index].image.faceImagePath =
              _self.cities[index].image.faceImagePath +
              '?top' +
              Date.parse(new Date())
          }
          if (_self.cities.length == 0) {
            _self.theme_val = true
          } else {
            _self.theme_val = false
          }
        })
        .catch(function(error) {})
    },
    getData() {
      this.checkAllFlag = false
      this.checkAll(false)
      let _self = this
      _self.cities = []
      _self.url = process.env.VUE_APP_BASE_API
      _self.url = _self.url.substring(0, _self.url.length - 1)
      FaceLibrarysDatasss(
        this.libCode,
        this.deviceFaceLibraryCode,
        _self.The_query,
        (_self.listQuery.page - 1) * _self.listQuery.limit,
        _self.listQuery.limit
      )
        .then(response => {
          _self.total = response.data.result.totalCount
          _self.cities = response.data.result.list
          for (let index = 0; index <= _self.cities.length; index++) {
            _self.cities[index].image.faceImagePath =
              _self.cities[index].image.faceImagePath +
              '?top' +
              Date.parse(new Date())
          }
          if (_self.cities.length == 0) {
            _self.theme_val = true
          } else {
            _self.theme_val = false
          }
        })
        .catch(function(error) {})
    },
    // 编辑点击事件
    editorClick(isd) {
      this.ditorshow = true
      this.servic_id = isd
      this.$refs.myfaceed.details(isd)
    },
    //修改点击事件
    handleClick(ids) {
      let _self = this
      _self.ditorshow = true
      this.servic_id = ids.id + ''
      ids.image.faceImagePath =
        ids.image.faceImagePath.split('?')[0] + '?top' + Date.parse(new Date())
      _self.$refs.myfaceed.details(ids)
    },
    // 导入弹框
    theimport() {
      this.importshow = true
      this.$refs.mytolead.object_library()
    },
    //   移动弹框
    facemoopen(servic_id) {
      if (servic_id == 1) {
        if (this.checkedCities.length > 0) {
          this.nameto = '移动人脸'
          this.facemoshow = true
          this.userid = servic_id
          this.$refs.mymovecopy.object_library(this.checkedCities, servic_id)
        } else {
          this.$message.info('请您先选择要移动的人脸')
        }
      } else {
        if (this.checkedCities.length > 0) {
          this.nameto = '复制人脸'
          this.facemoshow = true
          this.userid = servic_id
          this.$refs.mymovecopy.object_library(this.checkedCities, servic_id)
        } else {
          this.$message.info('请您先选择要复制的人脸')
        }
      }
    },
    // 全选
    checkAll(event) {
      let cits = []
      for (let i = 0; i < this.cities.length; i++) {
        const element = this.cities[i].id

        cits.push(element)
      }
      this.checkedCities = event ? cits : []
      this.isIndeterminate = false
    },
    // 单选
    homecheckbox(value) {
      let checkedCount = value.length
      this.checkAllFlag = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    // 删除
    deletes() {
      if (this.checkedCities.length > 0) {
        this.$prompt('请输入二次密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false
        })
          .then(({ value }) => {
            let datas = {
              id: '2019250914092837034765',
              requestObject: 'tunano.ldc.face',
              operation: 'deleteFaces',
              Data: {
                Ids: this.checkedCities,
                pwd: value
              },
              AppInfo: { AppId: null, DeviceId: null },
              Description: null
            }
            updateFace(datas)
              .then(response => {
                this.grabble()
                this.checkAllFlag = false
                this.checkAll(false)
              })
              .catch(function(error) {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
      } else {
        this.$message.info('请先选择您要删除的人脸')
      }
    }
  },
  created() {
    this.getData()
  },
  computed: {
    ...mapGetters([
      'iddata',
      'deviceFaceLibraryCode',
      'libCode',
      'facenames',
      'times'
    ])
  }
}
</script>
<style lang="scss" scoped>
.table-head {
}
.home-card {
  width: 100%;
  overflow: hidden;
  padding: 0px 0px;
  display: flex;
  flex-wrap: wrap;
  .home-item {
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    border-radius: 4px;
    // width: calc(10%);
    width: 150px;
    height: 212px;
    padding: 10px 0px 10px 10px;
    margin-right: 15px !important;
    margin-bottom: 10px;
    align-items: center;
    background: #fff;
    &:nth-child(4) {
      margin-right: 0;
    }
    .home-img {
      display: inline-block;
      width: 126px;
      height: 160px;
      margin: 0;
      border-radius: 5px;
      padding: 0;
    }
    .home-right {
      margin-left: 10px;
      padding-top: 8px;
      display: inline-block;
      .home-num {
        font-size: 40px;
        margin: 5px 0;
      }
    }
  }
}
.The-selected {
  border: 1px solid #1989fa !important;
}
.head-left {
  display: inline-block;
  height: 40px;
  span {
    line-height: 30px;
    font-family: Helvetica;
    font-size: 14px;
    color: #606266;
    letter-spacing: 0;
  }
}
.home-item:hover {
  border: 1px solid #1989fa;
}
</style>