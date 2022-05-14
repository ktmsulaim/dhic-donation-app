<template>
  <el-container>
    <el-aside :class="{ 'collapsed': drawer }">
      <div class="logo">
        <div v-if="!drawer">
          Donation
          <span>Darul Hasanath Islamic College</span>
        </div>
        <div v-else>
          DH
        </div>
      </div>
      <el-menu :router="true" :collapse="drawer" :default-active="$route.path">
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
    </el-aside>
    <el-container>
      <el-header>
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <span class="drawer-toggler" @click="drawer = !drawer">
              <i class="el-icon-s-unfold" v-if="drawer"></i>
              <i class="el-icon-s-fold" v-else></i>
            </span>
          </el-col>
          <el-col :span="6" class="text-right"> 
          <el-dropdown>
            <div class="user-profile">
              <el-avatar
                size="small"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
              <span class="name">{{ user.name }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user">Profile</el-dropdown-item>
              <el-dropdown-item icon="el-icon-refresh-left" @click="logout"
                >Logout</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <Nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      drawer: false,
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
  computed: {
    user() {
      return this.$auth.user
    },
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push('/login')
      } catch (error) {
        this.$toast.error(error.response?.data?.data)
      }
    },
  },
}
</script>

<style>
</style>