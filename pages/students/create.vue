<template>
  <div>
      <el-row :gutter="10">
        <el-col :lg="12" :md="12" :sm="18" :xs="24">
            <student-form @success="goToStudents"></student-form>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
    layout: 'Dashboard',
    head() {
        return {
            title: 'Create Student'
        }
    },
    methods: {
        goToStudents() {
            this.$router.push('/students')
        }
    },
    created() {
        this.$store.commit('setPageTitle', 'Create Student');
    }

}
</script>

<style>

</style>