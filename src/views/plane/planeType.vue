<template>
  <div class="planeType">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>飞机类型管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.model" filterable clearable placeholder="请选择飞机类型">
          <el-option
            v-for="item in planeTypeModel"
            :key="item.id"
            :label="item.model"
            :value="item.model">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryByName()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addPlaneType()">添加飞机类型</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="planeTypeData" highlight-current-row v-loading="loading" border
              element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="model" label="飞机型号" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="passengerCapacity" label="客容量" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="firstClassCapacity" label="头等舱数量" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="economyClassCapacity" label="经济舱数量" width="150">
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
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deletePlaneType(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="40%" @click='closeDialog("edit")'>
      <el-form label-width="130px" ref="editTypeForm" :model="editTypeForm" :rules="rules">
        <el-form-item label="飞机型号" prop="model">
          <el-input size="small" v-model="editTypeForm.model" auto-complete="off"
                    placeholder="请输入飞机型号"></el-input>
        </el-form-item>
        <el-form-item label="客容量" prop="passengerCapacity">
          <el-input type="number" size="small" v-model="editTypeForm.passengerCapacity" auto-complete="off"
                    placeholder="请输入客容量"></el-input>
        </el-form-item>
        <el-form-item label="头等舱座位数" prop="firstClassCapacity">
          <el-input type="number" size="small" v-model="editTypeForm.firstClassCapacity" auto-complete="off" placeholder="请输入头等舱座位数"></el-input>
        </el-form-item>
        <el-form-item label="经济舱座位数" prop="economyClassCapacity">
          <el-input type="number" size="small" v-model="editTypeForm.economyClassCapacity" auto-complete="off"
                    placeholder="请输入经济舱座位数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editTypeForm')">保存
        </el-button>
      </div>
    </el-dialog>
    <!--    新增机场-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="90px" ref="editTypeForm" :model="addTypeForm" :rules="rules">
        <el-form-item label="飞机型号" prop="model">
          <el-input size="small" v-model="addTypeForm.model" auto-complete="off"
                    placeholder="请输入飞机型号"></el-input>
        </el-form-item>
        <el-form-item label="客容量" prop="passengerCapacity">
          <el-input type="number" size="small" v-model="addTypeForm.passengerCapacity" auto-complete="off"
                    placeholder="请输入客容量"></el-input>
        </el-form-item>
        <el-form-item label="头等舱座位数" prop="firstClassCapacity">
          <el-input type="number" size="small" v-model="addTypeForm.firstClassCapacity" auto-complete="off" placeholder="请输入头等舱座位数"></el-input>
        </el-form-item>
        <el-form-item label="经济舱座位数" prop="economyClassCapacity">
          <el-input type="number" size="small" v-model="addTypeForm.economyClassCapacity" auto-complete="off"
                    placeholder="请输入经济舱座位数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('addTypeForm')">保存
        </el-button>
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
  name: "planeType",
  data(){
    /* 定义初始化变量 */
    return{
      addFormVisible: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      planeTypeData:[],
      title: '飞机类型信息修改',
      title1: '新增飞机类型',
      editFormVisible: false,
      rules: {
        passengerCapacity: [
          {required: true, message: '请输入客容量', trigger: 'blur'}
        ],
        firstClassCapacity: [
          {required: true, message: '请输入头等舱数量', trigger: 'blur'}
        ],
        economyClassCapacity: [
          {required: true, message: '请输入经济舱数量', trigger: 'blur'}
        ],
        model: [
          {required: true, message: '请输入飞机型号', trigger: 'blur'}
        ],
      },
      addTypeForm:{
        passengerCapacity:'',
        firstClassCapacity:'',
        economyClassCapacity:'',
        model:''
      },
      editTypeForm:{
        passengerCapacity:'',
        firstClassCapacity:'',
        economyClassCapacity:'',
        model:''
      },
      planeTypeModel:[],
      formInline: {
        model:''
      }
    }
  },
  /* 定义事件函数 */
  methods:{
    submitAddForm(formName){
      this.$axios.post("/aircraftType/addAircraftType", this.addTypeForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    submitForm(formName) {
      this.$axios.put("/aircraftType/updateAircraftType", this.editTypeForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    deletePlaneType(id){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/aircraftType/delete?id=" + id).then(res =>{
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
    addPlaneType(){
      this.addFormVisible = true
    },
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    // 打开编辑窗口
    handleEdit(planeType) {
      this.editFormVisible = true
      this.editTypeForm = {...planeType}
    },
    queryByName(){
      this.queryAll()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },
    // 获取初始化信息
    queryAllModel(){
      this.$axios.get('/aircraftType/queryAllModel').then(res => {
        this.planeTypeModel = res.data.data
      })
    },
    queryAll() {
      this.$axios.get('/aircraftType/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          model: this.formInline.model,
        }
      }).then(res => {
        this.planeTypeData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
      })
    },
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
    this.queryAllModel()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
