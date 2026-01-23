import { HomeFilled, Menu } from "@element-plus/icons-vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

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
        path: "second",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页2",
          icon: Menu,
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/layout",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
