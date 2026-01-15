<template>
  <el-sub-menu v-if="menu.children.length">
    <template #title>
      <el-icon v-if="menu.icon">
        <component :is="menu.icon"></component>
      </el-icon>
      <span>{{ menu.name }}</span>
    </template>
    <MenuItem v-for="(val, index) in menu.children" :key="index" :menu="val" />
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path">
    <el-icon v-if="menu.icon">
      <component :is="menu.icon"></component>
    </el-icon>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
defineProps<{
  menu: { name: string; path: string; children: any[]; icon: any };
}>();
</script>

<style scoped lang="scss"></style>
