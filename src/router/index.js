import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* 路由模块使用 */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * 注释: 只有当route children.length大于等于1时，才会出现子菜单。
 * 详见: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果为 true, 项目不会显示在边栏中（默认值为false）
 * alwaysShow: true               如果为 true, 将始终显示根菜单
 *                                如果未设置AlwaysShow，则当项有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则不会在breadcrumb中重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧边栏中
    noCache: true                如果设置为true，则不会缓存该页（默认值为false）
    affix: true                  如果设置为真，则标签将粘贴在“标签”视图中。
    breadcrumb: false            如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径。
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页
 * 所有角色都可以访问的路由组
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      },
      {
        path: 'dashboard/operationLog',
        component: () => import('@/views/dashboard/operationLog'),
        name: 'operationLog',
        meta: {
          title: 'operationLog'
        },
        hidden: true
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/page',
    alwaysShow: true, // 将始终显示根菜单
    meta: {
      title: '商户',
      icon: 'user'
    },
    children: [
      {
        path: 'basicInfo',
        component: () => import('@/views/merchant/basicInfo'),
        name: 'basicInfo',
        meta: {
          title: 'basicInfo'
        }
      },
      {
        path: 'bankInfo',
        component: () => import('@/views/merchant/bankInfo'),
        name: 'bankInfo',
        meta: {
          title: 'bankInfo'
        }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/page',
    alwaysShow: true, // 将始终显示根菜单
    name: 'device',
    meta: {
      title: 'device',
      icon: 'international'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/device/list'),
        name: 'list',
        meta: {
          title: 'list'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/device/add'),
        name: 'add',
        meta: {
          title: 'add'
        }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/device/edit'),
        name: 'edit',
        meta: {
          title: 'edit'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/fans',
    component: Layout,
    redirect: '/fans/page',
    alwaysShow: true, // 将始终显示根菜单
    name: 'fans',
    meta: {
      title: 'fans',
      icon: 'peoples'
    },
    children: [
      {
        path: 'fansDay',
        component: () => import('@/views/fans/fansDay'),
        name: 'fansDay',
        meta: {
          title: 'fansDay'
        }
      },
      {
        path: 'fansMonth',
        component: () => import('@/views/fans/fansMonth'),
        name: 'fansMonth',
        meta: {
          title: 'fansMonth'
        }
      },
      {
        path: 'fansRecord',
        component: () => import('@/views/fans/fansRecord'),
        name: 'fansRecord',
        meta: {
          title: 'fansRecord'
        }
      }
    ]
  },
  {
    path: '/estimate',
    component: Layout,
    redirect: '/estimate/page',
    alwaysShow: true, // 将始终显示根菜单
    name: 'estimate',
    meta: {
      title: 'estimate',
      icon: 'money'
    },
    children: [
      {
        path: 'survey',
        component: () => import('@/views/estimate/survey'),
        name: 'survey',
        meta: {
          title: 'survey'
        }
      },
      {
        path: 'estimateList',
        component: () => import('@/views/estimate/estimateList'),
        name: 'estimateList',
        meta: {
          title: 'estimateList'
        }
      }
    ]
  },
  /** 当路由图太长时，可以将其拆分为小模块。 **/
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
