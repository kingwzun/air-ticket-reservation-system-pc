<template>
  <div class="vip">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员等级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--条件查询-->
    <el-form :inline="true"  class="user-search">
      <el-form-item style="margin-left: 1100px">
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addVip()">添加会员</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="vipData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%; margin-top: 10px">
      <el-table-column align="center" sortable prop="level" label="会员等级" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="requiredSpending" label="所需消费" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="discountRate" label="折扣" width="250">
      </el-table-column>
      <el-table-column align="center" sortable prop="publishTime" label="发布时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifyTime" label="修改时间" width="250">
      </el-table-column>
      <el-table-column align="center" sortable prop="creator" label="发布人" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifier" label="修改人" width="150">
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteVip(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editVipForm" :model="editVipForm" :rules="rules">
        <el-form-item label="会员等级" prop="level">
          <el-input-number size="small" v-model="editVipForm.level" auto-complete="off" placeholder="请输入会员等级"></el-input-number>
        </el-form-item>
        <el-form-item label="所需消费" prop="requiredSpending">
          <el-input-number size="small" v-model="editVipForm.requiredSpending" auto-complete="off" placeholder="请输入消费"></el-input-number>
        </el-form-item>
        <el-form-item label="折扣" prop="discountRate">
          <el-input-number size="small"  v-model="editVipForm.discountRate" auto-complete="off" placeholder="请输入折扣"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary"  class="title" @click="submitForm('editVipForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--    新增会员等级-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddVipForm" :model="editAddVipForm" :rules="rules">
        <el-form-item label="会员等级" prop="level">
          <el-input-number size="small" v-model="editAddVipForm.level" auto-complete="off" placeholder="请输入会员等级"></el-input-number>
        </el-form-item>
        <el-form-item label="所需消费" prop="requiredSpending">
          <el-input-number size="small" v-model="editAddVipForm.requiredSpending" auto-complete="off" placeholder="请输入消费"></el-input-number>
        </el-form-item>
        <el-form-item label="折扣" prop="discountRate">
          <el-input-number size="small"  v-model="editAddVipForm.discountRate" auto-complete="off" placeholder="请输入折扣"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary"  class="title" @click="submitAddForm('editAddVipForm')">保存</el-button>
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
  name: "vip",
  data(){
    /* 定义初始化变量 */
    return{
      addFormVisible: false,
      showDeleteButton: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      vipData: [],
      title: '代理会员',
      title1: '新增会员',
      editFormVisible: false,

      editAddVipForm:{
        requiredSpending:'',
        discountRate:'',
        level:''
      },
      rules: {
        requiredSpending: [
          {required: true, message: '资格证不能为空', trigger: 'blur'}
        ],
        discountRate: [
          {required: true, message: '请选择帐号状态', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '请输入会员等级', trigger: 'blur'}
        ]
      },
      editVipForm: {
        requiredSpending:'',
        discountRate:'',
        level:''
      },
    }
  },
  /* 定义事件函数 */
  methods:{
    submitAddForm(formName){
      this.$axios.post("/vip/addVip", this.editAddVipForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    addVip(){
      this.addFormVisible = true
    },
    selectChange(val) {
      this.ids = []
      val.forEach((item, index) => {
        this.ids.push(item.id)
      })
      if (this.ids.length > 0) {
        this.showDeleteButton = true
      } else {
        this.showDeleteButton = false
      }
    },
    deleteList(ids) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: ids.join(',')
        };
        this.$axios.delete("/agent/delete", {params}).then(res => {
          if (res.data.code === 200) {
            this.pageNum = 1
            this.pageSize = 10
            this.queryAll()
            this.$message.success("重置成功")
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
    closeDeleteButton() {
      this.ids = []
      this.showDeleteButton = false
      this.queryAll()

    },
    submitForm(formName) {
      this.$axios.put("/vip/updateVip", this.editVipForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    handleEdit(vip) {
      this.editFormVisible = true
      this.editVipForm = {...vip}
    },
    deleteVip(id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/vip/delete?id=" + id).then(res => {
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
    search(){
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get('/vip/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(res => {
        this.vipData = res.data.data.records
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
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
