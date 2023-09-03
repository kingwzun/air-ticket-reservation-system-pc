<template>
  <div class="airport">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机场管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.province" filterable clearable placeholder="请选择省份">
          <el-option
            v-for="item in airportData"
            :key="item.province"
            :label="item.label"
            :value="item.province">
          </el-option>
        </el-select>
        <el-select size="small" v-model="formInline.city" filterable clearable placeholder="请选择城市">
          <el-option
            v-for="item in airportData"
            :key="item.city"
            :label="item.label"
            :value="item.city">
          </el-option>
        </el-select>
        <el-form-item label="">
          <el-input size="small" v-model="formInline.airportName" placeholder="输入机场名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryByName()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-circle-plus" v-show="this.userKind !== '-2'" @click="addAirport()">添加机场</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="airportData" highlight-current-row v-loading="loading" border
              element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="province" label="省份" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="city" label="城市" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="airportName" label="机场名" width="250">
      </el-table-column>
      <el-table-column align="center" sortable prop="airportCoordinateX" label="机场坐标X" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="airportCoordinateY" label="机场坐标Y" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="creator" label="创建人" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifier" label="修改人" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="publishTime" label="创建时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifyTime" label="修改时间" width="150">
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" v-show="userKind !== '-2'" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" v-show="userKind !== '-2'" type="danger" @click="deleteAirport(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="40%" @click='closeDialog("edit")'>
      <el-form label-width="90px" ref="editAirportForm" :model="editAirportForm" :rules="rules">
        <el-form-item label="机场名" prop="airportName">
          <el-input size="small" v-model="editAirportForm.airportName" auto-complete="off"
                    placeholder="请输入机场名"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input size="small" v-model="editAirportForm.province" auto-complete="off"
                    placeholder="请输入省份"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input size="small" v-model="editAirportForm.city" auto-complete="off" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-form-item label="机场坐标X" prop="airportCoordinateX">
          <el-input type="number" size="small" v-model="editAirportForm.airportCoordinateX" auto-complete="off"
                    placeholder="请输入坐标X"></el-input>
        </el-form-item>
        <el-form-item label="机场坐标Y" prop="airportCoordinateY">
          <el-input type="number" size="small" v-model="editAirportForm.airportCoordinateY" auto-complete="off"
                    placeholder="请输入坐标Y"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editAirportForm')">保存
        </el-button>
      </div>
    </el-dialog>
    <!--    新增机场-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddAirportForm" :model="editAddAirportForm" :rules="rules">
        <el-form-item label="机场名" prop="airportName">
          <el-input size="small" v-model="editAddAirportForm.airportName" auto-complete="off" placeholder="请输入机场名"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input size="small" v-model="editAddAirportForm.province" auto-complete="off" placeholder="请输入省份"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input size="small" v-model="editAddAirportForm.city" auto-complete="off" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-form-item label="X坐标" prop="airportCoordinateX">
          <el-input type="number" size="small" v-model="editAddAirportForm.airportCoordinateX" auto-complete="off" placeholder="请输入X坐标"></el-input>
        </el-form-item>
        <el-form-item label="Y坐标" prop="airportCoordinateY">
          <el-input type="number" size="small" v-model="editAddAirportForm.airportCoordinateY" auto-complete="off" placeholder="请输入Y坐标"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddAirportForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--    分页条-->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "airport",
  data() {
    /* 定义初始化变量 */
    return {
      userKind:'',
      editAddAirportForm:{
        province: '',
        city: '',
        airportName: '',
        airportCoordinateX: '',
        airportCoordinateY: ''
      },
      addFormVisible: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      airportData: [],
      title: '机场修改',
      title1: '新增机场',
      editFormVisible: false,
      rules: {
        province: [
          {required: true, message: '省份不能为空', trigger: 'blur'}
        ],
        city: [
          {required: true, message: '城市不能为空', trigger: 'blur'}
        ],
        airportName: [
          {required: true, message: '请输入机场名', trigger: 'blur'}
        ],
        airportCoordinateX: [
          {required: true, message: '请输入机场坐标X', trigger: 'blur'}
        ],
        airportCoordinateY: [
          {required: true, message: '请输入机场坐标Y', trigger: 'blur'}
        ]
      },
      editAirportForm: {
        province: '',
        city: '',
        airportName: '',
        airportCoordinateX: '',
        airportCoordinateY: ''
      },
      formInline: {
        city: '',
        province: '',
        airportName: ''
      }
    }
  },
  /* 定义事件函数 */
  methods: {
    submitAddForm(formName){
      this.$axios.post("/airport/addAirport", this.editAddAirportForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    addAirport(){
      this.addFormVisible = true
    },
    submitForm(formName) {
      this.$axios.put("/airport/updateAirport", this.editAirportForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    handleEdit(airport) {
      this.editFormVisible = true
      this.editAirportForm = {...airport}
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },
    deleteAirport(id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/airport/delete?id=" + id).then(res => {
          if (res.data.code === 200) {
            this.pageNum = 1
            this.pageSize = 10
            this.queryAll()
            this.$message.success("删除成功")
          } else {
            this.$message.error(res.data.data)
          }
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    queryByName() {
      this.pageNum = 1
      this.queryAll()
    },
    getUserKind(){
      const userDataJSON = sessionStorage.getItem("user");
      const userData = JSON.parse(userDataJSON);
      this.userKind = userData.vipStatus
      console.log(this.userKind);
    },
    queryAll() {
      this.$axios.get('/airport/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          city: this.formInline.city,
          province: this.formInline.province,
          airportName: this.formInline.airportName
        }
      }).then(res => {
        this.airportData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
      })
    }

  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
    this.getUserKind()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
