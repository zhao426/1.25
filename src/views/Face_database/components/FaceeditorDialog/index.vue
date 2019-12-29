
<template>
  <!-- 修改添加组建 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      width="61%"
      :show="show"
      ref="myfaceed"
      :lock-scroll="false"
      :close-on-click-modal="false"
    >
      <div style="height:400px">
        <!--修改照片 -->
        <el-row class="dl_row">
          <el-col :span="2" style="width:150px;">
            <div :class="[{'img_border':imageUrl==''}]" class="item">
              <img
                class="avatar"
                v-if="imageUrl!=''"
                :src="imageUrl"
                style="height:150px;width:116px;border-radius: 4px"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-col>
          <el-col :span="10" style="height:170px;">
            <div class="facedi_text">
              <div v-show="shows">
                用户ID：
                <span>{{dataform.id}}</span>
              </div>
              <div v-show="shows">
                人脸照片ID：
                <span>{{dataform.imageid}}</span>
              </div>
              <div v-show="shows">
                图片文件路径：
                <span>{{dataform.faceImagePath}}</span>
              </div>
              <el-upload
                action
                class="avatar-uploader"
                :show-file-list="false"
                :on-change="getFile"
                list-type="picture"
                :auto-upload="false"
                accept="image/jpeg"
                :before-upload="beforeAvatarUpload"
              >
                <el-button size="small" type="primary" plain>{{buttonname}}</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <!-- 属性填写 -->
        <el-scrollbar style="height:260px;border-bottom:1px solid  #ebeef5">
          <el-row style="margin:10px 0;">
            <el-col>
              <div
                class="dl_ul"
                style="margin-top: 15px;    margin-left: 14px;color: #303133; font-sizi:16px;"
              >用户属性</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <div class="dl_ul" style="margin-top: 15px;    margin-left: 14px;color: #303133;">名字</div>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="请输入与名字" v-model="propertydata.name"></el-input>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="dl_ul" style="margin-top: 15px;    margin-left: 14px;color: #303133;">身份证号</div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-input
                  placeholder="请输入身份证号"
                  v-model="propertydata.identityId"
                  auto-complete="new-password"
                  show-password
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row style="margin:20px 0px;">
            <el-col :span="2">
              <div class="dl_ul" style="margin-top: 15px;margin-left: 14px;color: #303133;">读者证</div>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="请输入读者证" v-model="propertydata.cardNO"></el-input>
            </el-col>
            <el-col :span="2" :offset="3">
              <div
                class="dl_ul"
                style="margin-top: 15px;    margin-left: 14px;color: #303133;"
              >读者证类型</div>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="请输入读者证类型" v-model="propertydata.cardType"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <div class="dl_ul" style="margin-top: 15px;    margin-left: 14px;color: #303133;">特征码</div>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="请输入特征码" v-model="propertydata.specCode"></el-input>
            </el-col>
            <el-col :span="2" :offset="3">
              <div
                class="dl_ul"
                style="margin-top: 15px;    margin-left: 14px;color: #303133;"
              >特征码类型</div>
            </el-col>
            <el-col :span="7">
              <!-- <el-input placeholder="请输入特征码类型" v-model="propertydata.specCodeType |codeType"></el-input> -->
              <el-select v-model="propertydata.specCodeType" placeholder="请选择特征码类型">
                <el-option
                  v-for="item in codeTyede"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;" v-show="shows">
            <el-col :span="2">
              <div class="dl_ul" style="margin-top: 15px; margin-left: 14px;color: #303133;">ID</div>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="请输入ID" :disabled="true" v-model="proid"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin:10px 0;" v-show="shows">
            <el-col>
              <div
                class="dl_ul"
                style="margin-top: 15px;    margin-left: 14px;color: #303133; font-sizi:16px;"
              >人脸属性</div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:20px;" v-show="shows">
            <el-col :span="2">
              <div
                class="dl_ul"
                style="margin-top: 15px;    margin-left: 14px;color: #303133;"
                maxlength="1"
              >性别</div>
            </el-col>
            <el-col :span="7">
              <!-- <el-input placeholder="请输入内容" v-model="facsdata.sex" maxlength="1"></el-input> -->
              <el-select v-model="facsdata.sex" :disabled="true" placeholder="请选择性别">
                <el-option
                  v-for="item in genderdata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" :offset="3">
              <div class="dl_ul" style="margin-top: 15px;     margin-left: 14px;color: #303133;">年龄</div>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="请输入内容" maxlength="3" :disabled="true" v-model="facsdata.age"></el-input>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <!-- 底部时间 -->
      <div slot="footer" class="dialog-footer">
        <div class="dl_div" v-show="shows">
          <div class="dl_form">
            创建时间
            <span class="dl_span">{{dataform.createTime |formatDate}}</span>
          </div>

          <div class="dl_form">
            修改时间
            <span class="dl_span">{{dataform.lastVisitTime |formatDate}}</span>
          </div>
        </div>
        <el-button @click="remove()">取 消</el-button>
        <el-button type="primary" v-preventReClick="3000" @click.prevent="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateFace } from '@/api/FaceLibrarys' //详情数据请求
