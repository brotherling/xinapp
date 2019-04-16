import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../store/login.vue'], resolve),
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['../store/home.vue'], resolve),
      meta: {
        keepAlive: false
      },
    },
    {
      path: '/homemenu',
      name: 'homemenu',
      component: resolve => require(['../store/homemenu.vue'], resolve),
      meta: {
        keepAlive: false 
      },
    },
    {
      path: '/personalCenter',
      name: 'personalCenter',
      component: resolve => require(['../store/personalCenter.vue'], resolve),
      meta: {
        keepAlive: false 
      }
    },

    {
      path: '/assetpage',
      name: 'assetpage',
      component: resolve => require(['../store/assetpage.vue'], resolve),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/statement',
      name: 'statement',
      component: resolve => require(['../store/statement.vue'], resolve),
      meta: {
        keepAlive: false
      }
    },
    {//资产新增
      path: '/assetAdd',
      name: 'assetAdd',
      component: resolve => require(['../store/assetAdd.vue'], resolve),
      meta: {
        keepAlive: true,
      },
        // beforeRouteEnter(to, from, next) {
        //     // 设置下一个路由的 meta
        //     console.log(to,form)
        //    to.meta.keepAlive = true;  // 让 A 缓存，即不刷新
        //    next();
        // }   
    },
    { //资产修改
      path: '/assetEdit',
      name: 'assetEdit',
      component: resolve => require(['../store/assetEdit.vue'], resolve),
      meta: {
        keepAlive: false
      }
    },
    //盘点批次
      {
        path: '/reviewbatch',
        name: 'reviewbatch',
        component: resolve => require(['../store/Inventory/reviewbatch.vue'], resolve),
        meta: {
          keepAlive: false 
        }
    },
    //盘点批次编号
    {
      path: '/StockDetailList',
      name: 'StockDetailList',
      component: resolve => require(['../store/Inventory/StockDetailList.vue'], resolve),
      meta: {
        keepAlive: false 
      }
  },
      //资产盘点
      {
        path: '/assetInventory',
        name: 'assetInventory',
        component: resolve => require(['../store/Inventory/assetInventory.vue'], resolve),
        meta: {
          keepAlive: false 
        }
    },
          //盘盈
          {
            path: '/assetprofit',
            name: 'assetprofit',
            component: resolve => require(['../store/Inventory/assetprofit.vue'], resolve),
            meta: {
              keepAlive: false 
            }
        },
        //盘点图表
        {
          path:'/stockchart',
          name: 'stockchart',
          component: resolve => require(['../store/Inventory/stockchart.vue'], resolve),
          meta: {
            keepAlive: false 
          }

        },
        //盘盈明细
        {
          path:'/inventoryDetails',
          name: 'inventoryDetails',
          component: resolve => require(['../store/Inventory/inventoryDetails.vue'], resolve),
          meta: {
            keepAlive: false 
          }

        },
        //供应商选择
        {
          path:'/supplier',
          name: 'supplier',
          component: resolve => require(['../components/choose/v-supplier.vue'], resolve),
          meta: {
            keepAlive: false 
          } 
        },
         //人员选择
        {
          path:'/personnel',
          name: 'personnel',
          component: resolve => require(['../components/choose/v-personnel.vue'], resolve),
          meta: {
            keepAlive: false 
          },
          children:[
            {path:"/personnelRadio1",name: 'personnel',component:resolve => require(['../components/choose/v-personnel_Radio1.vue'], resolve)},
            {path:"/personnelRadio2",name: 'personnel',component:resolve => require(['../components/choose/v-personnel_Radio2.vue'], resolve)},
            { path: "/personnelRadio3", name: 'personnel', component: resolve => require(['../components/choose/v-personnel_Radio3.vue'], resolve) }            
          ]
        },
         //部门选择
         {
          path:'/department',
          name: 'department',
          component: resolve => require(['../components/choose/v-department.vue'], resolve),
          meta: {
            keepAlive: false 
          }
          },
          //管理部门
         {
          path:'/admindepartment',
          name: 'admindepartment',
          component: resolve => require(['../components/choose/v-department.vue'], resolve),
          meta: {
            keepAlive: false 
          }
          },
          //资产分类
         {
          path:'/assetClass',
          name: 'assetClass',
          component: resolve => require(['../components/choose/v-assetClass.vue'], resolve),
          meta: {
            keepAlive: false 
          }
          },
          //存放地
         {
          path:'/designated',
          name: 'designated',
          component: resolve => require(['../components/choose/v-designated.vue'], resolve),
          meta: {
            keepAlive: false 
          }
          },
         //个人核查
         {
           path: '/grcheck',
           name: 'grcheck',
           component: resolve => require(['../store/grCheck/grcheck.vue'], resolve),
           meta: {
             keepAlive: false
           }
         },    
         //个人核查列表
         {
           path: '/grcheckList',
           name: 'grcheckList',
           component: resolve => require(['../store/grCheck/grcheckList.vue'], resolve),
           meta: {
             keepAlive: false
           }
         },
         //领用登记
          {
            path: '/applyAdd',
            name: 'applyAdd',
            component: resolve => require(['../store/apply/applyAdd.vue'], resolve),
            meta: {
              keepAlive: false
            }
          },
          //领用处理
          {
            path: '/applyList',
            name: 'applyList',
            component: resolve => require(['../store/apply/applyList.vue'], resolve),
            meta: {
              keepAlive: false
            }
          },
          //领用查询
          {
            path: '/applyQuery',
            name: 'applyQuery',
            component: resolve => require(['../store/apply/applyQuery.vue'], resolve),
            meta: {
              keepAlive: false
            }
          }, 
          //选择资产明细
          {
            path: '/applyChoose',
            name: 'applyChoose',
            component: resolve => require(['../store/apply/applyChoose.vue'], resolve),
            meta: {
              keepAlive: false
            }
          },
          //领用处理单据信息
          {
            path: '/applyBill',
            name: 'applyBill',
            component: resolve => require(['../store/apply/applyBill.vue'], resolve),
            meta: {
              keepAlive: false
            }
          },                 
  ]
})
