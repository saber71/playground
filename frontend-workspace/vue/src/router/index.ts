import { Compass, HomeFilled, Menu } from "@element-plus/icons-vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

export const routes: RouteRecordRaw[] = [
  {
    path: "/layout",
    redirect: "/layout/home",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          icon: HomeFilled,
        },
      },
      {
        path: "component-view",
        component: () => import("@/views/ComponentsView.vue"),
        meta: {
          title: "组件页面",
          icon: Menu,
        },
      },
      {
        path: "xterm",
        component: () => import("@/views/xterm/index.vue"),
        meta: {
          title: "XTerm",
          icon: Compass,
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/layout",
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
