<template>
  <a-layout class="layout-container">
    <!-- 头部菜单栏 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">
          <span>Playground系统</span>
        </div>

        <a-menu
          v-model:selectedKeys="selectedKeys"
          :items="menuItems"
          mode="horizontal"
          theme="dark"
          @click="handleMenuClick"
        />
      </div>
    </a-layout-header>

    <!-- 主内容区域 -->
    <a-layout-content class="layout-main">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

// 当前选中的菜单项
const selectedKeys = computed(() => [route.path])

// 从路由配置生成菜单项
const menuItems = computed(() => {
  const routes = router.options.routes || []

  // 过滤出需要显示在菜单中的路由
  return routes
    .filter((route) => route.meta?.showInMenu !== false)
    .map((route) => ({
      key: route.path,
      label: route.meta?.title || route.name || "",
      icon: route.meta?.icon,
    }))
})

// 处理菜单点击事件
const handleMenuClick = ({ key }) => {
  router.push(key)
}
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
}

.layout-header {
  padding: 0;
  background: #001529;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .header-content {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 24px;
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
    margin-right: 40px;
    white-space: nowrap;
    color: white;
  }

  :deep(.ant-menu) {
    line-height: 64px;
    flex: 1;
    border-bottom: none;

    &.ant-menu-dark {
      background: transparent;
    }
  }
}

.layout-main {
  min-height: calc(100vh - 112px);
  margin: 24px;
  padding: 24px;
  border-radius: 4px;
  background: #fff;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    padding: 0 16px;
  }

  .logo {
    margin-right: 0;
    margin-bottom: 16px;
    text-align: center;
  }

  .layout-main {
    margin: 12px;
    padding: 16px;
  }
}
</style>
