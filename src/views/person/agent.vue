<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代理管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search" v-show="!showDeleteButton">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.status" placeholder="请选择帐号状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="已锁定" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.username" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addAgent()">添加代理</el-button>
      </el-form-item>
    </el-form>
    <!--列表删除-->
    <el-form v-show="showDeleteButton" :inline="true" :model="formInline" class="user-search">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-close" @click="closeDeleteButton()">取消</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="danger" icon="el-icon-delete" style="margin-left: 1000px"
                   @click="deleteList(ids)">删除
        </el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="userData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="account" label="代理账号" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="qualificationNumber" label="资格号" width="250">
      </el-table-column>
      <el-table-column align="center" sortable prop="level" label="代理等级" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status=== '1' ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteAgent(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="resetpwd( scope.row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAgentForm" :model="editAgentForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input size="small" v-model="editAgentForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="资格证" prop="qualificationNumber">
          <el-input size="small" v-model="editAgentForm.qualificationNumber" auto-complete="off" placeholder="请输入资格证"></el-input>
        </el-form-item>
        <el-form-item label="代理等级" prop="level">
          <el-select size="small" v-model="editAgentForm.level" placeholder="请选择" class="userRole">
            <el-option v-for="num in 10" :key="num" :label="num" :value="num"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理等级" prop="level">
          <el-select size="small" v-model="editAgentForm.status" placeholder="请选择" class="userRole">
            <el-option label="正常" value="1"></el-option>
            <el-option label="封禁" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editAgentForm')">保存</el-button>
      </div>
    </el-dialog>
<!--    新增代理-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddAgentForm" :model="editAddAgentForm" :rules="rulesAdd">
        <el-form-item label="用户名" prop="username">
          <el-input size="small" v-model="editAddAgentForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input size="small" v-model="editAddAgentForm.account" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="资格证" prop="qualificationNumber">
          <el-input size="small" v-model="editAddAgentForm.qualificationNumber" auto-complete="off" placeholder="请输入资格证"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddAgentForm')">保存</el-button>
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
  name: "agent",
  data(){
    /* 定义初始化变量 */
    return{
      addFormVisible: false,
      showDeleteButton: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ids: [],
      userData: [],
      nshow: true, //switch开启
      fshow: false, //switch关闭
      title: '代理修改',
      title1: '新增代理',
      editFormVisible: false,
      editForm: {
        id:'',
        status: '',
      },
      editAddAgentForm:{
        username:'',
        qualificationNumber:'',
        account:''
      },
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        qualificationNumber: [
          {required: true, message: '资格证不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择帐号状态', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '请输入代理等级', trigger: 'blur'}
        ]
      },
      rulesAdd:{
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        account: [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ],
        qualificationNumber: [
          {required: true, message: '资格证不能为空', trigger: 'blur'}
        ],
      },
      editAgentForm: {
        id:'',
        status: '',
        qualificationNumber:'',
        level:''
      },
      formInline: {
        username:'',
        status:''
      }
    }
  },
  /* 定义事件函数 */
  methods:{
    submitAddForm(formName){
      this.$axios.post("/agent/addAgent", this.editAddAgentForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    addAgent(){
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
      this.$axios.put("/agent/updateAgent", this.editAgentForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    handleEdit(agent) {
      this.editFormVisible = true
      this.editAgentForm = {...agent}
    },
    deleteAgent(id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/agent/delete?id=" + id).then(res => {
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
    resetpwd(id) {
      this.$confirm('确定要重置吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.put("/agent/updatePassword?id=" + id).then(res => {
          if (res.data.code === 200) {
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
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    editStatus(row) {
      this.editForm.id = row.id
      let status = row.status
      if (status == '1') {
        this.editForm.status = '0'
      } else {
        this.editForm.status = '1'
      }
      this.$axios.put('/agent/updateAgent', this.editForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success("修改成功")
          this.queryAll()
        } else {
          this.$message.error(res.data.data)
        }
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
    search(){
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get('/agent/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.formInline.username,
          status: this.formInline.status,
        }
      }).then(res => {
        this.userData = res.data.data.records
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
