<template>
  <div class="announcement">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search" >
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.title" placeholder="输入公告标题"></el-input>
      </el-form-item>
      <el-form-item >
        <el-input size="small" v-model="formInline.content" placeholder="输入公告内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker size="small" v-model="formInline.publishTime" align="right" type="date"
                        value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryBy()">搜索</el-button>
      </el-form-item>
      <el-form-item>
          <el-button size="small" type="primary" v-show="this.userKind !== '-2'" icon="el-icon-search" @click="add()">新增公告</el-button>
      </el-form-item>
    </el-form>
    <!--内容-->
    <el-row :gutter="20" v-for="(row, index) in rows" :key="index">
      <el-col :span="8" v-for="(item, idx) in row" :key="idx" >
        <div class="grid-content bg-purple-light">
          <div class="grid-content bg-purple" style="font-size: 15px; text-align: center; padding-top: 10px">
            {{ item.title}}
          </div>
          <div >
            {{ item.content}}
          </div>
          <div class="button-list" v-show="userKind !== '-2'">
            <el-switch  v-model="item.status === 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editStatus(item)"></el-switch>
            <el-button  type="primary" icon="el-icon-edit" circle @click="handleEdit(item)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteAnnouncement(item.id)"></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAnnouncementForm" :model="editAnnouncementForm" :rules="rules">
        <el-form-item label="公告标题" prop="title">
          <el-input size="small" v-model="editAnnouncementForm.title" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input  type="textarea" :autosize="{ minRows: 4, maxRows: 7}" v-model="editAnnouncementForm.content" auto-complete="off" placeholder="请输入公告内容"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="ttl">
          <el-date-picker size="small" v-model="editAnnouncementForm.ttl" align="right" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="公告状态" prop="status">
          <el-switch v-model="editAnnouncementForm.status" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editAnnouncementForm')">保存</el-button>
      </div>
    </el-dialog>
<!--  新增-->
    <el-dialog title="新增公告" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddAnnouncementForm" :model="editAddAnnouncementForm" :rules="rules">
        <el-form-item label="公告标题" prop="title">
          <el-input size="small" v-model="editAddAnnouncementForm.title" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input  type="textarea" :autosize="{ minRows: 4, maxRows: 7}" v-model="editAddAnnouncementForm.content" auto-complete="off" placeholder="请输入公告内容"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="ttl">
          <el-date-picker size="small" v-model="editAddAnnouncementForm.ttl" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="公告状态" prop="status">
          <el-switch v-model="editAddAnnouncementForm.status" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddAnnouncementForm')">保存</el-button>
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
  name: "announcement",
  data(){
    /* 定义初始化变量 */
    return{
      userKind:'',
      addFormVisible: false,
      showDeleteButton: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: '修改公告',
      nshow: true, //switch开启
      fshow: false, //switch关闭
      editFormVisible: false,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9], // 假设有 9 个数据
      rows: [], // 初始化为空数组
      formInline: {
        title:'',
        content:'',
        publishTime:''

      },
      editForm:{
          id:'',
        status:''
      },
      editAnnouncementForm:{
        title: '',
        content:'',
        status:'',
        ttl:'',
      },
      announcementData:[

      ],
      editAddAnnouncementForm:{

      },
      rules: {
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '内容不能为空', trigger: 'blur'}
        ],
        ttl: [
          {required: true, message: '请选择截止时间', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
    }
  },

  /* 定义事件函数 */
  methods:{
    getUserKind(){
      const userDataJSON = sessionStorage.getItem("user");
      const userData = JSON.parse(userDataJSON);
      this.userKind = userData.vipStatus
    },
    submitAddForm(formName){
      this.$axios.post("/announcement/addAnnouncement", this.editAddAnnouncementForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.pageNum = 1
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
    add(){
      this.addFormVisible = true;
    },
    // 条件搜索
    queryBy() {
      this.pageNum = 1
      this.queryAll()
    },
    // 向后端获取数据
    queryAll() {
      this.$axios.get('/announcement/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.formInline.title,
          content: this.formInline.content,
          publishTime:this.formInline.publishTime
        }
      }).then(res => {
        this.rows=[]
        this.announcementData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
        // 计算需要显示多少行
        const rowCount = Math.ceil(this.announcementData.length / 3); // 计算需要显示多少行
        for (let i = 0; i < rowCount; i++) {
          // 每行显示 3 个数据，将数据按照每 3 个一组分为多行
          this.rows.push(this.announcementData.slice(i * 3, (i + 1) * 3));
        }

      })
    },
    // 打开修改页面
    handleEdit(announcement){
      this.editFormVisible = true
      this.editAnnouncementForm = {...announcement}
    },
    // 关闭修改页面
    closeDialog(){
      this.editFormVisible = false
      this.addFormVisible = false
    },
    // 提交修改
    submitForm(){
      this.$axios.put("/announcement/updateAnnouncement", this.editAnnouncementForm).then(res => {
        if(res.data.code === 200){
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    // 快捷修改状态
    editStatus(row) {
      this.editForm.id = row.id
      let status = row.status
      if (status === 1) {
        this.editForm.status = 0
      } else {
        this.editForm.status = 1
      }
      this.$axios.put('/announcement/updateAnnouncement', this.editForm).then(res => {
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

    // 删除
    deleteAnnouncement(id){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(`/announcement/announcementDelete/${id}`).then(res =>{
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

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
  word-wrap: break-word; /* 单词内部换行 */
  word-break: break-all; /* 单个字母或数字换行 */
}
.bg-purple-light {
  background: #e5e9f2;
  word-wrap: break-word; /* 单词内部换行 */
  word-break: break-all; /* 单个字母或数字换行 */
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.button-list{

  display: flex; /* 使用 Flex 布局 */
  justify-content: flex-end; /* 子组件向右对齐 */
  padding-top: 10px;
  padding-bottom: 5px;
  padding-right: 5px;
//justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .el-switch{
    margin-right: 10px;
  }
  .el-button{
    height: 10px;
    width: 10px;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
}
</style>
