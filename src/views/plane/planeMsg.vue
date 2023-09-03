<template>
  <div class="planeMsg">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>飞机信息管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.modelId" filterable clearable placeholder="请选择飞机类型">
          <el-option
            v-for="item in planeTypeModel"
            :key="item.id"
            :label="item.model"
            :value="item.id">
          </el-option>
        </el-select>
        <el-form-item label="">
          <el-input size="small" v-model="formInline.aircraftCode" placeholder="输入飞机编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryByName()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addPlane()">添加飞机</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table size="small" :data="planeMsgData" highlight-current-row v-loading="loading" border
              element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="model" label="飞机型号" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="aircraftCode" label="飞机编号" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="purchaseDate" label="购买日期" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="serviceYears" label="服役年限" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="lastMaintenanceDate" label="上次检修日期" width="150">
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
          <el-button size="mini" type="danger" @click="deletePlane(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="40%" @click='closeDialog("edit")'>
      <el-form label-width="110px" ref="editPlaneForm" :model="editPlaneForm" :rules="rules">
        <el-form-item label="飞机型号" prop="modelId">
          <el-select size="small" v-model="editPlaneForm.modelId" filterable clearable placeholder="请选择飞机类型">
            <el-option
              v-for="item in planeTypeModel"
              :key="item.id"
              :label="item.model"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞机编号" prop="aircraftCode">
          <el-input size="small" v-model="editPlaneForm.aircraftCode" auto-complete="off"
                    placeholder="请输入客容量"></el-input>
        </el-form-item>
        <el-form-item label="购买日期" prop="purchaseDate">
          <el-date-picker
            v-model="editPlaneForm.purchaseDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服役年限" prop="serviceYears">
          <el-select size="small" v-model="editPlaneForm.serviceYears" placeholder="请选择" class="userRole">
            <el-option v-for="num in 10" :key="num" :label="num" :value="num"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上次检修日期" prop="lastMaintenanceDate">
          <el-date-picker
            v-model="editPlaneForm.lastMaintenanceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
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
      <el-form label-width="110px" ref="addPlaneForm" :model="addPlaneForm" :rules="rules">
        <el-form-item label="飞机型号" prop="modelId">
          <el-select size="small" v-model="addPlaneForm.modelId" filterable clearable placeholder="请选择飞机类型">
            <el-option
              v-for="item in planeTypeModel"
              :key="item.id"
              :label="item.model"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞机编号" prop="aircraftCode">
          <el-input size="small" v-model="addPlaneForm.aircraftCode" auto-complete="off"
                    placeholder="请输入飞机编号"></el-input>
        </el-form-item>
        <el-form-item label="购买日期" prop="purchaseDate">
          <el-date-picker
            v-model="addPlaneForm.purchaseDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editTypeForm')">保存
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
  name: "planeMsg",
  data(){
    /* 定义初始化变量 */
    return{
      addFormVisible: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      planeMsgData:[],
      title: '飞机修改',
      title1: '新增飞机',
      editFormVisible: false,
      rules: {
        modelId: [
          {required: true, message: '请选择型号', trigger: 'blur'}
        ],
        aircraftCode: [
          {required: true, message: '请输入飞机代码', trigger: 'blur'}
        ],
        purchaseDate: [
          {required: true, message: '请选择购买日期', trigger: 'blur'}
        ],
        serviceYears: [
          {required: true, message: '请选择服役年限', trigger: 'blur'}
        ],
        lastMaintenanceDate: [
          {required: true, message: '请选择上次检修日期', trigger: 'blur'}
        ]
      },
      addPlaneForm:{
        modelId:'',
        aircraftCode:'',
        purchaseDate:'',
      },
      editPlaneForm:{
       modelId:'',
       aircraftCode:'',
       purchaseDate:'',
       serviceYears:'',
       lastMaintenanceDate:''
      },
      planeTypeModel:[],
      formInline: {
        aircraftCode:'',
        modelId:''
      }
    }
  },
  /* 定义事件函数 */
  methods:{
    submitAddForm(formName){
      this.$axios.post("/aircraftInformation/addPlane", this.addPlaneForm).then(res => {
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
      this.$axios.put("/aircraftInformation/updatePlane", this.editPlaneForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    deletePlane(id){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/aircraftInformation/delete?id=" + id).then(res =>{
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
    addPlane(){
      this.addFormVisible = true
    },
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    // 打开编辑窗口
    handleEdit(planeMsg) {
      this.editFormVisible = true
      this.editPlaneForm = {...planeMsg}
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
    queryAllModel(){
      this.$axios.get('/aircraftType/queryAllModel').then(res => {
        this.planeTypeModel = res.data.data
      })
    },
    queryAll(){
      this.$axios.get('/aircraftInformation/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          aircraftCode: this.formInline.aircraftCode,
          modelId: this.formInline.modelId,
        }
      }).then(res => {
        this.planeMsgData = res.data.data.records
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
    this.queryAllModel()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
