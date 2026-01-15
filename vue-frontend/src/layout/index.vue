<template>
  <div class="layout-container">
    <div class="sidebar">
      <div class="logos">
        <img src="@/assets/logo.svg" />
        <span>VITE + VUE</span>
      </div>
      <el-scrollbar>
        <el-menu
          class="menus"
          :default-active="route.path"
          router
          text-color="#ffffff"
          active-text-color="#ffffff"
          background-color="transparent"
        >
          <MenuItem v-for="(val, index) in menus" :menu="val" :key="index" />
        </el-menu>
      </el-scrollbar>
      <div class="bottom-area"></div>
    </div>
    <el-scrollbar class="view-container">
      <RouterView />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router";
import { type RouteRecordRaw, RouterView, useRoute } from "vue-router";
import MenuItem from "./components/MenuItem.vue";

const route = useRoute();
const firstRoute = routes[0]!;
const menus: Menu[] = [];

for (let child of firstRoute.children!) {
  menus.push(toMenu(child, firstRoute));
}

interface Menu {
  path: string;
  name: string;
  children: Menu[];
  icon: any;
}

function toMenu(route: RouteRecordRaw, parent: RouteRecordRaw): Menu {
  route = Object.assign({}, route);
  if (route.path[0] !== "/") {
    if (parent.path !== "/") route.path = parent.path + "/" + route.path;
    else route.path = "/" + route.path;
  }
  return {
    path: route.path,
    name: (route.meta?.title as string) ?? "",
    children: route.children?.map((i) => toMenu(i, route)) ?? [],
    icon: route.meta?.icon,
  };
}
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  .sidebar {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    box-sizing: border-box;
    --el-menu-item-height: 38px;
    .logos {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      padding: 12px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 20px;
      gap: 16px;
      img {
        width: 32px;
        margin-left: 12px;
      }
    }
    .el-scrollbar {
      flex-grow: 1;
    }
    .el-menu {
      padding: 0 8px;
      border-right: none;
      .el-menu-item {
        border-radius: 8px;
        opacity: 0.75;
        transition: all 0.3s;
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          opacity: 1;
        }
        &.is-active {
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
        }
        & + .el-menu-item {
          margin-top: 8px;
        }
      }
    }
    .bottom-area {
      height: 50px;
      flex-shrink: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
  .view-container {
    flex-grow: 1;
    height: 100%;
    box-sizing: border-box;
    position: relative;
  }
}
</style>
