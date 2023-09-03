<template>
  <div class="flight">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>航班管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.departureCity" filterable clearable placeholder="请选择起始机场">
          <el-option
            v-for="item in city"
            :key="item.id"
            :label="item.city"
            :value="item.city">
          </el-option>
        </el-select>

        <el-select size="small" v-model="formInline.destinationCity" filterable clearable placeholder="请选择目的机场">
          <el-option
            v-for="item in city"
            :key="item.id"
            :label="item.city"
            :value="item.city">
          </el-option>
        </el-select>
        <el-form-item label="">
          <el-input size="small" v-model="formInline.aircraftCode" placeholder="输入飞机编号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="formInline.departureTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" v-show="this.userKind !== '-2'" @click="addFlight() ">添加航班</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="exportData()">导出数据</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table size="small" :data="flightData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center"  prop="departureAirport" label="起始机场" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="destinationAirport" label="目的机场" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="aircraftCode" label="飞机编号" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="departureTime" label="离开时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="arrivalTime" label="到达时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="firstClassPrice" label="头等舱价格" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="economyClassPrice" label="经济舱价格" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="firstClassNum" label="头等舱数量" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="economyClassNum" label="经济舱数量" width="150">
      </el-table-column>
      <el-table-column
        label="航班状态" align="center" sortable prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'danger' : 'worry' "
                  >
            {{ scope.row.status === 1 ? '已完成' : scope.row.status === 0 ? '未起飞' : '推迟' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="publishTime" label="发布时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifyTime" label="修改时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="creator" label="创建人" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="modifier" label="修改人" width="100">
      </el-table-column>

      <el-table-column label="操作" min-width="150" >
        <template slot-scope="scope" >
          <el-button size="mini" v-show="userKind !== '-2'" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" v-show="userKind !== '-2'" type="danger" @click="deleteFlight(scope.row.flightId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click='closeDialog("edit")'>
      <el-form label-width="150px" ref="editFlightForm" :model="editFlightForm" :rules="rules">
        <el-form-item label="起始机场" prop="departureAirportId">
          <el-select size="small" @change='queryByStartAirport(editFlightForm.departureAirportId)' v-model="editFlightForm.departureAirportId" filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in city"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的机场" prop="destinationAirport">
          <el-select size="small" v-model="editFlightForm.destinationAirportId"  :disabled = disabled filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in startRoute"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞机编号" prop="aircraftId">
          <el-select size="small" v-model="editFlightForm.aircraftId"  @change='selectPlane(editFlightForm.aircraftId)' filterable clearable placeholder="请选择飞机类型">
            <el-option
              v-for="item in plane"
              :key="item.id"
              :label="item.aircraftCode"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
<!--        不能超过飞机类型的最大座位数-->
        <el-form-item label="经济舱剩余座位数量" prop="economyClassNum">
          <el-input-number size="small"  v-model="editFlightForm.economyClassNum" :disabled = disabledFlight auto-complete="off" :placeholder="'请输入经济舱座位数:(最大数量)' + aircraftType.economyClassCapacity" :max="aircraftType.economyClassCapacity"></el-input-number>
        </el-form-item>
        <el-form-item label="头等舱剩余座位数量" prop="firstClassNum">
          <el-input-number size="small" v-model="editFlightForm.firstClassNum" :disabled = disabledFlight auto-complete="off" :placeholder="'请输入头等舱座位数:(最大数量)' + aircraftType.firstClassCapacity" :max="aircraftType.firstClassCapacity"></el-input-number>
        </el-form-item>

        <el-form-item label="头等舱价格" prop="firstClassPrice">
          <el-input type="number" size="small" v-model="editFlightForm.firstClassPrice" auto-complete="off" placeholder="请输入头等舱座位数"></el-input>
        </el-form-item>
        <el-form-item label="经济舱价格" prop="economyClassPrice">
          <el-input type="number" size="small" v-model="editFlightForm.economyClassPrice" auto-complete="off"
                    placeholder="请输入经济舱座位数"></el-input>
        </el-form-item>
        <el-form-item label="离开时间" prop="departureTime">
          <el-date-picker
            v-model="editFlightForm.departureTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到达时间" prop="arrivalTime">
          <el-date-picker
            v-model="editFlightForm.arrivalTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="航班状态" prop="status">
          <el-select size="small" v-model="editFlightForm.status" placeholder="请选择" class="userRole">
            <el-option label="完成" :value="1"></el-option>
            <el-option label="未起飞" :value="0"></el-option>
            <el-option label="推迟" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editFlightForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--    新增航线-->
    <el-dialog :title="title" :visible.sync="addFormVisible" width="50%" @click='closeDialog("edit")'>
      <el-form label-width="150px" ref="editFlightForm" :model="editAddFlightForm" :rules="rules">
        <el-form-item label="起始机场" prop="departureAirportId">
          <el-select size="small" @change='queryByStartAirport($event)' v-model="editAddFlightForm.departureAirportId" filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in city"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的机场" prop="destinationAirport">
          <el-select size="small" v-model="editAddFlightForm.destinationAirportId"  :disabled = disabled filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in startRoute"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞机编号" prop="aircraftId">
          <el-select size="small" v-model="editAddFlightForm.aircraftId" @change='selectPlane(editAddFlightForm.aircraftId)' filterable clearable placeholder="请选择飞机类型">
            <el-option
              v-for="item in plane"
              :key="item.id"
              :label="item.aircraftCode"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="经济舱剩余座位数量" prop="economyClassNum">
          <el-input-number size="small" v-model="editAddFlightForm.economyClassNum" :disabled = disabledFlight auto-complete="off" :placeholder="'请输入经济舱座位数:(最大数量)' + aircraftType.economyClassCapacity" :max="aircraftType.economyClassCapacity"></el-input-number>
        </el-form-item>
        <el-form-item label="头等舱剩余座位数量" prop="firstClassNum">
          <el-input-number size="small" v-model="editAddFlightForm.firstClassNum" :disabled = disabledFlight auto-complete="off" :placeholder="'请输入头等舱座位数:(最大数量)' + aircraftType.firstClassCapacity" :max="aircraftType.firstClassCapacity"></el-input-number>
        </el-form-item>

        <el-form-item label="头等舱价格" prop="firstClassPrice">
          <el-input type="number" size="small" v-model="editAddFlightForm.firstClassPrice" auto-complete="off"  placeholder="请输入头等舱价格"></el-input>
        </el-form-item>
        <el-form-item label="经济舱价格" prop="economyClassPrice">
          <el-input type="number" size="small" v-model="editAddFlightForm.economyClassPrice" auto-complete="off"
                    placeholder="请输入经济舱价格"></el-input>
        </el-form-item>
        <el-form-item label="离开时间" prop="departureTime">
          <el-date-picker
            v-model="editAddFlightForm.departureTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到达时间" prop="arrivalTime">
          <el-date-picker
            v-model="editAddFlightForm.arrivalTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddFlightForm')">保存</el-button>
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
import FileSaver from 'file-saver';
export default {


  name: "flight",
  data(){
    /* 定义初始化变量 */
    return{
      // 基本信息
      userKind:'',
      editAddFlightForm:{
        departureAirportId : '',
        aircraftId: '',
        departureTime:'',
        arrivalTime:'',
        economyClassNum:'',
        firstClassNum:'',
        firstClassPrice:'',
        economyClassPrice:'',
        destinationAirportId:''
      },
      placeholder:'',
      disabledFlight: true,
      disabled : true,
      title1:"新增航班",
      title: "修改航班",
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
        departureCity:'',
        destinationCity:'',
        aircraftCode:'',
        departureTime:''
      },
      editFlightForm:{
        departureAirportId : '',
          aircraftId: '',
          departureTime:'',
          arrivalTime:'',
          status:'',
          economyClassNum:'',
          firstClassNum:'',
          firstClassPrice:'',
          economyClassPrice:'',
          destinationAirportId:''
      },
      rules: {
        departureAirportId: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        aircraftId: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        departureTime: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        arrivalTime: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        economyClassNum: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        firstClassNum: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        firstClassPrice: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        economyClassPrice: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        destinationAirportId: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ]
      },
      city:[],
      plane:[],
      startRoute:[],
      aircraftType:[]
    }
  },
  /* 定义事件函数 */
  methods:{
    exportData() {
      // 模拟要导出的数据
      const data = this.flightData;
      // 将数据转换为CSV格式
      const csvData = this.convertToCSV(data);
      // 创建Blob对象
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      // 使用FileSaver.js保存文件
      FileSaver.saveAs(blob, 'data.csv');
    },
    convertToCSV(data) {
      // 将数据转换为CSV格式的字符串
      const csvRows = [];
      const headers = Object.keys(data[0]);
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      return csvRows.join('\n');
    },

    selectPlane(id){
      this.$axios.get(`/aircraftInformation/getModel/${id}`).then(res => {
        this.aircraftType = res.data.data
        this.disabledFlight = false
      })

    },
    addFlight(){
      this.addFormVisible = true
      this.disabledFlight = true
      this.queryAllCity()
      this.queryPlaneMsg()
    },
    queryByStartAirport(id){
      this.$axios.get('/route/getByStartAirport?id=' + id).then(res => {
        this.startRoute = res.data.data
        this.disabled = false
      })
    },
    submitForm(formName) {
      this.$axios.put("/flight/updateFlight", this.editFlightForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.queryAllCity()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    deleteFlight(flightId){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/flight/delete?id=" + flightId).then(res =>{
          if(res.data.code === 200){
            this.pageNum = 1
            this.pageSize = 10
            this.queryAll()
            this.queryAllCity()
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
    submitAddForm(formName){
      this.$axios.post("/flight/addFlight", this.editAddFlightForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.queryAllCity()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
      this.queryAllCity()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
      this.queryAllCity()
    },
    // 打开编辑窗口
    handleEdit(flight) {
      this.editFormVisible = true
      this.editFlightForm = {...flight}
      this.queryAllCity()
      this.queryPlaneMsg()
      this.disabled = true
      this.disabledFlight = true
    },
    queryPlaneMsg(){
      this.$axios.get('/aircraftInformation/getAllPlane').then(res => {
        this.plane = res.data.data
      })
    },
    // 编辑窗口关闭
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    search(){
      this.pageNum = 1
      this.queryAll()
      this.queryAllCity()
    },
    queryAllCity(){
      this.$axios.get('/airport/getAllAirport').then(res => {
        this.city = res.data.data
        this.startRoute = this.city
      })
    },
    getUserKind(){
      const userDataJSON = sessionStorage.getItem("user");
      const userData = JSON.parse(userDataJSON);
      this.userKind = userData.vipStatus
    },
    queryAll() {
      this.$axios.get('/flight/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          departureCity: this.formInline.departureCity,
          destinationCity: this.formInline.destinationCity,
          aircraftCode: this.formInline.aircraftCode,
          departureTime: this.formInline.departureTime
        }
      }).then(res => {
        if(res.data.code === 200){
          this.flightData = res.data.data.records
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
    this.queryAllCity()
    this.getUserKind()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