export default {
  name: 'faceed',
  data() {
    return {
      // 性别
      genderdata: [
        {
          value: 'male',
          label: '男'
        },
        {
          value: 'female',
          label: '女'
        }
      ],
      // 人脸属性
      codeTyede: [
        {
          value: '0',
          label: '读者证'
        },
        {
          value: '1',
          label: '身份证'
        }
      ],
      facsdata: {
        age: '',
        sex: ''
      },
      proid: '',
      // 用户属性参数
      propertydata: {
        cardNO: '',
        cardType: '',
        identityId: '',
        name: '',
        specCodeType: '',
        specCode: ''
      },
      // 显示隐藏
      shows: true,
      buttonname: '',
      // 详情数据
      details_data: {},
      // 页面数据
      dataform: {
        id: '',
        faceImagePath: '',
        imageid: '',
        createTime: '',
        lastVisitTime: '',
        userjson: '',
        facejson: '',
        imageBase64: ''
      },
      imageUrl: '',
      imgBase64: '', // 存储img base64的值将值传给后端处理
      title: '',
      visible: this.show,
      text: '',
      restaurants: [],
      state1: '',
      state2: 'asda'
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
    }
  },
  methods: {
    //
    sahcnhu(done) {
      // this.imageUrl = '';
      console.log(done)
    },
    //详情数据获取
    details(data) {
      let _self = this
      if (data != '') {
        _self.shows = true
        _self.title = '编辑人脸'
        _self.buttonname = '修改照片'
        _self.details_data = data
        _self.imageUrl = process.env.VUE_APP_BASE_API

        _self.imageUrl = _self.imageUrl.substring(0, _self.imageUrl.length - 1)

        _self.imageUrl =
          _self.imageUrl +
          data.image.faceImagePath +
          '?top' +
          Date.parse(new Date())
        _self.dataform.id = data.patron.cardNo
        _self.dataform.faceImagePath = data.image.faceImagePath.split('?')[0]
        _self.dataform.imageid = data.image.id
        _self.dataform.createTime = data.createTime
        _self.dataform.lastVisitTime = data.lastModifTime
        _self.propertydata.cardNO = data.patron.cardNo
        _self.propertydata.cardType = data.patron.cardType
        _self.propertydata.identityId = data.patron.identityId
        _self.propertydata.name = data.patron.name
        _self.propertydata.specCodeType = data.patron.specCodeType + ''
        _self.propertydata.specCode = data.patron.specCode
        _self.proid = data.patron.id
        var json = new Function('return ' + data.faceInfo)()
        _self.facsdata = json
      } else {
        _self.buttonname = '上传照片'
        _self.title = '新增人脸'
        _self.shows = false
        _self.imageUrl = ''
        _self.propertydata = {
          cardNO: '',
          cardType: '',
          identityId: '',
          name: '',
          specCodeType: '',
          specCode: ''
        }
        _self.facsdata = {
          age: '',
          sex: ''
        }
      }
    },
    getFile(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.dataform.imageBase64 = res
      })
    },

    getBase64(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      } else {
        return new Promise(function(resolve, reject) {
          let reader = new FileReader()
          let imgResult = ''
          reader.readAsDataURL(file)
          reader.onload = function() {
            imgResult = reader.result
          }
          reader.onerror = function(error) {
            reject(error)
          }
          reader.onloadend = function() {
            resolve(imgResult)
          }
        })
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 取消弹框
    remove() {
      let _self = this
      _self.imageUrl = ''
      _self.dataform = {
        id: '',
        faceImagePath: '',
        imageid: '',
        createTime: '',
        lastVisitTime: '',
        userjson: '',
        facejson: '',
        imageBase64: ''
      }
      _self.visible = false
    },
    confirm() {
      let deviceFaceLibraryCode = this.deviceFaceLibraryCode
      let libCode = this.libCode
      let _self = this
      let form_Data = {
        Id: '2019122215071656538511',
        RequestObject: 'tunano.ldc.face',
        Operation: 'updateFace',
        Data: {
          patron: _self.propertydata,
          faceInfo: JSON.stringify(_self.facsdata) + '',
          imageBase64: _self.dataform.imageBase64
        },
        AppInfo: { AppId: null, DeviceId: null },
        Description: null
      }
      if (
        _self.imageUrl != '' &&
        _self.propertydata.cardNO != '' &&
        _self.propertydata.cardType != '' &&
        _self.propertydata.identityId != '' &&
        _self.propertydata.name != '' &&
        _self.propertydata.specCodeType != '' &&
        _self.propertydata.specCode != ''
      ) {
        if (_self.id == '') {
          form_Data.Operation = 'addFace'
          form_Data.Data.deviceFaceLibraryCode = _self.deviceFaceLibraryCode
          form_Data.Data.libCode = _self.libCode
          updateFace(form_Data)
            .then(response => {
              _self.$parent.grabble()
              _self.$message.success('人脸新增成功')
              _self.visible = false
              _self.imageUrl = ''
            })
            .catch(function(error) {
              _self.$parent.grabble()
              // _self.$message.error(error.response.data.message);
              _self.visible = false
              _self.imageUrl = ''
            })
        } else {
          form_Data.Operation = 'updateFace'
          form_Data.Data.deviceFaceLibraryCode = _self.deviceFaceLibraryCode
          form_Data.Data.libCode = _self.libCode
          form_Data.Data.id = _self.details_data.id
          form_Data.Data.patron.id = _self.proid
          updateFace(form_Data)
            .then(response => {
              _self.visible = false
              _self.$message.success('人脸编辑成功')
              _self.$parent.grabble()
              // _self.title = "人脸库新增";
            })
            .catch(function(error) {
              _self.$parent.grabble()
              // _self.$message.error("人脸编辑失败");
              _self.visible = false
            })
        }
      } else if (_self.imageUrl == '') {
        _self.$message.info('请先上传人脸照片')
      } else if (_self.propertydata.name == '') {
        _self.$message.info('名字不能为空')
      } else if (_self.propertydata.identityId == '') {
        _self.$message.info('身份证号不能为空')
      } else if (_self.propertydata.cardNO == '') {
        _self.$message.info('读者证不能为空')
      } else if (_self.propertydata.cardType == '') {
        _self.$message.info('读者证类型不能为空')
      } else if (_self.propertydata.specCode == '') {
        _self.$message.info('特征码不能为空')
      } else if (_self.propertydata.specCodeType == '') {
        _self.$message.info('请选择特征码类型')
      }
    }
  },
  computed: {
    ...mapGetters(['iddata', 'deviceFaceLibraryCode', 'libCode', 'facenames'])
  }
}
</script>
<style lang="scss" scoped>
.img_border {
  border: 1px dashed;
}
.line {
  text-align: center;
}
.dl_row {
  border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  .dl_ul {
    height: 85px;
    width: 280px;
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
  // width: 537px;
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 150px;
  width: 116px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.item {
  height: 150px;
  width: 116px;
  border-radius: 4px;
  margin-top: 10px;
}
.facedi_text {
  margin-top: 20px;
  div {
    margin-top: 10px;
  }
}
</style>
