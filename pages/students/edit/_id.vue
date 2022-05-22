<template>
  <div>
      <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="18" :xs="24">
            <el-skeleton :rows="5" animated v-if="loading" />
            <student-form v-else-if="student.id" :student="student"></student-form>
            <el-empty v-else description="No student was found"></el-empty>
          </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
    name: 'EditStudentPage',
    layout: 'Dashboard',
    head() {
        return {
            title: 'Edit Student',
        }
    },
    data() {
        return {
            loading: false,
            student: {},
        }
    },
    methods: {
        async getStudent() {
            try {
                this.loading = true
                const response = await this.$axios.get(`/students/${this.$route.params.id}`)
                this.student = response.data.data
            } catch (error) {
                this.$toast.error(error.response?.data?.data || "Unable to fetch the student")
                this.$router.push('/students')
            } finally {
                this.loading = false
            }
        }
    },
    created() {
        this.$store.commit('setPageTitle', 'Edit Student');
        this.getStudent()
    },
}
</script>

<style>

</style>