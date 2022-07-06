<template>
  <el-row :gutter="10">
    <el-col :lg="6" :md="6" :sm="12" :xs="24">
      <el-card>
        <div class="report">
          <h3 class="report-header">Class wise</h3>
          <p class="report-description">Generate paid or unpaid list of students for selected month / year</p>
          <el-button size="small" @click="goTo('class-wise')">View</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :lg="6" :md="6" :sm="12" :xs="24">
      <el-card>
        <div class="report">
          <h3 class="report-header">Monthly</h3>
          <p class="report-description">Generate report for selected month / year</p>
          <el-button size="small" @click="goTo('monthly')">View</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :lg="6" :md="6" :sm="12" :xs="24">
      <el-card>
        <div class="report">
          <h3 class="report-header">Amount Due</h3>
          <p class="report-description">Generate class wise due amount since start date</p>
          <el-button size="small" @click="goTo('due')">View</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
    layout: 'Dashboard',
    head() {
        return {
            title: 'Reports',
        }
    },
    methods: {
      goTo(page) {
        this.$router.push({ path: `/reports/${page}` })
      }
    },
    created() {
      this.$store.commit('setPageTitle', 'Reports');
    }
}
</script>

<style>

</style>