<template>
  <div class="layout-container">
    <div class="sidebar" :class="{ collapsed: collapse }">
      <div v-if="collapse" class="expand-icon">
        <el-icon @click="collapse = false"><Expand /></el-icon>
      </div>
      <div class="logos">
        <img src="../assets/logo.svg" />
        <span v-if="!collapse">VITE + VUE</span>
        <div class="icon" v-if="!collapse">
          <el-icon @click="collapse = true"><Fold /></el-icon>
        </div>
      </div>
      <el-scrollbar>
        <el-menu
          class="menus"
          :default-active="route.path"
          router
          text-color="#ffffff"
          active-text-color="#ffffff"
          background-color="transparent"
          :collapse="collapse"
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
import { routes } from "@/router"
import { Expand, Fold } from "@element-plus/icons-vue"
import { ref } from "vue"
import { type RouteRecordRaw, RouterView, useRoute } from "vue-router"
import MenuItem from "./components/MenuItem.vue"

const route = useRoute()
const firstRoute = routes[0]!
const menus: Menu[] = []
const collapse = ref(false)

for (let child of firstRoute.children!) {
  menus.push(toMenu(child, firstRoute))
}

interface Menu {
  path: string
  name: string
  children: Menu[]
  icon: any
}

function toMenu(route: RouteRecordRaw, parent: RouteRecordRaw): Menu {
  route = Object.assign({}, route)
  if (route.path[0] !== "/") {
    if (parent.path !== "/") route.path = parent.path + "/" + route.path
    else route.path = "/" + route.path
  }
  return {
    path: route.path,
    name: (route.meta?.title as string) ?? "",
    children: route.children?.map((i) => toMenu(i, route)) ?? [],
    icon: route.meta?.icon,
  }
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
    transition: all 0.3s;
    .logos {
      position: relative;
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
      span{
        white-space: nowrap;
      }
      .icon {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
        font-size: 12px;
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
  .sidebar.collapsed {
    width: 48px;
    .logos {
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        margin-left: 0;
      }
    }
    .expand-icon{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
      color: white;
      cursor:pointer;
    }
    .el-menu {
      margin: 0;
      width: 100%;
    }
    .el-menu-item {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
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
