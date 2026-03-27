import { createRouter, createWebHistory } from "vue-router"
import Layout from "@/layout/index.vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      component: Layout,
      meta: {
        title: "首页",
      },
      children: [
        {
          path: "",
          component: () => import("@/views/home/index.vue"),
        },
      ],
    },
    {
      path: "/terminal",
      component: Layout,
      meta: {
        title: "终端",
      },
      children: [
        {
          path: "",
          component: () => import("@/views/terminal/index.vue"),
        },
      ],
    },
  ],
})
