<template>
  <div class="baggage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>托运管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-form-item label="">
          <el-input size="small" v-model="formInline.baggageCode" placeholder="输入托运编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryByName()">搜索</el-button>
        </el-form-item>

      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="baggageData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center"  prop="ticketId" label="机票订单编号" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="baggageCode" label="托运码" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="baggageWeight" label="行李重量" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="baggageItemCount" label="行李数量" width="150">
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" v-show="userKind !== '-2'" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" v-show="userKind !== '-2'" type="danger" @click="deleteBaggage(scope.row.baggageId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click='closeDialog("edit")'>
      <el-form label-width="140px" ref="editBaggageForm" :model="editBaggageForm" :rules="rules">
        <el-form-item label="托运行李数" prop=" baggageItemCount">
          <el-input type="number" size="small" v-model="editBaggageForm.baggageItemCount" auto-complete="off" placeholder="请输入托运行李数"></el-input>
        </el-form-item>
        <el-form-item label="托运重量" prop="baggageWeight">
          <el-input type="number" size="small" v-model="editBaggageForm.baggageWeight" auto-complete="off" placeholder="请输入托运重量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editOrderForm')">保存</el-button>
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
  name: "baggage",
  data(){
    /* 定义初始化变量 */
    return{
      userKind:'',
      title: "修改托运信息",
      loading: false, //显示加载
      editFormVisible: false,
      addFormVisible : false,
      // 列表信息
      flightData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 条件查找
      formInline: {
        baggageCode:''
      },
      editBaggageForm:{
        baggageWeight:'',
        baggageItemCount:''
      },
      rules: {
        baggageWeight: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        baggageItemCount: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
      },
      baggageData:[]
    }
  },
  /* 定义事件函数 */
  methods:{
    getUserKind(){
      const userDataJSON = sessionStorage.getItem("user");
      const userData = JSON.parse(userDataJSON);
      this.userKind = userData.vipStatus
    },
    deleteBaggage(baggageId){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(`/baggage/delete/${baggageId}`).then(res =>{
          if(res.data.code === 200){
            this.pageNum = 1
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
    submitForm(formName) {
      this.$axios.put("/baggage/updateBaggage", this.editBaggageForm).then(res => {
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
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },
    handleEdit(baggage) {
      this.editFormVisible = true
      this.editBaggageForm = {...baggage}
    },
    queryByName(){
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get('/baggage/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          baggageCode: this.formInline.baggageCode
        }
      }).then(res => {
        if(res.data.code === 200){
          this.baggageData = res.data.data.records
          this.pageNum = res.data.data.current
          this.total = res.data.data.total
        } else {
          this.$message.warning(res.data.data)
        }
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
