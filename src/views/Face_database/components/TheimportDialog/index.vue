<template>
  <!-- 详情组建 -->
  <div>
    <el-dialog
      title="人脸用户数据导入"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      width="61%"
      :show="show"
      ref="mytolead"
      :lock-scroll="false"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-dialog
        width="30%"
        title="导入进度"
        :visible.sync="neidata"
        :lock-scroll="false"
        :show-close="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        append-to-body
      >
        <div>正在导入中请勿关闭</div>
        <el-progress :text-inside="true" :stroke-width="24" :percentage="text" status="success"></el-progress>
      </el-dialog>
      <el-dialog
        width="30%"
        title="导入照片进度"
        :visible.sync="zhaopian"
        :lock-scroll="false"
        :show-close="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        append-to-body
      >
        <div>正在导入人脸照片请耐心等待.....</div>
        <el-progress :text-inside="true" :stroke-width="24" :percentage="textse" status="success"></el-progress>
      </el-dialog>
      <el-dialog width="50%" title="人脸用户数导入结果" :visible.sync="innerVisible" append-to-body>
        <div style="height:400px;">
          <el-row style="bor" v-if="tosucceed">
            <el-col class="link_result">
              <div style="margin-top: 10px;">
                <span class="result_sizi">失败 {{ dataval.failCount }} 条 请核对后重新上传</span>
                <el-button
                  icon="el-icon-printer"
                  size="mini"
                  type="primary"
                  plain
                  v-preventReClick="3000"
                  @click.prevent="ExportData()"
                >打印</el-button>
              </div>
            </el-col>
            <el-col
              style="  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;height:260px"
            >
              <div class="link_ref">导入错误信息提示</div>
              <el-scrollbar style="height:210px">
                <div v-for="(item, index) in dataval.details" :key="index.cardNo">
                  <p>
                    {{ item.failMsg }}
                    <span style="color: #f66c6d;">无法识别</span>
                  </p>
                </div>
              </el-scrollbar>
            </el-col>
          </el-row>
          <el-row v-if="todefeated">
            <el-col style=" border-top: 1px solid #ebeef5;">
              <div class="succeed">
                <i class="el-icon-circle-check"></i>
              </div>
              <div class="succeed_div">
                <p class="suvved_p">导入成功</p>
                <p class="suvved-pq">深圳图书馆人脸数据库</p>
                <p class="suvved-pq">共导入{{ dataval.total }}条人脸数据</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="remover">完 成</el-button>
        </div>
      </el-dialog>
      <div style="height:400px">
        <el-row class="ai33">
          <el-col>
            <div style="margin:20px 0;">人脸库名称</div>
          </el-col>
          <!-- <el-col> -->
          <el-select v-model="value" placeholder="请选择" :disabled="true" style="width:450px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- </el-col> -->
          <el-col>
            <div class="text_val" style>人脸照片目录路径 :</div>
          </el-col>
          <el-col :md="7">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="url"
              accept=".zip"
              :on-preview="handlePreview"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :on-success="Image_datatrue"
              :before-remove="beforeRemove"
              :on-remove="handleRemoves"
              :headers="tokens"
              :on-error="files_defeated"
              :on-progress="files_progress"
              :before-upload="beforeUploadFile"
            >
              <div slot="tip" class="el-upload__tip">只能上传.zip压缩包</div>
              <el-button size="small" type="primary" plain v-if="imgbutton">选择</el-button>
            </el-upload>
          </el-col>
          <el-col>
            <div class="text_val">人脸结构化数据文件路径 :</div>
          </el-col>
          <el-col :md="7">
            <el-upload
              ref="uploads"
              class="upload-demo"
              :headers="tokens"
              :action="url"
              accept=".xls, .xlsx"
              :on-preview="handlePreview"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :on-success="files_datatrue"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :on-error="files_defeated"
            >
              <el-button size="small" type="primary" plain v-if="xlsxbutton">选择</el-button>
              <div slot="tip" class="el-upload__tip">只能上传 .xlsx 文本</div>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="removvisible">取 消</el-button>
        <el-button type="primary" v-preventReClick="3000" @click.prevent="to_lead()">导 入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FaceLibrarysData, updateFace } from '@/api/FaceLibrarys' //详情数据请求
