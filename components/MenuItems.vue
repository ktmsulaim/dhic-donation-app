<template>
    <el-menu
        :router="true"
        :collapse="$device.isMobileOrTablet ? false : drawer"
        :default-active="$route.path"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :class="{ 'no-border': $device.isMobileOrTablet }"
      >
        <el-menu-item
          v-for="(link, i) in links"
          :key="i"
          :route="{ path: link.path }"
          :index="link.path"
        >
          <i :class="link.icon"></i>
          <span>{{ link.name }}</span>
        </el-menu-item>
      </el-menu>
</template>

<script>
export default {
  name: 'MenuItems',
  props: ['drawer'],
  data() {
    return {
      links: [
        {
          name: 'Dashboard',
          path: '/',
          icon: 'el-icon-menu',
        },
        {
          name: 'Students',
          path: '/students',
          icon: 'el-icon-user',
        },
        {
          name: 'Reports',
          path: '/reports',
          icon: 'el-icon-document',
        },
      ],
    }
  },
}
</script>

<style>
</style>