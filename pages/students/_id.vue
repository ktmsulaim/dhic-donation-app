<template>
  <div>
    <el-row v-if="loading">
      <el-col>
        <el-skeleton :rows="6" animated />
      </el-col>
    </el-row>
    <el-row v-else-if="student" :gutter="10">
      <el-col :lg="12" :md="12" :sm="24">
        <el-card>
          <payments :student="student" @refresh="fetchStudent"></payments>
        </el-card>
        <bulk-payment :student="student" @refresh="fetchStudent"></bulk-payment>
      </el-col>
      <el-col :lg="6" :md="6" :sm="24">
        <el-card v-if="student.subscription">
          <el-descriptions
            title="Donation"
            :column="1"
            :border="true"
          >
            <el-descriptions-item>
              <template slot="label"> Amount </template>
              {{ student.subscription_summary }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Total paid </template>
              {{ student.subscription.amount.paid_formatted }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Remaining </template>
              {{ student.subscription.amount.remaining_formatted }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Start date </template>
              {{ formatDate(student.subscription.start_date) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> End date </template>
              {{ formatDate(student.subscription.end_date) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <div class="subscription-actions">
          <subscription-form :is-editing="!!student.subscription" :student="student" @refresh="fetchStudent"></subscription-form>
          <refresh-payments :student="student" @refresh="fetchStudent"></refresh-payments>
        </div>
      </el-col>
      <el-col :lg="6" :md="6" :sm="24">
        <el-card>
          <el-descriptions title="Student info" :column="1" :border="true">
            <el-descriptions-item>
              <template slot="label"> Name </template>
              {{ student.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Place </template>
              {{ student.place }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> AD.NO </template>
              {{ student.adno }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> DOB </template>
              {{ formatDate(student.dob) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> Class </template>
              {{ student.class }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-empty description="No data" v-else></el-empty>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ShowStudent',
  layout: 'Dashboard',
  head() {
    return {
      title: 'View student',
    }
  },
  data() {
    return {
      loading: false,
      student: null,
    }
  },
  methods: {
    async fetchStudent() {
      try {
        this.loading = true
        const id = this.$route.params.id

        const response = await this.$axios.get(`students/${id}`)
        this.student = response.data.data
      } catch (error) {
        this.$toast.error(
          error.response?.data.message || 'Failed to load student'
        )
        this.$router.push('/students')
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      try {
        return moment(date).format('DD-MM-YYYY')
      } catch (error) {
        return date
      }
    },
  },
  created() {
    this.$store.commit('setPageTitle', 'View student')
    this.fetchStudent()
  },
}
</script>

<style>
</style>