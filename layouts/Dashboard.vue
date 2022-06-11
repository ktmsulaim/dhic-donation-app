<template>
  <el-container>
    <el-drawer
      title="Donation"
      :visible.sync="drawer"
      direction="ltr"
      size="80%"
      v-if="$device.isMobileOrTablet"
    >
      <div class="drawer">
        <menu-items :drawer="drawer"></menu-items>
      </div>
    </el-drawer>
    <el-aside v-else :class="{ collapsed: drawer }">
      <div class="logo">
        <div v-if="!drawer">
          Donation
          <span>Darul Hasanath Islamic College</span>
        </div>
        <div v-else>DH</div>
      </div>
      
        <menu-items :drawer="drawer"></menu-items>
    </el-aside>
    <el-container>
      <el-header>
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :md="6" :sm="12">
            <span class="drawer-toggler" @click="drawer = !drawer">
              <i class="el-icon-more" v-if="drawer"></i>
              <i class="el-icon-more-outline" v-else></i>
            </span>
            <span v-if="$device.isDesktop" class="page-title">
              {{ $store.state.pageTitle }}
            </span>
          </el-col>
          <el-col :md="6" class="text-right">
            <el-dropdown @command="dropdownAction($event)">
              <div class="user-profile">
                <el-avatar
                  size="small"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                ></el-avatar>
                <span class="name">{{ user.name }}</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile" icon="el-icon-user"
                  >Profile</el-dropdown-item
                >
                <el-dropdown-item
                  command="logout"
                  icon="el-icon-refresh-left"
                  @click="logout"
                  >Logout</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <div class="page-header-mobile" v-if="$device.isMobileOrTablet">
          {{ $store.state.pageTitle }}
        </div>
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
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
  },
  methods: {
    dropdownAction(value) {
      if (value) {
        if (value === 'logout') {
          this.logout()
        } else if (value === 'profile') {
          this.$router.push('/profile')
        }
      }
    },
    async logout() {
      try {
        const loading = this.$loading({
          lock: true,
          text: 'Signing out...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        await this.$auth.logout()
        this.$router.push('/login')
        loading.close()
      } catch (error) {
        this.$toast.error(error.response?.data?.data)
      }
    },
  },
  watch: {
    $route(to, from) {
      this.drawer = false;
    }
  }
}
</script>

<style>
</style>