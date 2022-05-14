<template>
  <div>
    <el-card class="box" shadow="always">
      <div class="page-title">Login</div>

    <div @keypress.enter.prevent="onSubmit">
      <el-form ref="form" :model="form">
        <el-form-item label="Email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="onSubmit">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
    </el-card>
  </div>
</template>

<script>
export default {
  layout: 'Auth',
  head() {
    return {
      title: 'Login',
    }
  },
  data() {
    return {
      loading: false,
      form: {
        email: null,
        password: null,
      },
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.loading = true;
        await this.$auth.loginWith('local', { data: this.form })
        this.$router.push('/')
        this.$toast.success('Login Success')
      } catch (error) {
        this.$toast.error(error?.response?.data?.data)
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },
}
</script>

<style>
</style>