export default {
  name: 'tolead',
  data() {
    return {
      textse: 0,
      zhaopian: false,
      Statusare: 0,
      timerNum: 0, // 设置定时器时间,
      setInterName: null,
      neidata: false,
      // loading: false,
      dataval: {},
      tosucceed: false,
      todefeated: false,
      imgbutton: true,
      xlsxbutton: true,
      innerVisible: false,
      url: '',
      library_data: [],
      fileList: [],
      visible: this.show,
      asb: false,
      options: [],
      value: '',
      tokens: { Authorization: '' },
      // 文件路径
      file_path: '',
      // 图片路径
      Image_path: '',
      text: ''
    }
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
      this.visible = this.show
      let _self = this
      _self.url = ''
      _self.url = process.env.VUE_APP_BASE_API
      _self.url =
        _self.url.substring(0, _self.url.length - 1) +
        '/v1/ldc/face/FileManages/upload'
    }
  },
  methods: {
    getStatus() {
      this.loading() // 启动定时器
      this.timer = setInterval(() => {
        //创建定时器
        if (this.timerNum === 99) {
          // 设置的定时器时间为0后执行的操作
          this.timer && this.clearTimer() // 关闭定时器
        } else {
          this.loading()
        }
      }, this.Statusare)
    },
    loading() {
      // 启动定时器
      this.timerNum += 1 // 定时器减1
      this.text = this.timerNum
    },
    clearTimer() {
      // 清除定时器
      clearInterval(this.timer)
      this.timer = null
    },
    // 文件上传时
    files_progress(event, file, fileList) {
      // alert("asd")
      this.zhaopian = true
      if (Math.ceil(event.percent) < 98) {
        this.textse = Math.ceil(event.percent)
      }
    },
    // 文件上传
    files_defeated(response, file, fileList) {
      this.zhaopian = false
      this.$message.error('文件上传失败')
      this.text = 0
      this.timerNum = 0
    },
    files_datatrue(response, file, fileList) {
      this.$message.success('文件上传成功')
      this.file_path = response[0].filePath
      this.xlsxbutton = false
      this.dataval = {}
      this.text = 0
      this.timerNum = 0
    },
    Image_datatrue(response, file, fileList) {
      this.textse = 100
      this.zhaopian = false
      this.imgbutton = false
      this.$message.success('人脸照片压缩包上传成功')
      this.Image_path = response[0].filePath
      this.dataval = {}
      this.text = 0
      this.timerNum = 0
    },
    beforeUploadFile(file) {
      this.Statusare = (Math.ceil(file.size / 111500) * 500) / 100
    },
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件,  ${files.length +
          fileList.length} 个文件 请先删除前文件在上传`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`是否移除 ${file.name} 后重新上传？`)
    },
    handleRemove(file, fileList) {
      this.timerNum = 0
      this.clearTimer()

      this.xlsxbutton = true
    },
    handleRemoves(file, fileList) {
      this.timerNum = 0
      this.clearTimer()
      this.imgbutton = true
    },
    // 获取目标库
    object_library() {
      // 获取路由的两个值
      let _self = this
      _self.options = []
      FaceLibrarysData(this.libCode, '', '', '', '0', '100').then(response => {
        _self.tokens.Authorization = 'Bearer ' + this.token
        let fordate = response.data.result.list
        for (let index = 0; index < fordate.length; index++) {
          if (fordate[index].faceLibraryName == this.facenames) {
            _self.value = fordate[index].id
          }
          var obj = {}
          obj.value = fordate[index].id
          obj.label = fordate[index].faceLibraryName
          _self.options.push(obj)
        }
      })
    },
    // 取消
    removvisible() {
      let _self = this
      _self.visible = false
      this.$refs.upload.clearFiles()
      this.$refs.uploads.clearFiles()
      _self.timerNum = 0
      _self.clearTimer()
      _self.neidata = false
      _self.xlsxbutton = true
      _self.imgbutton = true
    },
    // 导入
    to_lead() {
      this.text = 0
      this.timerNum = 0
      let _self = this
      if (_self.imgbutton == true || _self.xlsxbutto == true) {
        _self.$message.info('请先上传文件')
        return
      } else {
        _self.neidata = true
        this.getStatus()
        let form_data = {
          Id: '2019122215071656538511',
          RequestObject: 'tunano.ldc.face',
          Operation: 'importFaces',
          Data: {
            faceLibraryId: _self.value,
            faceImagesPath: _self.Image_path,
            faceImageDatasPath: _self.file_path
          },
          AppInfo: { AppId: null, DeviceId: null },
          Description: null
        }
        updateFace(form_data)
          .then(response => {
            if (response.data.result.failCount <= 0) {
              this.text = 100
              this.timerNum = 0
              this.clearTimer()
              _self.neidata = false
              this.$refs.upload.clearFiles()
              this.$refs.uploads.clearFiles()
              _self.dataval = response.data.result
              _self.$parent.grabble()
              _self.xlsxbutton = true
              _self.imgbutton = true
              _self.innerVisible = true
              _self.tosucceed = false
              _self.todefeated = true
            } else {
              _self.dataval = response.data.result
              this.text = 100
              this.timerNum = 0
              this.clearTimer()
              _self.neidata = false
              _self.$parent.grabble()
              this.$refs.upload.clearFiles()
              this.$refs.uploads.clearFiles()
              _self.xlsxbutton = true
              _self.imgbutton = true
              _self.innerVisible = true
              _self.todefeated = false
              _self.tosucceed = true
            }
          })
          .catch(err => {
            this.text = 100
            this.timerNum = 0
            this.clearTimer()
            _self.$parent.grabble()
            this.$refs.upload.clearFiles()
            this.$refs.uploads.clearFiles()
            _self.neidata = false
            // _self.innerVisible = false;
          })
      }
    },
    // 退出
    remover() {
      let _self = this
      _self.innerVisible = false
      _self.visible = false
    },
    ExportData() {
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([JSON.stringify(this.dataval.details)])

      //生成url对象
      let urlObject = window.URL || window.webkitURL || window
      let url = urlObject.createObjectURL(content)
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download = '上传错误文件导出.txt'
      //必须点击否则不会下载
      el.click()
      //移除链接释放资源
      urlObject.revokeObjectURL(url)
    }
  },
  // 最后在beforeDestroy()生命周期内清除定时器：
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  computed: {
    ...mapGetters([
      'iddata',
      'deviceFaceLibraryCode',
      'libCode',
      'token',
      'facenames'
    ])
  }
}
</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}
.ai33 {
  border-top: 1px solid #ebeef5;
}
.dl_border {
  border: 1px solid #dddfe7;
  height: 85px;
  width: 400px;
  border-radius: 6px;
  border-radius: 6px;
  padding: 10px;
  margin-top: 20px;
}
.text_val {
  margin-top: 20px;
  margin-bottom: 10px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #313234;
  letter-spacing: 0;
  line-height: 14px;
}
.ai3 {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.link_result {
  border-top: 1px solid #ebeef5;
  height: 50px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
  .result_sizi {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #f66c6d;
    letter-spacing: 0;
    margin: 0 auto;
    width: 70%;
    display: inline-block;
  }
}
.link_ref {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #313234;
  letter-spacing: 0;
  margin: 10px 0px;
}
.succeed {
  display: inline-block;
  width: 48%;
  height: 100%;
  margin-top: 50px;
  i {
    font-size: 100px;
    color: #67c23a;
    float: right;
  }
}
.succeed_div {
  display: inline-block;
  width: 45%;
  height: 100%;
  .suvved_p {
    font-family: PingFangSC-Semibold;
    font-size: 22px;
    color: #303133;
    line-height: 25px;
    letter-spacing: 0;
  }
  .suvved-pq {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #a8a8a8;
    letter-spacing: 0;
  }
}
</style>
