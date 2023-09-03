<template>
  <div class="airway">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>航线管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.departureAirportId" filterable clearable placeholder="请选择起始机场">
          <el-option
            v-for="item in airport"
            :key="item.id"
            :label="item.airportName"
            :value="item.id">
          </el-option>
        </el-select>

        <el-select size="small" v-model="formInline.destinationAirportId" filterable clearable placeholder="请选择目的机场">
          <el-option
            v-for="item in airport"
            :key="item.id"
            :label="item.airportName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" v-show="this.userKind !== '-2'" @click="addRoute()">添加航线</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table size="small" :data="routeData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="departureAirport" label="起始机场" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="destinationAirport" label="目的机场" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="publishTime" label="发布时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifyTime" label="修改时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="creator" label="创建人" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifier" label="修改人" width="100">
      </el-table-column>

      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" v-show="userKind !== '-2'" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" v-show="userKind !== '-2'" type="danger" @click="deleteAriway(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAirwayForm" :model="editAirwayForm" :rules="rules">
        <el-form-item label="起始机场" prop="departureAirportId">
          <el-select size="small" v-model="editAirwayForm.departureAirportId" filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in airport"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的机场" prop="destinationAirportId">
          <el-select size="small" v-model="editAirwayForm.destinationAirportId" filterable clearable placeholder="请选择目的机场">
            <el-option
              v-for="item in airport"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--    新增航线-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddRouteForm" :model="editAddRouteForm" :rules="rules">
        <el-form-item label="起始机场" prop="departureAirportId">
          <el-select size="small" v-model="editAddRouteForm.departureAirportId" filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in airport"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的机场" prop="destinationAirportId">
          <el-select size="small" v-model="editAddRouteForm.destinationAirportId" filterable clearable placeholder="请选择目的机场">
            <el-option
              v-for="item in airport"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddRouteForm')">保存</el-button>
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
  name: "airway",
  data() {
    /* 定义初始化变量 */
    return {
      // 基本信息
      userKind:'',
      editAddRouteForm:{
        destinationAirportId:'',
        departureAirportId:''
      },
      title1:"新增航线",
      title: "修改航线",
      loading: false, //显示加载
      editFormVisible: false,
      addFormVisible : false,
      // 列表信息
      routeData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 条件查找
      formInline: {
        departureAirportId: '',
        destinationAirportId: ''
      },
      editAirwayForm:{
        departureAirportId: '',
        destinationAirportId: ''
      },
      rules: {
        departureAirportId: [
          {required: true, message: '请选择起始地点', trigger: 'blur'}
        ],
        destinationAirportId: [
          {required: true, message: '请选择终止地点', trigger: 'blur'}
        ]
      },
      airport:[]
    }
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
    this.getAllAirport()
    this.getUserKind()
  },
  /* 定义事件函数 */
  methods: {
    submitAddForm(formName){
      this.$axios.post("/route/addRoute", this.editAddRouteForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    addRoute(){
      this.addFormVisible = true
    },

    getAllAirport() {
      this.$axios.get('/airport/getAllAirport',).then(res => {
        this.airport = res.data.data
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },
    submitForm(formName) {
      this.$axios.put("/route/updateRoute", this.editAirwayForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    // 打开编辑窗口
    handleEdit(route) {
      this.editFormVisible = true
      this.editAirwayForm = {...route}
    },
    // 编辑窗口关闭
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    // 删除
    deleteAriway(id){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/route/delete?id=" + id).then(res =>{
          if(res.data.code === 200){
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
    getUserKind(){
      const userDataJSON = sessionStorage.getItem("user");
      const userData = JSON.parse(userDataJSON);
      this.userKind = userData.vipStatus
      console.log(this.userKind);
    },
    // 获取初始化信息
    queryAll() {
      this.$axios.get('/route/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          departureAirportId: this.formInline.departureAirportId,
          destinationAirportId: this.formInline.destinationAirportId
        }
      }).then(res => {
        this.routeData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
      })
    },
    // 搜索事件
    search() {
      this.queryAll()

    }
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
