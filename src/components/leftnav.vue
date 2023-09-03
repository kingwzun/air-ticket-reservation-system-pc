
<!--<template>-->
<!--  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path"-->
<!--           unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff"-->
<!--           active-text-color="#ffd04b">-->
<!--    <div class="logobox">-->
<!--      <img class="logoimg" src="../assets/img/logo.png" alt="">-->
<!--    </div>-->
<!--    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">-->
<!--      <template slot="title">-->
<!--        <i class="iconfont" :class="menu.icon"></i>-->
<!--        <span>{{ menu.menuname }}</span>-->
<!--      </template>-->
<!--      <el-menu-item-group>-->
<!--        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">-->
<!--          <i class="iconfont" :class="chmenu.icon"></i>-->
<!--          <span>{{ chmenu.menuname }}</span>-->
<!--        </el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--    </el-submenu>-->
<!--  </el-menu>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--  name: 'leftnav',-->
<!--  data() {-->
<!--    return {-->
<!--      collapsed: false,-->
<!--      allmenu: []-->
<!--    }-->
<!--  },-->
<!--  // 创建完毕状态(里面是操作)-->
<!--  created() {-->
<!--    // 获取图形验证码-->
<!--    let res = {-->
<!--      success: true,-->
<!--      data: [-->
<!--        {-->
<!--          menuid: 1,-->
<!--          icon: 'icon-renyuanguanli',-->
<!--          menuname: '人员管理',-->
<!--          hasThird: null,-->
<!--          url: null,-->
<!--          menus: [-->
<!--            {-->
<!--              menuid: 2,-->
<!--              icon: 'icon-yuangonggonghao',-->
<!--              menuname: '员工管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'person/employee',-->
<!--              menus: null-->
<!--            }, {-->
<!--              menuid: 3,-->
<!--              icon: 'icon-dailishang',-->
<!--              menuname: '代理管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'person/agent',-->
<!--              menus: null-->
<!--            }, {-->
<!--              menuid: 4,-->
<!--              icon: 'icon-yonghu',-->
<!--              menuname: '用户管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'person/user',-->
<!--              menus: null-->
<!--            }, {-->
<!--              menuid: 5,-->
<!--              icon: 'icon-VIP',-->
<!--              menuname: 'VIP管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'person/vip',-->
<!--              menus: null-->
<!--            }-->
<!--          ]-->
<!--        },-->
<!--        {-->
<!--          menuid: 33,-->
<!--          icon: 'icon-hanghanggonggao',-->
<!--          menuname: '航行管理',-->
<!--          hasThird: null,-->
<!--          url: '',-->
<!--          menus: [-->
<!--            {-->
<!--              menuid: 34,-->
<!--              icon: 'icon-hangxian',-->
<!--              menuname: '航线管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'fly/airway',-->
<!--              menus: null-->
<!--            }, {-->
<!--              menuid: 35,-->
<!--              icon: 'icon-jichang',-->
<!--              menuname: '机场信息管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'fly/airport',-->
<!--              menus: null-->
<!--            }, {-->
<!--              menuid: 36,-->
<!--              icon: 'icon-hangbandongtai',-->
<!--              menuname: '航班管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'fly/flight',-->
<!--              menus: null-->
<!--            }-->
<!--          ]-->
<!--        },-->
<!--        {-->
<!--          menuid: 71,-->
<!--          icon: 'icon-lvxing',-->
<!--          menuname: '飞机管理',-->
<!--          hasThird: null,-->
<!--          url: null,-->
<!--          menus: [-->
<!--            {-->
<!--              menuid: 72,-->
<!--              icon: 'icon-feiji',-->
<!--              menuname: '飞机类型',-->
<!--              hasThird: 'N',-->
<!--              url: 'plane/planeType',-->
<!--              menus: null-->
<!--            },-->
<!--            {-->
<!--              menuid: 174,-->
<!--              icon: 'icon-feiji1',-->
<!--              menuname: '飞机信息',-->
<!--              hasThird: 'N',-->
<!--              url: 'plane/planeMsg',-->
<!--              menus: null-->
<!--            }-->
<!--          ]-->
<!--        },-->
<!--        {-->
<!--          menuid: 128,-->
<!--          icon: 'icon-dingdan',-->
<!--          menuname: '订单管理',-->
<!--          hasThird: null,-->
<!--          url: null,-->
<!--          menus: [-->
<!--            {-->
<!--              menuid: 129,-->
<!--              icon: 'icon-dingdan-',-->
<!--              menuname: '订单管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'order/order',-->
<!--              menus: null-->
<!--            },-->
<!--            {-->
<!--              menuid: 130,-->
<!--              icon: 'icon-tuoyun',-->
<!--              menuname: '托运订单管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'baggage/baggage',-->
<!--              menus: null-->
<!--            }-->
<!--          ]-->
<!--        },-->
<!--        {-->
<!--          menuid: 140,-->
<!--          icon: 'icon-gonggao1',-->
<!--          menuname: '公告管理',-->
<!--          hasThird: null,-->
<!--          url: null,-->
<!--          menus: [-->
<!--            {-->
<!--              menuid: 141,-->
<!--              icon: 'icon-gonggao',-->
<!--              menuname: '公告管理',-->
<!--              hasThird: 'N',-->
<!--              url: 'announcement/announcement',-->
<!--              menus: null-->
<!--            }-->
<!--          ]-->
<!--        },-->
<!--        {-->
<!--          menuid: 150,-->
<!--          icon: 'icon-tongji1',-->
<!--          menuname: '统计',-->
<!--          hasThird: null,-->
<!--          url: null,-->
<!--          menus: [-->
<!--            {-->
<!--              menuid: 159,-->
<!--              icon: 'icon-tongji',-->
<!--              menuname: '数据可视化',-->
<!--              hasThird: 'N',-->
<!--              url: 'charts/statistics',-->
<!--              menus: null-->
<!--            }-->
<!--          ]-->
<!--        }-->
<!--      ],-->
<!--      msg: 'success'-->
<!--    }-->
<!--    this.allmenu = res.data-->

<!--    // 监听-->
<!--    this.$root.Bus.$on('toggle', value => {-->
<!--      this.collapsed = !value-->
<!--    })-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style>-->
<!--.el-menu-vertical-demo:not(.el-menu&#45;&#45;collapse) {-->
<!--  width: 240px;-->
<!--  min-height: 400px;-->
<!--}-->

<!--.el-menu-vertical-demo:not(.el-menu&#45;&#45;collapse) {-->
<!--  border: none;-->
<!--  text-align: left;-->
<!--}-->

<!--.el-menu-item-group__title {-->
<!--  padding: 0px;-->
<!--}-->

<!--.el-menu-bg {-->
<!--  background-color: #1f2d3d !important;-->
<!--}-->

<!--.el-menu {-->
<!--  border: none;-->
<!--}-->

<!--.logobox {-->
<!--  height: 40px;-->
<!--  line-height: 40px;-->
<!--  color: #9d9d9d;-->
<!--  font-size: 20px;-->
<!--  text-align: center;-->
<!--  padding: 20px 0px;-->
<!--}-->

<!--.logoimg {-->
<!--  height: 40px;-->
<!--}-->
<!--</style>-->
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path"
           unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff"
           active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in filteredMenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{ menu.menuname }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{ chmenu.menuname }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: [],
      filteredMenu: [],
      user:[],
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.getAdmin()
    // 获取图形验证码
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'icon-renyuanguanli',
          menuname: '人员管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-yuangonggonghao',
              menuname: '员工管理',
              hasThird: 'N',
              url: 'person/employee',
              menus: null
            }, {
              menuid: 3,
              icon: 'icon-dailishang',
              menuname: '代理管理',
              hasThird: 'N',
              url: 'person/agent',
              menus: null
            }, {
              menuid: 4,
              icon: 'icon-yonghu',
              menuname: '用户管理',
              hasThird: 'N',
              url: 'person/user',
              menus: null
            }, {
              menuid: 5,
              icon: 'icon-VIP',
              menuname: 'VIP管理',
              hasThird: 'N',
              url: 'person/vip',
              menus: null
            }
          ]
        },
        {
          menuid: 33,
          icon: 'icon-hanghanggonggao',
          menuname: '航行管理',
          hasThird: null,
          url: '',
          menus: [
            {
              menuid: 34,
              icon: 'icon-hangxian',
              menuname: '航线管理',
              hasThird: 'N',
              url: 'fly/airway',
              menus: null
            }, {
              menuid: 35,
              icon: 'icon-jichang',
              menuname: '机场信息管理',
              hasThird: 'N',
              url: 'fly/airport',
              menus: null
            }, {
              menuid: 36,
              icon: 'icon-hangbandongtai',
              menuname: '航班管理',
              hasThird: 'N',
              url: 'fly/flight',
              menus: null
            }
          ]
        },
        {
          menuid: 71,
          icon: 'icon-lvxing',
          menuname: '飞机管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 72,
              icon: 'icon-feiji',
              menuname: '飞机类型',
              hasThird: 'N',
              url: 'plane/planeType',
              menus: null
            },
            {
              menuid: 174,
              icon: 'icon-feiji1',
              menuname: '飞机信息',
              hasThird: 'N',
              url: 'plane/planeMsg',
              menus: null
            }
          ]
        },
        {
          menuid: 128,
          icon: 'icon-dingdan',
          menuname: '订单管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 129,
              icon: 'icon-dingdan-',
              menuname: '订单管理',
              hasThird: 'N',
              url: 'order/order',
              menus: null
            },
            {
              menuid: 130,
              icon: 'icon-tuoyun',
              menuname: '托运订单管理',
              hasThird: 'N',
              url: 'baggage/baggage',
              menus: null
            }
          ]
        },
        {
          menuid: 140,
          icon: 'icon-gonggao1',
          menuname: '公告管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 141,
              icon: 'icon-gonggao',
              menuname: '公告管理',
              hasThird: 'N',
              url: 'announcement/announcement',
              menus: null
            }
          ]
        },
        {
          menuid: 150,
          icon: 'icon-tongji1',
          menuname: '统计',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 159,
              icon: 'icon-tongji',
              menuname: '数据可视化',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            }
          ]
        }
      ],
      msg: 'success'
    }
    this.allmenu = res.data
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  },
  methods: {
    getAdmin(){
      this.$axios.post("/admin/getMe").then(res => {
        this.user = res.data.data
        const administratorType = this.user.administratorType;
        this.filterMenuByAdministratorType(administratorType);
      })
    },
    //根据管理员类型显示
    filterMenuByAdministratorType(administratorType) {
      if (administratorType === '1') {
        // 返回全部菜单项
        this.filteredMenu = this.allmenu;
      } else if (administratorType === '2') {
        // 只保留航行管理、飞机管理和公告管理菜单项
        this.filteredMenu = this.allmenu.filter(menu => {
          const allowedMenus = ['航行管理', '飞机管理', '公告管理'];
          return allowedMenus.includes(menu.menuname);
        });
      } else {
        //订票代理
        this.filteredMenu = this.allmenu.filter(menu => {
          const allowedMenus = ['订单管理', '航行管理', '公告管理'];
          return allowedMenus.includes(menu.menuname);
        });
      }
    }
  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0px;
}

.el-menu-bg {
  background-color: #1f2d3d !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}

.logoimg {
  height: 40px;
}
</style>
